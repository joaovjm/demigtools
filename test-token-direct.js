// Script para testar token diretamente sem cache
import fs from 'fs';

console.log("🔍 Testando token diretamente do arquivo .env.local...\n");

// Ler arquivo .env.local diretamente
if (!fs.existsSync('.env.local')) {
  console.log("❌ Arquivo .env.local não encontrado!");
  process.exit(1);
}

const envContent = fs.readFileSync('.env.local', 'utf8');
const envLines = envContent.split('\n');

let phoneNumberId = null;
let accessToken = null;

envLines.forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      
      if (key.trim() === 'WHATSAPP_PHONE_NUMBER_ID') {
        phoneNumberId = value;
      }
      if (key.trim() === 'WHATSAPP_ACCESS_TOKEN') {
        accessToken = value;
      }
    }
  }
});

console.log("📋 Variáveis encontradas:");
console.log("Phone Number ID:", phoneNumberId);
console.log("Access Token (primeiros 20 chars):", accessToken?.substring(0, 20) + "...");
console.log("Access Token COMPLETO:", accessToken);

if (!phoneNumberId || !accessToken) {
  console.log("❌ Variáveis não encontradas!");
  process.exit(1);
}

// Testar token diretamente
console.log("\n🧪 Testando token com a API do WhatsApp...");

const apiUrl = 'https://graph.facebook.com/v18.0';
const testUrl = `${apiUrl}/${phoneNumberId}`;

console.log("URL:", testUrl);
console.log("Token (primeiros 20 chars):", accessToken.substring(0, 20) + "...");

try {
  const response = await fetch(testUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  console.log("\n📊 Resposta da API:");
  console.log("Status:", response.status);
  console.log("OK:", response.ok);

  const data = await response.json();
  console.log("Data:", JSON.stringify(data, null, 2));

  if (response.ok) {
    console.log("\n✅ TOKEN VÁLIDO!");
    console.log("Display Phone Number:", data.display_phone_number);
    console.log("Verified Name:", data.verified_name);
    console.log("Status:", data.status);
  } else {
    console.log("\n❌ TOKEN INVÁLIDO!");
    console.log("Erro:", data.error?.message);
  }

} catch (error) {
  console.log("\n❌ ERRO DE CONEXÃO:");
  console.log("Erro:", error.message);
}
