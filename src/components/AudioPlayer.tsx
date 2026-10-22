'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause, Square, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface AudioPlayerProps {
  checklistId: string;
}

export function AudioPlayer({ checklistId }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    handleStop();
    setTranscript('');
  }, [checklistId]);

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsLoading(false);
  };

  const handlePlay = async () => {
    if (isPlaying) {
      handleStop();
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checklistId }),
      });

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('audio/mpeg')) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = url;
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => {
          fallbackSpeech();
        };

        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      if (data.transcript) {
        setTranscript(data.transcript);
        fallbackSpeech(data.transcript);
      } else {
        fallbackSpeech();
      }
    } catch (err) {
      console.warn('Audio API failed, using browser speech synthesis fallback:', err);
      fallbackSpeech();
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackSpeech = (textToSpeak?: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Voice guidance is not supported by your browser.');
      setIsPlaying(false);
      return;
    }

    const script =
      textToSpeak ||
      transcript ||
      'Please stay calm. If you transferred money within the last two hours, dial 1930 immediately to freeze funds.';

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="bg-[#154D40] text-white rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-emerald-200" aria-hidden="true" />
          <h4 className="text-base font-bold text-white">
            Listen Aloud
          </h4>
        </div>
        <p className="text-xs text-emerald-100/80 font-normal">
          Hear the immediate action plan, one step at a time.
        </p>
      </div>

      {/* Audio playback row */}
      <div className="flex items-center gap-3 bg-[#0F3D33] p-3 rounded-xl border border-white/10">
        <button
          type="button"
          onClick={handlePlay}
          disabled={isLoading}
          className="w-9 h-9 rounded-full bg-white text-[#154D40] flex items-center justify-center shrink-0 hover:bg-emerald-50 transition cursor-pointer disabled:opacity-50"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#154D40]" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4 text-[#154D40]" />
          ) : (
            <Play className="w-4 h-4 text-[#154D40] fill-current ml-0.5" />
          )}
        </button>

        <div className="flex-1 space-y-1">
          <span className="text-xs font-semibold text-white block">
            {isPlaying ? 'Playing safety instructions...' : 'English - Ready to play'}
          </span>
          <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
            <div className={`bg-emerald-300 h-full ${isPlaying ? 'w-2/3 animate-pulse' : 'w-0'}`} />
          </div>
        </div>

        {isPlaying && (
          <button
            type="button"
            onClick={handleStop}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white transition"
            aria-label="Stop audio"
          >
            <Square className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="text-[11px] text-emerald-200/70">
        <span>You can also follow the written checklist.</span>
      </div>

      {/* Transcript toggle */}
      {transcript && (
        <div className="pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-xs font-semibold text-emerald-200 hover:text-white inline-flex items-center gap-1"
          >
            <span>{showTranscript ? 'Hide transcript' : 'Show transcript'}</span>
            {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showTranscript && (
            <div className="mt-2 p-3 rounded-xl bg-[#0F3D33] border border-white/10 text-xs text-emerald-100 leading-relaxed">
              {transcript}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AudioPlayer;
