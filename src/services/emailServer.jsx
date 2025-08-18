import { createTransport } from "nodemailer";
import { useState } from "react";

export const emailServer = async () => {
  // const [provider, setProvider] = useState();
  // const [emailName, setEmailName] = useState("João Oliveira")
  // const [email, setEmail] = useState("joao.oliveira18.jm@gmail.com");
  // const [password, setPassword] = useState("kibu zmzy zqhr pkyj");
  // const [emailTo, setEmailTo] = useState("infocelljm23@gmail.com");
  // const [subject, setSubject] = useState("Teste de envio de Email");
  // const [text, setText] = useState("Estou testando o envio deste email via reactJS");
  // const [filename, setFilename] = useState("")
  // const [archive, setArchive] = useState();
  let transporter = createTransport({
    service: "gmail",
    auth: {
      user: `${email}` ,
      pass: `${password}`,
    },
  });

  let options = {
    from: `${emailName} <${email}>`,
    to: `${emailTo}`,
    subject: `${subject}`,
    text: `${text}`,
    // attachments: [
    //   {
    //     filename: `${filename}`,
    //     path: `${archive}`,
    //   },
    // ],
  };

  try {
    await transporter.sendMail(options);
    process.exit;
  } catch (error) {
    console.log("Erro ao enviar email: ", error);
  }
};
