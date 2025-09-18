// Script para testar se as variáveis de ambiente estão sendo carregadas
import dotenv from 'dotenv';
import path from 'path';

console.log("🔍 Testando carregamento de variáveis de ambiente...\n");

// Tentar carregar .env.local primeiro
console.log("1. Tentando carregar .env.local...");
const localResult = dotenv.config({ path: '.env.local' });
if (localResult.error) {
  console.log("❌ Erro ao carregar .env.local:", localResult.error.message);
} else {
  console.log("✅ .env.local carregado com sucesso");
}

// Carregar .env padrão
console.log("\n2. Tentando carregar .env...");
const envResult = dotenv.config();
if (envResult.error) {
  console.log("❌ Erro ao carregar .env:", envResult.error.message);
} else {
  console.log("✅ .env carregado com sucesso");
}

console.log("\n3. Variáveis de ambiente encontradas:");
console.log("WHATSAPP_API_URL:", process.env.WHATSAPP_API_URL || "❌ Não definido");
console.log("WHATSAPP_PHONE_NUMBER_ID:", process.env.WHATSAPP_PHONE_NUMBER_ID || "❌ Não definido");
console.log("WHATSAPP_ACCESS_TOKEN:", process.env.WHATSAPP_ACCESS_TOKEN ? "✅ Definido" : "❌ Não definido");
console.log("WHATSAPP_ACCESS_TOKEN (primeiros 20 chars):", process.env.WHATSAPP_ACCESS_TOKEN?.substring(0, 20) + "...");
console.log("WEBHOOK_VERIFY_TOKEN:", process.env.WEBHOOK_VERIFY_TOKEN || "❌ Não definido");
console.log("EMAIL_USER:", process.env.EMAIL_USER || "❌ Não definido");

console.log("\n4. Verificando arquivos:");
import fs from 'fs';

const files = ['.env.local', '.env', '.env.example'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} não existe`);
  }
});

console.log("\n5. Conteúdo do .env.local (se existir):");
if (fs.existsSync('.env.local')) {
  const content = fs.readFileSync('.env.local', 'utf8');
  console.log(content);
} else {
  console.log("Arquivo .env.local não encontrado");
}
