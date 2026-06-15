---
name: vercel-serverless-deployment
description: Configuração e implantação do servidor MCP no ecossistema Vercel como Serverless Function.
---

# Vercel Serverless Deployment Skill

Esta habilidade orienta a preparação, roteamento e publicação do servidor HTTP Express MCP na infraestrutura serverless da Vercel.

## Detecção de Stack e Roteamento
- **Plataforma**: Vercel Serverless Functions.
- **Roteamento**: `vercel.json` na raiz mapeando chamadas HTTP para o entrypoint.
- **Entrypoint**: Express wrapper compatível com Vercel (exportando `app` ou usando um handler `(req, res) => app(req, res)`).

## Diretrizes de Configuração

### 1. Roteamento no `vercel.json`
O arquivo de configuração da Vercel deve encaminhar todas as requisições de API para a função serverless do MCP:
```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/mcp/(.*)",
      "destination": "/api/mcp"
    },
    {
      "source": "/mcp",
      "destination": "/api/mcp"
    },
    {
      "source": "/ping",
      "destination": "/api/mcp"
    },
    {
      "source": "/.well-known/(.*)",
      "destination": "/api/mcp"
    }
  ]
}
```

### 2. Wrapper Serverless para Express
A Vercel espera que a função da API exporte um manipulador HTTP padrão. Crie um arquivo em `api/mcp.ts` na raiz do projeto (ou dentro do pacote compilado) que inicialize o Express do pacote MCP e trate as requisições:
```typescript
import app from "../packages/mcp/src/index"; // Exportado apropriadamente
export default app;
```
*(Nota: Para suportar isso, o servidor Express em `packages/mcp/src/index.ts` deve ser exportado ou adaptado para não executar `app.listen()` automaticamente quando importado como módulo).*

### 3. Variáveis de Ambiente Necessárias no Painel Vercel
- `CONTEXT7_API_KEY`: API Key oficial do Context7.
- `UPSTASH_REDIS_REST_URL`: Endpoint REST do Redis.
- `UPSTASH_REDIS_REST_TOKEN`: Token de autenticação REST do Redis.
- `OPENAI_APPS_CHALLENGE_TOKEN`: Desafio OpenAI (se aplicável).
- `AUTH_SERVER_URL`: Servidor de autenticação OAuth 2.0.
