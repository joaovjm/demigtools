// API endpoint para enviar mensagens do WhatsApp
// Usa as variáveis de ambiente do backend para manter segurança

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default async function handler(req, res) {
  // Configurar CORS
  const allowedOrigins = [
    "http://localhost:5173",
    "https://demigtools.vercel.app",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: `Método ${req.method} não permitido` });
  }

  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
      return res.status(500).json({
        success: false,
        error: "Configuração do WhatsApp não encontrada"
      });
    }

    const { to, message, type = 'text' } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: "Parâmetros 'to' e 'message' são obrigatórios"
      });
    }

    const apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    // Preparar payload baseado no tipo de mensagem
    let payload = {
      messaging_product: 'whatsapp',
      to: to,
      type: type
    };

    if (type === 'text') {
      payload.text = { body: message };
    } else if (type === 'template') {
      payload.template = {
        name: message,
        language: { code: 'pt_BR' }
      };
    }

    // Enviar mensagem via API do WhatsApp
    const response = await fetch(`${apiUrl}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro na API do WhatsApp');
    }

    return res.status(200).json({
      success: true,
      messageId: data.messages?.[0]?.id,
      data: data
    });

  } catch (error) {
    console.error("Erro ao enviar mensagem WhatsApp:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Erro interno do servidor"
    });
  }
}
