import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { GetLatestNewsSchema, SearchAiNewsSchema, GetNicheDigestSchema, GetSourcesStatusSchema, } from './tools/schemas.js';
import { handleGetLatestNews, handleSearchAiNews, handleGetNicheDigest, handleGetSourcesStatus, } from './tools/handlers.js';
// Inicializar Servidor MCP
const server = new Server({
    name: 'mcp-agent-sentinel',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Registrar Lista de Ferramentas (tools)
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'get_latest_news',
                description: 'Recupera as notícias e registros de dados mais recentes de IA por categoria, persona e limite.',
                inputSchema: zodToJsonSchema(GetLatestNewsSchema),
            },
            {
                name: 'search_ai_news',
                description: 'Pesquisa textual em tempo real no feed curado por palavras-chave ou modelos de IA.',
                inputSchema: zodToJsonSchema(SearchAiNewsSchema),
            },
            {
                name: 'get_niche_digest',
                description: 'Gera um briefing/resumo executivo condensado e estruturado para um sub-nicho específico.',
                inputSchema: zodToJsonSchema(GetNicheDigestSchema),
            },
            {
                name: 'get_sources_status',
                description: 'Retorna o status atual de funcionamento e última execução dos scrapers e fontes de dados.',
                inputSchema: zodToJsonSchema(GetSourcesStatusSchema),
            },
        ],
    };
});
// Registrar Manipulador de Chamadas (CallToolHandler)
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'get_latest_news': {
                const parsed = GetLatestNewsSchema.parse(args || {});
                return await handleGetLatestNews(parsed);
            }
            case 'search_ai_news': {
                const parsed = SearchAiNewsSchema.parse(args || {});
                return await handleSearchAiNews(parsed);
            }
            case 'get_niche_digest': {
                const parsed = GetNicheDigestSchema.parse(args || {});
                return await handleGetNicheDigest(parsed);
            }
            case 'get_sources_status': {
                return await handleGetSourcesStatus();
            }
            default:
                throw new Error(`Ferramenta desconhecida: ${name}`);
        }
    }
    catch (error) {
        return {
            isError: true,
            content: [
                {
                    type: 'text',
                    text: `Erro ao executar a ferramenta '${name}': ${error?.message || String(error)}`,
                },
            ],
        };
    }
});
// Iniciar Servidor no Transporte Stdio
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('🚀 MCP Data Infrastructure Server rodando via Stdio...');
}
main().catch((error) => {
    console.error('Fatal error starting MCP Server:', error);
    process.exit(1);
});
