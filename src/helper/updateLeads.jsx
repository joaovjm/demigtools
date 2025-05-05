import { DataNow } from "../components/DataTime";
import supabase from "./superBaseClient";

const updateLeads = async (status_leads, operator_code_id, leads_id) => {

  try{
    const {data, error} = await supabase
    .from("leads")
    .update([
      {
        operator_code_id: operator_code_id,
        leads_status: status_leads,
        leads_date_accessed: DataNow()
      },
    ])
    .eq("leads_id", leads_id)
    .select()

    if(error) throw error

    return data
  } catch (error){
    console.log(error.message)
  }
  
};

export default updateLeads;