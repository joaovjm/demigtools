import { useEffect, useState, Fragment, useRef, useMemo } from "react";
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5";
import { MdAccessTime, MdCampaign } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";

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
  const messsageRef = useRef(null);
  const { conversations, messages } = useConversations();
  const [isMenuMediaOpen, setIsMenuMediaOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState();

  const menuMediaRef = useRef(null);
  const subMenuMediaRef = useRef(null);

  // Memoiza as mensagens filtradas para evitar re-renderizações desnecessárias
  const filteredMessages = useMemo(() => {
    if (!selectedConversation || !messages) return [];
    return messages.filter(
      (msg) => msg.conversation_id === selectedConversation.conversation_id
    );
  }, [selectedConversation, messages]);

  useEffect(() => {
    const el = messsageRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [selectedConversation]);

  // Scroll para baixo quando novas mensagens chegam
  useEffect(() => {
    const el = messsageRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [filteredMessages.length]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedConversation) {
      const payload = {
        conversationId: selectedConversation.conversation_id,
        from: selectedConversation.from_contact,
        to: selectedConversation.phone_number,
        message: message,
        type: "text",
      };

      try {
        const response = await fetch("/api/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        setMessage("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Verifica se clicou fora do submenu
      if (
        selectedMedia &&
        subMenuMediaRef.current &&
        !subMenuMediaRef.current.contains(e.target)
      ) {
        setSelectedMedia(null);
      }
      
      // Verifica se clicou fora do menu principal
      if (
        isMenuMediaOpen &&
        menuMediaRef.current &&
        !menuMediaRef.current.contains(e.target)
      ) {
        setIsMenuMediaOpen(false);
        setSelectedMedia(null); // Fecha o submenu também
      }
    };

    if (isMenuMediaOpen || selectedMedia) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuMediaOpen, selectedMedia]);

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
            <div className="chat-messages" ref={messsageRef}>
              {filteredMessages?.map((msg) => (
                <div
                  key={msg.message_id}
                  className={`message ${
                    msg.status !== "received" ? "delivered" : "received"
                  }`}
                >
                  <div className="message-content">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 16,
                      }}
                    >
                      <p className="message-text">{msg.body}</p>
                      <p>
                        {msg.status === "sent" ? (
                          <IoCheckmarkSharp />
                        ) : msg.status === "delivered" ||
                          msg.status === "read" ? (
                          <IoCheckmarkDoneSharp
                            style={{
                              color: msg.status === "read" ? "#faa01c" : "",
                            }}
                          />
                        ) : msg.status === "received" ? null : (
                          !msg.status && <MdAccessTime />
                        )}
                      </p>
                    </div>

                    <span className="message-time">
                      {new Date(msg.received_at).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de mensagem */}
            <div className="chat-input-container">
              {/* Menu de Media */}
              {isMenuMediaOpen && (
                <div className="menu-media" ref={menuMediaRef}>
                  <button
                    onClick={() => {
                      setSelectedMedia(selectedMedia === "campain" ? null : "campain");
                    }}
                    className={`menu-media-button ${
                      selectedMedia === "campain" ? "active" : ""
                    }`}
                  >
                    <MdCampaign /> Campanhas <FaAngleRight />
                  </button>
                </div>
              )}
              {selectedMedia === "campain" && (
                <div className="sub-menu-media" ref={subMenuMediaRef}>
                  <p>Campanhas</p>
                </div>
              )}

              <button
                onClick={() => {
                  setIsMenuMediaOpen(!isMenuMediaOpen);
                  if (isMenuMediaOpen) {
                    setSelectedMedia(null); // Fecha o submenu quando o menu principal é fechado
                  }
                }}
                className="icon-button"
              >
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
