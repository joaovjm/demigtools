// Script para diagnosticar o problema do WhatsApp webhook
import dotenv from 'dotenv';
import fs from 'fs';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local', override: true });
dotenv.config({ override: true });

async function diagnoseWhatsApp() {
  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    console.log("🔍 Diagnóstico do WhatsApp Business API");
    console.log("=====================================");
    console.log(`Phone Number ID: ${phoneNumberId}`);
    console.log(`Access Token: ${accessToken ? accessToken.substring(0, 20) + "..." : "Não definido"}`);
    console.log("");

    if (!accessToken || !phoneNumberId) {
      console.log("❌ Credenciais não configuradas");
      return;
    }

    // 1. Verificar informações do número de telefone
    console.log("1️⃣ Verificando número de telefone...");
    const phoneResponse = await fetch(`https://graph.facebook.com/v23.0/${phoneNumberId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const phoneData = await phoneResponse.json();
    console.log("📱 Dados do telefone:");
    console.log(`   - Número: ${phoneData.display_phone_number}`);
    console.log(`   - Nome: ${phoneData.verified_name}`);
    console.log(`   - Status: ${phoneData.status}`);
    console.log(`   - Webhook configurado: ${!!phoneData.webhook_configuration}`);
    if (phoneData.webhook_configuration) {
      console.log(`   - URL do webhook: ${phoneData.webhook_configuration.application}`);
    }
    console.log("");

    // 2. Verificar páginas associadas
    console.log("2️⃣ Verificando páginas do Facebook...");
    const pagesResponse = await fetch(`https://graph.facebook.com/v23.0/me/accounts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const pagesData = await pagesResponse.json();
    console.log(`📄 Total de páginas encontradas: ${pagesData.data ? pagesData.data.length : 0}`);
    
    if (pagesData.data && pagesData.data.length > 0) {
      console.log("   Páginas:");
      for (const page of pagesData.data) {
        console.log(`   - ${page.name} (ID: ${page.id})`);
      }
    } else {
      console.log("   ❌ Nenhuma página encontrada!");
    }
    console.log("");

    // 3. Verificar páginas com WhatsApp Business
    console.log("3️⃣ Verificando páginas com WhatsApp Business...");
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
            console.log(`   ✅ Página com WhatsApp: ${page.name} (ID: ${page.id})`);
            break;
          }
        } catch (error) {
          console.log(`   ❌ Erro ao verificar página ${page.id}: ${error.message}`);
        }
      }
    }

    if (!whatsappPage) {
      console.log("   ❌ Nenhuma página com WhatsApp Business encontrada!");
    }
    console.log("");

    // 4. Diagnóstico final
    console.log("4️⃣ Diagnóstico Final");
    console.log("===================");
    
    const issues = [];
    if (!pagesData.data || pagesData.data.length === 0) {
      issues.push("❌ Nenhuma página do Facebook associada à conta");
    }
    if (!whatsappPage) {
      issues.push("❌ Nenhuma página com WhatsApp Business configurada");
    }
    if (!phoneData.webhook_configuration) {
      issues.push("❌ Webhook não configurado");
    }

    if (issues.length === 0) {
      console.log("✅ Tudo configurado corretamente!");
    } else {
      console.log("Problemas encontrados:");
      issues.forEach(issue => console.log(`   ${issue}`));
      console.log("");
      console.log("🔧 Soluções:");
      console.log("1. Acesse https://developers.facebook.com/apps/");
      console.log("2. Selecione seu aplicativo");
      console.log("3. Vá para 'WhatsApp' > 'Configuration'");
      console.log("4. Configure o webhook:");
      console.log("   - URL: https://demigtools.vercel.app/api/webhook/whatsapp");
      console.log("   - Verify Token: manancial2025demigtools2025");
      console.log("   - Campos: messages, message_deliveries, message_reads");
      console.log("5. Se não houver páginas, crie uma página do Facebook");
      console.log("6. Configure o WhatsApp Business na página");
    }

  } catch (error) {
    console.error("❌ Erro durante o diagnóstico:", error.message);
  }
}

diagnoseWhatsApp();
