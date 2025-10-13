import supabase from "../../src/helper/supaBaseClient.js";

export const config = {
  api: {
    bodyParser: true,
  },
};

// DELETE: deleta campanha por ID
export default async function handler(req, res) {
  // Force content-type to JSON
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true, message: "OPTIONS OK" });
  }

  const { id } = req.query;


  if (!id) {
    return res.status(400).json({
      success: false,
      error: "ID da campanha é obrigatório",
      receivedQuery: req.query,
    });
  }

  try {
    if (req.method === "DELETE") {
      
      // Verificar se a campanha existe primeiro
      const { data: existingCampaign, error: selectError } = await supabase
        .from("whatsapp_campaigns")
        .select("id, name")
        .eq("id", id)
        .single();

      if (selectError) {
        console.error("❌ Erro ao buscar campanha:", selectError);
        return res.status(404).json({
          success: false,
          error: "Campanha não encontrada",
          details: selectError.message,
        });
      }


      // Deletar campanha
      const { error } = await supabase
        .from("whatsapp_campaigns")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("❌ Erro ao deletar campanha:", error);
        return res.status(500).json({
          success: false,
          error: "Erro ao deletar campanha",
          details: error.message,
        });
      }

      
      return res.status(200).json({
        success: true,
        message: "Campanha deletada com sucesso",
        deletedCampaign: existingCampaign,
      });
    }

    if (req.method === "GET") {
      // Buscar campanha por ID
      const { data: campaign, error } = await supabase
        .from("whatsapp_campaigns")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar campanha:", error);
        return res.status(404).json({
          success: false,
          error: "Campanha não encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        campaign,
      });
    }

    res.setHeader("Allow", ["GET", "DELETE"]);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`,
      allowedMethods: ["GET", "DELETE"]
    });
  } catch (error) {
    console.error("❌ Erro no endpoint de campanha:", error);
    console.error("❌ Stack trace:", error.stack);
    
    // Garantir que sempre retorna JSON válido
    try {
      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
        details: error.message,
        timestamp: new Date().toISOString(),
      });
    } catch (jsonError) {
      console.error("❌ Erro crítico ao retornar JSON:", jsonError);
      // Última tentativa de resposta válida
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: "Erro crítico do servidor",
        details: "Falha ao processar resposta"
      }));
    }
  }
}
