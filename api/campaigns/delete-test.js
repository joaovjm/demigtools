export const config = {
  api: {
    bodyParser: true,
  },
};

// Endpoint de teste simples para deleção
export default async function handler(req, res) {

  // Force JSON response
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true, message: "OPTIONS OK" });
  }

  try {
    if (req.method === "DELETE") {
      
      const { campaignId } = req.query;

      // Simular deleção sem acessar o banco
      return res.status(200).json({
        success: true,
        message: "Teste de deleção OK",
        receivedId: campaignId,
        method: req.method,
        timestamp: new Date().toISOString()
      });
    }

    if (req.method === "GET") {
      return res.status(200).json({
        success: true,
        message: "Endpoint de teste funcionando",
        availableMethods: ["GET", "DELETE"],
        howToTest: "Use DELETE /api/campaigns/delete-test?campaignId=123"
      });
    }

    return res.status(405).json({
      success: false,
      error: "Método não suportado",
      method: req.method,
      allowedMethods: ["GET", "DELETE"]
    });

  } catch (error) {
    console.error("❌ Erro no teste:", error);
    
    return res.status(500).json({
      success: false,
      error: "Erro no teste",
      details: error.message,
      stack: error.stack
    });
  }
}
