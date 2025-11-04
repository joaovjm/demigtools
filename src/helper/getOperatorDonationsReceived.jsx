import supabase from "./superBaseClient";

const getOperatorDonationsReceived = async ({ startDate, endDate, operatorId = null }) => {
  let totalValue = 0;
  let donation = [];
  
  try {
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
      .gte("donation_day_received", startDate)
      .lte("donation_day_received", endDate)
      .not("operator_code_id", "is", null);

    // Se um operador específico for fornecido, filtrar por ele
    if (operatorId) {
      query = query.eq("operator_code_id", operatorId);
    }

    const { data: operatorValue, error } = await query;
    
    if (error) throw error;
    
    if (operatorValue && operatorValue.length > 0) {
      for (let i = 0; i < operatorValue.length; i++) {
        let value = operatorValue[i].donation_value;
        totalValue = totalValue + value;
      }
      donation = operatorValue;
    }
    
    return { totalValue, donation };
  } catch (error) {
    console.error("Error fetching operator donations:", error.message);
    return { totalValue: 0, donation: [] };
  }
};

export default getOperatorDonationsReceived;

