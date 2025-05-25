import supabase from "./superBaseClient";

const getReceiveDonationPerOperator = async (startDate, endDate) => {
    console.log(startDate)
    console.log(endDate)
 
    try{
        const { data, error } = await supabase
    .from("donation")
    .select(
      "operator_name:operator_code_id(operator_name), operator_code_id, donation_value, donation_received"
    )
    .gte("donation_day_contact", startDate)
    .lte("donation_day_contact", endDate)

    if(error) throw error
    
    return data;
    
    } catch (error) {
        console.log("Erro: ", error.message)
    }

    
  
    
};

export default getReceiveDonationPerOperator;
