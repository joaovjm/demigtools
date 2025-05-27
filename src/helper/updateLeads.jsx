import { DataNow } from "../components/DataTime";
import supabase from "./superBaseClient";

const updateLeads = async (status_leads, operator_code_id, leads_id, operator_type) => {
  let operatorType;
  if(operator_type === "Operador Casa"){
    operatorType = "leads_casa"
  } else {
    operatorType = "leads"
  }
  const updateData = {
    leads_date_accessed: DataNow("noformated"),
    leads_status: status_leads,
    ...(operator_code_id !== null &&
      operator_code_id !== undefined && { operator_code_id: operator_code_id }),
  };

  try {
    const { data, error } = await supabase
      .from(operatorType)
      .update(updateData)
      .eq("leads_id", leads_id)
      .select();

    if (error) throw error;
    if(data[0].leads_status === status_leads){
      return data;
    }

    
  } catch (error) {
    console.log(error.message);
  }
};

export default updateLeads;
