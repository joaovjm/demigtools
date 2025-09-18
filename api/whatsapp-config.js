// API endpoint para obter configurações do WhatsApp
// Este endpoint retorna apenas as configurações necessárias para o frontend
// sem expor tokens sensíveis

import dotenv from 'dotenv';

// Carregar variáveis de ambiente para desenvolvimento local
dotenv.config({ path: '.env.local' });
dotenv.config();

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

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: `Método ${req.method} não permitido` });
  }

  try {
    // Verificar se as variáveis de ambiente estão configuradas
    const config = {
      apiUrl: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
      pageId: process.env.WHATSAPP_PAGE_ID, // ID da página do WhatsApp
      hasAccessToken: !!process.env.WHATSAPP_ACCESS_TOKEN,
      hasWebhookToken: !!process.env.WEBHOOK_VERIFY_TOKEN,
      hasPageId: !!process.env.WHATSAPP_PAGE_ID,
      isConfigured: !!(
        process.env.WHATSAPP_PHONE_NUMBER_ID &&
        process.env.WHATSAPP_ACCESS_TOKEN &&
        process.env.WEBHOOK_VERIFY_TOKEN
      )
    };
    console.log(config)

    // Retornar apenas informações necessárias, sem expor tokens
    return res.status(200).json({
      success: true,
      config: config
    });

  } catch (error) {
    console.error("Erro ao obter configuração:", error);
    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
}
