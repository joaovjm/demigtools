import React from "react";
import { getLeadsHistory } from "../helper/getLeadsHistory";

const getNameOperator = (leads) => {
  const operator = [
    ...new Map(
      leads?.map((history) => [
        history.operator_name.operator_name,
        {
          name: history.operator_name.operator_name,
        },
      ])
    ).values(),
  ];

  return operator;
};

const getLeadsScheduling = (leads) => {
  const scheduled = leads?.reduce((acc, item) => {
    const name = item.operator_name.operator_name;
    if (item.leads_status === "agendado") acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  return scheduled;
};

const getLeadsNA = (leads) => {
  const leadsNA = leads?.reduce((acc, item) => {
    const name = item.operator_name.operator_name;
    if (item.leads_status === "Não Atendeu") acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  return leadsNA;
};

const getLeadsNP = (leads) => {
  const leadsNP = leads?.reduce((acc, item) => {
    const name = item.operator_name.operator_name;
    if (item.leads_status === "Não pode ajudar")
      acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  return leadsNP;
};

const getLeadsSuccess = (leads) => {
  const leadsSuccess = leads?.reduce((acc, item) => {
    const name = item.operator_name.operator_name
    if(item.leads_status === "Sucesso") acc[name] = (acc[name] || 0) + 1
    return acc;
  }, {})

  return leadsSuccess;
}

const getCountLeads = (leads) => {
  const countLeads = leads?.reduce((acc, item) => {
    const name = item.operator_name.operator_name
    acc[name] = (acc[name] || 0) + 1
    return acc;
  }, {})

  return countLeads;
}

export const leadsHistoryService = async () => {
  const { leads, leadsCasa } = await getLeadsHistory();
  const operator = getNameOperator(leads);
  const operatorCasa = getNameOperator(leadsCasa);
  const scheduled = getLeadsScheduling(leads);
  const scheduledCasa = getLeadsScheduling(leadsCasa);
  const leadsNA = getLeadsNA(leads);
  const leadsNACasa = getLeadsNA(leadsCasa);
  const leadsNP = getLeadsNP(leads);
  const leadsNPCasa = getLeadsNP(leadsCasa);
  const leadsSuccess = getLeadsSuccess(leads);
  const leadsSuccessCasa = getLeadsSuccess(leadsCasa);
  const countLeads = getCountLeads(leads);
  const countLeadsCasa = getCountLeads(leadsCasa);

  return {
    operator,
    operatorCasa,
    scheduled,
    scheduledCasa,
    leadsNA,
    leadsNACasa,
    leadsNP,
    leadsNPCasa,
    leadsSuccess,
    leadsSuccessCasa,
    countLeads,
    countLeadsCasa
  };
};
