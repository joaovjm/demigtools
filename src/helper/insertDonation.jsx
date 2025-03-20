export const insertDonation = async (valor, data, descricao, idDonor, comissao, data_receber) => {
    const {error} = await supabase.from("doação").insert([{
      donation_value: valor,
      donation_day_contact: data,
      donation_description: descricao,
      donor_id: idDonor,
      donation_extra: comissao,
      donation_day_to_receive: data_receber,
      donation_day_received: data_recebida,
      donation_print: print,
      donation_received: recebida
    }])
    if (!error) {
      window.alert("Doação criada com sucesso!")
    } else {
      window.alert("Erro ao criar doação: ", error)
    }
  }