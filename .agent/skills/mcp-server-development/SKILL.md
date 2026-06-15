---
name: mcp-server-development
description: Instruções de desenvolvimento e extensão de servidores Model Context Protocol (MCP) utilizando a SDK oficial.
---

# MCP Server Development Skill

Esta habilidade orienta a criação, depuração, modificação e extensão do servidor MCP do Context7.

## Detecção de Stack e Tecnologias
- **Framework**: `@modelcontextprotocol/sdk` (Server e Transports).
- **Validação**: `zod` para esquemas de entrada.
- **Roteamento HTTP**: `express` com suporte a `StreamableHTTPServerTransport` para comunicação SSE de longa duração.

## Diretrizes de Codificação

### 1. Registro de Novas Ferramentas
Ao registrar ferramentas no `McpServer`, sempre utilize schemas Zod explícitos com descrições detalhadas (`.describe()`) para orientar corretamente o modelo cliente:
```typescript
server.registerTool(
  "nome-da-ferramenta",
  {
    title: "Título Legível",
    description: "Descrição clara da finalidade.",
    inputSchema: {
      parametro: z.string().describe("Descrição do parâmetro"),
    },
  },
  async ({ parametro }) => {
    // Implementação do Handler
    return {
      content: [
        {
          type: "text",
          text: "Resultado",
        },
      ],
    };
  }
);
```

### 2. Tratamento de Aliases e Hallucinated Keys
Clientes de LLM frequentemente geram chaves incorretas nos argumentos com base na descrição das ferramentas. Sempre verifique se o utilitário `installTransportArgAliasing` está aplicando as substituições necessárias antes de delegar a requisição ao Zod.

### 3. Gerenciamento do Ciclo de Vida da Sessão
No transporte HTTP, certifique-se de que a sessão é excluída/invalidada caso o cliente envie um método `DELETE` para liberar conexões e chaves no Redis.
