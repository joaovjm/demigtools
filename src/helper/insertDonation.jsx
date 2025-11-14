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
  collector,
  request_name
) => {
  let print = "";
  let received = "";
  let request_name_searched = "";

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
    let requestId = null;
    
    // Verificar se existe um request ativo para este donor_id
    if(request_name === null || request_name === undefined || request_name === ""){
      const { data: requestData, error: requestError } = await supabase
        .from("request")
        .select("id, request_name")
        .eq("donor_id", donor_id)
        .eq("request_active", "True")
        .limit(1)
        .single();

      if(!requestError && requestData){
        request_name_searched = requestData.request_name;
        requestId = requestData.id;
      }
    }

    // Inserir a doação
    const { data, error } = await supabase.from("donation").insert([
      {
        donor_id: donor_id,
        operator_code_id: operator ? operator : null,
        donation_value: valor ? Number(valor): 0,
        donation_day_contact: data_contato,
        donation_description: descricao,
        donation_extra: comissao ? Number(comissao) : null,
        donation_day_to_receive: data_receber ? data_receber : null,
        donation_print: print,
        donation_received: received,
        donation_monthref: mesref ? mesref : null,
        donation_campain: campain ? campain : null,
        collector_code_id: collector ? collector : null,
        donation_worklist: request_name ? request_name : request_name_searched ? request_name_searched : null,
      },
    ]).select();
    
    if(error) throw error;

    // Se encontrou um request ativo, atualizar o status para "Sucesso"
    // Apenas se o operador NÃO for 521 (Mensal)
    if(requestId && operator !== 521){
      const { error: updateError } = await supabase
        .from("request")
        .update({ request_status: "Sucesso" })
        .eq("id", requestId);
      
      if(updateError){
        console.log("Erro ao atualizar status do request", updateError.message);
      }
    }

    if(!error){
      return data;
    }

  } catch (error){
    console.log("Erro ao criar doação", error.message);
    throw error;
  }
  
};
