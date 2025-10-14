import supabase from "../src/helper/supaBaseClient.js";

export const config = {
  api: {
    bodyParser: true,
  },
};

// API para gerenciar contatos
// GET: lista todos os contatos com informações do operador
export default async function handler(req, res) {
  // Adicionar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      // Listar todos os contatos com informações do operador
      const { data: contacts, error } = await supabase
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
        .order("created_at", { ascending: true });

      if (error) {
        console.error("❌ Erro ao buscar contatos:", error);
        return res.status(500).json({
          success: false,
          error: "Erro ao buscar contatos",
          details: error.message,
        });
      }

      // Processar os dados para incluir o nome do operador
      const processedContacts = contacts?.map(contact => ({
        id: contact.contact_id,
        phone_number: contact.phone_number,
        operator_name: contact.operator?.operator_name || "Sem operador",
        operator_code_id: contact.operator_code_id,
        created_at: contact.created_at
      })) || [];

      return res.status(200).json({
        success: true,
        contacts: processedContacts,
        total: processedContacts.length
      });
    }

    if (req.method === "POST") {
      // Criar novo contato (opcional, caso seja necessário)
      const { name, phone_number, operator_code_id, donor_code } = req.body;

      if (!name || !phone_number) {
        return res.status(400).json({
          success: false,
          error: "Nome e telefone são obrigatórios"
        });
      }

      const { data: newContact, error } = await supabase
        .from("contacts")
        .insert([{
          name: name.trim(),
          phone_number: phone_number.replace(/\D/g, ''), // Remove caracteres não numéricos
          operator_code_id: operator_code_id || null,
          donor_code: donor_code || null,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error("❌ Erro ao criar contato:", error);
        return res.status(500).json({
          success: false,
          error: "Erro ao criar contato",
          details: error.message,
        });
      }

      return res.status(201).json({
        success: true,
        contact: newContact,
        message: "Contato criado com sucesso"
      });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`,
      allowedMethods: ["GET", "POST"]
    });

  } catch (error) {
    console.error("❌ Erro no endpoint de contatos:", error);
    console.error("❌ Stack trace:", error.stack);
    
    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
