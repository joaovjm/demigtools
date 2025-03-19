import supabase from "./superBaseClient";

export const searchDonor = async (params, donor_type) => {
  try {
    let column = "";
    if (params) {
      if (/^\d{11}$/.test(params)) {
        column = "donor_cpf";
      } else if (/^\d{1,9}$/.test(params)) {
        column = "donor_tel_1";
      } else {
        column = "donor_name";
      }
    }
    const { data, error } = await supabase
      .from("donor")
      .select()
      .ilike(column, `${params}`)
      .ilike("donor_type", `%${donor_type}%`);
      
      
    return data;
  } catch (error) {
    console.error("Erro ao buscar doador: ", error);
    return null;
  }
};


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