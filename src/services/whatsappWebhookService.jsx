// WhatsApp Business API Webhook Service
// Este serviço gerencia a comunicação com a API do WhatsApp Business

// Variáveis de ambiente do Vite (prefixo VITE_)
const WHATSAPP_API_BASE_URL = import.meta.env.VITE_WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
const WHATSAPP_PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
const WEBHOOK_VERIFY_TOKEN = import.meta.env.VITE_WEBHOOK_VERIFY_TOKEN;

console.log(WHATSAPP_ACCESS_TOKEN);
console.log(WEBHOOK_VERIFY_TOKEN)

class WhatsAppWebhookService {
  constructor() {
    this.webhookEndpoint = '/api/webhook/whatsapp';
    this.messageListeners = [];
    this.statusListeners = [];
  }

  // Configurar webhook (deve ser chamado no backend)
  setupWebhook() {
    return {
      endpoint: this.webhookEndpoint,
      verifyToken: WEBHOOK_VERIFY_TOKEN,
      instructions: {
        url: `${window.location.origin}${this.webhookEndpoint}`,
        verify_token: WEBHOOK_VERIFY_TOKEN,
        fields: ['messages', 'message_deliveries', 'message_reads', 'messaging_handovers']
      }
    };
  }

  // Processar webhook recebido (implementar no backend)
  processWebhookData(webhookData) {
    try {
      const { entry } = webhookData;
      
      if (!entry || !entry.length) {
        console.log('Webhook sem dados de entrada');
        return;
      }

      entry.forEach(entryItem => {
        const { changes } = entryItem;
        
        if (!changes || !changes.length) return;

        changes.forEach(change => {
          const { value, field } = change;
          
          if (field === 'messages') {
            this.handleMessagesUpdate(value);
          }
        });
      });
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
    }
  }

  // Processar mensagens recebidas
  handleMessagesUpdate(value) {
    const { messages, contacts, metadata } = value;

    if (messages && messages.length > 0) {
      messages.forEach(message => {
        this.processIncomingMessage(message, contacts, metadata);
      });
    }

    // Processar status de mensagens (entregue, lida, etc.)
    if (value.statuses && value.statuses.length > 0) {
      value.statuses.forEach(status => {
        this.processMessageStatus(status);
      });
    }
  }

  // Processar mensagem recebida
  processIncomingMessage(message, contacts, metadata) {
    const contact = contacts?.find(c => c.wa_id === message.from);
    
    const processedMessage = {
      id: message.id,
      from: message.from,
      timestamp: message.timestamp,
      type: message.type,
      contact: {
        name: contact?.profile?.name || 'Usuário',
        phone: message.from
      },
      content: this.extractMessageContent(message)
    };

    // Notificar listeners sobre nova mensagem
    this.notifyMessageListeners(processedMessage);
  }

  // Extrair conteúdo da mensagem baseado no tipo
  extractMessageContent(message) {
    switch (message.type) {
      case 'text':
        return {
          text: message.text?.body || ''
        };
      case 'image':
        return {
          type: 'image',
          image: message.image,
          caption: message.image?.caption || ''
        };
      case 'document':
        return {
          type: 'document',
          document: message.document,
          filename: message.document?.filename || 'Documento'
        };
      case 'audio':
        return {
          type: 'audio',
          audio: message.audio
        };
      case 'video':
        return {
          type: 'video',
          video: message.video,
          caption: message.video?.caption || ''
        };
      case 'location':
        return {
          type: 'location',
          location: message.location
        };
      case 'contacts':
        return {
          type: 'contacts',
          contacts: message.contacts
        };
      default:
        return {
          text: 'Mensagem não suportada'
        };
    }
  }

  // Processar status de mensagem
  processMessageStatus(status) {
    const statusUpdate = {
      messageId: status.id,
      recipientId: status.recipient_id,
      status: status.status, // sent, delivered, read, failed
      timestamp: status.timestamp,
      errors: status.errors || null
    };

    this.notifyStatusListeners(statusUpdate);
  }

