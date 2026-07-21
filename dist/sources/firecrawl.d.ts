import { NewsItem } from '../types.js';
export interface FirecrawlScrapeResult {
    success: boolean;
    markdown?: string;
    metadata?: {
        title?: string;
        description?: string;
        sourceURL?: string;
        statusCode?: number;
    };
    error?: string;
}
/**
 * Cliente simples para a API do Firecrawl (utilizado para sites não estruturados sem RSS/API)
 */
export declare function scrapeUrlWithFirecrawl(url: string): Promise<FirecrawlScrapeResult>;
/**
 * Fetcher que utiliza o Firecrawl para raspar páginas públicas pré-configuradas (se API Key estiver ativa)
 */
export declare function fetchFirecrawlNews(): Promise<NewsItem[]>;
