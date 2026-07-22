import fs from 'fs';
import path from 'path';

function checkSetup() {
  const distIndexPath = path.resolve(process.cwd(), 'dist', 'index.js');
  const distExists = fs.existsSync(distIndexPath);

  console.log('======================================================');
  console.log('📌 STATUS DA CONFIGURAÇÃO DO MCP DATA INFRASTRUCTURE');
  console.log('======================================================\n');

  if (distExists) {
    console.log('✅ Build verificado: dist/index.js está pronto!');
  } else {
    console.log('❌ dist/index.js não encontrado. Execute "npm run build" primeiro.');
    return;
  }

  const absoluteDistPath = distIndexPath.replace(/\\/g, '/');

  console.log('\n📋 COMO ATIVAR NO CURSOR IDE NESTE EXATO MOMENTO:');
  console.log('------------------------------------------------------');
  console.log('1. Abra as configurações do Cursor (Ctrl + , ou Ícone de Engrenagem).');
  console.log('2. Vá em "Features" -> "MCP Servers".');
  console.log('3. Clique em "+ Add New MCP Server".');
  console.log('4. Preencha os campos exatamente assim:\n');
  console.log(`   - Name:    mcp-agent-sentinel`);
  console.log(`   - Type:    command`);
  console.log(`   - Command: node "${absoluteDistPath}"\n`);
  console.log('------------------------------------------------------');
  console.log('🧪 PROMPT PARA TESTAR NO CHAT DO CURSOR AO VIVO:');
  console.log('------------------------------------------------------');
  console.log('Cole este prompt em qualquer chat do Cursor:');
  console.log('\n> "Use a ferramenta get_latest_news do servidor mcp-agent-sentinel para me mostrar os últimos artigos de pesquisa do ArXiv e release notes para a persona dev."');
  console.log('\n======================================================');
}

checkSetup();
