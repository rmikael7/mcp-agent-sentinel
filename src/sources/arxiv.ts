import { NewsItem, Persona } from '../types.js';

/**
 * Fetcher para artigos científicos recentes do ArXiv (cs.AI, cs.CL, cs.LG)
 */
export async function fetchArxivNews(): Promise<NewsItem[]> {
  const url =
    'https://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.CL+OR+cat:cs.LG&sortBy=submittedDate&sortOrder=descending&max_results=10';

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MCP-Data-Infrastructure/1.0 (https://github.com/agent-principal/mcp-data-infrastructure)',
      },
    });

    if (!response.ok) {
      console.error(`ArXiv API Error: ${response.status} ${response.statusText}`);
      return [];
    }

    const xmlText = await response.text();
    return parseArxivAtom(xmlText);
  } catch (error) {
    console.error('Erro ao buscar papéis do ArXiv:', error);
    return [];
  }
}

/**
 * Parser simples e robusto de Atom XML para o ArXiv
 */
function parseArxivAtom(xml: string): NewsItem[] {
  const items: NewsItem[] = [];
  const entries = xml.split('<entry>');

  // O primeiro elemento é o cabeçalho da feed Atom
  for (let i = 1; i < entries.length; i++) {
    const entry = entries[i];

    const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
    const summaryMatch = entry.match(/<summary>([\s\S]*?)<\/summary>/);
    const idMatch = entry.match(/<id>([\s\S]*?)<\/id>/);
    const publishedMatch = entry.match(/<published>([\s\S]*?)<\/published>/);

    if (!titleMatch || !idMatch) continue;

    const rawTitle = titleMatch[1].replace(/\s+/g, ' ').trim();
    const rawSummary = summaryMatch ? summaryMatch[1].replace(/\s+/g, ' ').trim() : '';
    const arxivUrl = idMatch[1].trim();
    const publishedAt = publishedMatch ? new Date(publishedMatch[1].trim()).toISOString() : new Date().toISOString();

    // Extrair ID numérico do ArXiv ex: http://arxiv.org/abs/2607.12345v1 -> 2607.12345v1
    const paperIdMatch = arxivUrl.match(/abs\/([^/]+)$/);
    const paperId = paperIdMatch ? paperIdMatch[1] : `paper-${i}`;

    const tags = ['arxiv', 'research', 'paper'];
    const lowerTitle = rawTitle.toLowerCase();
    const lowerSummary = rawSummary.toLowerCase();

    if (lowerTitle.includes('agent') || lowerSummary.includes('agent')) tags.push('agents');
    if (lowerTitle.includes('llm') || lowerSummary.includes('language model')) tags.push('llm');
    if (lowerTitle.includes('reasoning') || lowerSummary.includes('reasoning')) tags.push('reasoning');
    if (lowerTitle.includes('benchmark') || lowerSummary.includes('eval')) tags.push('benchmarks');
    if (lowerTitle.includes('rag') || lowerSummary.includes('retrieval')) tags.push('rag');

    const isHighImpact = tags.includes('agents') || tags.includes('llm') || tags.includes('reasoning');
    const personas: Persona[] = ['dev', 'product', 'creator'];
    if (tags.includes('benchmarks') || tags.includes('agents')) personas.push('investor');

    items.push({
      id: `arxiv-${paperId}`,
      title: `[Paper ArXiv] ${rawTitle}`,
      source: 'ArXiv AI & Machine Learning',
      url: arxivUrl,
      publishedAt,
      category: 'research',
      summary: rawSummary.length > 300 ? rawSummary.substring(0, 297) + '...' : rawSummary,
      relevanceScore: isHighImpact ? 0.94 : 0.86,
      tags,
      impactLevel: isHighImpact ? 'high' : 'medium',
      personas,
      codeDiffAvailable: false,
    });
  }

  return items;
}
