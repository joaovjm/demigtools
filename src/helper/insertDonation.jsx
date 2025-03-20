import supabase from "./superBaseClient";

export const insertDonation = async (
  donor_id,
  valor,
  comissao,
  data_contato,
  data_receber,
  impresso,
  recebido,
  descricao
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
        donation_value: valor,
        donation_day_contact: data_contato,
        donation_description: descricao,
        donation_extra: comissao,
        donation_day_to_receive: data_receber,
        donation_print: print,
        donation_received: received,
      },
    ]).select();
    
    window.alert("Movimento criado com sucesso")
    if(error) throw error

    return data
  } catch (error){
    console.log("Erro ao criar doação", error.message)
  }
  
};
