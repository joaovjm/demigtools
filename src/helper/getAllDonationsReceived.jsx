import { DataNow } from "../components/DataTime";
import supabase from "./superBaseClient";

const getAllDonationsReceived = async () => {
  let totalValue = 0;
  let donation = [];
  
  let query = supabase
    .from("donation")
    .select(`
      donation_value, 
      donor: donor_id(donor_name), 
      donation_day_received,
      operator_code_id,
      operator_name: operator_code_id(operator_name)
    `)
    .eq("donation_received", "Sim")
    .gte("donation_day_received", `${DataNow("mesrefnf")}`)
    .not("operator_code_id", "is", null);

  try {
    const { data: operatorValue, error } = await query;
    if (error) throw error;
    if (!error) {
      for (let i = 0; i < operatorValue.length; i++) {
        let value = operatorValue[i].donation_value;
        totalValue = totalValue + value;
      }
    }
    donation = operatorValue;
  } catch (error) {
    console.error("Error", error.message);
  }

  return { totalValue, donation };
};

export default getAllDonationsReceived;

