import supabase from "./superBaseClient";

const GetLeadsWithPagination = async (
  start, 
  end,
  setItems,
  setCurrentLead,
  operatorID
) => {

  try {
    const { data, error, count } = await supabase
      .from("leads")
      .select("*", { count: "exact" })
      .or(`leads_status.eq.Nunca Ligado,and(leads_status.eq.Aberto,operator_code_id.eq.${operatorID})`)
      .range(start, end)
      .order("leads_id", { ascending: true })

    setCurrentLead(data?.[0] || null)
    setItems(count || 0)
    
    return data
  
  } catch (error) {
    console.error("Erro ao buscar os dados", error.message);
  }
};

export default GetLeadsWithPagination;