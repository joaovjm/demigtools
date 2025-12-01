import React from "react";
import supabase from "./superBaseClient";

const getLeads = async () => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select(
        "operator_code_id, operator_name: operator_code_id(operator_name), leads_status"
      )
      .or(
        "leads_status.eq.agendado, leads_status.eq.Não pode ajudar, leads_status.eq.Não Atendeu, leads_status.eq.Sucesso"
      );

    if (error) throw error;
    if (!error) return data;
  } catch (error) {
    console.log("Erro: ", error.message);
  }
};

export const getLeadsHistory = async (startDate, endDate) => {
  const leads = await getLeads();

  return { leads };
};
