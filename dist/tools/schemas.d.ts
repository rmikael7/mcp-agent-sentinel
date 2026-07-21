import { z } from 'zod';
/**
 * Esquemas Zod para validação de argumentos das Ferramentas MCP
 */
export declare const GetLatestNewsSchema: z.ZodObject<{
    category: z.ZodDefault<z.ZodEnum<["all", "models", "research", "dev_tools", "business"]>>;
    persona: z.ZodDefault<z.ZodEnum<["dev", "product", "investor", "creator"]>>;
    timeframe: z.ZodDefault<z.ZodEnum<["24h", "7d", "30d"]>>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    category: "all" | "models" | "research" | "dev_tools" | "business";
    persona: "dev" | "product" | "investor" | "creator";
    timeframe: "24h" | "7d" | "30d";
    limit: number;
}, {
    category?: "all" | "models" | "research" | "dev_tools" | "business" | undefined;
    persona?: "dev" | "product" | "investor" | "creator" | undefined;
    timeframe?: "24h" | "7d" | "30d" | undefined;
    limit?: number | undefined;
}>;
export declare const SearchAiNewsSchema: z.ZodObject<{
    query: z.ZodString;
    persona: z.ZodDefault<z.ZodEnum<["dev", "product", "investor", "creator"]>>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    persona: "dev" | "product" | "investor" | "creator";
    limit: number;
    query: string;
}, {
    query: string;
    persona?: "dev" | "product" | "investor" | "creator" | undefined;
    limit?: number | undefined;
}>;
export declare const GetNicheDigestSchema: z.ZodObject<{
    niche: z.ZodString;
    persona: z.ZodDefault<z.ZodEnum<["dev", "product", "investor", "creator"]>>;
    format: z.ZodDefault<z.ZodEnum<["json", "markdown"]>>;
}, "strip", z.ZodTypeAny, {
    persona: "dev" | "product" | "investor" | "creator";
    niche: string;
    format: "json" | "markdown";
}, {
    niche: string;
    persona?: "dev" | "product" | "investor" | "creator" | undefined;
    format?: "json" | "markdown" | undefined;
}>;
export declare const GetSourcesStatusSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
