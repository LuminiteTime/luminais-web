/** Static text file response for endpoints such as robots.txt and llms.txt. */
export const textResponse = (body: string, type = 'text/plain') =>
  new Response(body, { headers: { 'Content-Type': `${type}; charset=utf-8` } });
