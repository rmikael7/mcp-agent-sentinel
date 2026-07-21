/**
 * Cliente simples para a API do Firecrawl (utilizado para sites não estruturados sem RSS/API)
 */
export async function scrapeUrlWithFirecrawl(url) {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
        return {
            success: false,
            error: 'FIRECRAWL_API_KEY não configurada no ambiente.',
        };
    }
    try {
        const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                url,
                formats: ['markdown'],
            }),
        });
        if (!response.ok) {
            return {
                success: false,
                error: `Firecrawl API Error: ${response.status} ${response.statusText}`,
            };
        }
        const json = (await response.json());
        if (json.success && json.data) {
            return {
                success: true,
                markdown: json.data.markdown,
                metadata: json.data.metadata,
            };
        }
        return {
            success: false,
            error: 'Resposta inválida da API Firecrawl.',
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido ao chamar Firecrawl.',
        };
    }
}
/**
 * Fetcher que utiliza o Firecrawl para raspar páginas públicas pré-configuradas (se API Key estiver ativa)
 */
export async function fetchFirecrawlNews() {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
        // Retorna vazio silenciosamente se não houver chave (fallback gracioso)
        return [];
    }
    const targetUrls = [
        { url: 'https://news.ycombinator.com', category: 'business' },
    ];
    const items = [];
    for (const target of targetUrls) {
        const result = await scrapeUrlWithFirecrawl(target.url);
        if (result.success && result.markdown) {
            const title = result.metadata?.title || 'Notícias de Tecnologia e IA';
            const desc = result.metadata?.description || result.markdown.substring(0, 250);
            items.push({
                id: `firecrawl-${Date.now()}`,
                title: `[Web Firecrawl] ${title}`,
                source: 'Firecrawl Web Scraper',
                url: target.url,
                publishedAt: new Date().toISOString(),
                category: target.category,
                summary: desc,
                relevanceScore: 0.90,
                tags: ['web-scrape', 'firecrawl', 'tech-news'],
                impactLevel: 'medium',
                personas: ['dev', 'product', 'investor'],
                codeDiffAvailable: false,
            });
        }
    }
    return items;
}
