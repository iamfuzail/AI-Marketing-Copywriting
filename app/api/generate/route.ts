import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildPrompt } from '@/lib/prompts';
import type { GenerationRequest } from '@/types';

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: 'GEMINI_API_KEY is not configured. Add it to your .env.local file.' },
      { status: 500 }
    );
  }

  try {
    const body: GenerationRequest = await req.json();
    const prompt = buildPrompt(body);

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = [
      'gemini-2.0-flash',
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-pro-latest'
    ];

    let result;
    let streamError;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        });
        result = await model.generateContentStream(prompt);
        break; // If successful, exit the fallback loop
      } catch (err: unknown) {
        streamError = err;
        const errorMsg = err instanceof Error ? err.message : String(err);
        // If it's an API key issue, don't cascade, just fail
        if (errorMsg.includes('API_KEY_INVALID')) {
          throw err;
        }
        console.warn(`Model ${modelName} failed, falling back...`, errorMsg);
      }
    }

    if (!result) {
      throw streamError || new Error('All model generation attempts failed.');
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          console.error('Stream error:', err);
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    console.error('Generation error:', error);
    const message = error instanceof Error ? error.message : 'Generation failed';

    if (message.includes('429') || message.includes('RATE_LIMIT')) {
      return Response.json(
        { error: 'Slow down — wait a few seconds and try again' },
        { status: 429 }
      );
    }

    return Response.json({ error: message }, { status: 500 });
  }
}
