---
name: jwt-authentication-jose
description: Autenticação baseada em tokens JWT utilizando a biblioteca jose de forma segura.
---

# JWT Authentication with Jose Skill

Esta habilidade fornece instruções detalhadas para validação de assinaturas e manipulação de tokens JSON Web Token (JWT) no endpoint autenticado do servidor MCP utilizando a biblioteca `jose`.

## Detecção de Stack e Autenticação
- **Biblioteca**: `jose` (leve, segura, compatível com Web APIs e Vercel Edge).
- **Abstração**: `packages/mcp/src/lib/jwt.ts` para validação de JWTs OAuth 2.0.

## Diretrizes de Implementação e Segurança

### 1. Validação de Assinatura JWT
Sempre verifique a validade do token utilizando o algoritmo de criptografia correto (ex: RS256, ES256) e a chave pública ou conjunto de chaves JWKS do provedor:
```typescript
import * as jose from "jose";

async function validateToken(token: string, jwksUri: string) {
  const JWKS = jose.createRemoteJWKSet(new URL(jwksUri));
  try {
    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: "https://auth.context7.com",
      audience: "https://api.context7.com",
    });
    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}
```

### 2. Padrões de Segurança
- **Header Authorization**: A extração do token deve suportar o formato padrão `Bearer <token>`.
- **CORS e Headers**: As respostas não autenticadas ou com tokens expirados/inválidos devem retornar status HTTP `401 Unauthorized` e expor o cabeçalho `WWW-Authenticate` conforme especificações do OAuth 2.0 (RFC 9728).
- **Sem Logs de Tokens**: Nunca escreva o token ou partes dele em logs do console ou de auditoria em produção.
