# Antigravity Agent Ecosystem

Este documento define a governança e a orquestração dos sub-agentes no ecossistema **Context7**.

## Regras de Execução e Orquestração

Todas as operações devem ser guiadas por personas especializadas configuradas sob a pasta `.agents/agents/` e utilizando as habilidades e fluxos de trabalho estruturados.

| Persona ID | Perfil Técnico | Especialização e Escopo |
| :--- | :--- | :--- |
| **mcp-architect** | `.agents/agents/mcp-architect.md` | Protocolo MCP, definição de schemas de ferramentas e conformidade. |
| **serverless-deployer** | `.agents/agents/serverless-deployer.md` | Empacotamento, builds e implantação no Vercel. |
| **security-auditor** | `.agents/agents/security-auditor.md` | Auditoria de segurança, JWT (jose), controle CORS e proteção de secrets. |

## Diretrizes Globais

1. **Priorização de Skills**: Antes de propor ou implementar qualquer lógica, verifique se há uma instrução relevante sob o diretório `.agents/skills/`.
2. **Uso de Workflows**: Para deploys, execução de testes ou adição de novas ferramentas, siga os roteiros definidos em `.agents/workflows/`.
3. **Persistência de Memória**: O estado cognitivo das sessões dos agentes e cache de chamadas deve ser mantido no Upstash Redis seguindo as regras da skill `upstash-redis-integration`.
4. **Segurança em Primeiro Lugar**: Nenhum código ou configuração de deploy deve ser efetuado sem passar pela revisão de segurança focada em OWASP Top 10 e validação de chaves.
