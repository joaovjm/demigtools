import supabase from "../src/helper/supaBaseClient.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const { conversationId } = req.body;
    
    if (!conversationId) {
      return res.status(400).json({ error: "conversation_id é obrigatório" });
    }

    console.log('📱 Marcando mensagens como lidas para conversa:', conversationId);

    // Usar status "received" para identificar mensagens de clientes
    // (mesmo critério usado para posicionamento das mensagens)
    console.log('🔧 Usando status "received" para identificar mensagens de clientes');

    // Primeira tentativa: usar campo is_read
    let { data: updatedMessages, error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .eq("status", "received") // Mensagens recebidas de clientes
      .select();

    if (error) {
      console.error("Erro ao usar campo is_read:", error);
      
      // Se erro por campo não existir, tenta criar coluna
      if (error.message && error.message.includes('column "is_read" does not exist')) {
        console.log('🔧 Campo is_read não existe - tentando criar...');
        
        // Tenta criar a coluna
        const { error: alterError } = await supabase.rpc('exec', {
          sql: 'ALTER TABLE messages ADD COLUMN is_read BOOLEAN DEFAULT false;'
        });
        
        if (alterError) {
          console.warn('⚠️ Não foi possível criar campo is_read:', alterError.message);
          
          // Fallback final: não fazer nada no banco, só retornar sucesso local
          return res.status(200).json({ 
            success: true, 
            method: "local_only",
            updatedCount: 0,
            warning: "Campo is_read não existe no banco - funcionando apenas localmente"
          });
        }

        // Tenta novamente após criar o campo
        const { data: retryMessages, error: retryError } = await supabase
          .from("messages")
          .update({ is_read: true })
          .eq("conversation_id", conversationId)
          .eq("status", "received")
          .select();
          
        if (retryError) {
          console.error("Erro após criar campo:", retryError);
          return res.status(500).json({ 
            error: "Erro após criar campo is_read", 
            details: retryError.message 
          });
        }
        
        updatedMessages = retryMessages;
      } else {
        return res.status(500).json({ 
          error: "Erro ao atualizar mensagens", 
          details: error.message 
        });
      }
    }

    console.log('✅ Mensagens marcadas como lidas:', updatedMessages?.length || 0);

    return res.status(200).json({ 
      success: true, 
      method: "is_read_field",
      updatedCount: updatedMessages?.length || 0,
      messages: updatedMessages 
    });

  } catch (err) {
    console.error("Erro crítico ao marcar mensagens como lidas:", err);
    return res.status(500).json({ 
      error: "Erro interno do servidor", 
      details: err.message 
    });
  }
}
