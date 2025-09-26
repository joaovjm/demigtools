import supabase from "../src/helper/superBaseClient.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { to, message, type = "text" } = req.body;
  

  try {
    // Envia para WhatsApp API
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type,
          text: { body: message },
        }),
      }
    );
    console.log({to, message, type});
    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erro na API do WhatsApp",
        details: result,
      });
    }

    console.log("FROM:", process.env.WHATSAPP_PHONE_NUMBER);
    // Salva no Supabase
    const { data: insertedData, error: supabaseError } = await supabase
      .from("messages")
      .insert([
        {
          from: process.env.WHATSAPP_PHONE_NUMBER,
          to,
          type,
          text: message,
          timestamp: new Date().toISOString(),
        },
      ])
      .select();

    if (supabaseError) {
      console.error("Erro Supabase:", supabaseError);
      // ainda retorno 200 porque a mensagem foi enviada no WhatsApp
      return res.status(200).json({
        success: true,
        whatsapp: result,
        supabase: { error: supabaseError.message },
      });
    }

    // Tudo certo
    return res.status(200).json({
      success: true,
      whatsapp: result,
    supabase: insertedData,
    });
  } catch (err) {
    console.error("Erro interno:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
