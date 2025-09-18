# Teste das Variáveis de Ambiente

Este arquivo explica como testar se as variáveis de ambiente estão funcionando corretamente.

## 1. Teste da API de Configuração

Para testar se as variáveis estão sendo carregadas corretamente no backend, acesse:

```
https://seu-dominio.vercel.app/api/whatsapp-config
```

**Resposta esperada se configurado:**
```json
{
  "success": true,
  "config": {
    "apiUrl": "https://graph.facebook.com/v18.0",
    "phoneNumberId": "seu_phone_number_id",
    "hasAccessToken": true,
    "hasWebhookToken": true,
    "isConfigured": true
  }
}
```

**Resposta se não configurado:**
```json
{
  "success": true,
  "config": {
    "apiUrl": "https://graph.facebook.com/v18.0",
    "phoneNumberId": null,
    "hasAccessToken": false,
    "hasWebhookToken": false,
    "isConfigured": false
  }
}
```

## 2. Teste no Frontend

Adicione este código temporariamente em um componente para testar:

```javascript
import whatsappWebhookService from '../services/whatsappWebhookService';

// Teste de configuração
const testConfig = async () => {
  const config = await whatsappWebhookService.validateConfiguration();
  console.log('Configuração:', config);
  
  if (!config.valid) {
    console.error('Erros:', config.errors);
  } else {
    console.log('WhatsApp configurado corretamente!');
  }
};

// Chamar a função
testConfig();
```

## 3. Verificar no Console do Navegador

1. Abra o DevTools (F12)
2. Vá para a aba Console
3. Execute o teste acima
4. Verifique se não há erros de configuração

## 4. Variáveis Necessárias no Vercel

Certifique-se de que estas variáveis estão configuradas no Vercel:

```
WHATSAPP_API_URL = https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID = seu_phone_number_id
WHATSAPP_ACCESS_TOKEN = seu_access_token
WEBHOOK_VERIFY_TOKEN = seu_webhook_verify_token
EMAIL_USER = seu_email@gmail.com
EMAIL_PASS = sua_senha_de_app
```

## 5. Troubleshooting

### Problema: "WhatsApp não configurado - verifique as variáveis de ambiente no backend"

**Solução:**
1. Verifique se as variáveis estão configuradas no Vercel
2. Faça um novo deploy após adicionar as variáveis
3. Teste a API `/api/whatsapp-config`

### Problema: "WHATSAPP_PHONE_NUMBER_ID não configurado no backend"

**Solução:**
1. Verifique se a variável `WHATSAPP_PHONE_NUMBER_ID` está configurada no Vercel
2. Verifique se não há espaços extras no valor
3. Faça um novo deploy

### Problema: API retorna erro 500

**Solução:**
1. Verifique os logs do Vercel
2. Verifique se todas as variáveis obrigatórias estão configuradas
3. Teste localmente primeiro

## 6. Logs Úteis

Para debug, adicione estes logs temporariamente:

```javascript
// No arquivo api/whatsapp-config.js
console.log('Variáveis de ambiente:', {
  WHATSAPP_API_URL: process.env.WHATSAPP_API_URL,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID ? 'Definido' : 'Não definido',
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN ? 'Definido' : 'Não definido',
  WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN ? 'Definido' : 'Não definido'
});
```

## 7. Próximos Passos

1. Configure as variáveis no Vercel
2. Faça um novo deploy
3. Teste a API `/api/whatsapp-config`
4. Teste o frontend
5. Remova os logs de debug após confirmar que está funcionando