  // Enviar mensagem de texto
  async sendTextMessage(to, text) {
    try {
      const response = await fetch(
        `${WHATSAPP_API_BASE_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'text',
            text: {
              body: text
            }
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${data.error?.message || 'Erro desconhecido'}`);
      }

      return {
        success: true,
        messageId: data.messages?.[0]?.id,
        data: data
      };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar mensagem com template
  async sendTemplateMessage(to, templateName, templateParams = []) {
    try {
      const response = await fetch(
        `${WHATSAPP_API_BASE_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'template',
            template: {
              name: templateName,
              language: {
                code: 'pt_BR'
              },
              components: templateParams.length > 0 ? [
                {
                  type: 'body',
                  parameters: templateParams.map(param => ({
                    type: 'text',
                    text: param
                  }))
                }
              ] : []
            }
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${data.error?.message || 'Erro desconhecido'}`);
      }

      return {
        success: true,
        messageId: data.messages?.[0]?.id,
        data: data
      };
    } catch (error) {
      console.error('Erro ao enviar template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar mídia (imagem, documento, etc.)
  async sendMediaMessage(to, mediaType, mediaId, caption = '') {
    try {
      const mediaObject = {
        id: mediaId
      };

      if (caption && (mediaType === 'image' || mediaType === 'video')) {
        mediaObject.caption = caption;
      }

      const response = await fetch(
        `${WHATSAPP_API_BASE_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: mediaType,
            [mediaType]: mediaObject
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${data.error?.message || 'Erro desconhecido'}`);
      }

      return {
        success: true,
        messageId: data.messages?.[0]?.id,
        data: data
      };
    } catch (error) {
      console.error('Erro ao enviar mídia:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload de mídia
  async uploadMedia(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type);
      formData.append('messaging_product', 'whatsapp');

      const response = await fetch(
        `${WHATSAPP_API_BASE_URL}/${WHATSAPP_PHONE_NUMBER_ID}/media`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
          },
          body: formData
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Erro no upload: ${data.error?.message || 'Erro desconhecido'}`);
      }

      return {
        success: true,
        mediaId: data.id,
        data: data
      };
    } catch (error) {
      console.error('Erro no upload de mídia:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Marcar mensagem como lida
  async markAsRead(messageId) {
    try {
      const response = await fetch(
        `${WHATSAPP_API_BASE_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            status: 'read',
            message_id: messageId
          })
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
      return false;
    }
  }

  // Verificar saúde da API
  async checkApiHealth() {
    try {
      const response = await fetch(
        `${WHATSAPP_API_BASE_URL}/${WHATSAPP_PHONE_NUMBER_ID}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
          }
        }
      );

      return {
        connected: response.ok,
        status: response.status,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Listeners para mensagens
  addMessageListener(callback) {
    this.messageListeners.push(callback);
  }

  removeMessageListener(callback) {
    this.messageListeners = this.messageListeners.filter(listener => listener !== callback);
  }

  notifyMessageListeners(message) {
    this.messageListeners.forEach(listener => {
      try {
        listener(message);
      } catch (error) {
        console.error('Erro no listener de mensagem:', error);
      }
    });
  }

  // Listeners para status
  addStatusListener(callback) {
    this.statusListeners.push(callback);
  }

  removeStatusListener(callback) {
    this.statusListeners = this.statusListeners.filter(listener => listener !== callback);
  }

  notifyStatusListeners(status) {
    this.statusListeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        console.error('Erro no listener de status:', error);
      }
    });
  }

  // Validar configuração
  validateConfiguration() {
    const errors = [];

    if (!WHATSAPP_PHONE_NUMBER_ID) {
      errors.push('REACT_APP_WHATSAPP_PHONE_NUMBER_ID não configurado');
    }

    if (!WHATSAPP_ACCESS_TOKEN) {
      errors.push('REACT_APP_WHATSAPP_ACCESS_TOKEN não configurado');
    }

    if (!WEBHOOK_VERIFY_TOKEN) {
      errors.push('REACT_APP_WEBHOOK_VERIFY_TOKEN não configurado');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
}

// Instância singleton
const whatsappWebhookService = new WhatsAppWebhookService();

export default whatsappWebhookService;
