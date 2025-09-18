// API para verificar e corrigir a configuração da página do WhatsApp
// Este endpoint verifica se há uma página associada e fornece instruções para corrigir

import dotenv from 'dotenv';
import fs from 'fs';

// Carregar variáveis de ambiente
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

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: `Método ${req.method} não permitido` });
  }

  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      return res.status(200).json({
        success: false,
        error: "Credenciais não configuradas",
        solution: "Configure as variáveis WHATSAPP_ACCESS_TOKEN e WHATSAPP_PHONE_NUMBER_ID"
      });
    }

    // 1. Verificar informações do número de telefone
    console.log("🔍 Verificando número de telefone...");
    const phoneResponse = await fetch(`https://graph.facebook.com/v23.0/${phoneNumberId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const phoneData = await phoneResponse.json();
    console.log("📱 Dados do telefone:", phoneData);

    // 2. Verificar se há uma página associada
    console.log("🔍 Verificando páginas associadas...");
    const pagesResponse = await fetch(`https://graph.facebook.com/v23.0/me/accounts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const pagesData = await pagesResponse.json();
    console.log("📄 Páginas encontradas:", pagesData);

    // 3. Verificar configuração do webhook
    console.log("🔍 Verificando configuração do webhook...");
    const webhookResponse = await fetch(`https://graph.facebook.com/v23.0/${phoneNumberId}/webhook_configuration`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const webhookData = await webhookResponse.json();
    console.log("🔗 Configuração do webhook:", webhookData);

    // 4. Verificar se há uma página do WhatsApp Business
    let whatsappPage = null;
    if (pagesData.data && pagesData.data.length > 0) {
      for (const page of pagesData.data) {
        try {
          const pageWhatsAppResponse = await fetch(`https://graph.facebook.com/v23.0/${page.id}?fields=whatsapp_business_account`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          const pageWhatsAppData = await pageWhatsAppResponse.json();
          if (pageWhatsAppData.whatsapp_business_account) {
            whatsappPage = {
              pageId: page.id,
              pageName: page.name,
              whatsappBusinessAccount: pageWhatsAppData.whatsapp_business_account
            };
            break;
          }
        } catch (error) {
          console.log(`Erro ao verificar página ${page.id}:`, error.message);
        }
      }
    }

    return res.status(200).json({
      success: true,
      analysis: {
        phoneNumber: {
          id: phoneNumberId,
          displayNumber: phoneData.display_phone_number,
          verifiedName: phoneData.verified_name,
          status: phoneData.status,
          webhookConfigured: !!phoneData.webhook_configuration
        },
        pages: {
          total: pagesData.data ? pagesData.data.length : 0,
          pages: pagesData.data || [],
          whatsappPage: whatsappPage
        },
        webhook: {
          configured: !!phoneData.webhook_configuration,
          url: phoneData.webhook_configuration?.application || null
        }
      },
      issues: [
        ...(pagesData.data && pagesData.data.length === 0 ? [{
          type: "NO_PAGES",
          message: "Nenhuma página do Facebook encontrada associada à conta",
          solution: "Crie uma página do Facebook e associe-a ao seu aplicativo"
        }] : []),
        ...(!whatsappPage ? [{
          type: "NO_WHATSAPP_PAGE",
          message: "Nenhuma página com WhatsApp Business encontrada",
          solution: "Configure o WhatsApp Business em uma das suas páginas do Facebook"
        }] : []),
        ...(!phoneData.webhook_configuration ? [{
          type: "NO_WEBHOOK",
          message: "Webhook não configurado",
          solution: "Configure o webhook no Facebook Developer Console"
        }] : [])
      ],
      solutions: {
        step1: "Acesse https://developers.facebook.com/apps/",
        step2: "Selecione seu aplicativo",
        step3: "Vá para 'WhatsApp' > 'Configuration'",
        step4: "Na seção 'Webhook', configure:",
        step5: "- URL: https://demigtools.vercel.app/api/webhook/whatsapp",
        step6: "- Verify Token: manancial2025demigtools2025",
        step7: "- Selecione os campos: messages, message_deliveries, message_reads",
        step8: "Clique em 'Verify and Save'"
      }
    });

  } catch (error) {
    console.error("Erro ao verificar configuração:", error);
    return res.status(200).json({
      success: false,
      error: `Erro: ${error.message}`,
      solution: "Verifique as credenciais e tente novamente"
    });
  }
}
