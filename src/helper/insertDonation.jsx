import { toast } from "react-toastify";
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
  campain,
  collector
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
        donation_monthref: mesref ? mesref : null,
        donation_campain: campain ? campain : null,
        collector_code_id: collector ? collector : null,
      },
    ]).select();
    
    if(error) throw error

    if(!error){
      return data
    }

  } catch (error){
    console.log("Erro ao criar doação", error.message)
    throw error;
  }
  
};
