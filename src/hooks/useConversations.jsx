import { useEffect, useState } from "react";
import { getConversations } from "../helper/getConversations.jsx";
import { getMessages } from "../helper/getMessages.jsx";
import supabase from "../helper/superBaseClient";

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getConversations();
      setConversations(data);
    })();
    (async () => {
      const data = await getMessages();
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
              return [updated, ...newList];
            } else {
              getConversations().then((data) => setConversations(data));
              return prev;
            }
          });
          setMessages((prev) => {
            return[...prev, msg];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new;
          setConversations((prev) =>
            prev.map((c) =>
              c.conversation_id === msg.conversation_id
                ? {
                    ...c,
                    last_message_status: msg.status,
                  }
                : c
            )
          );
          setMessages((prev) => {
            return[...prev, msg];
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
          setConversations((prev) =>
            prev.map((c) =>
              c.conversation_id === conv.conversation_id
                ? { ...c, title: conv.title, avatar_url: conv.avatar_url }
                : c
            )
          );
        }
      )
      .subscribe();

    return () => {
      msgChannel.unsubscribe();
      convChannel.unsubscribe();
    };
  }, []);

  return {conversations, messages};
}
