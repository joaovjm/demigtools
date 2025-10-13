import supabase from "../src/helper/supaBaseClient.js";

export const config = {
  api: {
    bodyParser: true,
  },
};

// CRUD para Campanhas de WhatsApp
// GET: lista campanhas
// POST: cria nova campanha
export default async function handler(req, res) {
  // Adicionar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Debug: log da requisição

    if (req.method === "GET") {
      // Listar todas as campanhas
      
      const { data: campaigns, error } = await supabase
        .from("whatsapp_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Erro ao buscar campanhas:", error);
        return res.status(500).json({
          success: false,
          error: "Erro ao buscar campanhas",
          details: error.message,
        });
      }

      return res.status(200).json({
        success: true,
        campaigns: campaigns || [],
      });
    }

    if (req.method === "POST") {
      // Criar nova campanha
      const { name, description, selectedTemplates, variables = [] } = req.body;

      // Validação
      if (!name || !selectedTemplates || selectedTemplates.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Nome da campanha e pelo menos um template são obrigatórios",
        });
      }

      // Preparar dados para inserção
      const campaignData = {
        name: name.trim(),
        description: description?.trim() || null,
        selected_templates: selectedTemplates,
        variables: variables.filter(v => v && v.trim() !== ''), // Salvar apenas variáveis não vazias
      };


      const { data: campaign, error } = await supabase
        .from("whatsapp_campaigns")
        .insert([campaignData])
        .select()
        .single();

      if (error) {
        console.error("❌ Erro ao criar campanha:", error);
        
        // Verificar se a tabela existe
        if (error.message?.includes('relation "whatsapp_campaigns" does not exist')) {
          return res.status(500).json({
            success: false,
            error: "Tabela whatsapp_campaigns não encontrada. Execute o script SQL primeiro.",
            details: error.message,
          });
        }

        return res.status(500).json({
          success: false,
          error: "Erro ao criar campanha",
          details: error.message,
        });
      }

      return res.status(201).json({
        success: true,
        campaign,
        message: "Campanha criada com sucesso",
      });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("❌ Erro no endpoint de campanhas:", error);
    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
