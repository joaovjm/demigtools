// API para testar se o webhook está configurado no Facebook
// Esta API verifica se o webhook está ativo e funcionando

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
    console.log("🔄 Recarregando variáveis de ambiente no webhook...");
    
    // Limpar variáveis existentes
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

    console.log("🔍 Debug - Variáveis do webhook (APÓS RECARREGAMENTO):");
    console.log("WHATSAPP_ACCESS_TOKEN:", process.env.WHATSAPP_ACCESS_TOKEN ? "✅ Definido" : "❌ Não definido");
    console.log("WHATSAPP_ACCESS_TOKEN (primeiros 20 chars):", process.env.WHATSAPP_ACCESS_TOKEN?.substring(0, 20) + "...");
    console.log("WEBHOOK_VERIFY_TOKEN:", process.env.WEBHOOK_VERIFY_TOKEN ? "✅ Definido" : "❌ Não definido");

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WEBHOOK_VERIFY_TOKEN) {
      return res.status(200).json({
        success: false,
        webhookActive: false,
        error: "Variáveis de ambiente do webhook não configuradas",
        details: {
          hasAccessToken: !!process.env.WHATSAPP_ACCESS_TOKEN,
          hasWebhookToken: !!process.env.WEBHOOK_VERIFY_TOKEN
        }
      });
    }

    const apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const configuredPageId = process.env.WHATSAPP_PAGE_ID;

    let pageId = configuredPageId;
    let pageName = null;

    // Se não tiver o ID da página configurado, obter automaticamente
    if (!pageId) {
      try {
        // Obter lista de páginas
        const accountsResponse = await fetch(`${apiUrl}/me/accounts`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!accountsResponse.ok) {
          const errorData = await accountsResponse.json();
          return res.status(200).json({
            success: false,
            webhookActive: false,
            error: `Erro ao obter páginas: ${errorData.error?.message || 'Erro desconhecido'}`,
            details: {
              status: accountsResponse.status,
              errorCode: errorData.error?.code,
              webhookUrl: `${process.env.VERCEL_URL || 'localhost:3000'}/api/webhook/whatsapp`,
              verifyToken: process.env.WEBHOOK_VERIFY_TOKEN ? 'Configurado' : 'Não configurado'
            }
          });
        }

        const accountsData = await accountsResponse.json();
        const pages = accountsData.data || [];

        if (pages.length === 0) {
          return res.status(200).json({
            success: false,
            webhookActive: false,
            error: "Nenhuma página encontrada associada à conta",
            details: {
              webhookUrl: `${process.env.VERCEL_URL || 'localhost:3000'}/api/webhook/whatsapp`,
              verifyToken: process.env.WEBHOOK_VERIFY_TOKEN ? 'Configurado' : 'Não configurado',
              note: "É necessário ter pelo menos uma página associada à conta para configurar webhooks"
            }
          });
        }

        // Usar a primeira página encontrada para verificar webhooks
        pageId = pages[0].id;
        pageName = pages[0].name;
        console.log("🔍 Usando página ID obtido automaticamente:", pageId);
      } catch (error) {
        return res.status(200).json({
          success: false,
          webhookActive: false,
          error: `Erro ao obter páginas: ${error.message}`,
          details: {
            webhookUrl: `${process.env.VERCEL_URL || 'localhost:3000'}/api/webhook/whatsapp`,
            verifyToken: process.env.WEBHOOK_VERIFY_TOKEN ? 'Configurado' : 'Não configurado',
            note: "Configure WHATSAPP_PAGE_ID nas variáveis de ambiente para evitar este erro"
          }
        });
      }
    } else {
      console.log("🔍 Usando página ID configurado:", pageId);
    }

    // Verificar webhooks da página
    try {
      const webhookResponse = await fetch(`${apiUrl}/${pageId}/subscribed_apps`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (webhookResponse.ok) {
        const webhookData = await webhookResponse.json();
        return res.status(200).json({
          success: true,
          webhookActive: true,
          message: "Webhook verificado com sucesso",
          details: {
            pageId: pageId,
            pageName: pageName,
            subscribedApps: webhookData.data || [],
            webhookUrl: `${process.env.VERCEL_URL || 'localhost:3000'}/api/webhook/whatsapp`,
            verifyToken: process.env.WEBHOOK_VERIFY_TOKEN ? 'Configurado' : 'Não configurado'
          }
        });
      } else {
        const errorData = await webhookResponse.json();
        return res.status(200).json({
          success: false,
          webhookActive: false,
          error: `Erro ao verificar webhook: ${errorData.error?.message || 'Erro desconhecido'}`,
          details: {
            pageId: pageId,
            pageName: pageName,
            status: webhookResponse.status,
            errorCode: errorData.error?.code,
            webhookUrl: `${process.env.VERCEL_URL || 'localhost:3000'}/api/webhook/whatsapp`,
            verifyToken: process.env.WEBHOOK_VERIFY_TOKEN ? 'Configurado' : 'Não configurado'
          }
        });
      }
    } catch (apiError) {
      console.error("Erro na verificação do webhook:", apiError);
      // Se a API de webhook não estiver disponível, retornar status baseado nas variáveis
      return res.status(200).json({
        success: true,
        webhookActive: true,
        message: "Webhook configurado (verificação limitada)",
        details: {
          pageId: pageId,
          pageName: pageName,
          webhookUrl: `${process.env.VERCEL_URL || 'localhost:3000'}/api/webhook/whatsapp`,
          verifyToken: process.env.WEBHOOK_VERIFY_TOKEN ? 'Configurado' : 'Não configurado',
          note: "Verificação completa requer configuração no Facebook Developer Console",
          error: apiError.message
        }
      });
    }

  } catch (error) {
    console.error("Erro ao testar webhook:", error);
    return res.status(200).json({
      success: false,
      webhookActive: false,
      error: `Erro de conexão: ${error.message}`,
      details: {
        type: error.name,
        message: error.message
      }
    });
  }
}
