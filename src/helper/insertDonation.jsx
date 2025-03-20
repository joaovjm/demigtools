import supabase from "./superBaseClient";

export const insertDonation = async (
  donor_id,
  valor,
  comissao,
  data_contato,
  data_receber,
  impresso,
  recebido,
  descricao,
  setModalShow
) => {
  let print = "";
  let received = "";

  if (impresso === true) {
    print = "sim";
  } else {
    print = "Não";
  }

  if (recebido === true) {
    received = "sim";
  } else {
    received = "Não";
  }
  try{
    const { data, error } = await supabase.from("donation").insert([
      {
        donor_id: donor_id,
        donation_value: valor ? Number(valor): null,
        donation_day_contact: data_contato,
        donation_description: descricao,
        donation_extra: comissao ? Number(comissao) : null,
        donation_day_to_receive: data_receber ? data_receber : null,
        donation_print: print,
        donation_received: received,
      },
    ]).select();
    
    if(error) throw error

    if(!error){
      window.alert("Movimento criado com sucesso!")
      setModalShow(false)
    }

    return data
  } catch (error){
    window.alert("Erro ao criar doação", error.message)
  }
  
};
