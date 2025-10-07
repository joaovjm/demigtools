import supabase from "../src/helper/supaBaseClient.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const { conversationId, from, to, message, type } = req.body;
    console.log({conversationId, from, to, message, type});
    if (!to || !message || !type) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const fromNumber = process.env.WHATSAPP_PHONE_NUMBER;
    console.log({phoneId, accessToken, fromNumber});

    if (!phoneId || !accessToken || !fromNumber) {
      console.error("❌ Variáveis de ambiente ausentes");
      return res
        .status(500)
        .json({ error: "Variáveis de ambiente ausentes no servidor" });
    }
    // Envia para WhatsApp API
    const response = await fetch(
      `https://graph.facebook.com/v23.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to,
          type: type,
          text: { body: message },
        }),
      }
    );
    console.log({ to, message, type });
    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Erro na API do WhatsApp",
        details: result,
      });
    }

    // Salva no Supabase
    const { data: insertedData, error: supabaseError } = await supabase
      .from("messages")
      .insert([
        {
          conversation_id: conversationId,
          from_contact: from,
          //to_contact: to,
          body: message,
          message_type: type,
          received_at: new Date().toISOString(),
          status: "delivered",
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
