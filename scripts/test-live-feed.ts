import { getLiveNewsItems, getSourcesStatus } from '../src/sources/aggregator.js';
import { handleGetLatestNews, handleGetNicheDigest } from '../src/tools/handlers.js';

async function testLiveFeed() {
  console.log('⚡ Iniciando teste de captura do Feed em Tempo Real (ArXiv, GitHub, Release Notes)...\n');

  const items = await getLiveNewsItems(true);
  console.log(`✅ Total de itens capturados: ${items.length}`);

  items.slice(0, 5).forEach((item, index) => {
    console.log(`\n--- [Item ${index + 1}] ---`);
    console.log(`Título: ${item.title}`);
    console.log(`Fonte: ${item.source}`);
    console.log(`Categoria: ${item.category} | Relevância: ${item.relevanceScore}`);
    console.log(`URL: ${item.url}`);
    console.log(`Resumo: ${item.summary.substring(0, 150)}...`);
  });

  console.log('\n--- 📊 Status das Fontes ---');
  console.log(JSON.stringify(getSourcesStatus(), null, 2));

  console.log('\n--- 🧪 Testando Handler handleGetLatestNews (dev) ---');
  const latestDevNews = await handleGetLatestNews({ category: 'all', persona: 'dev', limit: 3 });
  console.log(latestDevNews.content[0].text);

  console.log('\n--- 📑 Testando Handler handleGetNicheDigest (Markdown) ---');
  const digest = await handleGetNicheDigest({ niche: 'AI Engineering', persona: 'dev', format: 'markdown' });
  console.log(digest.content[0].text);
}

testLiveFeed().catch(console.error);
