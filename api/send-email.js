import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

// força carregar o .env.local na raiz
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Carrega as variáveis do .env.local
dotenv.config();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {

  const allowedOrigins = [
    "http://localhost:5173",
    "https://demigtools.vercel.app",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: `Método ${req.method} não permitido` });
  }

  const { emailTo, subject, text } = req.body;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({
      message: "Erro ao enviar email",
      error: "EMAIL_USER ou EMAIL_PASS não definidos",
    });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Centro Geriátrico Manancial" <${process.env.EMAIL_USER}>`,
    to: emailTo,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email enviado com sucesso!" });
  } catch (error) {
    console.error("Erro Nodemailer:", error);
    return res.status(500).json({
      message: "Erro ao enviar email",
      error: error.message,
    });
  }
}
