import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { tools } from '@/utils/ai/tools';

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a friendly assistant!',
    messages,
    tools,
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}   