import supabase from "./superBaseClient";

const getLeadById = async (leadId) => {
  try {
    // Primeiro tenta buscar na tabela leads
    let { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("leads_id", leadId)
      .single();

    // Se não encontrar, tenta na tabela leads_casa
    if (error || !data) {
      const { data: dataCasa, error: errorCasa } = await supabase
        .from("leads_casa")
        .select("*")
        .eq("leads_id", leadId)
        .single();

      if (errorCasa) {
        console.error("Erro ao buscar lead:", errorCasa.message);
        throw errorCasa;
      }

      return dataCasa;
    }

    return data;
  } catch (error) {
    console.error("Erro na função getLeadById:", error);
    throw error;
  }
};

export default getLeadById;

