import { useState, useCallback } from 'react';
import type { GenerationRequest, OutputField } from '@/types';
import { parseOutputFields } from '@/lib/prompts';
import { useSettingsStore } from '@/store/settingsStore';

export function useGenerate() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [fields, setFields] = useState<OutputField[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const userApiKey = useSettingsStore((s) => s.apiKey);

  const generate = useCallback(async (request: GenerationRequest) => {
    setIsGenerating(true);
    setStreamText('');
    setFields([]);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...request, userApiKey }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Generation failed');
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamText(accumulated);
      }

      const parsed = parseOutputFields(accumulated, request.format);
      setFields(parsed);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Something went wrong. Check your API key or try again.';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setStreamText('');
    setFields([]);
    setError(null);
  }, []);

  return { generate, isGenerating, streamText, fields, error, reset };
}
