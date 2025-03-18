import supabase from "./superBaseClient";

export const insertDonor = async (
  nome,
  tipo,
  cpf,
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
  const { error } = await supabase.from("donor").insert([
    {
      nome: nome,
      tipo: tipo,
      cpf: cpf,
      endereco: endereco,
      cidade: cidade,
      bairro: bairro,
      telefone_1: telefone1,
      telefone_2: telefone2,
      telefone_3: telefone3,
      dia: dia,
      mensalidade: mensalidade,
      media: media,
      observacao: observacao,
    },
  ]);

  if (!error) {
    window.alert("Doador criado com sucesso!");
  } else {
    window.alert("Erro ao criar doador: ", error);
  }
};

export const editDonor = async (
  nome,
  tipo,
  cpf,
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
  const { error } = await supabase
    .from("donor")
    .update([
      {
        nome: nome,
        tipo: tipo,
        cpf: cpf,
        endereco: endereco,
        cidade: cidade,
        bairro: bairro,
        telefone_1: telefone1,
        telefone_2: telefone2,
        telefone_3: telefone3,
        dia: dia,
        mensalidade: mensalidade,
        media: media,
        observacao: observacao,
      },
    ])
    .eq("telefone_1", telefone1);
};

export const searchDonor = async (params, tipo_doador_descricao) => {
  try {
    let column = "";
    if (params) {
      if (/^\d{11}$/.test(params)) {
        column = "cpf";
      } else if (/^\d{1,9}$/.test(params)) {
        column = "telefone1";
      } else {
        column = "nome_doador";
      }
    }
    const { data, error } = await supabase
      .from("doador")
      .select()
      .ilike(column, `${params}`)
      .ilike("tipo_doador_descricao", `%${tipo_doador_descricao}%`);
      
      
    return data;
  } catch (error) {
    console.error("Erro ao buscar doador: ", error);
    return null;
  }
};

export const deleteDonor = async (id) => {
  console.log(id);
  const response = await supabase.from("donor").delete().eq("telefone_1", id);
};

export const getInfoDonor = async (id) => {
  const { data, error } = await supabase
    .from("doador")
    .select()
    .eq("id_doador", id);
  return data;
};

export const getDonations = async (idDonor) => {
  const {data, error} = await supabase
  .from("doação")
  .select()
  .eq("id_doacao_doador", idDonor)
  return data
}

export const insertDonation = async (valor, data, descricao, idDonor, comissao, data_receber) => {
  const {error} = await supabase.from("doação").insert([{
    valor: valor,
    data_contato: data,
    obs_doacao: descricao,
    id_doacao_doador: idDonor,
    comissao: comissao,
    data_receber: data_receber
  }])
  if (!error) {
    window.alert("Doação criada com sucesso!")
  } else {
    window.alert("Erro ao criar doação: ", error)
  }
}