export const sendEmail = async () => {
    try{
      const response = await axios.post("https://email-server-beige.vercel.app/api/send-email", {
        emailTo: "infocelljm23@gmail.com",
        subject: "Teste de envio de Email",
        text: "Estou testando o envio deste email via reactJS",
      });
      console.log(response.data.message);
      toast.success("Email enviado com sucesso");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao enviar email");
    }
  };