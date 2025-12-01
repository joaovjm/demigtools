import supabase from "./superBaseClient";
import { toast } from "react-toastify";

const editLead = async (leadId, leadData, operatorType = null) => {
  try {
    // Determina a tabela baseado no tipo de operador ou tenta ambas
    let tableName = "leads";
    
    // Se operatorType foi fornecido, usa ele
    if (operatorType === "Operador Casa") {
      tableName = "leads_casa";
    } else if (operatorType) {
      tableName = "leads";
    } else {
      // Se não foi fornecido, tenta descobrir verificando em qual tabela o lead existe
      const { data: leadCheck } = await supabase
        .from("leads")
        .select("leads_id")
        .eq("leads_id", leadId)
        .single();

      if (!leadCheck) {
        tableName = "leads_casa";
      }
    }

    const updateData = {
      leads_name: leadData.name,
      leads_address: leadData.address,
      leads_neighborhood: leadData.neighborhood,
      leads_city: leadData.city,
      leads_icpf: leadData.icpf,
      leads_tel_1: leadData.tel1,
      leads_tel_2: leadData.tel2 || null,
      leads_tel_3: leadData.tel3 || null,
      leads_tel_4: leadData.tel4 || null,
      leads_tel_5: leadData.tel5 || null,
      leads_tel_6: leadData.tel6 || null,
    };

    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq("leads_id", leadId)
      .select();

    if (error) {
      console.error("Erro ao atualizar lead:", error.message);
      toast.error("Erro ao atualizar lead: " + error.message);
      throw error;
    }

    if (data && data.length > 0) {
      toast.success("Lead atualizado com sucesso!");
      return data[0];
    }

    return null;
  } catch (error) {
    console.error("Erro na função editLead:", error);
    throw error;
  }
};

export default editLead;

