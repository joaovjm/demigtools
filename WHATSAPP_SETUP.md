# Configuração do WhatsApp Business API

Este documento explica como configurar a integração com o WhatsApp Business API para o sistema de chat.

## Pré-requisitos

1. **Conta do Facebook Developer**
   - Acesse [Facebook for Developers](https://developers.facebook.com/)
   - Crie uma conta de desenvolvedor se não tiver uma

2. **WhatsApp Business Account**
   - Configure uma conta do WhatsApp Business
   - Verifique seu número de telefone comercial

3. **Aplicativo do Facebook**
   - Crie um novo aplicativo no Facebook Developer Console
   - Adicione o produto "WhatsApp Business API"

## Configuração Passo a Passo

### 1. Configurar o Aplicativo no Facebook

1. Acesse o [Facebook Developer Console](https://developers.facebook.com/apps/)
2. Clique em "Create App" (Criar Aplicativo)
3. Selecione "Business" como tipo de aplicativo
4. Preencha as informações do aplicativo
5. Adicione o produto "WhatsApp Business API"

### 2. Obter Credenciais

1. **Phone Number ID**
   - Vá para WhatsApp > API Setup
   - Copie o "Phone number ID"

2. **Access Token**
   - Gere um token de acesso permanente
   - Copie o token gerado

3. **Webhook Verify Token**
   - Crie um token seguro para verificação do webhook
   - Use um gerador de senhas ou crie manualmente

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# WhatsApp Business API Configuration (Vite usa prefixo VITE_)
VITE_WHATSAPP_API_URL=https://graph.facebook.com/v18.0
VITE_WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id_aqui
VITE_WHATSAPP_ACCESS_TOKEN=seu_access_token_aqui
VITE_WEBHOOK_VERIFY_TOKEN=seu_webhook_verify_token_aqui
VITE_BACKEND_URL=http://localhost:3001
VITE_ENVIRONMENT=development
```

### 4. Configurar o Webhook

#### 4.1 Criar Endpoint no Backend

Crie um endpoint no seu backend para receber webhooks:

```javascript
// api/webhook/whatsapp.js
const express = require('express');
const router = express.Router();

const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

// Verificação do webhook (GET)
router.get('/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
      console.log('Webhook verificado com sucesso!');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Receber mensagens (POST)
router.post('/whatsapp', (req, res) => {
  const body = req.body;

  if (body.object) {
    if (body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]) {
      
      // Processar mensagem recebida
      const message = body.entry[0].changes[0].value.messages[0];
      console.log('Mensagem recebida:', message);
      
      // Aqui você pode processar a mensagem e notificar o frontend
      // via WebSocket, Server-Sent Events, ou polling
    }
    
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
```

#### 4.2 Configurar URL do Webhook no Facebook

1. Vá para WhatsApp > Configuration no Facebook Developer Console
2. Na seção "Webhook", clique em "Edit"
3. Insira a URL do seu webhook: `https://seudominio.com/api/webhook/whatsapp`
4. Insira o Verify Token que você criou
5. Selecione os campos: `messages`, `message_deliveries`, `message_reads`
6. Clique em "Verify and Save"

### 5. Implementar Backend para Webhook

#### 5.1 Estrutura Recomendada

```
backend/
├── api/
│   └── webhook/
│       └── whatsapp.js
├── services/
│   └── whatsappService.js
├── models/
│   └── message.js
└── server.js
```

#### 5.2 Serviço do WhatsApp

```javascript
// services/whatsappService.js
const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.baseURL = 'https://graph.facebook.com/v18.0';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  }

  async sendMessage(to, message) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error.response?.data || error.message);
      throw error;
    }
  }

  async uploadMedia(filePath, type) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('type', type);
    formData.append('messaging_product', 'whatsapp');

    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/media`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro no upload:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new WhatsAppService();
```

### 6. Testar a Configuração

1. **Verificar Webhook**
   - No Facebook Developer Console, teste a verificação do webhook
   - Deve retornar sucesso

2. **Testar Envio de Mensagem**
   - Use a interface do chat para enviar uma mensagem
   - Verifique se a mensagem é entregue no WhatsApp

3. **Testar Recebimento de Mensagem**
   - Envie uma mensagem do WhatsApp para o número configurado
   - Verifique se a mensagem aparece na interface do chat

### 7. Configurações de Produção

#### 7.1 Domínio e HTTPS

- Configure um domínio com certificado SSL válido
- O Facebook exige HTTPS para webhooks

#### 7.2 Rate Limiting

- Implemente rate limiting para evitar spam
- Configure limites apropriados para sua aplicação

#### 7.3 Logs e Monitoramento

- Configure logs detalhados para debugging
- Implemente monitoramento de saúde da API
- Configure alertas para falhas

### 8. Solução de Problemas

#### Problemas Comuns

1. **Webhook não verifica**
   - Verifique se a URL está acessível
   - Confirme se o verify token está correto
   - Verifique os logs do servidor

2. **Mensagens não são entregues**
   - Verifique se o access token é válido
   - Confirme se o phone number ID está correto
   - Verifique os limites de rate da API

3. **Mensagens não são recebidas**
   - Verifique se o webhook está configurado corretamente
   - Confirme se os campos corretos estão selecionados
   - Verifique os logs do webhook

#### Logs Úteis

```javascript
// Adicione logs detalhados para debugging
console.log('Webhook body:', JSON.stringify(req.body, null, 2));
console.log('Headers:', req.headers);
console.log('Query params:', req.query);
```

### 9. Recursos Adicionais

- [Documentação Oficial da API](https://developers.facebook.com/docs/whatsapp/business-management-api)
- [Guia de Webhook](https://developers.facebook.com/docs/whatsapp/webhooks)
- [Referência da API](https://developers.facebook.com/docs/whatsapp/cloud-api/reference)
- [Postman Collection](https://www.postman.com/meta/workspace/whatsapp-business-platform)

### 10. Segurança

- Nunca exponha tokens de acesso no frontend
- Use variáveis de ambiente para credenciais
- Implemente validação de webhook signature
- Configure CORS adequadamente
- Use HTTPS em produção

---

Para mais informações ou problemas específicos, consulte a documentação oficial do WhatsApp Business API ou entre em contato com o suporte técnico.
