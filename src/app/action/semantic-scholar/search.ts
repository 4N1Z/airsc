import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { cache } from 'react';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})
// Create a new ratelimiter that allows 30 requests per minute
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(30, "60 s"),
  analytics: true, // Enable analytics
  prefix: "semantic_scholar", // Prefix for Redis keys
});

// Create a cache map for storing results
const searchCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const searchSemanticScholar = cache(async (
  query: string, 
  limit: number = 5, 
  sort: string = 'recency'
) => {
  try {
    // Create a cache key from the parameters
    const cacheKey = `${query}-${limit}-${sort}`;
    
    // Check cache first
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("Using cached research paper results for:", query);
      return cached.data;
    }

    // Apply rate limiting using Upstash
    const { success, limit: rateLimitInfo } = await ratelimit.limit(`search_${query}`);
    
    if (!success) {
      console.warn('Rate limit reached:', rateLimitInfo);
      // Try to return cached data even if expired rather than failing
      if (cached) {
        console.log("Using expired cache due to rate limit");
        return cached.data;
      }
      throw new Error(`Rate limit exceeded. Reset in ${rateLimitInfo} seconds`);
    }

    console.log("Fetching new research paper results for:", query);
    
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=${limit}&sort=${sort}&fields=title,authors,year,abstract,url`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 } // Revalidate cache every hour
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        // Try to return cached data even if expired rather than failing
        if (cached) {
          console.log("Using expired cache due to API rate limit");
          return cached.data;
        }
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Cache the results
    searchCache.set(cacheKey, {
      data: data.data,
      timestamp: Date.now()
    });

    // Clean up old cache entries
    cleanCache();

    return data.data;
  } catch (error) {
    console.error('Error searching Semantic Scholar:', error);
    throw error;
  }
});

function cleanCache() {
  const now = Date.now();
  for (const [key, value] of searchCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      searchCache.delete(key);
    }
  }
}

// Create a utility file src/utils/rate-limit.ts