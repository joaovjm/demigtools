import supabase from "./superBaseClient";

export async function getConversations() {
  try {
    const { data, error } = await supabase.rpc(
      "get_conversations_with_preview"
    );
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    throw error;
  }
}
