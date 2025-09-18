// API para forçar recarregamento das variáveis de ambiente
import dotenv from 'dotenv';
import fs from 'fs';

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
    console.log("🔄 Forçando recarregamento das variáveis de ambiente...");

    // Limpar variáveis existentes
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;
    delete process.env.WHATSAPP_ACCESS_TOKEN;
    delete process.env.WEBHOOK_VERIFY_TOKEN;
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;

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

    console.log("✅ Variáveis recarregadas com sucesso!");

    return res.status(200).json({
      success: true,
      message: "Variáveis de ambiente recarregadas",
      variables: {
        WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID ? "✅ Definido" : "❌ Não definido",
        WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN ? "✅ Definido" : "❌ Não definido",
        WHATSAPP_ACCESS_TOKEN_PREVIEW: process.env.WHATSAPP_ACCESS_TOKEN?.substring(0, 20) + "...",
        WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN ? "✅ Definido" : "❌ Não definido",
        EMAIL_USER: process.env.EMAIL_USER ? "✅ Definido" : "❌ Não definido"
      }
    });

  } catch (error) {
    console.error("❌ Erro ao recarregar variáveis:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
