# Configuração do Twilio Voice para Chamadas VoIP

## Variáveis de Ambiente Necessárias

Para que o serviço de chamadas VoIP funcione, você precisará configurar as seguintes variáveis de ambiente do Twilio.

### Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
# Credenciais da conta Twilio
TWILIO_ACCOUNT_SID=seu_account_sid_aqui
TWILIO_API_KEY=seu_api_key_aqui
TWILIO_API_SECRET=seu_api_secret_aqui

# SID da aplicação TwiML
TWILIO_TWIML_APP_SID=seu_twiml_app_sid_aqui
```

## Como obter essas informações:

1. **TWILIO_ACCOUNT_SID**: 
   - Acesse o [Console do Twilio](https://console.twilio.com/)
   - No painel principal, você encontrará o "Account SID"
   - Copie este valor

2. **TWILIO_API_KEY** e **TWILIO_API_SECRET**:
   - No Console do Twilio, vá para **Account** > **API Keys & Tokens**
   - Clique em **Create API Key**
   - Dê um nome para a chave e salve
   - Copie o **SID** (será o TWILIO_API_KEY) e o **Secret** (será o TWILIO_API_SECRET)
   - ⚠️ **Importante**: O Secret só é mostrado uma vez! Salve-o imediatamente

3. **TWILIO_TWIML_APP_SID**:
   - No Console do Twilio, vá para **Voice** > **TwiML** > **TwiML Apps**
   - Crie uma nova TwiML App ou use uma existente
   - Copie o **SID** da aplicação

## Como iniciar o servidor

### Opção 1: Iniciar ambos os servidores juntos (Recomendado)
```bash
npm run dev:all
```

Este comando inicia:
- Servidor da API na porta 3000 (`vercel dev --listen 3000`)
- Servidor do frontend na porta 5173 (`vite`)

### Opção 2: Iniciar separadamente

**Terminal 1 - Servidor da API:**
```bash
npm run dev:api
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## ⚠️ Importante:

- **Nunca** commite o arquivo `.env` com os valores reais
- Estas credenciais são sensíveis e devem ser tratadas com segurança
- Certifique-se de que o arquivo `.env` esteja no `.gitignore`
- O servidor da API **deve estar rodando** na porta 3000 para que o frontend funcione corretamente

## Resolução de Problemas:

### Erro: `ECONNREFUSED` ao tentar acessar `/api/token`
- **Causa**: O servidor da API não está rodando
- **Solução**: Execute `npm run dev:api` ou `npm run dev:all` em um terminal

### Erro: Variáveis de ambiente não encontradas
- **Causa**: O arquivo `.env` não existe ou as variáveis não estão configuradas
- **Solução**: Crie o arquivo `.env` na raiz do projeto com todas as variáveis necessárias

### Erro: Token inválido ao inicializar o dispositivo
- **Causa**: As credenciais do Twilio estão incorretas ou expiradas
- **Solução**: Verifique se todas as variáveis de ambiente estão corretas no arquivo `.env`

