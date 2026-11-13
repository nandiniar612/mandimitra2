import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Mic,
  MicOff,
  RotateCcw,
  Send,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations.ts';
import type { ChatMessage, FarmerProfile, Language } from '../types.ts';

interface PriceAdvisorChatProps {
  farmer: FarmerProfile;
  language: Language;
  pendingPrompt?: string | null;
  onConsumePendingPrompt?: () => void;
}

const SPEECH_LOCALES: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const commaIdx = result.indexOf(',');
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = () => reject(new Error('Failed to read audio recording.'));
    reader.readAsDataURL(blob);
  });
}

function getSupportedAudioMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return 'audio/webm';
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return '';
}

export const PriceAdvisorChat: React.FC<PriceAdvisorChatProps> = ({
  farmer,
  language,
  pendingPrompt,
  onConsumePendingPrompt,
}) => {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      text: t.chatbot.welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      detectedLanguage: language,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastLangRef = useRef<Language>(language);

  useEffect(() => {
    if (lastLangRef.current !== language) {
      lastLangRef.current = language;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === 'welcome'
            ? { ...m, text: TRANSLATIONS[language].chatbot.welcomeMessage, detectedLanguage: language }
            : m
        )
      );
    }
  }, [language]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isVoiceProcessing]);

  useEffect(() => {
    return () => {
      stopAllPlayback();
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (pendingPrompt && pendingPrompt.trim()) {
      void sendMessage(pendingPrompt);
      onConsumePendingPrompt?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPrompt]);

  const stopAllPlayback = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  };

  const playSpeechFallback = (msgId: string, text: string, lang: Language) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LOCALES[lang];
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const playWavBase64 = (msgId: string, base64: string, fallbackText: string, lang: Language) => {
    stopAllPlayback();
    try {
      const audio = new Audio(`data:audio/wav;base64,${base64}`);
      activeAudioRef.current = audio;
      setSpeakingId(msgId);
      audio.onended = () => {
        activeAudioRef.current = null;
        setSpeakingId(null);
      };
      audio.onerror = () => {
        activeAudioRef.current = null;
        playSpeechFallback(msgId, fallbackText, lang);
      };
      void audio.play().catch(() => {
        activeAudioRef.current = null;
        playSpeechFallback(msgId, fallbackText, lang);
      });
    } catch {
      playSpeechFallback(msgId, fallbackText, lang);
    }
  };

  const sendMessage = async (textOverride?: string) => {
    const query = (textOverride ?? input).trim();
    if (!query || isLoading || isVoiceProcessing) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (!textOverride) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language,
          farmer,
          history: nextHistory
            .filter((m) => m.id !== 'welcome' && !m.error)
            .map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        detectedLanguage?: Language;
        analysisCard?: ChatMessage['analysisCard'];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || `Server error (${response.status})`);
      }

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: data.reply || '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detectedLanguage: data.detectedLanguage ?? language,
        analysisCard: data.analysisCard,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : 'Unable to reach advisor service.';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: errorText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const processRecordedAudio = async (audioBlob: Blob, mimeType: string) => {
    setIsVoiceProcessing(true);
    try {
      const audioBase64 = await blobToBase64(audioBlob);

      const response = await fetch('/api/voice-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64,
          mimeType,
          language,
          farmer,
          history: messages
            .filter((m) => m.id !== 'welcome' && !m.error)
            .map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = (await response.json()) as {
        transcript?: string;
        reply?: string;
        detectedLanguage?: Language;
        analysisCard?: ChatMessage['analysisCard'];
        audioBase64?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || `Server error (${response.status})`);
      }

      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const replyLang: Language = data.detectedLanguage ?? language;
      const userVoiceMsg: ChatMessage = {
        id: `uv-${Date.now()}`,
        role: 'user',
        text: data.transcript || '',
        timestamp: nowTime,
        detectedLanguage: replyLang,
        isVoice: true,
      };

      const assistantId = `av-${Date.now() + 1}`;
      const assistantVoiceMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        text: data.reply || '',
        timestamp: nowTime,
        detectedLanguage: replyLang,
        audioBase64: data.audioBase64,
        isVoice: true,
        analysisCard: data.analysisCard,
      };

      setMessages((prev) => [...prev, userVoiceMsg, assistantVoiceMsg]);

      // Automatically reply with spoken voice in the exact same language the farmer spoke
      if (data.audioBase64) {
        playWavBase64(assistantId, data.audioBase64, data.reply || '', replyLang);
      } else if (data.reply) {
        playSpeechFallback(assistantId, data.reply, replyLang);
      }
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : 'Unable to process voice query.';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: errorText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          error: true,
        },
      ]);
    } finally {
      setIsVoiceProcessing(false);
    }
  };

  const toggleVoiceRecording = async () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (isLoading || isVoiceProcessing) return;
    stopAllPlayback();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeType = getSupportedAudioMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const recordedMime = recorder.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: recordedMime });
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
        setRecordingSeconds(0);

        if (blob.size > 0) {
          void processRecordedAudio(blob, recordedMime);
        }
      };

      mediaRecorderRef.current = recorder;
      setRecordingSeconds(0);
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
      recorder.start();
    } catch {
      setIsRecording(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `mic-err-${Date.now()}`,
          role: 'assistant',
          text: t.chatbot.micPermissionError,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          error: true,
        },
      ]);
    }
  };

  const toggleSpeakMessage = async (msg: ChatMessage) => {
    if (speakingId === msg.id) {
      stopAllPlayback();
      return;
    }

    const msgLang = msg.detectedLanguage ?? language;
    if (msg.audioBase64) {
      playWavBase64(msg.id, msg.audioBase64, msg.text, msgLang);
      return;
    }

    stopAllPlayback();
    setSpeakingId(msg.id);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg.text, language: msgLang }),
      });

      if (!response.ok) {
        throw new Error('TTS unavailable');
      }
      const data = (await response.json()) as { audioBase64?: string };
      if (!data.audioBase64) {
        throw new Error('No audio returned');
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, audioBase64: data.audioBase64 } : m))
      );
      playWavBase64(msg.id, data.audioBase64, msg.text, msgLang);
    } catch {
      playSpeechFallback(msg.id, msg.text, msgLang);
    }
  };

  const handleResetChat = () => {
    stopAllPlayback();
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: t.chatbot.welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detectedLanguage: language,
      },
    ]);
  };

  const micSupported =
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function');

  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-[calc(100vh-11.5rem)] min-h-[540px] max-h-[820px]">
      {/* Chat Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900">
            {t.chatbot.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.chatbot.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={handleResetChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.chatbot.clearChat}</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 bg-[#FAFBFB]">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const cardLabels = TRANSLATIONS[msg.detectedLanguage ?? language].chatbot.cardLabels;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-2xl rounded-xl px-4 py-3.5 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-700 text-white'
                    : msg.error
                    ? 'bg-red-50 border border-red-200 text-red-800'
                    : 'bg-white border border-slate-200 text-slate-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Structured Market Card */}
                {msg.analysisCard && (
                  <div className="mt-4 pt-3.5 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-slate-500">{cardLabels.bestPrice}</div>
                      <div className="mt-0.5 font-mono-nums font-semibold text-slate-900 text-sm">
                        ₹{msg.analysisCard.currentBestPrice.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-500">{cardLabels.marketMove}</div>
                      <div
                        className={`mt-0.5 font-mono-nums font-semibold text-sm inline-flex items-center gap-1 ${
                          msg.analysisCard.trendDirection === 'up'
                            ? 'text-emerald-700'
                            : 'text-red-600'
                        }`}
                      >
                        {msg.analysisCard.trendDirection === 'up' ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {msg.analysisCard.changePercent >= 0 ? '+' : ''}
                          {msg.analysisCard.changePercent}%{' '}
                          ({msg.analysisCard.trendDirection === 'up'
                            ? cardLabels.up
                            : cardLabels.down})
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-500">{cardLabels.forecast5d}</div>
                      <div
                        className={`mt-0.5 font-mono-nums font-semibold text-sm ${
                          msg.analysisCard.forecastDirection === 'increment'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        ₹{msg.analysisCard.predicted5DayPrice.toLocaleString('en-IN')} (
                        {msg.analysisCard.forecastPercent >= 0 ? '+' : ''}
                        {msg.analysisCard.forecastPercent}%)
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-500">{cardLabels.decision}</div>
                      <div
                        className={`mt-0.5 font-semibold text-sm ${
                          msg.analysisCard.recommendation === 'SELL'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {msg.analysisCard.recommendation === 'SELL'
                          ? cardLabels.sell
                          : cardLabels.hold}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-slate-500">{cardLabels.topMandi}</div>
                      <div className="mt-0.5 font-semibold text-slate-900">
                        {msg.analysisCard.bestMandiName} <span aria-hidden="true">·</span>{' '}
                        <span className="font-mono-nums text-emerald-700">
                          ₹{msg.analysisCard.bestMandiNetProfit.toLocaleString('en-IN')}{' '}
                          {cardLabels.netProfit}
                        </span>{' '}
                        <span className="text-slate-500 font-normal">
                          ({msg.analysisCard.bestMandiDistanceKm} km)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-1.5 flex items-center gap-3 px-1 text-[11px] text-slate-400">
                <span className="font-mono-nums">{msg.timestamp}</span>
                {!isUser && !msg.error && (
                  <button
                    type="button"
                    onClick={() => void toggleSpeakMessage(msg)}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    {speakingId === msg.id ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>{t.chatbot.stopReading}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{t.chatbot.readAloud}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {(isLoading || isVoiceProcessing) && (
          <div className="flex items-start">
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600">
              {isVoiceProcessing ? t.chatbot.voiceProcessing : t.chatbot.thinking}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Prompt Bar */}
      <div className="px-5 py-2.5 border-t border-slate-200 bg-white overflow-x-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
            {t.chatbot.quickPromptsLabel}:
          </span>
          {t.chatbot.quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading || isVoiceProcessing || isRecording}
              onClick={() => void sendMessage(q)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage();
        }}
        className="p-4 border-t border-slate-200 bg-white rounded-b-xl flex items-center gap-2.5"
      >
        {micSupported && (
          <button
            type="button"
            disabled={isLoading || isVoiceProcessing}
            onClick={() => void toggleVoiceRecording()}
            title={isRecording ? t.chatbot.voiceTapToStop : t.chatbot.voiceListen}
            aria-label={isRecording ? t.chatbot.voiceTapToStop : t.chatbot.voiceListen}
            className={`inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors shrink-0 cursor-pointer disabled:opacity-50 ${
              isRecording
                ? 'bg-red-50 border-red-300 text-red-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span className="font-mono-nums whitespace-nowrap">
                  {t.chatbot.voiceListening} 0:{String(recordingSeconds).padStart(2, '0')}
                </span>
              </>
            ) : isVoiceProcessing ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
        )}

        <input
          type="text"
          value={input}
          disabled={isRecording || isVoiceProcessing}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isRecording ? t.chatbot.voiceTapToStop : t.chatbot.placeholder}
          className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white disabled:opacity-70"
        />

        <button
          type="submit"
          disabled={isLoading || isVoiceProcessing || isRecording || !input.trim()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
        >
          <span>{t.chatbot.send}</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
