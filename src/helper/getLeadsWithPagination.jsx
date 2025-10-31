import supabase from "./superBaseClient";

const GetLeadsWithPagination = async (
  start,
  end,
  setItems,
  setCurrentLead,
  operatorID,
  operator_type,
  neighborhood = ""
) => {
  let operatorType;
  if (operator_type === "Operador Casa") {
    operatorType = "leads_casa";
  } else {
    operatorType = "leads";
  }
  try {
    let query = supabase
      .from(operatorType)
      .select("*", { count: "exact" })
      .or(
        `leads_status.eq.Nunca Ligado,and(leads_status.eq.Aberto,operator_code_id.eq.${operatorID})`
      );

    // Adicionar filtro por bairro se especificado
    if (neighborhood && neighborhood.trim() !== "") {
      query = query.eq("leads_neighborhood", neighborhood);
    }

    const { data, error, count } = await query
      .range(start, end)
      .order("leads_id", { ascending: true })
      .limit(1);

    setCurrentLead(data?.[0] || null);
    setItems(count || 0);

    if (data.length === 0 && operator_type !== "Operador Casa") {
      let queryContinue = supabase
        .from("leads_casa")
        .select("*", { count: "exact" })
        .or(
          `leads_status.eq.Nunca Ligado,and(leads_status.eq.Aberto,operator_code_id.eq.${operatorID})`
        );

      // Adicionar filtro por bairro se especificado
      if (neighborhood && neighborhood.trim() !== "") {
        queryContinue = queryContinue.eq("leads_neighborhood", neighborhood);
      }

      const { data: dataContinue } = await queryContinue
        .range(start, end)
        .order("leads_id", { ascending: true })
        .limit(1);
      return dataContinue;
    }

    return data;
  } catch (error) {
    // Erro 416 (Range Not Satisfiable) significa que não há mais leads disponíveis
    if (error.message && error.message.includes("Range Not Satisfiable")) {
      console.log("Não há mais leads disponíveis na posição solicitada");
    } else {
      console.error("Erro ao buscar os dados", error.message);
    }
    setItems(0);
    setCurrentLead(null);
    return [];
  }
};

export default GetLeadsWithPagination;
