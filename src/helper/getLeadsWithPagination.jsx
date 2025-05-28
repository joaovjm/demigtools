import supabase from "./superBaseClient";

const GetLeadsWithPagination = async (
  start,
  end,
  setItems,
  setCurrentLead,
  operatorID,
  operator_type
) => {
  let operatorType;
  if (operator_type === "Operador Casa") {
    operatorType = "leads_casa";
  } else {
    operatorType = "leads";
  }
  try {
    const { data, error, count } = await supabase
      .from(operatorType)
      .select("*", { count: "exact" })
      .or(
        `leads_status.eq.Nunca Ligado,and(leads_status.eq.Aberto,operator_code_id.eq.${operatorID})`
      )
      .range(start, end)
      .order("leads_id", { ascending: true })
      .limit(1);

    setCurrentLead(data?.[0] || null);
    setItems(count || 0);

    if (data.length === 0 && operator_type !== "Operador Casa") {
      const { data: dataContinue } = await subabase
        .from("leads_casa")
        .select("*", { count: "exact" })
        .or(
          `leads_status.eq.Nunca Ligado,and(leads_status.eq.Aberto,operator_code_id.eq.${operatorID})`
        )
        .range(start, end)
        .order("leads_id", { ascending: true })
        .limit(1);
      return dataContinue;
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar os dados", error.message);
  }
};

export default GetLeadsWithPagination;
