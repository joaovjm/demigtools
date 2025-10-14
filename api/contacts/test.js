import supabase from "../../../src/helper/supaBaseClient.js";

export const config = {
  api: {
    bodyParser: true,
  },
};

// Endpoint de teste para verificar a funcionalidade da API de contatos
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
      // Teste 1: Verificar se consegue conectar com Supabase
      const { data: testConnection, error: connectionError } = await supabase
        .from("contacts")
        .select("count")
        .limit(1);

      if (connectionError) {
        return res.status(500).json({
          success: false,
          error: "Erro de conexão com Supabase",
          details: connectionError.message,
        });
      }

      // Teste 2: Verificar estrutura da tabela contacts
      const { data: contacts, error: contactsError } = await supabase
        .from("contacts")
        .select(`
          contact_id,
          name,
          phone_number,
          donor_code,
          created_at,
          operator_code_id
        `)
        .limit(5);

      if (contactsError) {
        return res.status(500).json({
          success: false,
          error: "Erro ao acessar tabela contacts",
          details: contactsError.message,
        });
      }

      // Teste 3: Verificar se existe relacionamento com operadores
      const { data: contactsWithOperators, error: operatorsError } = await supabase
        .from("contacts")
        .select(`
          contact_id,
          name,
          phone_number,
          donor_code,
          operator_code_id,
          operator!operator_code_id (
            operator_name,
            operator_code_id
          )
        `)
        .limit(3);

      if (operatorsError) {
        return res.status(500).json({
          success: false,
          error: "Erro ao buscar relacionamento com operadores",
          details: operatorsError.message,
        });
      }

      // Teste 4: Contar total de contatos
      const { count: totalContacts, error: countError } = await supabase
        .from("contacts")
        .select("*", { count: 'exact', head: true });

      if (countError) {
        return res.status(500).json({
          success: false,
          error: "Erro ao contar contatos",
          details: countError.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: "✅ API de contatos funcionando corretamente!",
        results: {
          connection: "OK",
          tableStructure: "OK",
          operatorRelationship: "OK",
          totalContacts: totalContacts || 0,
          sampleContacts: contacts?.length || 0,
          sampleWithOperators: contactsWithOperators?.length || 0
        },
        sampleData: {
          contacts: contacts || [],
          contactsWithOperators: contactsWithOperators || []
        },
        instructions: {
          listContacts: "GET /api/contacts",
          getContact: "GET /api/contacts/[id]",
          updateContact: "PUT /api/contacts/[id]",
          deleteContact: "DELETE /api/contacts/[id]"
        }
      });
    }

    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`,
      allowedMethods: ["GET"]
    });

  } catch (error) {
    console.error("❌ Erro no teste da API de contatos:", error);
    
    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
