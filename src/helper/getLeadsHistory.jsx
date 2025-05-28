import React from "react";
import supabase from "./superBaseClient";

const getLeads = async () => {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select()
      .or(
        "leads_status.eq.agendado, leads_status.eq.Não pode ajudar, leads_status.eq.Não Atendeu"
      );

    if (error) throw error;
    if (!error) return data;
  } catch (error) {
    console.log("Erro: ", error.message);
  }
};

const getLeadsCasa = async () => {
  try {
    const { data, error } = await supabase
      .from("leads_casa")
      .select()
      .or(
        "leads_status.eq.agendado, leads_status.eq.Não pode ajudar, leads_status.eq.Não Atendeu"
      );
    if (error) throw error;
    if (!error) return data;
  } catch (error) {
    console.log("Erro: ", error.message);
  }
};

const getLeadsExcludes = async () => {
  try {
    const { data, error } = await supabase
      .from("leads_excludes")
      .select()
      .or(
        "leads_status.eq.agendado, leads_status.eq.Não pode ajudar, leads_status.eq.Não Atendeu"
      );

    if (error) throw error;
    if (!error) return data;
  } catch (error) {
    console.log("Error: ", error.message);
  }
};

export const getLeadsHistory = async (startDate, endDate) => {
  let leadsHistory = [];
  const leads = await getLeads();
  if (leads.length > 0) leadsHistory.push(leads);
  const leadsCasa = await getLeadsCasa();
  if (leadsCasa.length > 0) leadsHistory.push(leadsCasa);
  const leadsExcludes = await getLeadsExcludes();
  if (leadsExcludes.length > 0) leadsHistory.push(leadsExcludes);

  return leadsHistory;
};
