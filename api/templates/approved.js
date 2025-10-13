export const config = {
  api: {
    bodyParser: true,
  },
};

// Lista todos os templates aprovados do WhatsApp Business (Meta)
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const wabaId = process.env.WHATSAPP_WABA_ID; // ID da WABA (business_account)
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN; // App token com permissão

  if (!wabaId || !accessToken) {
    return res.status(500).json({
      error: "Variáveis de ambiente ausentes",
      details: "WHATSAPP_WABA_ID e WHATSAPP_ACCESS_TOKEN são obrigatórios",
    });
  }

  try {
    // Buscar todos os templates
    const url = new URL(`https://graph.facebook.com/v23.0/${wabaId}/message_templates`);
    url.searchParams.set("fields", "name,status,category,language,components,rejected_reason,rejected_reason_details,last_updated_time");
    url.searchParams.set("limit", "100"); // Aumentar limite para pegar mais templates

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: "Erro ao consultar templates", 
        details: data 
      });
    }

    // Filtrar apenas templates aprovados
    const approvedTemplates = (data.data || []).filter(
      template => template.status === "APPROVED"
    );

    return res.status(200).json({ 
      success: true, 
      templates: approvedTemplates,
      total: approvedTemplates.length
    });

  } catch (error) {
    console.error("❌ Erro ao buscar templates aprovados:", error);
    return res.status(500).json({ 
      error: "Erro interno do servidor", 
      details: error.message 
    });
  }
}
