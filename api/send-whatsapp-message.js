// API endpoint para enviar mensagens do WhatsApp
// Usa as variáveis de ambiente do backend para manter segurança

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

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: `Método ${req.method} não permitido` });
  }

  try {
    // Forçar recarregamento das variáveis
    console.log("🔄 Recarregando variáveis de ambiente no send-whatsapp-message...");
    
    // Limpar variáveis existentes
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;
    delete process.env.WHATSAPP_ACCESS_TOKEN;

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

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
      return res.status(500).json({
        success: false,
        error: "Configuração do WhatsApp não encontrada"
      });
    }

    const { to, message, type = 'text', caption, messageId } = req.body;

    // Verificar se é para marcar como lida
    if (type === 'mark_read') {
      if (!messageId) {
        return res.status(400).json({
          success: false,
          error: "Parâmetro 'messageId' é obrigatório para marcar como lida"
        });
      }
    } else {
      if (!to || !message) {
        return res.status(400).json({
          success: false,
          error: "Parâmetros 'to' e 'message' são obrigatórios"
        });
      }
    }

    const apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    // Preparar payload baseado no tipo de mensagem
    let payload = {
      messaging_product: 'whatsapp'
    };

    if (type === 'mark_read') {
      payload.status = 'read';
      payload.message_id = messageId;
    } else {
      payload.to = to;
      payload.type = type;

      if (type === 'text') {
        payload.text = { body: message };
      } else if (type === 'template') {
        payload.template = {
          name: message,
          language: { code: 'pt_BR' }
        };
      } else if (['image', 'video', 'document', 'audio'].includes(type)) {
        payload[type] = {
          id: message
        };
        if (caption && (type === 'image' || type === 'video')) {
          payload[type].caption = caption;
        }
      }
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
