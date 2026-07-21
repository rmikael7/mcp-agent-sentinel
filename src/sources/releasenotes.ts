import { NewsItem, Persona } from '../types.js';

interface ReleaseFeedSource {
  name: string;
  url: string;
  category: 'models' | 'dev_tools';
}

const RELEASE_FEEDS: ReleaseFeedSource[] = [
  {
    name: 'Model Context Protocol TS SDK',
    url: 'https://github.com/modelcontextprotocol/typescript-sdk/releases.atom',
    category: 'dev_tools',
  },
  {
    name: 'OpenAI Node.js SDK',
    url: 'https://github.com/openai/openai-node/releases.atom',
    category: 'models',
  },
  {
    name: 'Anthropic TypeScript SDK',
    url: 'https://github.com/anthropics/anthropic-sdk-typescript/releases.atom',
    category: 'models',
  },
];

/**
 * Fetcher para Release Notes e Changelogs de SDKs e Provedores de IA
 */
export async function fetchReleaseNotesNews(): Promise<NewsItem[]> {
  const allItems: NewsItem[] = [];

  for (const feed of RELEASE_FEEDS) {
    try {
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'MCP-Data-Infrastructure/1.0 (https://github.com/agent-principal/mcp-data-infrastructure)',
        },
      });

      if (!response.ok) {
        continue;
      }

      const xmlText = await response.text();
      const feedItems = parseReleaseAtom(xmlText, feed);
      allItems.push(...feedItems);
    } catch (error) {
      console.error(`Erro ao buscar release notes de ${feed.name}:`, error);
    }
  }

  return allItems;
}

/**
 * Parser de Atom XML para Releases do GitHub
 */
function parseReleaseAtom(xml: string, feedInfo: ReleaseFeedSource): NewsItem[] {
  const items: NewsItem[] = [];
  const entries = xml.split('<entry>');

  for (let i = 1; i < entries.length; i++) {
    const entry = entries[i];

    const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
    const contentMatch = entry.match(/<content[\s\S]*?>([\s\S]*?)<\/content>/);
    const linkMatch = entry.match(/<link[\s\S]*?href="([^"]+)"/);
    const updatedMatch = entry.match(/<updated>([\s\S]*?)<\/updated>/);
    const idMatch = entry.match(/<id>([\s\S]*?)<\/id>/);

    if (!titleMatch || !linkMatch) continue;

    const rawTitle = titleMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const releaseUrl = linkMatch[1].trim();
    const publishedAt = updatedMatch ? new Date(updatedMatch[1].trim()).toISOString() : new Date().toISOString();
    
    let rawContent = contentMatch ? contentMatch[1] : '';
    // Decodificar entidades HTML comuns
    rawContent = rawContent
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');
    // Remover todas as tags HTML
    rawContent = rawContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    const entryId = idMatch ? idMatch[1].replace(/[^a-zA-Z0-9]/g, '-').slice(-20) : `rel-${i}`;
    const lowerTitle = rawTitle.toLowerCase();
    const lowerContent = rawContent.toLowerCase();

    const isBreaking = lowerTitle.includes('breaking') || lowerContent.includes('breaking change') || lowerTitle.includes('v2.') || lowerTitle.includes('v3.');
    const tags = ['release-notes', 'sdk', feedInfo.name.toLowerCase().replace(/\s+/g, '-')];
    if (isBreaking) tags.push('breaking-changes');

    const personas: Persona[] = ['dev', 'product', 'creator'];
    if (isBreaking || feedInfo.category === 'models') personas.push('investor');

    items.push({
      id: `rel-${entryId}`,
      title: `[Release Notes] ${feedInfo.name}: ${rawTitle}`,
      source: `${feedInfo.name} Changelog`,
      url: releaseUrl,
      publishedAt,
      category: feedInfo.category,
      summary: rawContent.length > 280 ? rawContent.substring(0, 277) + '...' : rawContent || `Nova versão de ${feedInfo.name} publicada.`,
      relevanceScore: isBreaking ? 0.98 : 0.92,
      tags,
      impactLevel: isBreaking ? 'critical' : 'high',
      personas,
      codeDiffAvailable: true,
    });
  }

  return items;
}
