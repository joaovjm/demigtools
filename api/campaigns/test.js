import supabase from "../../src/helper/supaBaseClient.js";

export default async function handler(req, res) {
  try {

    // Teste 1: Verificar se consegue conectar com Supabase
    const { data: testConnection, error: connectionError } = await supabase
      .from("messages") // usando uma tabela que provavelmente existe
      .select("count")
      .limit(1);

    if (connectionError) {
      return res.status(500).json({
        success: false,
        error: "Erro de conexão com Supabase",
        details: connectionError.message,
      });
    }


    // Teste 2: Verificar se a tabela whatsapp_campaigns existe
    const { data: campaigns, error: campaignsError } = await supabase
      .from("whatsapp_campaigns")
      .select("*")
      .limit(1);

    if (campaignsError) {
      
      if (campaignsError.message?.includes('relation "whatsapp_campaigns" does not exist')) {
        return res.status(500).json({
          success: false,
          error: "Tabela whatsapp_campaigns não existe",
          solution: "Execute o SQL: CREATE TABLE whatsapp_campaigns ...",
          details: campaignsError.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: "Erro ao acessar tabela whatsapp_campaigns",
        details: campaignsError.message,
      });
    }


    // Teste 3: Tentar inserir uma campanha de teste
    const testCampaign = {
      name: "Teste " + Date.now(),
      description: "Campanha de teste",
      selected_templates: [
        { name: "test_template", category: "utility", language: "pt_BR" }
      ],
    };

    const { data: insertTest, error: insertError } = await supabase
      .from("whatsapp_campaigns")
      .insert([testCampaign])
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({
        success: false,
        error: "Erro ao inserir campanha de teste",
        details: insertError.message,
      });
    }


    // Limpar campanha de teste
    await supabase
      .from("whatsapp_campaigns")
      .delete()
      .eq("id", insertTest.id);

    return res.status(200).json({
      success: true,
      message: "Todos os testes passaram!",
      tests: {
        supabaseConnection: "✅ OK",
        campaignsTable: "✅ OK", 
        insertTest: "✅ OK"
      }
    });

  } catch (error) {
    console.error("❌ Erro no teste:", error);
    return res.status(500).json({
      success: false,
      error: "Erro interno no teste",
      details: error.message,
      stack: error.stack,
    });
  }
}
