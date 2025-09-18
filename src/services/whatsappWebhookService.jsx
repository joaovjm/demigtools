// WhatsApp Business API Webhook Service
// Este serviço gerencia a comunicação com a API do WhatsApp Business

// Não expor variáveis sensíveis no frontend
// Estas variáveis serão obtidas via API do backend
const WHATSAPP_API_BASE_URL = 'https://graph.facebook.com/v18.0';
let WHATSAPP_PHONE_NUMBER_ID = null;
let WHATSAPP_ACCESS_TOKEN = null;
let WEBHOOK_VERIFY_TOKEN = null;

class WhatsAppWebhookService {
  constructor() {
    this.webhookEndpoint = '/api/webhook/whatsapp';
    this.messageListeners = [];
    this.statusListeners = [];
    this.isConfigured = false;
    this.config = null;
  }

  // Inicializar configuração via API
  async initializeConfig() {
    try {
      const response = await fetch('/api/whatsapp-config');
      const data = await response.json();
      console.log(data)
      if (data.success) {
        this.config = data.config;
        this.isConfigured = data.config.isConfigured;
        
        if (this.isConfigured) {
          WHATSAPP_PHONE_NUMBER_ID = data.config.phoneNumberId;
        }
      }
      
      return this.isConfigured;
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      return false;
    }
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

  // Enviar mensagem de texto via API do backend
  async sendTextMessage(to, text) {
    try {
      // Verificar se a configuração foi inicializada
      if (!this.isConfigured) {
        await this.initializeConfig();
      }

      if (!this.isConfigured) {
        throw new Error('WhatsApp não configurado');
      }

      const response = await fetch('/api/send-whatsapp-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: to,
          message: text,
          type: 'text'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar mensagem');
      }

      return {
        success: true,
        messageId: data.messageId,
        data: data.data
      };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar mensagem com template via API do backend
  async sendTemplateMessage(to, templateName, templateParams = []) {
    try {
      // Verificar se a configuração foi inicializada
      if (!this.isConfigured) {
        await this.initializeConfig();
      }

      if (!this.isConfigured) {
        throw new Error('WhatsApp não configurado');
      }

      const response = await fetch('/api/send-whatsapp-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: to,
          message: templateName,
          type: 'template',
          templateParams: templateParams
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar template');
      }

      return {
        success: true,
        messageId: data.messageId,
        data: data.data
      };
    } catch (error) {
      console.error('Erro ao enviar template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar mídia (imagem, documento, etc.) via API do backend
  async sendMediaMessage(to, mediaType, mediaId, caption = '') {
    try {
      // Verificar se a configuração foi inicializada
      if (!this.isConfigured) {
        await this.initializeConfig();
      }

      if (!this.isConfigured) {
        throw new Error('WhatsApp não configurado');
      }

      const response = await fetch('/api/send-whatsapp-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: to,
          message: mediaId,
          type: mediaType,
          caption: caption
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar mídia');
      }

      return {
        success: true,
        messageId: data.messageId,
        data: data.data
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

  // Marcar mensagem como lida via API do backend
  async markAsRead(messageId) {
    try {
      // Verificar se a configuração foi inicializada
      if (!this.isConfigured) {
        await this.initializeConfig();
      }

      if (!this.isConfigured) {
        return false;
      }

      const response = await fetch('/api/send-whatsapp-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId: messageId,
          type: 'mark_read'
        })
      });

      const data = await response.json();
      return data.success || false;
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
      return false;
    }
  }

  // Verificar saúde da API via backend com teste real
  async checkApiHealth() {
    try {
      // Verificar se a configuração foi inicializada
      if (!this.isConfigured) {
        await this.initializeConfig();
      }

      if (!this.isConfigured) {
        return {
          connected: false,
          error: 'WhatsApp não configurado - verifique as variáveis de ambiente',
          timestamp: new Date().toISOString()
        };
      }

      // Fazer teste real da conexão com a API do WhatsApp
      const response = await fetch('/api/test-whatsapp-connection');
      const data = await response.json();
      
      console.log('Teste de conexão WhatsApp:', data);

      return {
        connected: data.connected,
        status: response.status,
        timestamp: new Date().toISOString(),
        details: data.details,
        error: data.error,
        message: data.message
      };
    } catch (error) {
      console.error('Erro ao verificar saúde da API:', error);
      return {
        connected: false,
        error: `Erro de conexão: ${error.message}`,
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
  async validateConfiguration() {
    // Inicializar configuração se necessário
    if (!this.isConfigured) {
      await this.initializeConfig();
    }

    const errors = [];
    
    if (!this.isConfigured) {
      errors.push('WhatsApp não configurado - verifique as variáveis de ambiente no backend');
    }

    if (!this.config?.phoneNumberId) {
      errors.push('WHATSAPP_PHONE_NUMBER_ID não configurado no backend');
    }

    if (!this.config?.hasAccessToken) {
      errors.push('WHATSAPP_ACCESS_TOKEN não configurado no backend');
    }

    if (!this.config?.hasWebhookToken) {
      errors.push('WEBHOOK_VERIFY_TOKEN não configurado no backend');
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      isConfigured: this.isConfigured
    };
  }
}

// Instância singleton
const whatsappWebhookService = new WhatsAppWebhookService();

export default whatsappWebhookService;
