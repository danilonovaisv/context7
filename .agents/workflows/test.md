---
name: test
description: Executa testes unitários, formatação, linter e checagem de tipos em todos os pacotes.
allowed-tools: RunCommand, Glob
---

# /test

Este workflow realiza a verificação completa de qualidade e integridade do código do repositório Context7.

## Passos do Workflow

### 1. Verificação de Tipos (TypeScript)
Execute a checagem de tipos estrita em todos os pacotes do monorepo:
```bash
pnpm typecheck
```

### 2. Linting e Formatação
Rode os scripts de linter e formatação de código para garantir conformidade de estilos:
```bash
pnpm lint && pnpm format:check
```

### 3. Testes Unitários
Dispare os testes unitários utilizando o Vitest em todos os workspaces configurados:
```bash
pnpm test
```
Verifique se todos os testes foram concluídos com sucesso antes de efetuar commits ou deploys.
