export function rateLimit({
  interval,
  uniqueTokenPerInterval = 500,
}: {
  interval: number;
  uniqueTokenPerInterval?: number;
}) {
  const tokens = new Map<string, number[]>();

  return {
    check: async (limit: number, token: string) => {
      const now = Date.now();
      const tokenCount = tokens.get(token) || [];
      
      // Only keep tokens from within the interval
      const validTokens = tokenCount.filter((timestamp) => now - timestamp < interval);
      
      // Allow bursts of requests up to 2x the limit
      const burstLimit = limit * 2;
      
      if (validTokens.length >= burstLimit) {
        throw new Error('Rate limit exceeded');
      }

      validTokens.push(now);
      tokens.set(token, validTokens);

      // Cleanup old tokens every 100 requests
      if (Math.random() < 0.01) {
        const tokensToRemove = [...tokens.entries()]
          .filter(([_, timestamps]) => 
            timestamps.every((timestamp) => now - timestamp >= interval)
          );
        
        for (const [tokenToRemove] of tokensToRemove) {
          tokens.delete(tokenToRemove);
        }
      }

      // More lenient check for unique tokens
      if (tokens.size > uniqueTokenPerInterval * 2) {
        throw new Error('Too many unique requests');
      }
    },
  };
} 