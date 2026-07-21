import { NewsItem } from '../types.js';
/**
 * Fetcher para artigos científicos recentes do ArXiv (cs.AI, cs.CL, cs.LG)
 */
export declare function fetchArxivNews(): Promise<NewsItem[]>;
