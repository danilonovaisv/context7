---
name: deploy
description: Prepara e publica o servidor MCP no ecossistema Vercel.
allowed-tools: RunCommand, Write, Edit, Glob
---

# /deploy

Este workflow orienta o agente na execução de builds e na implantação segura do servidor MCP na Vercel.

## Passos do Workflow

### 1. Verificações Pré-Deploy
- Verifique se os arquivos de configuração `vercel.json` e `package.json` estão consistentes.
- Verifique as dependências locais executando checagem de tipos no monorepo:
  ```bash
  pnpm typecheck
  ```

### 2. Validação de Variáveis de Ambiente
- Certifique-se de que as credenciais do Upstash Redis e as chaves da API do Context7 estão declaradas localmente no `.env` para testes locais e prontas para configuração no console da Vercel.

### 3. Execução do Deploy
Proponha o comando de deploy oficial do Vercel CLI para subir as alterações em ambiente de staging ou produção:
```bash
npx vercel --prod
```
Após o deploy, valide se o endpoint `/ping` responde corretamente.
