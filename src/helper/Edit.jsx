import supabase from "./superBaseClient";

export const editDonor = async (
    id,
    nome,
    tipo,
    //cpf,
    endereco,
    cidade,
    bairro,
    telefone1,
    //telefone2,
    //telefone3,
    //dia,
    //mensalidade,
    //media,
    //observacao
  ) => {
    const { data, error } = await supabase
      .from("donor")
      .update([
        {
          donor_name: nome,
          donor_type: tipo,
          //cpf: cpf,
          donor_address: endereco,
          donor_city: cidade,
          donor_neighborhood: bairro,
          donor_tel_1: telefone1,
          //telefone_2: telefone2,
          //telefone_3: telefone3,
          //dia: dia,
          //mensalidade: mensalidade,
          //media: media,
          //observacao: observacao,
        },
      ])
      .eq("donor_id", id)
      .select();

      if (data) {
        window.alert("Doador atualizado com sucesso!")
      }
      if (error) {
        window.alert("Erro ao atualizar dados do doador: ", error.message)
      }
      console.log(id)

      return data;
  };