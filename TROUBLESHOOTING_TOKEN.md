# Troubleshooting - Token Expirado

Este guia ajuda a resolver problemas de token expirado que persistem mesmo após atualização.

## 🔍 **Possíveis Causas**

### 1. **Cache do Navegador**
- O navegador pode estar usando uma versão em cache da API
- **Solução**: Limpe o cache ou use modo incógnito

### 2. **Arquivo .env.local não está sendo carregado**
- O arquivo pode não estar na localização correta
- **Solução**: Verifique se está na raiz do projeto

### 3. **Servidor não foi reiniciado**
- As variáveis só são carregadas quando o servidor inicia
- **Solução**: Pare e reinicie o servidor

### 4. **Token ainda é temporário**
- O token pode ter expirado novamente
- **Solução**: Gere um token permanente

## 🛠️ **Passos para Debug**

### Passo 1: Verificar Arquivo .env.local

```bash
# Verificar se o arquivo existe
ls -la .env.local

# Verificar conteúdo (sem expor o token completo)
head -5 .env.local
```

### Passo 2: Verificar Logs do Servidor

1. **Inicie o servidor**:
   ```bash
   npm run dev
   ```

2. **Acesse a API de teste**:
   ```
   http://localhost:3000/api/test-whatsapp-connection
   ```

3. **Verifique os logs no terminal**:
   - Deve mostrar as variáveis carregadas
   - Deve mostrar o token sendo usado

### Passo 3: Testar Token Manualmente

1. **Copie o token** do arquivo `.env.local`
2. **Teste diretamente** no Facebook Graph API Explorer:
   ```
   https://developers.facebook.com/tools/explorer/
   ```
3. **Use a query**:
   ```
   GET /{phone-number-id}
   ```

### Passo 4: Verificar Timestamp

O erro sempre mostra o mesmo horário? Isso indica:
- **Cache**: O token antigo está sendo usado
- **Arquivo errado**: Está lendo de outro local
- **Servidor não reiniciado**: Variáveis antigas em memória

## 🔧 **Soluções**

### Solução 1: Limpar Cache e Reiniciar

```bash
# Parar servidor (Ctrl+C)
# Limpar cache do npm
npm cache clean --force

# Remover node_modules e reinstalar
rm -rf node_modules
npm install

# Reiniciar servidor
npm run dev
```

### Solução 2: Verificar Localização do Arquivo

```
demigtools/
├── .env.local          ← Deve estar aqui (raiz)
├── package.json
├── src/
└── api/
```

### Solução 3: Forçar Recarregamento

Adicione este código temporariamente no início de cada API:

```javascript
// Forçar recarregamento das variáveis
delete require.cache[require.resolve('dotenv')];
require('dotenv').config({ path: '.env.local' });
```

### Solução 4: Usar Token Permanente

1. **No Facebook Developer Console**:
   - Vá para WhatsApp → API Setup
   - Clique em "Generate Token"
   - Selecione "Permanent Token" (se disponível)

2. **Se não houver opção permanente**:
   - Use token temporário
   - Configure renovação automática
   - Ou renove manualmente

## 📋 **Checklist de Verificação**

- [ ] Arquivo `.env.local` existe na raiz do projeto
- [ ] Arquivo `.env.local` contém o token correto
- [ ] Servidor foi reiniciado após atualizar o token
- [ ] Cache do navegador foi limpo
- [ ] Token foi testado no Facebook Graph API Explorer
- [ ] Logs mostram o token correto sendo usado

## 🚨 **Se Nada Funcionar**

1. **Crie um novo arquivo** `.env.local` do zero
2. **Copie as variáveis** uma por uma
3. **Reinicie o servidor**
4. **Teste imediatamente** (antes que expire)

## 📞 **Próximos Passos**

1. ✅ Execute os passos de debug
2. ✅ Verifique os logs do servidor
3. ✅ Teste o token manualmente
4. ✅ Aplique as soluções necessárias

Se o problema persistir, pode ser um problema específico com o token ou configuração do Facebook Developer Console.
