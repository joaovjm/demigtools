// Script para testar todas as APIs e verificar se estão funcionando
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testAPI(endpoint, name) {
  console.log(`\n🧪 Testando ${name}...`);
  console.log(`URL: ${BASE_URL}${endpoint}`);
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${data.success || 'N/A'}`);
    
    if (data.error) {
      console.log(`❌ Erro: ${data.error}`);
    } else if (data.connected !== undefined) {
      console.log(`🔗 Conectado: ${data.connected ? '✅ Sim' : '❌ Não'}`);
    } else if (data.webhookActive !== undefined) {
      console.log(`🔗 Webhook Ativo: ${data.webhookActive ? '✅ Sim' : '❌ Não'}`);
    } else {
      console.log(`✅ Resposta: ${JSON.stringify(data, null, 2)}`);
    }
    
    return { success: response.ok, data };
  } catch (error) {
    console.log(`❌ Erro de conexão: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log("🚀 Iniciando testes de todas as APIs...\n");
  
  const tests = [
    { endpoint: '/api/reload-env', name: 'Recarregar Variáveis' },
    { endpoint: '/api/whatsapp-config', name: 'Configuração WhatsApp' },
    { endpoint: '/api/test-whatsapp-connection', name: 'Teste Conexão WhatsApp' },
    { endpoint: '/api/test-webhook', name: 'Teste Webhook' }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testAPI(test.endpoint, test.name);
    results.push({ ...test, ...result });
    
    // Aguardar um pouco entre os testes
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log("\n📊 Resumo dos Testes:");
  console.log("===================");
  
  results.forEach(result => {
    const status = result.success ? "✅" : "❌";
    console.log(`${status} ${result.name}: ${result.success ? 'OK' : 'FALHOU'}`);
  });
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`\n🎯 Resultado: ${successCount}/${totalCount} testes passaram`);
  
  if (successCount === totalCount) {
    console.log("🎉 Todas as APIs estão funcionando!");
  } else {
    console.log("⚠️  Algumas APIs falharam. Verifique os logs acima.");
  }
}

// Executar testes
runTests().catch(console.error);
