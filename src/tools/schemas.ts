import { z } from 'zod';

/**
 * Esquemas Zod para validação de argumentos das Ferramentas MCP
 */

export const GetLatestNewsSchema = z.object({
  category: z.enum(['all', 'models', 'research', 'dev_tools', 'business']).default('all')
    .describe('Categoria do feed de dados (models, research, dev_tools, business ou all)'),
  persona: z.enum(['dev', 'product', 'investor', 'creator']).default('dev')
    .describe('Persona do consumidor (dev: código/diffs, product: ROI/pricing, investor: tração/stars, creator: ganchos/viral/newsletters)'),
  timeframe: z.enum(['24h', '7d', '30d']).default('24h')
    .describe('Janela de tempo dos registros (24h, 7d, 30d)'),
  limit: z.number().min(1).max(50).default(10)
    .describe('Quantidade máxima de itens a retornar (1 a 50)'),
});

export const SearchAiNewsSchema = z.object({
  query: z.string().min(1)
    .describe('Termo de busca (ex: "Claude 3.7", "Cursor", "FastMCP", "ArXiv")'),
  persona: z.enum(['dev', 'product', 'investor', 'creator']).default('dev')
    .describe('Persona do consumidor para recortes contextuais'),
  limit: z.number().min(1).max(20).default(5)
    .describe('Quantidade máxima de resultados'),
});

export const GetNicheDigestSchema = z.object({
  niche: z.string().min(1)
    .describe('Nome do nicho ou sub-nicho (ex: "Agentic Frameworks", "Local LLMs", "Multimodal RAG")'),
  persona: z.enum(['dev', 'product', 'investor', 'creator']).default('dev')
    .describe('Persona do consumidor'),
  format: z.enum(['json', 'markdown']).default('markdown')
    .describe('Formato de saída desejado (markdown ou json)'),
});

export const GetSourcesStatusSchema = z.object({});
