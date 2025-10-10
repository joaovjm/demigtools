import { useEffect, useState, useRef } from "react";
import { getConversations } from "../helper/getConversations.jsx";
import { getMessages } from "../helper/getMessages.jsx";
import { markMessagesAsRead } from "../helper/unreadMessages.jsx";
import supabase from "../helper/superBaseClient";

// Singleton para evitar múltiplas instâncias do hook
let globalConversations = [];
let globalMessages = [];
let isGlobalInitialized = false;
let globalSubscriptions = null;

export function useConversations() {
  const [conversations, setConversations] = useState(globalConversations);
  const [messages, setMessages] = useState(globalMessages);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Evita múltiplas inicializações
    if (isInitialized.current || isGlobalInitialized) return;
    isInitialized.current = true;
    isGlobalInitialized = true;

    (async () => {
      const data = await getConversations();
      globalConversations = data;
      setConversations(data);
    })();
    (async () => {
      const data = await getMessages();
      globalMessages = data;
      setMessages(data);
    })();

    const msgChannel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new;
          setConversations((prev) => {
            const idx = prev.findIndex(
              (c) => c.conversation_id === msg.conversation_id
            );
            if (idx >= 0) {
              const updated = {
                ...prev[idx],
                last_message: msg.body,
                last_message_time: msg.received_at,
                last_message_status: msg.status,
              };
              const newList = [...prev];
              newList.splice(idx, 1);
              globalConversations = [updated, ...newList];
              return globalConversations;
            } else {
              getConversations().then((data) => {
                globalConversations = data;
                setConversations(data);
              });
              return prev;
            }
          });
          setMessages((prev) => {
            // Verifica se a mensagem já existe para evitar duplicação
            const messageExists = prev.some(existingMsg => 
              existingMsg.message_id === msg.message_id || 
              (existingMsg.body === msg.body && 
               existingMsg.conversation_id === msg.conversation_id && 
               Math.abs(new Date(existingMsg.received_at) - new Date(msg.received_at)) < 1000)
            );
            if (messageExists) {
              return prev;
            }
            globalMessages = [...prev, msg];
            return globalMessages;
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new;
          setConversations((prev) => {
            const updated = prev.map((c) =>
              c.conversation_id === msg.conversation_id
                ? {
                    ...c,
                    last_message_status: msg.status,
                  }
                : c
            );
            globalConversations = updated;
            return updated;
          });
          setMessages((prev) => {
            const messageExists = prev.some(existingMsg => existingMsg.message_id === msg.message_id);
            if (messageExists) {
              // Atualiza a mensagem existente apenas se houver mudanças significativas
              const updated = prev.map((existingMsg) => {
                if (existingMsg.message_id === msg.message_id) {
                  // Só atualiza se o status mudou ou se há outras mudanças significativas
                  if (existingMsg.status !== msg.status || 
                      existingMsg.body !== msg.body ||
                      existingMsg.received_at !== msg.received_at) {
                    return msg;
                  }
                }
                return existingMsg;
              });
              globalMessages = updated;
              return updated;
            } else {
              // Se a mensagem não existe, adiciona (caso raro, mas pode acontecer)
              globalMessages = [...prev, msg];
              return globalMessages;
            }
          });
        }
      )
      .subscribe();

    const convChannel = supabase
      .channel("conversations")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "conversations" },
        (payload) => {
          const conv = payload.new;
          setConversations((prev) => {
            const updated = prev.map((c) =>
              c.conversation_id === conv.conversation_id
                ? { ...c, title: conv.title, avatar_url: conv.avatar_url }
                : c
            );
            globalConversations = updated;
            return updated;
          });
        }
      )
      .subscribe();

    globalSubscriptions = { msgChannel, convChannel };

    return () => {
      if (globalSubscriptions) {
        globalSubscriptions.msgChannel.unsubscribe();
        globalSubscriptions.convChannel.unsubscribe();
        globalSubscriptions = null;
      }
      isInitialized.current = false;
      isGlobalInitialized = false;
    };
  }, []);

  // Função para marcar mensagens como lidas
  const markAsRead = async (conversationId) => {
    // Atualiza o estado local imediatamente para melhor UX
    setMessages((prev) => {
      const updatedMessages = markMessagesAsRead(prev, conversationId);
      globalMessages = updatedMessages;
      return updatedMessages;
    });

    // Persiste no banco de dados
    try {
      const response = await fetch("/api/mark-messages-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationId }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("❌ Erro ao marcar mensagens como lidas no servidor:", result);
        console.error("📋 Detalhes:", result.details);
        if (result.suggestion) {
          console.warn("💡 Sugestão:", result.suggestion);
        }
        // Em caso de erro, poderíamos reverter o estado local aqui
      } else {
        console.log("✅ Mensagens marcadas como lidas:", result.updatedCount, "mensagens");
        if (result.method) {
          console.log("🔧 Método usado:", result.method);
        }
        if (result.warning) {
          console.warn("⚠️ Aviso:", result.warning);
        }
      }
    } catch (error) {
      console.error("❌ Erro de rede ao marcar mensagens como lidas:", error);
      // Em caso de erro, poderíamos reverter o estado local aqui
    }
  };

  return {conversations, messages, markAsRead};
}
