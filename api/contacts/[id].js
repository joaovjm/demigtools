import supabase from "../../../src/helper/supaBaseClient.js";

export const config = {
  api: {
    bodyParser: true,
  },
};

// API para gerenciar contatos individuais
// GET: busca contato por ID
// PUT: atualiza contato (principalmente código doador)
// DELETE: remove contato (opcional)
export default async function handler(req, res) {
  // Adicionar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: "ID do contato é obrigatório"
    });
  }

  try {
    if (req.method === "GET") {
      // Buscar contato específico por ID
      const { data: contact, error } = await supabase
        .from("contacts")
        .select(`
          contact_id,
          phone_number,
          created_at,
          operator_code_id,
          operator!operator_code_id (
            operator_name,
            operator_code_id
          )
        `)
        .eq("contact_id", id)
        .single();

      if (error) {
        console.error("❌ Erro ao buscar contato:", error);
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            success: false,
            error: "Contato não encontrado"
          });
        }
        return res.status(500).json({
          success: false,
          error: "Erro ao buscar contato",
          details: error.message,
        });
      }

      // Processar os dados
      const processedContact = {
        id: contact.contact_id,
        phone_number: contact.phone_number,
        operator_name: contact.operator?.operator_name || "Sem operador",
        operator_code_id: contact.operator_code_id,
        created_at: contact.created_at
      };

      return res.status(200).json({
        success: true,
        contact: processedContact
      });
    }

    if (req.method === "PUT") {
      // Atualizar contato (principalmente código doador)
      const { operator_code_id } = req.body;
      console.log(operator_code_id);

      // Verificar se o contato existe
      /*const { data: existingContact, error: checkError } = await supabase
        .from("contacts")
        .select("contact_id")
        .eq("contact_id", id)
        .single();

      if (checkError || !existingContact) {
        return res.status(404).json({
          success: false,
          error: "Contato não encontrado"
        });
      }*/

      // Preparar dados para atualização
      const updateData = {};
      if (operator_code_id !== undefined) updateData.operator_code_id = operator_code_id;

      // Se não há dados para atualizar
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          error: "Nenhum dado fornecido para atualização"
        });
      }
      
      const { data: updatedContact, error } = await supabase
        .from("contacts")
        .update(updateData)
        .eq("contact_id", id)
        .select(`
          contact_id,
          phone_number,
          created_at,
          operator_code_id,
          operator!operator_code_id (
            operator_name,
            operator_code_id
          )
        `)
        .single();

      if (error) {
        console.error("❌ Erro ao atualizar contato:", error);
        return res.status(500).json({
          success: false,
          error: "Erro ao atualizar contato",
          details: error.message,
        });
      }

      // Processar os dados atualizados
      const processedContact = {
        id: updatedContact.contact_id,
        phone_number: updatedContact.phone_number,
        operator_name: updatedContact.operator?.operator_name || "Sem operador",
        operator_code_id: updatedContact.operator_code_id,
        created_at: updatedContact.created_at
      };

      return res.status(200).json({
        success: true,
        contact: processedContact,
        message: "Contato atualizado com sucesso"
      });
    }

    if (req.method === "DELETE") {
      // Deletar contato (opcional)
      const { data: existingContact, error: checkError } = await supabase
        .from("contacts")
        .select("contact_id", )
        .eq("contact_id", id)
        .single();

      if (checkError || !existingContact) {
        return res.status(404).json({
          success: false,
          error: "Contato não encontrado"
        });
      }

      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("contact_id", id);

      if (error) {
        console.error("❌ Erro ao deletar contato:", error);
        return res.status(500).json({
          success: false,
          error: "Erro ao deletar contato",
          details: error.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Contato "${existingContact.name}" deletado com sucesso`
      });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`,
      allowedMethods: ["GET", "PUT", "DELETE"]
    });

  } catch (error) {
    console.error("❌ Erro no endpoint de contato individual:", error);
    console.error("❌ Stack trace:", error.stack);
    
    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
