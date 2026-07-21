import { NewsItem, SourceStatus } from '../types.js';
/**
 * Retorna as notícias agregadas em tempo real (com cache de 15 minutos)
 */
export declare function getLiveNewsItems(forceRefresh?: boolean): Promise<NewsItem[]>;
/**
 * Retorna o status atualizado de operacionalidade de todas as fontes da Camada 1
 */
export declare function getSourcesStatus(): SourceStatus[];
