import supabase from "../helper/superBaseClient";

export async function fetchConversations() {
  try {
    const { data: messages, error: errorMessages } = await supabase
      .from("messages")
      .select("*");
    if (errorMessages) console.log(errorMessages.message);
    if (!errorMessages) {
      const { data: conversations, error: errorConversations } = await supabase
        .from("conversations")
        .select("conversation_id, title");
      if (errorConversations) console.log(errorConversations.message);
      if (!errorConversations) {
        return { messages, conversations };
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}
