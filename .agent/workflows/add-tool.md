---
name: add-tool
description: Guia para adição e registro de novas ferramentas no servidor MCP.
allowed-tools: Write, Edit, Glob
---

# /add-tool

Este workflow orienta na criação de uma nova ferramenta exposta pelo servidor Context7 MCP.

## Passos do Workflow

### 1. Definição do Schema de Input
- Crie ou mapeie a estrutura de entrada no Zod em `packages/mcp/src/index.ts`.
- Certifique-se de que cada parâmetro possui `.describe()` documentando seu uso.

### 2. Registro da Ferramenta no Servidor
- Utilize `server.registerTool` no arquivo principal, passando o nome da ferramenta, metadados e o handler assíncrono.
- Trate aliases de argumentos (se houver variação comum de nomenclatura de LLM) registrando no `GLOBAL_ALIASES` ou `TOOL_ALIASES`.

### 3. Testagem e Validação
- Adicione testes unitários para o novo handler em `packages/mcp/test/` (ou crie um arquivo de teste de integração).
- Execute `/test` para validar a implementação.
