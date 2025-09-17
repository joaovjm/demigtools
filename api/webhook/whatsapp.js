export default function handler(req, res) {
  console.log("📩 Chegou requisição:", req.method, req.url);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Body:", JSON.stringify(req.body, null, 2));
  try {
    const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

    if (req.method === "GET") {
      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];

      if (mode && token) {
        if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
          console.log("Webhook verificado com sucesso!");
          return res.status(200).send(challenge);
        } else {
          return res.sendStatus(403);
        }
      }
    }
    console.log("Log teste")
    if (req.method === "POST") {
      const body = req.body;

      if (body.object) {
        const change = body.entry?.[0]?.changes?.[0];
        const message = change?.value?.messages?.[0];

        if (message) {
          console.log("Mensagem recebida:", message);
        }

        return res.status(200).send("EVENT_RECEIVED");
      } else {
        return res.sendStatus(404);
      }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Método ${req.method} não permitido`);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Erro interno ", error.message);
  }
}
