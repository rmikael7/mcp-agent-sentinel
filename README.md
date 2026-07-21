# 🛡️ MCP Agent Sentinel (`mcp-agent-sentinel`)

> **Real-time Proactive Sentinel & Breaking-Change Intelligence Server for Autonomous AI Agents**  
> *Compatible with Cursor IDE, Hermes, Claude Desktop, LangChain, AutoGen, and Windsurf*

[![Smithery Verified](https://img.shields.io/badge/Smithery-Verified-blue.svg)](https://smithery.ai)
[![Glama Listed](https://img.shields.io/badge/Glama-Listed-emerald.svg)](https://glama.ai/mcp)
[![MCP Protocol Spec](https://img.shields.io/badge/MCP-2026.1_Spec-purple.svg)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Why MCP Agent Sentinel?

Most AI agents rely on **reactive search APIs** (like Tavily or Exa) where the agent has to *guess* what to search for. If an SDK introduces a breaking change or deprecates an API parameter, your agent won't know until your production code breaks.

**MCP Agent Sentinel** is a **proactive context server** that continuously monitors ArXiv, GitHub Repositories, SDK Release Notes (MCP, OpenAI, Anthropic, Google), and Web sources. It injects clean, pre-classified intelligence and breaking change alerts directly into your agent's context window before issues occur.

---

## 🛠️ MCP Tools Exposed

| Tool | Description | Key Parameters |
|---|---|---|
| 🚨 `get_latest_news` | Real-time technical news, releases & breaking change alerts | `category`, `persona`, `timeframe`, `limit` |
| 🔍 `search_ai_news` | Fast full-text semantic search on the curated live feed | `query`, `persona`, `limit` |
| 📊 `get_niche_digest` | Executive markdown briefing for sub-niches (e.g. AI Engineering) | `niche`, `persona`, `format` |
| 📡 `get_sources_status` | Live health, timestamp & processing metrics of all scrapers | N/A |

---

## 👥 Persona-Based Context Filters

Data is automatically indexed and served according to consumer personas:

- 🛠️ **`dev`**: Code diffs, breaking changes, SDK updates (`@modelcontextprotocol/server`), deprecations & bug fixes.
- 📊 **`product`**: Pricing matrices, token efficiency, LLM benchmarks & feature availability.
- 📈 **`investor`**: Frontier ArXiv research papers, agentic framework adoption & cloud distribution deals (Anthropic + AWS Bedrock).
- 📣 **`creator`**: Trending GitHub repos, viral AI tools & hooks for newsletters/youtube.

---

## 🚀 Quickstart & Local Installation

### 1. Build from Source

```bash
# Clone repository
git clone https://github.com/agent-principal/mcp-agent-sentinel.git
cd mcp-agent-sentinel

# Install & Build
npm install
npm run build
```

---

## ⚙️ Client Setup Configurations

### 1. Claude Desktop App Setup

Locate your Claude Desktop configuration file:
- 🪟 **Windows:** `%APPDATA%\Claude\claude_desktop_config.json` (`C:\Users\<YourUser>\AppData\Roaming\Claude\claude_desktop_config.json`)
- 🍎 **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

Add `mcp-agent-sentinel` to your `mcpServers` object:

```json
{
  "mcpServers": {
    "mcp-agent-sentinel": {
      "command": "node",
      "args": [
        "C:/Users/rmica/Agent Principal/projects/mcp-data-infrastructure/dist/index.js"
      ],
      "disabled": false
    }
  }
}
```

---

### 2. Cursor IDE Setup
Add under **Cursor Settings -> Features -> MCP Servers**:

- **Name:** `mcp-agent-sentinel`
- **Type:** `command`
- **Command:** `node "C:/Users/rmica/Agent Principal/projects/mcp-data-infrastructure/dist/index.js"`

---

### 3. Antigravity IDE & Hermes Setup
Add to your `~/.gemini/config/mcp_config.json` or `~/.hermes/config/mcp_config.json`:

```json
{
  "mcpServers": {
    "mcp-agent-sentinel": {
      "command": "node",
      "args": [
        "C:/Users/rmica/Agent Principal/projects/mcp-data-infrastructure/dist/index.js"
      ],
      "disabled": false
    }
  }
}
```

---

## 🧪 Interactive Live Demo

Test the live feed parser right from your terminal:

```bash
# Interactive Persona Visualizer
npm run demo

# Verify Cursor/IDE Setup
npm run verify-cursor
```

---

## 📄 License & Maintainers

- **Maintainers:** Agent Principal Core Team
- **License:** MIT License
