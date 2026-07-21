import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import http from 'http';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  GetLatestNewsSchema,
  SearchAiNewsSchema,
  GetNicheDigestSchema,
  GetSourcesStatusSchema,
} from './tools/schemas.js';
import {
  handleGetLatestNews,
  handleSearchAiNews,
  handleGetNicheDigest,
  handleGetSourcesStatus,
} from './tools/handlers.js';

const toolsDefinition = [
  {
    name: 'get_latest_news',
    description: 'Recupera as notícias e registros de dados mais recentes de IA por categoria, persona e limite.',
    inputSchema: zodToJsonSchema(GetLatestNewsSchema) as any,
  },
  {
    name: 'search_ai_news',
    description: 'Pesquisa textual em tempo real no feed curado por palavras-chave ou modelos de IA.',
    inputSchema: zodToJsonSchema(SearchAiNewsSchema) as any,
  },
  {
    name: 'get_niche_digest',
    description: 'Gera um briefing/resumo executivo condensado e estruturado para um sub-nicho específico.',
    inputSchema: zodToJsonSchema(GetNicheDigestSchema) as any,
  },
  {
    name: 'get_sources_status',
    description: 'Retorna o status atual de funcionamento e última execução dos scrapers e fontes de dados.',
    inputSchema: zodToJsonSchema(GetSourcesStatusSchema) as any,
  },
];

// Inicializar Servidor MCP
const server = new Server(
  {
    name: 'mcp-agent-sentinel',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Registrar Lista de Ferramentas (tools)
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: toolsDefinition };
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
  } catch (error: any) {
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

/**
 * Inicializador Híbrido: Suporta Stdio e HTTP SSE simultaneamente
 */
async function main() {
  const mode = process.env.MCP_MODE || 'hybrid';
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  if (mode === 'stdio' || mode === 'hybrid') {
    const stdioTransport = new StdioServerTransport();
    await server.connect(stdioTransport);
    console.error('🚀 MCP Agent Sentinel rodando em modo Stdio...');
  }

  if (mode === 'http' || mode === 'hybrid') {
    let sseTransport: SSEServerTransport | null = null;

    const httpServer = http.createServer(async (req, res) => {
      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      if (req.url === '/sse' && req.method === 'GET') {
        sseTransport = new SSEServerTransport('/message', res);
        await server.connect(sseTransport);
      } else if (req.url?.startsWith('/message') && req.method === 'POST') {
        if (sseTransport) {
          await sseTransport.handlePostMessage(req, res);
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'SSE Transport not initialized' }));
        }
      } else if (req.url === '/.well-known/mcp/server-card.json' || req.url === '/server-card.json') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            name: 'mcp-agent-sentinel',
            description: 'Real-time Agentic Sentinel & Breaking-Change Intelligence Server for AI Agents',
            version: '1.0.0',
            tools: toolsDefinition,
          })
        );
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'active', server: 'mcp-agent-sentinel', endpoints: ['/sse', '/server-card.json'] }));
      }
    });

    httpServer.listen(port, () => {
      console.error(`📡 MCP Agent Sentinel HTTP/SSE Server escutando na porta ${port}...`);
    });
  }
}

main().catch((error) => {
  console.error('Fatal error starting MCP Server:', error);
  process.exit(1);
});
