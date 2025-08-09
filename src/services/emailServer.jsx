import { createTransport } from "nodemailer";

let transporter = createTransport({
    service: 'gmail',
    auth: {
        user:"joao.oliveira18.jm@gmail.com",
        pass: "kibu zmzy zqhr pkyj"
    }
})

let options = {
    from: 'João Oliveira <joao.oliveira18.jm@gmail.com>',
    to: 'infocelljm23@gmail.com',
    subject: "Teste de envio de Email",
    text: "Estou testando o envio deste email via reactJS"
}

export const sendEmail = async () => {
    try{
        await transporter.sendMail(options);
        process.exit;
    } catch (error) {
        console.log("Erro ao enviar email: ", error)
    }
}