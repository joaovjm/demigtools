import { useEffect, useState, Fragment, useRef } from "react";
import "./index.css";
import {
  FiSearch,
  FiMoreVertical,
  FiPaperclip,
  FiSend,
  FiSmile,
} from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdCall, IoMdVideocam } from "react-icons/io";
import { useConversations } from "../../hooks/useConversations";
import Avatar from "../../components/forms/Avatar";

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const buttonRef = useRef(null);
  const { conversations, messages } = useConversations();

  /*const contactList = async () => {
    const { messages, conversations } = await fetchConversations();
    setMessageList(messages);
    setConversationList(conversations);
    scrollToBottom();
  };*/

  useEffect(() => {
    buttonRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation, messages]);

  const handleSendMessage = () => {
    if (message.trim() && selectedConversation) {
      // Aqui seria a lógica para enviar a mensagem
      console.log("Enviando mensagem:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar com lista de conversas */}
      <div className={`chat-sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
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
          {conversations?.map((contact) => (
            <div
              key={contact.conversation_id}
              className={`contact-item ${
                selectedConversation === contact.conversation_id ? "active" : ""
              }`}
              onClick={() => {
                setSelectedConversation(contact);
                setIsMobileMenuOpen(false);
              }}
            >
              <div className="contact-avatar">
                <div className={`avatar ${contact.online ? "online" : ""}`}>
                  <Avatar name={contact.title} />
                </div>
              </div>
              <div className="contact-info">
                <div className="contact-header">
                  <h3 className="contact-name">{contact.title}</h3>
                  <span className="contact-time">
                    {new Date(contact.last_message_time).toLocaleTimeString(
                      "pt-BR",
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </span>
                </div>
                <div className="contact-footer">
                  <p className="contact-message">{contact.last_message}</p>
                  
                    <span className="unread-badge">5</span>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área principal do chat */}
      <div className="chat-main">
        {selectedConversation ? (
          <Fragment key={selectedConversation.conversation_id}>
            {/* Header do chat */}
            <div className="chat-header">
              <button
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                ☰
              </button>
              <div className="chat-contact-info">
                <div
                  className={`chat-avatar ${
                    selectedConversation.online ? "online" : ""
                  }`}
                >
                  {selectedConversation.avatar}
                </div>
                <div className="chat-contact-details">
                  <h3 className="chat-contact-name">
                    {selectedConversation.title}
                  </h3>
                  <p className="chat-contact-status">
                    {selectedConversation.online
                      ? "Online"
                      : "Visto por último às 13:45"}
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
              {messages?.map(
                (msg) =>
                  msg.conversation_id ===
                    selectedConversation.conversation_id && (
                    <div
                      key={msg.message_id}
                      className={`message ${
                        msg.status === "sent" ? "sent" : "received"
                      }`}
                    >
                      <div className="message-content">
                        <p className="message-text">{msg.body}</p>
                        <span className="message-time">
                          {new Date(msg.received_at).toLocaleTimeString(
                            "pt-BR",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </span>
                      </div>
                    </div>
                  )
              )}
              <div ref={buttonRef} />
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
          </Fragment>
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
