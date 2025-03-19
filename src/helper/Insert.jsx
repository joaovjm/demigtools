import supabase from "./superBaseClient";

export const insertDonor = async (
    nome,
    tipo,
    endereco,
    cidade,
    bairro,
    telefone1,
    telefone2,
    telefone3,
    dia,
    mensalidade,
    media,
    observacao
  ) => {
    const { data, error } = await supabase.from("donor").insert([
      {
        donor_name: nome,
        donor_type: tipo,
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
    ]).select(); 
  
    if (!error) {
      window.alert("Doador criado com sucesso!");
    } else {
      window.alert("Erro ao criar doador: ", error);
    }
  
    return data;
  };

export const insertDonor_cpf = async (donor_id, cpf) => {
    const {error} = await supabase.from("donor_cpf").insert([{
        donor_id: donor_id,
        donor_cpf: cpf
    }])

    if (error) {
      window.alert ("Não foi possível salvar o CPF")
    }
};

export const insertDonor_tel_2 = async (donor_id, telefone2) => {
  const {error} = await supabase.from ("donor_tel_2").insert([{
    donor_id: donor_id,
    donor_tel_2: telefone2
  }])

  if (error) {
    window.alert ("Não foi possível salvar o Telefone 2")
  }
}

export const insertDonor_observation = async (donor_id, observacao) => {
  const {error} = await supabase.from("donor_observation").insert([{
    donor_id: donor_id,
    donor_observation: observacao
  }])
}

export const insertDonor_tel_3 = async (donor_id, telefone3) => {
  const {error} = await supabase.from("donor_tel_3").insert([{
    donor_id: donor_id,
    donor_tel_3: telefone3
  }])
}