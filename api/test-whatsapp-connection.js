// API para testar a conexão real com o WhatsApp Business API
// Esta API faz uma chamada real para verificar se as credenciais estão corretas

import dotenv from 'dotenv';
import fs from 'fs';

// Carregar variáveis de ambiente para desenvolvimento local
dotenv.config({ path: '.env.local', override: true });
dotenv.config({ override: true });

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
    // Forçar recarregamento das variáveis
    console.log("🔄 Recarregando variáveis de ambiente...");
    
    // Limpar variáveis existentes
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;
    delete process.env.WHATSAPP_ACCESS_TOKEN;
    delete process.env.WEBHOOK_VERIFY_TOKEN;

    // Recarregar do arquivo .env.local
    if (fs.existsSync('.env.local')) {
      const envContent = fs.readFileSync('.env.local', 'utf8');
      const envLines = envContent.split('\n');
      
      envLines.forEach(line => {
        if (line.trim() && !line.startsWith('#')) {
          const [key, ...valueParts] = line.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim();
            process.env[key.trim()] = value;
          }
        }
      });
    }

    // Carregar via dotenv também
    dotenv.config({ path: '.env.local', override: true });
    dotenv.config({ override: true });

    // Debug: Log das variáveis de ambiente
    console.log("🔍 Debug - Variáveis de ambiente (APÓS RECARREGAMENTO):");
    console.log("WHATSAPP_PHONE_NUMBER_ID:", process.env.WHATSAPP_PHONE_NUMBER_ID ? "✅ Definido" : "❌ Não definido");
    console.log("WHATSAPP_ACCESS_TOKEN:", process.env.WHATSAPP_ACCESS_TOKEN ? "✅ Definido" : "❌ Não definido");
    console.log("WHATSAPP_ACCESS_TOKEN (primeiros 10 chars):", process.env.WHATSAPP_ACCESS_TOKEN?.substring(0, 10) + "...");
    console.log("WHATSAPP_ACCESS_TOKEN COMPLETO:", process.env.WHATSAPP_ACCESS_TOKEN);
    console.log("WEBHOOK_VERIFY_TOKEN:", process.env.WEBHOOK_VERIFY_TOKEN ? "✅ Definido" : "❌ Não definido");
    
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
      return res.status(200).json({
        success: false,
        connected: false,
        error: "Variáveis de ambiente não configuradas",
        details: {
          hasPhoneNumberId: !!process.env.WHATSAPP_PHONE_NUMBER_ID,
          hasAccessToken: !!process.env.WHATSAPP_ACCESS_TOKEN,
          hasWebhookToken: !!process.env.WEBHOOK_VERIFY_TOKEN
        }
      });
    }

    const apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    console.log("🔍 Debug - Fazendo chamada para API:");
    console.log("URL:", `${apiUrl}/${phoneNumberId}`);
    console.log("Token (primeiros 20 chars):", accessToken?.substring(0, 20) + "...");
    console.log("Timestamp:", new Date().toISOString());

    // Fazer uma chamada real para a API do WhatsApp para verificar se as credenciais são válidas
    const response = await fetch(`${apiUrl}/${phoneNumberId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("🔍 Debug - Resposta da API:");
    console.log("Status:", response.status);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));

    const data = await response.json();

    if (response.ok) {
      // Credenciais válidas - verificar se o número está ativo
      return res.status(200).json({
        success: true,
        connected: true,
        message: "WhatsApp Business API conectado com sucesso",
        details: {
          phoneNumberId: phoneNumberId,
          displayPhoneNumber: data.display_phone_number,
          verifiedName: data.verified_name,
          status: data.status,
          qualityRating: data.quality_rating,
          apiVersion: data.api_version
        }
      });
    } else {
      // Credenciais inválidas ou erro na API
      return res.status(200).json({
        success: false,
        connected: false,
        error: `Erro na API do WhatsApp: ${data.error?.message || 'Erro desconhecido'}`,
        details: {
          status: response.status,
          errorCode: data.error?.code,
          errorType: data.error?.type,
          errorSubcode: data.error?.error_subcode
        }
      });
    }

  } catch (error) {
    console.error("Erro ao testar conexão WhatsApp:", error);
    return res.status(200).json({
      success: false,
      connected: false,
      error: `Erro de conexão: ${error.message}`,
      details: {
        type: error.name,
        message: error.message
      }
    });
  }
}
