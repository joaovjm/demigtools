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

export const searchDonor = async (params, tipo) => {
  try {
    let column = "";
    if (params) {
      if (/^\d{11}$/.test(params)) {
        column = "cpf";
      } else if (/^9\d{7,}$/.test(params)) {
        column = "telefone_1";
      } else {
        column = "nome";
      }
    }
    const { data, error } = await supabase
      .from("donor")
      .select()
      .ilike(column, `${params}`)
      .ilike("tipo", `%${tipo}%`);
      
      
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
    .from("donor")
    .select()
    .eq("telefone_1", id);
  return data;
};