import { useState } from 'react';
import './index.css';
import { FiSearch, FiMoreVertical, FiPaperclip, FiSend, FiSmile } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdCall, IoMdVideocam } from 'react-icons/io';

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data para demonstração
  const contacts = [
    {
      id: 1,
      name: 'João Silva',
      lastMessage: 'Olá, como você está?',
      time: '14:30',
      unread: 2,
      avatar: 'JS',
      online: true
    },
    {
      id: 2,
      name: 'Maria Santos',
      lastMessage: 'Vamos marcar aquela reunião...',
      time: '13:45',
      unread: 0,
      avatar: 'MS',
      online: false
    },
    {
      id: 3,
      name: 'Pedro Costa',
      lastMessage: 'Obrigado pela ajuda!',
      time: '12:20',
      unread: 1,
      avatar: 'PC',
      online: true
    },
    {
      id: 4,
      name: 'Ana Oliveira',
      lastMessage: 'Até mais tarde',
      time: '11:15',
      unread: 0,
      avatar: 'AO',
      online: false
    },
    {
      id: 5,
      name: 'Carlos Lima',
      lastMessage: 'Perfeito, combinado!',
      time: '10:30',
      unread: 3,
      avatar: 'CL',
      online: true
    }
  ];

  const messages = selectedContact ? [
    {
      id: 1,
      text: 'Olá! Como você está?',
      time: '14:25',
      sent: false
    },
    {
      id: 2,
      text: 'Oi! Estou bem, obrigado. E você?',
      time: '14:26',
      sent: true
    },
    {
      id: 3,
      text: 'Também estou bem! Preciso falar com você sobre o projeto.',
      time: '14:27',
      sent: false
    },
    {
      id: 4,
      text: 'Claro! Pode falar.',
      time: '14:28',
      sent: true
    },
    {
      id: 5,
      text: 'Podemos marcar uma reunião para amanhã?',
      time: '14:29',
      sent: false
    },
    {
      id: 6,
      text: 'Perfeito! Que horas seria bom para você?',
      time: '14:30',
      sent: true
    }
  ] : [];

  const handleSendMessage = () => {
    if (message.trim() && selectedContact) {
      // Aqui seria a lógica para enviar a mensagem
      console.log('Enviando mensagem:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar com lista de conversas */}
      <div className={`chat-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Header da sidebar */}
        <div className="sidebar-header">
          <h2>Conversas</h2>
          <div className="sidebar-actions">
            <button className="icon-button">
              <BsThreeDotsVertical />
            </button>
          </div>
        </div>

        {/* Barra de pesquisa */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Pesquisar contatos..."
              className="search-input"
            />
          </div>
        </div>

        {/* Lista de contatos */}
        <div className="contacts-list">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedContact(contact);
                setIsMobileMenuOpen(false);
              }}
            >
              <div className="contact-avatar">
                <div className={`avatar ${contact.online ? 'online' : ''}`}>
                  {contact.avatar}
                </div>
              </div>
              <div className="contact-info">
                <div className="contact-header">
                  <h3 className="contact-name">{contact.name}</h3>
                  <span className="contact-time">{contact.time}</span>
                </div>
                <div className="contact-footer">
                  <p className="contact-message">{contact.lastMessage}</p>
                  {contact.unread > 0 && (
                    <span className="unread-badge">{contact.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área principal do chat */}
      <div className="chat-main">
        {selectedContact ? (
          <>
            {/* Header do chat */}
            <div className="chat-header">
              <button 
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                ☰
              </button>
              <div className="chat-contact-info">
                <div className={`chat-avatar ${selectedContact.online ? 'online' : ''}`}>
                  {selectedContact.avatar}
                </div>
                <div className="chat-contact-details">
                  <h3 className="chat-contact-name">{selectedContact.name}</h3>
                  <p className="chat-contact-status">
                    {selectedContact.online ? 'Online' : 'Visto por último às 13:45'}
                  </p>
                </div>
              </div>
              <div className="chat-actions">
                <button className="icon-button">
                  <IoMdCall />
                </button>
                <button className="icon-button">
                  <IoMdVideocam />
                </button>
                <button className="icon-button">
                  <FiMoreVertical />
                </button>
              </div>
            </div>

            {/* Área de mensagens */}
            <div className="chat-messages">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`message ${msg.sent ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <p className="message-text">{msg.text}</p>
                    <span className="message-time">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de mensagem */}
            <div className="chat-input-container">
              <button className="icon-button">
                <FiPaperclip />
              </button>
              <div className="message-input-wrapper">
                <input
                  type="text"
                  placeholder="Digite uma mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="message-input"
                />
                <button className="icon-button">
                  <FiSmile />
                </button>
              </div>
              <button 
                className="send-button"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <FiSend />
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-content">
              <h2>Bem-vindo ao Chat</h2>
              <p>Selecione uma conversa para começar a conversar</p>
            </div>
          </div>
        )}
      </div>

      {/* Overlay para mobile */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Chat;
