import supabase from "./superBaseClient";

const GetLeads = async (
) => {
  try {
    //const from = (currentPage - 1) * itemsPerPage;
    //const to = from + itemsPerPage - 1;
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("leads_status", "Nunca Ligado")
      .order("leads_id", { ascending: true })

    if (error) throw error;

    return data
  
  } catch (error) {
    console.error("Erro ao buscar os dados", error.message);
  }
};

export default GetLeads;
