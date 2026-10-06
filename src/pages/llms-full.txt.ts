import type { APIRoute } from 'astro';
import { llmsFull } from '@/lib/llms';
import { textResponse } from '@/lib/text-response';

export const GET: APIRoute = () => textResponse(llmsFull(), 'text/markdown');
