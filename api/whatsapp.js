// pages/api/whatsapp.js
import dotenv from "dotenv";
import supabase from "../src/helper/superBaseClient";
//import supabase from "../src/helper/superBaseClient.js";

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
      const data = req.body;

      const message = data.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
      const contact = data.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];

      if (!message || !contact) {
        return res.status(200).send("Nenhuma mensagem encontrada");
      }

      let { data: existingContact } = await supabase
        .from("contacts")
        .select("contact_id")
        .eq("phone_number", contact.wa_id)
        .single();

      let contactId;

      if (existingContact) {
        contactId = existingContact.contact_id;
      } else {
        const { data: newContact, error: insertContactError } = await supabase
          .from("contacts")
          .insert({
            phone_number: contact.wa_id,
            name: contact.profile?.name || null,
          })
          .select()
          .single();
        if (insertContactError) throw insertContactError;
        contactId = newContact.id;
      }

      let { data: existingConv } = await supabase
        .from("conversations")
        .select("conversation_id")
        .eq("type", "individual")
        .eq("title", contact.profile?.name || contact.wa_id)
        .single();

      let conversationId;
      if (existingConv) {
        conversationId = existingConv.conversation_id;
      } else {
        const { data: newConv, error: insertConvError } = await supabase
          .from("conversations")
          .insert({
            type: "individual",
            title: contact.profile?.name || contact.wa_id,
          })
          .select()
          .single();
        if (insertConvError) throw insertConvError;
        conversationId = newConv.conversation_id;
      }

      // 🔹 Inserir mensagem
      const { data: newMessage, error: insertMsgError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          from_contact: contactId,
          body: message.text?.body || null,
          message_type: message.type,
          media_url: message.image?.id
            ? `https://graph.facebook.com/v18.0/${message.image.id}`
            : null,
          status: "received",
        })
        .select()
        .single();
      if (insertMsgError) throw insertMsgError;

      return res.status(200).send("EVENT_RECEIVED");
    } catch (err) {
      console.error("❌ Erro no handler:", err);
      return res.status(500).send("Internal Server Error");
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
