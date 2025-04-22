import prisma from "../lib/prisma";
import { buildCacheKey, getCache, setCache } from "../lib/redisClient";


// utils/prismaFetchers.ts
type PaginatedOptions<T> = {
    model: keyof typeof prisma & string;
    cachePrefix: string;
    page: number;
    limit: number;
    where?: Record<string, any>;
    include?: Record<string, any>;
    orderBy?: Record<string, any>;
};

export async function fetchPaginatedWithCache<T>({
    model,
    cachePrefix,
    page,
    limit,
    where = {},
    include,
    orderBy,
}: PaginatedOptions<T>): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}> {

    const filters = {
        page,
        limit,
        ...Object.fromEntries(
            Object.entries(where ?? {}).map(([key, val]) => [key, JSON.stringify(val)])
        ),
    };

    const cacheKey = buildCacheKey(cachePrefix, filters);

    try {
        const cached = await getCache<typeof result>(cacheKey);
        if (cached) return cached;

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            (prisma[model] as any).findMany({
                where,
                include,
                orderBy,
                skip,
                take: limit,
            }),
            (prisma[model] as any).count({ where }),
        ]);

        const result = {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };

        if (data.length > 0) {
            await setCache(cacheKey, result);
        }

        return result;
    } catch (error) {
        console.error(`❌ Error fetching ${model} list:`, error);
        throw new Error(`❌ Failed to fetch ${model}`);
    }
}

type ByIdOptions<T> = {
    model: keyof typeof prisma & string;
    id: string;
    include?: Record<string, any>;
    cachePrefix: string;
};

export async function fetchByIdWithCache<T>({
    model,
    id,
    include,
    cachePrefix,
}: ByIdOptions<T>): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}> {
  
    const cacheKey = `${cachePrefix}:${id}`;

    try {
        const cached = await getCache<typeof result>(cacheKey);
        if (cached) return cached;

        const data = await (prisma[model] as any).findUnique({
            where: { id },
            include,
        });

        const total = data ? 1 : 0;

        const result = {
            data: data ? [data] : [],
            total,
            page: 1,
            limit: 1,
            totalPages: total,
        };

        if (data) {
            await setCache(cacheKey, result);
        }

        return result;
    } catch (error) {
        console.error(`❌ Error fetching ${model} by ID:`, error);
        throw new Error(`❌ Failed to fetch ${model}`);
    }
}
