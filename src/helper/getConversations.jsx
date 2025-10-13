import supabase from "./superBaseClient";

export async function getConversations() {
  try {
    const { data, error } = await supabase.rpc(
      "get_conversations_with_preview"
    );
    
    if (error) {
      console.error("❌ Erro na RPC get_conversations_with_preview:", error);
      throw error;
    }
    
    if (data?.length > 0) {
    }
    
    return data || [];
  } catch (error) {
    console.error("❌ Erro ao buscar conversas:", error);
    return []; // Retorna array vazio em caso de erro
  }
}
