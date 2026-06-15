---
name: upstash-redis-integration
description: Integração e gerenciamento de estado de sessões MCP usando o Upstash Redis.
---

# Upstash Redis Integration Skill

Esta habilidade orienta o uso do banco de dados Upstash Redis para gerenciar persistência de sessões e cache no servidor HTTP do Context7.

## Detecção de Stack e Conexão
- **SDK**: `@upstash/redis` para conexões REST de baixíssima latência (ideais para serverless).
- **Abstração**: `packages/mcp/src/lib/sessionStore.ts` gerenciando o ciclo de vida.

## Diretrizes de Lógica e Armazenamento

### 1. Inicialização do Cliente
O cliente do Redis deve utilizar variáveis de ambiente para a conexão REST segura:
```typescript
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
```

### 2. Gestão de Sessões (`Session Store`)
Para garantir statelessness nas funções da Vercel, o estado de conexão e handshake MCP (`mcp-session-id`) deve ser mantido no Redis:
- **Criação de Sessão**: Salve o ID da sessão com um TTL (Time-To-Live) apropriado (ex: 24 horas) para evitar vazamento de memória.
- **Refresh**: A cada requisição HTTP recebida contendo `mcp-session-id`, execute um comando `EXPIRE` para estender a expiração da sessão.
- **Exclusão**: Ao receber um método `DELETE`, remova a chave do Redis imediatamente.
