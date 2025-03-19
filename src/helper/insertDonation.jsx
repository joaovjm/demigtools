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