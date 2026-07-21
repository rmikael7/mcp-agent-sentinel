import { z } from 'zod';
import { GetLatestNewsSchema, SearchAiNewsSchema, GetNicheDigestSchema } from './schemas.js';
export declare function handleGetLatestNews(args: z.infer<typeof GetLatestNewsSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
export declare function handleSearchAiNews(args: z.infer<typeof SearchAiNewsSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
export declare function handleGetNicheDigest(args: z.infer<typeof GetNicheDigestSchema>): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
export declare function handleGetSourcesStatus(): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
