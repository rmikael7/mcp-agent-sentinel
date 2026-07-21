import { getLiveNewsItems, getSourcesStatus } from '../sources/aggregator.js';
export async function handleGetLatestNews(args) {
    const { category, persona, limit } = args;
    const liveNews = await getLiveNewsItems();
    let filtered = liveNews.filter((item) => {
        const matchCategory = category === 'all' || item.category === category;
        const matchPersona = item.personas.includes(persona);
        return matchCategory && matchPersona;
    });
    filtered = filtered.slice(0, limit);
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    count: filtered.length,
                    persona,
                    category,
                    items: filtered,
                }, null, 2),
            },
        ],
    };
}
export async function handleSearchAiNews(args) {
    const { query, persona, limit } = args;
    const q = query.toLowerCase();
    const liveNews = await getLiveNewsItems();
    const results = liveNews
        .filter((item) => {
        const matchQuery = item.title.toLowerCase().includes(q) ||
            item.summary.toLowerCase().includes(q) ||
            item.tags.some((t) => t.toLowerCase().includes(q));
        const matchPersona = item.personas.includes(persona);
        return matchQuery && matchPersona;
    })
        .slice(0, limit);
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    query,
                    persona,
                    resultsCount: results.length,
                    results,
                }, null, 2),
            },
        ],
    };
}
export async function handleGetNicheDigest(args) {
    const { niche, persona, format } = args;
    const liveNews = await getLiveNewsItems();
    const relevantItems = liveNews.filter((item) => item.personas.includes(persona)).slice(0, 5);
    const topTrends = relevantItems.map((item) => `${item.title} (${item.source})`);
    const breakingAlerts = liveNews
        .filter((item) => item.impactLevel === 'critical' || item.tags.includes('breaking-changes'))
        .map((item) => `Alerta: ${item.title} — ${item.summary.substring(0, 120)}...`);
    const keyPapersAndRepos = relevantItems.map((item) => ({
        title: item.title,
        url: item.url,
        description: item.summary.substring(0, 150),
    }));
    const digest = {
        niche,
        updatedAt: new Date().toISOString(),
        executiveSummary: `Digest em Tempo Real para ${niche} (Persona: ${persona}): Síntese gerada automaticamente a partir de ${liveNews.length} itens capturados do ArXiv, GitHub e Provider Release Notes.`,
        topTrends: topTrends.length > 0 ? topTrends : ['Nenhuma tendência recente detectada para este filtro.'],
        breakingAlerts: breakingAlerts.length > 0 ? breakingAlerts : ['Nenhum breaking alert crítico nas últimas 24h.'],
        keyPapersAndRepos,
    };
    if (format === 'markdown') {
        const markdownOutput = `
# 📊 Digest de Nicho em Tempo Real: ${digest.niche}
*Atualizado em: ${digest.updatedAt} | Persona: ${persona}*

## 💡 Resumo Executivo
${digest.executiveSummary}

## 🔥 Principais Tendências Capturadas
${digest.topTrends.map((t) => `- ${t}`).join('\n')}

## ⚠️ Alertas Críticos (Breaking Changes / Impacto Alto)
${digest.breakingAlerts.map((a) => `- **${a}**`).join('\n')}

## 📑 Principais Repositórios & Papers do Feed
${digest.keyPapersAndRepos.map((r) => `- [${r.title}](${r.url}): ${r.description}`).join('\n')}
`;
        return {
            content: [{ type: 'text', text: markdownOutput.trim() }],
        };
    }
    return {
        content: [{ type: 'text', text: JSON.stringify(digest, null, 2) }],
    };
}
export async function handleGetSourcesStatus() {
    // Garante que o feed foi inicializado ao verificar status
    await getLiveNewsItems();
    const sources = getSourcesStatus();
    return {
        content: [{ type: 'text', text: JSON.stringify({ sourcesCount: sources.length, sources }, null, 2) }],
    };
}
