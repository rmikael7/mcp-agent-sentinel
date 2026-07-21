import { getLiveNewsItems, getSourcesStatus } from '../src/sources/aggregator.js';
import { handleGetNicheDigest } from '../src/tools/handlers.js';
import { Persona } from '../src/types.js';
import readline from 'readline';

// Cores ANSI simples para o terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function mainHeader() {
  console.clear();
  console.log(`${colors.cyan}${colors.bright}========================================================================${colors.reset}`);
  console.log(`${colors.bright} 📡 MCP DATA INFRASTRUCTURE — DEMO VISUAL INTERATIVA (LIVE FEED) ${colors.reset}`);
  console.log(`${colors.cyan}========================================================================${colors.reset}`);
  console.log(`${colors.gray}Visualizador nativo de feed por persona, desduplicação e métricas de infraestrutura.${colors.reset}\n`);
}

async function renderPersonaFeed(persona: Persona) {
  await mainHeader();
  console.log(`${colors.yellow}⏳ Buscando e desduplicando feed em tempo real para Persona: ${colors.bright}${persona.toUpperCase()}${colors.reset}...\n`);

  const items = await getLiveNewsItems();
  const filtered = items.filter((item) => item.personas.includes(persona));

  console.log(`${colors.green}✅ ${filtered.length} itens relevantes encontrados para [${persona}]:${colors.reset}\n`);

  filtered.slice(0, 6).forEach((item, idx) => {
    const impactColor = item.impactLevel === 'critical' ? colors.red : item.impactLevel === 'high' ? colors.yellow : colors.cyan;
    console.log(`${colors.bright}${idx + 1}. ${item.title}${colors.reset}`);
    console.log(`   ${colors.gray}Fonte:${colors.reset} ${item.source} | ${colors.gray}Cat:${colors.reset} ${item.category} | ${colors.gray}Impacto:${colors.reset} ${impactColor}${item.impactLevel.toUpperCase()}${colors.reset} | ${colors.gray}Score:${colors.reset} ${item.relevanceScore}`);
    console.log(`   ${colors.gray}URL:${colors.reset} ${colors.cyan}${item.url}${colors.reset}`);
    console.log(`   ${colors.gray}Resumo:${colors.reset} ${item.summary.substring(0, 160)}...`);
    console.log(`   ${colors.gray}Tags:${colors.reset} [${item.tags.join(', ')}]\n`);
  });

  console.log(`${colors.magenta}------------------------------------------------------------------------${colors.reset}`);
  console.log(`${colors.bright}📑 DIGEST DE NICHO (SÍNTESE EXECUTIVA PARSEADA):${colors.reset}`);
  console.log(`${colors.magenta}------------------------------------------------------------------------${colors.reset}`);

  const digestResult = await handleGetNicheDigest({ niche: 'AI Engineering', persona, format: 'markdown' });
  console.log(digestResult.content[0].text);

  promptMenu();
}

async function renderSourcesStatus() {
  await mainHeader();
  console.log(`${colors.yellow}📊 STATUS DAS FONTES DE DADOS MONITORADAS (CAMADA 1):${colors.reset}\n`);

  await getLiveNewsItems();
  const sources = getSourcesStatus();

  sources.forEach((s) => {
    const statusColor = s.status === 'active' ? colors.green : colors.red;
    console.log(`${colors.bright}• ${s.sourceName}${colors.reset}`);
    console.log(`  Status: ${statusColor}${s.status.toUpperCase()}${colors.reset} | Categoria: ${s.category}`);
    console.log(`  Itens Processados (24h): ${colors.cyan}${s.itemsProcessed24h}${colors.reset}`);
    console.log(`  Última Raspagem: ${s.lastScrapedAt}\n`);
  });

  promptMenu();
}

function promptMenu() {
  console.log(`\n${colors.bright}Escolha uma opção para visualizar:${colors.reset}`);
  console.log(`1) Persona: ${colors.cyan}DEVELOPER (dev)${colors.reset} — Foco em código, ArXiv, repositórios e SDKs`);
  console.log(`2) Persona: ${colors.green}PRODUCT MANAGER (product)${colors.reset} — Foco em modelos, custos e recursos`);
  console.log(`3) Persona: ${colors.yellow}INVESTOR (investor)${colors.reset} — Foco em pesquisas de alto impacto e tendências`);
  console.log(`4) Status das Fontes e Infraestrutura`);
  console.log(`5) Sair\n`);

  rl.question(`${colors.bright}Digite o número da opção (1-5): ${colors.reset}`, (answer) => {
    const choice = answer.trim();
    if (choice === '1') {
      renderPersonaFeed('dev');
    } else if (choice === '2') {
      renderPersonaFeed('product');
    } else if (choice === '3') {
      renderPersonaFeed('investor');
    } else if (choice === '4') {
      renderSourcesStatus();
    } else if (choice === '5') {
      console.log(`\n${colors.green}Encerrando visualização. Até logo!${colors.reset}\n`);
      rl.close();
      process.exit(0);
    } else {
      console.log(`${colors.red}Opção inválida.${colors.reset}`);
      promptMenu();
    }
  });
}

// Inicia o app
mainHeader().then(() => promptMenu());
