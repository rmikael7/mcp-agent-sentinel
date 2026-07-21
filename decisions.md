# 🏛️ Registros de Decisão de Arquitetura (ADR) — MCP Data Infrastructure

---

## ADR-001: Adocão de TypeScript com `@modelcontextprotocol/sdk` e Zod

* **Status:** ✅ Aprovado  
* **Data:** 2026-07-21  
* **Autores:** Antigravity / Gemini & Operador  

### Contexto
Precisamos construir a Fase 1 da infraestrutura MCP de dados em tempo real para agentes de IA. O servidor precisa ser leve, fácil de instalar via `npx` e compatível com todos os clientes MCP (Cursor, Hermes, Claude Desktop, Glama.ai e Smithery.ai).

### Opções Consideradas
1. **Python com FastMCP:** Excelente ecossistema para IA/Scraping, mas exige ambiente Python instalado na máquina do usuário final para rodar via CLI.
2. **TypeScript com SDK Oficial (`@modelcontextprotocol/sdk`):** Instalação instantânea via Node.js (`npx`), alta performance, tipagem estrita com Zod e suporte nativo a Stdio e Streamable HTTP.
3. **Go / Rust:** Compilação nativa ultra-rápida, mas com ecossistema de SDKs MCP ainda imaturo em 2026.

### Decisão
Escolhemos **TypeScript com a SDK Oficial e Zod**.

### Consequências
* **Prós:**
  * Instalação via `npx -y` em qualquer máquina com Node.js sem configuração prévia.
  * Validação em tempo de execução dos argumentos das ferramentas (`tools`) usando Zod.
  * Compatibilidade imediata com registradores Smithery.ai e Glama.ai.
* **Contras:**
  * Necessidade de etapa de compilação (`tsc` ou uso de `tsx` em dev).
