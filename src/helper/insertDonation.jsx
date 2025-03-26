import supabase from "./superBaseClient";

export const insertDonation = async (
  donor_id,
  operator,
  valor,
  comissao,
  data_contato,
  data_receber,
  impresso,
  recebido,
  descricao,
  mesref,
  setModalShow
) => {
  let print = "";
  let received = "";

  if (impresso === true) {
    print = "Sim";
  } else {
    print = "Não";
  }

  if (recebido === true) {
    received = "Sim";
  } else {
    received = "Não";
  }

  console.log(donor_id,
    valor,
    comissao,
    data_contato,
    data_receber,
    impresso,
    recebido,
    descricao,
    mesref)
  try{
    const { data, error } = await supabase.from("donation").insert([
      {
        donor_id: donor_id,
        operator_code_id: operator ? operator : null,
        donation_value: valor ? Number(valor): null,
        donation_day_contact: data_contato,
        donation_description: descricao,
        donation_extra: comissao ? Number(comissao) : null,
        donation_day_to_receive: data_receber ? data_receber : null,
        donation_print: print,
        donation_received: received,
        donation_monthref: mesref ? mesref : null
      },
    ]).select();
    
    if(error) throw error

    if(!error){
      setModalShow(false)
      return data
    }

  } catch (error){
    console.log("Erro ao criar doação", error.message)
  }
  
};
