import type { APIRoute } from 'astro';
import { llmsIndex } from '@/lib/llms';
import { textResponse } from '@/lib/text-response';

export const GET: APIRoute = () => textResponse(llmsIndex(), 'text/markdown');
