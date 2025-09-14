import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    }
  }
}

export default async function handler(req, res) {

  const allowedOrigins = [
    "http://localhost:5173",
    "https://demigtools.vercel.app",
  ]

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

  if (req.method === "OPTIONS") {

    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { emailTo, subject, text } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const options = {
    from: `"João Oliveira" <${process.env.EMAIL_USER}>`,
    to: emailTo,
    subject: subject,
    text: text,
  };
  try {
    await transporter.sendMail(options);
    res.status(200).json({ message: "Email enviado com sucesso" });
  } catch (error) {
    console.error("Erro Nodemailer: ", error)
    res.status(500).json({ message: "Erro ao enviar email", error: error.message });
  }
}