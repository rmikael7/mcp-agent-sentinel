import { NewsItem, Persona } from '../types.js';

interface GitHubRepoItem {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  pushed_at: string;
  topics: string[];
}

/**
 * Fetcher para repositórios emergentes e populares de IA / MCP no GitHub
 */
export async function fetchGitHubTrendingNews(): Promise<NewsItem[]> {
  const url = 'https://api.github.com/search/repositories?q=mcp+OR+agentic+OR+llm-agent&sort=updated&order=desc&per_page=12';

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MCP-Data-Infrastructure/1.0 (https://github.com/agent-principal/mcp-data-infrastructure)',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      console.error(`GitHub API Error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = (await response.json()) as { items?: GitHubRepoItem[] };
    if (!data.items || !Array.isArray(data.items)) {
      return [];
    }

    return data.items.map((repo) => {
      const stars = repo.stargazers_count || 0;
      const lang = repo.language || 'TypeScript/Python';
      const desc = repo.description || 'Repositório de infraestrutura de inteligência artificial e agentes.';
      const topics = repo.topics && repo.topics.length > 0 ? repo.topics : ['github', 'open-source', 'ai'];

      const isHighImpact = stars > 500 || topics.includes('mcp');
      const personas: Persona[] = ['dev', 'product', 'creator'];
      if (stars > 2000 || isHighImpact) personas.push('investor');

      return {
        id: `gh-${repo.id}`,
        title: `[GitHub Repos] ${repo.full_name} (${stars} ⭐)`,
        source: 'GitHub Trending Repos (AI/LLM/MCP)',
        url: repo.html_url,
        publishedAt: repo.pushed_at || repo.updated_at || new Date().toISOString(),
        category: 'dev_tools',
        summary: `${desc} — Linguagem principal: ${lang}. Tópicos: ${topics.slice(0, 5).join(', ')}.`,
        relevanceScore: isHighImpact ? 0.95 : 0.88,
        tags: topics,
        impactLevel: isHighImpact ? 'high' : 'medium',
        personas,
        codeDiffAvailable: true,
      };
    });
  } catch (error) {
    console.error('Erro ao buscar novidades do GitHub:', error);
    return [];
  }
}
