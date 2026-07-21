import { NewsItem, SourceStatus } from '../types.js';
import { fetchArxivNews } from './arxiv.js';
import { fetchGitHubTrendingNews } from './github.js';
import { fetchReleaseNotesNews } from './releasenotes.js';
import { fetchFirecrawlNews } from './firecrawl.js';

interface CacheState {
  items: NewsItem[];
  lastFetchedAt: number;
  sourcesStatus: SourceStatus[];
}

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutos de cache em memória

let cache: CacheState = {
  items: [],
  lastFetchedAt: 0,
  sourcesStatus: [
    {
      sourceName: 'ArXiv AI & Machine Learning',
      category: 'research',
      status: 'active',
      lastScrapedAt: new Date(0).toISOString(),
      itemsProcessed24h: 0,
    },
    {
      sourceName: 'GitHub Trending Repos (AI/LLM/MCP)',
      category: 'dev_tools',
      status: 'active',
      lastScrapedAt: new Date(0).toISOString(),
      itemsProcessed24h: 0,
    },
    {
      sourceName: 'Model & SDK Release Notes',
      category: 'models',
      status: 'active',
      lastScrapedAt: new Date(0).toISOString(),
      itemsProcessed24h: 0,
    },
    {
      sourceName: 'Firecrawl Web Scraper Engine',
      category: 'business',
      status: process.env.FIRECRAWL_API_KEY ? 'active' : 'degraded',
      lastScrapedAt: new Date(0).toISOString(),
      itemsProcessed24h: 0,
    },
  ],
};

/**
 * Retorna as notícias agregadas em tempo real (com cache de 15 minutos)
 */
export async function getLiveNewsItems(forceRefresh = false): Promise<NewsItem[]> {
  const now = Date.now();

  if (!forceRefresh && cache.items.length > 0 && now - cache.lastFetchedAt < CACHE_TTL_MS) {
    return cache.items;
  }

  const scrapedAtIso = new Date().toISOString();

  // Executa todas as fontes em paralelo com Promise.allSettled para garantir resiliência
  const [arxivResult, githubResult, releaseResult, firecrawlResult] = await Promise.allSettled([
    fetchArxivNews(),
    fetchGitHubTrendingNews(),
    fetchReleaseNotesNews(),
    fetchFirecrawlNews(),
  ]);

  const arxivItems = arxivResult.status === 'fulfilled' ? arxivResult.value : [];
  const githubItems = githubResult.status === 'fulfilled' ? githubResult.value : [];
  const releaseItems = releaseResult.status === 'fulfilled' ? releaseResult.value : [];
  const firecrawlItems = firecrawlResult.status === 'fulfilled' ? firecrawlResult.value : [];

  // Atualizar métricas de status das fontes
  cache.sourcesStatus = [
    {
      sourceName: 'ArXiv AI & Machine Learning',
      category: 'research',
      status: arxivResult.status === 'fulfilled' ? 'active' : 'offline',
      lastScrapedAt: scrapedAtIso,
      itemsProcessed24h: arxivItems.length,
    },
    {
      sourceName: 'GitHub Trending Repos (AI/LLM/MCP)',
      category: 'dev_tools',
      status: githubResult.status === 'fulfilled' ? 'active' : 'offline',
      lastScrapedAt: scrapedAtIso,
      itemsProcessed24h: githubItems.length,
    },
    {
      sourceName: 'Model & SDK Release Notes',
      category: 'models',
      status: releaseResult.status === 'fulfilled' ? 'active' : 'offline',
      lastScrapedAt: scrapedAtIso,
      itemsProcessed24h: releaseItems.length,
    },
    {
      sourceName: 'Firecrawl Web Scraper Engine',
      category: 'business',
      status: process.env.FIRECRAWL_API_KEY ? (firecrawlResult.status === 'fulfilled' ? 'active' : 'degraded') : 'degraded',
      lastScrapedAt: scrapedAtIso,
      itemsProcessed24h: firecrawlItems.length,
    },
  ];

  // Agrega e remove duplicatas por URL/ID
  const allRawItems = [...releaseItems, ...githubItems, ...arxivItems, ...firecrawlItems];
  const uniqueItemsMap = new Map<string, NewsItem>();

  for (const item of allRawItems) {
    const key = item.url || item.id;
    if (!uniqueItemsMap.has(key)) {
      uniqueItemsMap.set(key, item);
    }
  }

  const sortedItems = Array.from(uniqueItemsMap.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  cache.items = sortedItems;
  cache.lastFetchedAt = now;

  return cache.items;
}

/**
 * Retorna o status atualizado de operacionalidade de todas as fontes da Camada 1
 */
export function getSourcesStatus(): SourceStatus[] {
  return cache.sourcesStatus;
}
