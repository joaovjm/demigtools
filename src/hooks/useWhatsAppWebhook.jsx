import { useState, useEffect, useCallback } from 'react';
import whatsappWebhookService from '../services/whatsappWebhookService';

// Hook customizado para gerenciar conexão e mensagens do WhatsApp Business API
const useWhatsAppWebhook = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [webhookStatus, setWebhookStatus] = useState('inactive');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Verificar configuração e conectar
  useEffect(() => {
    const initializeConnection = async () => {
      setIsLoading(true);
      
      // Validar configuração
      const config = await whatsappWebhookService.validateConfiguration();
      if (!config.valid) {
        setError(`Configuração inválida: ${config.errors.join(', ')}`);
        setConnectionStatus('disconnected');
        setIsLoading(false);
        return;
      }

      // Simular processo de conexão
      setConnectionStatus('connecting');
      
      try {
        // Verificar saúde da API do WhatsApp
        const healthCheck = await whatsappWebhookService.checkApiHealth();
        
        if (healthCheck.connected) {
          setConnectionStatus('connected');
          setError(null);
          
          // Verificar webhook separadamente
          try {
            const webhookResponse = await fetch('/api/test-webhook');
            const webhookData = await webhookResponse.json();
            
            if (webhookData.webhookActive) {
              setWebhookStatus('active');
            } else {
              setWebhookStatus('inactive');
              setError(`Webhook inativo: ${webhookData.error || 'Verifique a configuração no Facebook Developer Console'}`);
            }
          } catch (webhookErr) {
            setWebhookStatus('inactive');
            setError(`Erro ao verificar webhook: ${webhookErr.message}`);
          }
        } else {
          setConnectionStatus('disconnected');
          setWebhookStatus('inactive');
          setError(`Erro de conexão: ${healthCheck.error || 'API indisponível'}`);
        }
      } catch (err) {
        setConnectionStatus('disconnected');
        setWebhookStatus('inactive');
        setError(`Erro ao conectar: ${err.message}`);
      }
      
      setIsLoading(false);
    };

    initializeConnection();
  }, []);

  // Configurar listeners para mensagens recebidas
  useEffect(() => {
    const handleIncomingMessage = (message) => {
      // Atualizar ou criar conversa
      setConversations(prev => {
        const existingConversation = prev.find(conv => conv.phone === message.from);
        
        if (existingConversation) {
          // Atualizar conversa existente
          return prev.map(conv => 
            conv.phone === message.from
              ? {
                  ...conv,
                  lastMessage: message.content.text || 'Nova mensagem',
                  time: new Date(parseInt(message.timestamp) * 1000).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }),
                  unread: (conv.unread || 0) + 1
                }
              : conv
          );
        } else {
          // Criar nova conversa
          const newConversation = {
            id: Date.now(),
            name: message.contact.name,
            phone: message.from,
            lastMessage: message.content.text || 'Nova mensagem',
            time: new Date(parseInt(message.timestamp) * 1000).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            unread: 1,
            avatar: message.contact.name.split(' ').map(n => n[0]).join('').toUpperCase(),
            status: 'online'
          };
          
          return [newConversation, ...prev];
        }
      });

      // Adicionar mensagem ao histórico
      setMessages(prev => {
        const conversationId = prev.conversationId || message.from;
        const newMessage = {
          id: message.id,
          text: message.content.text || 'Mensagem não suportada',
          sent: true, // Mensagem recebida
          time: new Date(parseInt(message.timestamp) * 1000).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          status: 'received',
          type: message.content.type || 'text',
          content: message.content
        };

        return {
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), newMessage]
        };
      });
    };

    const handleStatusUpdate = (statusUpdate) => {
      // Atualizar status das mensagens
      setMessages(prev => {
        const updatedMessages = { ...prev };
        
        Object.keys(updatedMessages).forEach(conversationId => {
          updatedMessages[conversationId] = updatedMessages[conversationId].map(msg => 
            msg.id === statusUpdate.messageId
              ? { ...msg, status: statusUpdate.status }
              : msg
          );
        });
        
        return updatedMessages;
      });
    };

    // Adicionar listeners
    whatsappWebhookService.addMessageListener(handleIncomingMessage);
    whatsappWebhookService.addStatusListener(handleStatusUpdate);

    // Cleanup
    return () => {
      whatsappWebhookService.removeMessageListener(handleIncomingMessage);
      whatsappWebhookService.removeStatusListener(handleStatusUpdate);
    };
  }, []);

  // Enviar mensagem de texto
  const sendMessage = useCallback(async (to, text) => {
    if (!text.trim()) return { success: false, error: 'Mensagem vazia' };
    
    try {
      setIsLoading(true);
      const result = await whatsappWebhookService.sendTextMessage(to, text);
      
      if (result.success) {
        // Adicionar mensagem enviada ao histórico local
        const sentMessage = {
          id: result.messageId,
          text: text,
          sent: false, // Mensagem enviada por nós
          time: new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          status: 'sent',
          type: 'text'
        };

        setMessages(prev => ({
          ...prev,
          [to]: [...(prev[to] || []), sentMessage]
        }));

        // Atualizar conversa
        setConversations(prev => prev.map(conv => 
          conv.phone === to
            ? { ...conv, lastMessage: text, time: sentMessage.time, unread: 0 }
            : conv
        ));
      }
      
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      setError(`Erro ao enviar mensagem: ${error.message}`);
      return { success: false, error: error.message };
    }
  }, []);

  // Enviar template
  const sendTemplate = useCallback(async (to, templateName, params = []) => {
    try {
      setIsLoading(true);
      const result = await whatsappWebhookService.sendTemplateMessage(to, templateName, params);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      setError(`Erro ao enviar template: ${error.message}`);
      return { success: false, error: error.message };
    }
  }, []);

  // Upload e envio de mídia
  const sendMedia = useCallback(async (to, file, caption = '') => {
    try {
      setIsLoading(true);
      
      // Upload da mídia
      const uploadResult = await whatsappWebhookService.uploadMedia(file);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      // Determinar tipo de mídia
      const mediaType = file.type.startsWith('image/') ? 'image' :
                       file.type.startsWith('video/') ? 'video' :
                       file.type.startsWith('audio/') ? 'audio' : 'document';

      // Enviar mídia
      const sendResult = await whatsappWebhookService.sendMediaMessage(
        to, 
        mediaType, 
        uploadResult.mediaId, 
        caption
      );
      
      setIsLoading(false);
      return sendResult;
    } catch (error) {
      setIsLoading(false);
      setError(`Erro ao enviar mídia: ${error.message}`);
      return { success: false, error: error.message };
    }
  }, []);

  // Marcar mensagem como lida
  const markAsRead = useCallback(async (messageId) => {
    try {
      await whatsappWebhookService.markAsRead(messageId);
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  }, []);

  // Marcar conversa como lida
  const markConversationAsRead = useCallback((conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId || conv.phone === conversationId
        ? { ...conv, unread: 0 }
        : conv
    ));
  }, []);

  // Reconectar
  const reconnect = useCallback(async () => {
    setConnectionStatus('connecting');
    setError(null);
    
    try {
      const healthCheck = await whatsappWebhookService.checkApiHealth();
      
      if (healthCheck.connected) {
        setConnectionStatus('connected');
        setWebhookStatus('active');
      } else {
        setConnectionStatus('disconnected');
        setWebhookStatus('inactive');
        setError('Falha na reconexão');
      }
    } catch (err) {
      setConnectionStatus('disconnected');
      setWebhookStatus('inactive');
      setError(`Erro na reconexão: ${err.message}`);
    }
  }, []);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Obter informações de configuração do webhook
  const getWebhookConfig = useCallback(() => {
    return whatsappWebhookService.setupWebhook();
  }, []);

  return {
    // Estados
    connectionStatus,
    webhookStatus,
    conversations,
    messages,
    isLoading,
    error,
    
    // Ações
    sendMessage,
    sendTemplate,
    sendMedia,
    markAsRead,
    markConversationAsRead,
    reconnect,
    clearError,
    getWebhookConfig,
    
    // Utilitários
    setConversations,
    setMessages,
    setConnectionStatus,
    setWebhookStatus
  };
};

export default useWhatsAppWebhook;
