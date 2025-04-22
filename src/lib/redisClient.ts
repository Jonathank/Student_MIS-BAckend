import { createClient } from "redis";
import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST ,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    password: process.env.REDIS_PASSWORD,
});



//const redisClient = createClient();
const DEFAULT_EXPIRATION = Number(process.env.REDIS_EXPIRATION || 3600);

redisClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});

(async () => {
    try {
        await redisClient.connect();
        console.log("✅ Connected to Redis");
    } catch (err) {
        console.error("❌ Redis connection failed:", err);
    }
})();

function makeKey(type: string, identifier?: string, extraKey?: string): string {
    return [type, identifier, extraKey].filter(Boolean).join(":");
}

async function getCache<T>(key: string): Promise<T | null> {
    try {
        const cached = await redisClient.get(key);
        if (cached) {
            console.log("✅ Cache hit for:", key);
            return JSON.parse(cached) as T; // <-- parse the string!
        }
        console.log("❌ Cache miss:", key);
        return null;
    } catch (err) {
        console.error("❌ Redis getCache error:", err);
        return null;
    }
}


async function setCache(key: string, data: any, expiration: number = DEFAULT_EXPIRATION): Promise<void> {
    try {
        await redisClient.setEx(key, expiration, JSON.stringify(data));
    } catch (err) {
        console.error("❌ Redis setCache error:", err);
    }
}

async function clearCache(key: string): Promise<void> {
    try {
        await redisClient.del(key);
        console.log("🧹 Cache cleared for key:", key);
    } catch (err) {
        console.error("❌ Redis clearCache error:", err);
    }
}

async function clearCacheByPattern(pattern: string): Promise<void> {
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log("🧹 Cleared keys matching:", pattern);
        }
    } catch (err) {
        console.error("❌ Redis pattern clear error:", err);
    }
}
async function clearCacheBySimilarPattern(pattern: string): Promise<void> {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => redisClient.del(key)));
      console.log("🧹 Cleared keys matching:", pattern);
    }
  } catch (err) {
    console.error("❌ Redis pattern clear error:", err);
  }
}

export function buildCacheKey(prefix: string, filters: Record<string, any>): string {
    const query = new URLSearchParams(
        Object.entries(filters).map(([key, val]) => [key, String(val ?? '')]) as [string, string][]
    ).toString();

    return `${prefix}:${query}`;
}


process.on("SIGINT", async () => {
  console.log("🛑 Closing Redis connection...");
  await redisClient.quit();
  process.exit(0);
});


export {
    redisClient,
    getCache,
    setCache,
    clearCache,
    clearCacheByPattern,
    makeKey,
};
 
