// pages/api/whatsapp.js
import dotenv from "dotenv";
import supabase from "../src/helper/superBaseClient.js";

dotenv.config();

// Necessário para o Next/Vercel entender JSON vindo do WhatsApp
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  // 🔹 Validação do Webhook (GET)
  if (req.method === "GET") {
    const verify_token = process.env.WEBHOOK_VERIFY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token && mode === "subscribe" && token === verify_token) {
      console.log("✅ WEBHOOK VERIFICADO");
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Token inválido");
    }
  }

  // 🔹 Recebendo mensagens (POST)
  if (req.method === "POST") {
    try {
      console.log("📩 Webhook body:", JSON.stringify(req.body, null, 2));

      const entry = req.body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const msg = value?.messages?.[0];

      if (msg) {
        const message = {
          from: msg.from,
          to: value.metadata?.display_phone_number,
          timestamp: new Date(Number(msg.timestamp) * 1000),
          type: msg.type,
          text: msg.text?.body || null,
        };

        console.log("✅ Mensagem recebida:", message);

        const { error } = await supabase.from("messages").insert([message]);
        if (error) {
          console.error("❌ Erro ao salvar no Supabase:", error);
        }
      } else {
        console.log("⚠️ Nenhuma mensagem encontrada no payload");
      }

      return res.status(200).send("EVENT_RECEIVED");
    } catch (err) {
      console.error("❌ Erro no handler:", err);
      return res.status(500).send("Internal Server Error");
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
