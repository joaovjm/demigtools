import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { 
  FaWhatsapp, 
  FaSearch, 
  FaPhone, 
  FaVideo, 
  FaEllipsisV,
  FaPaperclip,
  FaSmile,
  FaPaperPlane,
  FaCheck,
  FaCheckDouble,
  FaSync,
  FaCog
} from 'react-icons/fa';
import useWhatsAppWebhook from '../../hooks/useWhatsAppWebhook';

const Chat = () => {
  // Hook do WhatsApp Webhook
  const {
    connectionStatus,
    webhookStatus,
    conversations: hookConversations,
    messages: hookMessages,
    isLoading,
    error,
    sendMessage: hookSendMessage,
    sendMedia,
    markConversationAsRead,
    reconnect,
    clearError,
    getWebhookConfig,
    setConversations: setHookConversations,
    setMessages: setHookMessages
  } = useWhatsAppWebhook();

  // Estados locais
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  
  // Usar dados do hook se disponíveis, senão usar dados simulados
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'João Silva',
      phone: '+5511999999999',
      lastMessage: 'Olá, gostaria de mais informações',
      time: '14:30',
      unread: 2,
      avatar: 'JS',
      status: 'online'
    },
    {
      id: 2,
      name: 'Maria Santos',
      phone: '+5511888888888',
      lastMessage: 'Obrigada pelo atendimento!',
      time: '13:45',
      unread: 0,
      avatar: 'MS',
      status: 'offline'
    },
    {
      id: 3,
      name: 'Pedro Costa',
      phone: '+5511777777777',
      lastMessage: 'Quando vocês abrem?',
      time: '12:20',
      unread: 1,
      avatar: 'PC',
      status: 'online'
    }
  ]);

  const [messages, setMessages] = useState({});
  
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Simulação de mensagens iniciais
  useEffect(() => {
    const initialMessages = {
      1: [
        {
          id: 1,
          text: 'Olá! Como posso ajudá-lo hoje?',
          sent: false,
          time: '14:25',
          status: 'read'
        },
        {
          id: 2,
          text: 'Olá, gostaria de mais informações sobre os serviços',
          sent: true,
          time: '14:28',
          status: 'read'
        },
        {
          id: 3,
          text: 'Gostaria de saber sobre doações',
          sent: true,
          time: '14:30',
          status: 'delivered'
        },
        {
          id: 4,
          text: 'Quero contribuir com R$ 400,00',
          sent: true,
          time: '14:31',
          status: 'delivered'
        }
      ],
      2: [
        {
          id: 1,
          text: 'Obrigada pelo excelente atendimento!',
          sent: true,
          time: '13:45',
          status: 'read'
        },
        {
          id: 2,
          text: 'Ficamos felizes em ajudar! 😊',
          sent: false,
          time: '13:46',
          status: 'read'
        }
      ],
      3: [
        {
          id: 1,
          text: 'Quando vocês abrem?',
          sent: true,
          time: '12:20',
          status: 'sent'
        }
      ]
    };
    setMessages(initialMessages);
  }, []);

  // Simular conexão do webhook
  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionStatus('connecting');
      setTimeout(() => {
        setConnectionStatus('connected');
        setWebhookStatus('active');
      }, 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Auto scroll para última mensagem
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    const currentConversation = conversations.find(c => c.id === activeConversation);
    if (!currentConversation) return;

    // Se a API estiver conectada, usar o hook
    if (connectionStatus === 'connected') {
      try {
        const result = await hookSendMessage(currentConversation.phone, newMessage);
        
        if (result.success) {
          setNewMessage('');
          clearError();
        } else {
          console.error('Erro ao enviar mensagem:', result.error);
        }
      } catch (err) {
        console.error('Erro no envio:', err);
      }
    } else {
      // Modo simulado (fallback)
      const messageId = Date.now();
      const newMsg = {
        id: messageId,
        text: newMessage,
        sent: false,
        time: new Date().toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        status: 'sent'
      };

      setMessages(prev => ({
        ...prev,
        [activeConversation]: [...(prev[activeConversation] || []), newMsg]
      }));

      // Atualizar última mensagem na conversa
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversation 
          ? { ...conv, lastMessage: newMessage, time: newMsg.time }
          : conv
      ));

      setNewMessage('');

      // Simular entrega da mensagem
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          [activeConversation]: prev[activeConversation].map(msg => 
            msg.id === messageId ? { ...msg, status: 'delivered' } : msg
          )
        }));
      }, 1000);

      // Simular leitura da mensagem
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          [activeConversation]: prev[activeConversation].map(msg => 
            msg.id === messageId ? { ...msg, status: 'read' } : msg
          )
        }));
      }, 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.phone.includes(searchTerm)
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <FaCheck className="status-icon status-sent" />;
      case 'delivered':
        return <FaCheckDouble className="status-icon status-delivered" />;
      case 'read':
        return <FaCheckDouble className="status-icon status-read" />;
      default:
        return null;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'WhatsApp Business API Conectado';
      case 'connecting':
        return 'Conectando ao WhatsApp Business API...';
      case 'disconnected':
        return 'WhatsApp Business API Desconectado';
      default:
        return 'Status desconhecido';
    }
  };

  // Manipular upload de arquivo
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !activeConversation) return;

    const currentConversation = conversations.find(c => c.id === activeConversation);
    if (!currentConversation) return;

    if (connectionStatus === 'connected') {
      try {
        const result = await sendMedia(currentConversation.phone, file, '');
        
        if (result.success) {
          clearError();
        } else {
          console.error('Erro ao enviar arquivo:', result.error);
        }
      } catch (err) {
        console.error('Erro no upload:', err);
      }
    } else {
      // Modo simulado para upload
      console.log('Modo simulado: arquivo não pode ser enviado sem conexão API');
    }

    // Limpar input
    event.target.value = '';
  };

  // Manipular clique na conversa
  const handleConversationClick = (conversationId) => {
    setActiveConversation(conversationId);
    markConversationAsRead(conversationId);
  };

  // Usar dados do hook se disponíveis
  useEffect(() => {
    if (hookConversations.length > 0) {
      setConversations(hookConversations);
    }
  }, [hookConversations]);

  useEffect(() => {
    if (Object.keys(hookMessages).length > 0) {
      setMessages(hookMessages);
    }
  }, [hookMessages]);

  return (
    <div className="chat-container">
      {/* Sidebar - Lista de conversas */}
      <div className="chat-sidebar">

        {/* Status do Webhook */}
        <div className="webhook-status">
          <div className="webhook-indicator">
            <div className={`status-dot ${webhookStatus}`}></div>
            <span>Webhook {webhookStatus === 'active' ? 'Ativo' : 'Inativo'}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {connectionStatus === 'disconnected' && (
              <button 
                onClick={reconnect}
                className="chat-action-btn"
                title="Reconectar"
                disabled={isLoading}
              >
                <FaSync className={isLoading ? 'rotating' : ''} />
              </button>
            )}
            <button 
              onClick={() => setShowConfig(!showConfig)}
              className="chat-action-btn"
              title="Configurações"
            >
              <FaCog />
            </button>
          </div>
        </div>

        {/* Configurações do Webhook */}
        {showConfig && (
          <div className="webhook-config">
            <h4>Configuração do Webhook</h4>
            <div className="config-item">
              <label>URL do Webhook:</label>
              <code>{getWebhookConfig().instructions.url}</code>
            </div>
            <div className="config-item">
              <label>Verify Token:</label>
              <code>{getWebhookConfig().instructions.verify_token}</code>
            </div>
            <div className="config-item">
              <label>Status da API:</label>
              <span className={`status-text ${connectionStatus}`}>
                {getConnectionStatusText()}
              </span>
            </div>
            {error && (
              <div className="error-message">
                <span>{error}</span>
                <button onClick={clearError} className="clear-error-btn">×</button>
              </div>
            )}
          </div>
        )}

        {/* Status de Conexão */}
        <div className={`connection-status ${connectionStatus}`}>
          {getConnectionStatusText()}
        </div>

        {/* Busca */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar conversas..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Lista de conversas */}
        <div className="conversations-list">
          {filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              className={`conversation-item ${activeConversation === conversation.id ? 'active' : ''}`}
              onClick={() => handleConversationClick(conversation.id)}
            >
              <div className="conversation-avatar">
                {conversation.avatar}
              </div>
              <div className="conversation-info">
                <div className="conversation-name">
                  {conversation.name}
                </div>
                <div className="conversation-last-message">
                  {conversation.lastMessage}
                </div>
              </div>
              <div className="conversation-meta">
                <div className="conversation-time">
                  {conversation.time}
                </div>
                {conversation.unread > 0 && (
                  <div className="unread-count">
                    {conversation.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área principal do chat */}
      <div className="chat-main">
        {activeConversation ? (
          <>
            {/* Header do chat atual */}
            <div className="chat-main-header">
              <div className="current-chat-avatar">
                {conversations.find(c => c.id === activeConversation)?.avatar}
              </div>
              <div className="current-chat-info">
                <h3>{conversations.find(c => c.id === activeConversation)?.name}</h3>
                <div className="current-chat-status">
                  {conversations.find(c => c.id === activeConversation)?.phone} • 
                  {conversations.find(c => c.id === activeConversation)?.status === 'online' ? ' online' : ' visto por último hoje'}
                </div>
              </div>
              <div className="chat-actions">
                <button className="chat-action-btn">
                  <FaPhone />
                </button>
                <button className="chat-action-btn">
                  <FaVideo />
                </button>
                <button className="chat-action-btn">
                  <FaEllipsisV />
                </button>
              </div>
            </div>

            {/* Área de mensagens */}
            <div className="messages-area">
              {messages[activeConversation]?.map(message => (
                <div key={message.id} className={`message ${message.sent ? 'received' : 'sent'}`}>
                  <div className="message-bubble">
                    <p className="message-text">{message.text}</p>
                    <div className="message-time">
                      {message.time}
                      {!message.sent && (
                        <span className="message-status">
                          {getStatusIcon(message.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Indicador de digitação */}
              {isTyping && (
                <div className="message received">
                  <div className="typing-indicator">
                    <span>Digitando</span>
                    <div className="typing-dots">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Área de input */}
            <div className="message-input-area">
              <input
                type="file"
                id="file-upload"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              />
              <button 
                className="attachment-btn"
                onClick={() => document.getElementById('file-upload').click()}
                disabled={connectionStatus !== 'connected'}
                title={connectionStatus !== 'connected' ? 'Conecte-se à API para enviar arquivos' : 'Enviar arquivo'}
              >
                <FaPaperclip />
              </button>
              
              <div className="message-input-container">
                <textarea
                  ref={messageInputRef}
                  className="message-input"
                  placeholder="Digite uma mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={1}
                />
                <button className="emoji-btn">
                  <FaSmile />
                </button>
              </div>
              
              <button 
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <FaPaperPlane />
              </button>
            </div>
          </>
        ) : (
          /* Estado vazio */
          <div className="empty-chat">
            <FaWhatsapp className="empty-chat-icon" />
            <h3>WhatsApp Business Chat</h3>
            <p>
              Selecione uma conversa para começar a enviar mensagens via WhatsApp Business API
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;