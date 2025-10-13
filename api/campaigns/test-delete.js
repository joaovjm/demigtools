import supabase from "../../src/helper/supaBaseClient.js";

export const config = {
  api: {
    bodyParser: true,
  },
};

// Endpoint de teste para verificar deleção de campanhas
export default async function handler(req, res) {
  try {

    // Teste 1: Listar campanhas existentes
    const { data: campaigns, error: listError } = await supabase
      .from("whatsapp_campaigns")
      .select("id, name, created_at")
      .order("created_at", { ascending: false });

    if (listError) {
      return res.status(500).json({
        success: false,
        error: "Erro ao listar campanhas",
        details: listError.message,
      });
    }


    // Teste 2: Verificar estrutura da tabela
    const { data: tableInfo, error: tableError } = await supabase
      .from("whatsapp_campaigns")
      .select("*")
      .limit(1);

    if (tableError) {
      return res.status(500).json({
        success: false,
        error: "Erro ao verificar estrutura da tabela",
        details: tableError.message,
      });
    }

    // Teste 3: Simular deleção (sem executar)
    let simulationResult = "Nenhuma campanha para simular deleção";
    if (campaigns && campaigns.length > 0) {
      simulationResult = `Simularia deleção da campanha: ${campaigns[0].name} (ID: ${campaigns[0].id})`;
    }

    return res.status(200).json({
      success: true,
      message: "Teste de deleção realizado com sucesso",
      results: {
        totalCampaigns: campaigns?.length || 0,
        campaigns: campaigns?.slice(0, 5) || [], // Primeiras 5 campanhas
        tableStructure: tableInfo?.[0] ? Object.keys(tableInfo[0]) : [],
        simulationResult,
      },
      instructions: {
        howToTest: "Use DELETE /api/campaigns/{id} para deletar uma campanha específica",
        example: campaigns?.length > 0 ? `/api/campaigns/${campaigns[0].id}` : "Crie uma campanha primeiro",
      }
    });

  } catch (error) {
    console.error("❌ Erro no teste de deleção:", error);
    return res.status(500).json({
      success: false,
      error: "Erro interno no teste",
      details: error.message,
    });
  }
}
