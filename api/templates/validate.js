export const config = {
  api: {
    bodyParser: true,
  },
};

// Valida se um template específico está funcionando
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { templateName, testNumber = "5511999999999" } = req.body;

  if (!templateName) {
    return res.status(400).json({ error: "Nome do template é obrigatório" });
  }

  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneId || !accessToken) {
    return res.status(500).json({
      error: "Variáveis de ambiente ausentes no servidor",
    });
  }

  try {

    // Fazer uma requisição de teste (não será enviada por usar número de teste)
    const payload = {
      messaging_product: "whatsapp",
      to: testNumber,
      type: "template",
      template: {
        name: templateName,
        language: { code: "pt_BR" },
      },
    };


    const response = await fetch(
      `https://graph.facebook.com/v23.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      const errorDetails = {
        template: templateName,
        error: result.error?.message || "Erro desconhecido",
        errorCode: result.error?.code,
        httpStatus: response.status,
        details: result,
      };

      // Interpretar códigos de erro comuns
      let interpretation = "";
      switch (result.error?.code) {
        case 100:
          interpretation = "Template não encontrado ou não aprovado";
          break;
        case 132000:
          interpretation = "Parâmetros do template inválidos";
          break;
        case 80007:
        case 131026:
          interpretation = "Rate limit atingido - muitas mensagens enviadas";
          break;
        case 131051:
          interpretation = "Número de telefone inválido";
          break;
        case 131052:
          interpretation = "Usuário optou por não receber mensagens";
          break;
        default:
          interpretation = "Erro não identificado";
      }

      return res.status(200).json({
        success: false,
        template: templateName,
        error: errorDetails,
        interpretation,
        recommendation: getRecommendation(result.error?.code),
      });
    }

    return res.status(200).json({
      success: true,
      template: templateName,
      message: "Template válido e funcional",
      testResponse: result,
    });

  } catch (error) {
    console.error(`❌ Erro ao testar template ${templateName}:`, error);
    return res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message,
    });
  }
}

function getRecommendation(errorCode) {
  switch (errorCode) {
    case 100:
      return "Verifique se o template existe e está aprovado no WhatsApp Business Manager";
    case 132000:
      return "Verifique se todos os parâmetros obrigatórios estão sendo enviados";
    case 80007:
    case 131026:
      return "Aguarde alguns minutos antes de tentar novamente ou reduza a frequência de envios";
    case 131051:
      return "Verifique se o número de telefone está no formato correto (Ex: 5511999999999)";
    case 131052:
      return "O usuário optou por não receber mensagens. Tente com outro número";
    default:
      return "Verifique as configurações do template no WhatsApp Business Manager";
  }
}
