/**
 * Tipos e Interfaces do MCP Data Infrastructure
 */

export type Category = 'all' | 'models' | 'research' | 'dev_tools' | 'business';
export type Persona = 'dev' | 'product' | 'investor' | 'creator';
export type Timeframe = '24h' | '7d' | '30d';

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  category: Category;
  summary: string;
  relevanceScore: number;
  tags: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  personas: Persona[];
  codeDiffAvailable?: boolean;
}

export interface NicheDigest {
  niche: string;
  updatedAt: string;
  executiveSummary: string;
  topTrends: string[];
  breakingAlerts: string[];
  keyPapersAndRepos: Array<{
    title: string;
    url: string;
    description: string;
  }>;
}

export interface SourceStatus {
  sourceName: string;
  category: string;
  status: 'active' | 'degraded' | 'offline';
  lastScrapedAt: string;
  itemsProcessed24h: number;
}
