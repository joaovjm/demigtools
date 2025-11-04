import { DataNow } from "../components/DataTime";
import supabase from "./superBaseClient";

const getDonationReceived = async (id, dateMeta) => {
  let totalValue = 0;
  let count = 0;
  let donation = [];
  let query = supabase
    .from("donation")
    .select("donation_value, donor: donor_id(donor_name), donation_day_received")
    .eq("donation_received", "Sim")
    .eq("operator_code_id", id);
  
    if (dateMeta?.[0]) {
      query = query.gte("donation_day_received", dateMeta[0].start_date);
    } else {
      query = query.gte("donation_day_received", `${DataNow("mesrefnf")}`)
    }

    try {
      const { data: operatorValue, error } = await query;
      if (error) throw error;
      if (!error) {
        for (let i = 0; i < operatorValue.length; i++) {
          count = i;
          let value = operatorValue[i].donation_value;
          totalValue = totalValue + value;
        }
      }
      donation = operatorValue;
      console.log({id,dateMeta})
      console.log({totalValue, count, donation})
    } catch (error) {
      console.error("Error", error.message);
    }

  return { totalValue, count, donation };
};

export default getDonationReceived;
