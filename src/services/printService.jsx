import supabase from "../helper/superBaseClient";

export async function getDonationsPrint(setPrinters, startDate, endDate) {
    try{
        const { data, error } = await supabase
      .from("donation")
      .select(`donation_campain, donation_day_to_receive, donation_description, donation_value, donation_campain, receipt_donation_id,collector_code_id, collector: collector_code_id(collector_name), donor: donor_id(donor_name, donor_address, donor_city, donor_neighborhood, donor_tel_1, donor_type, donor_observation: donor_observation_donor_id_fkey(donor_observation), donor_reference:donor_reference_donor_id_fkey(donor_reference)), operator_code_id, operator: operator_code_id(operator_name)`)
      .eq("donation_print", "Não")
      .eq("donation_received", "Não")
      .gte("donation_day_to_receive", startDate)
      .lte("donation_day_to_receive", endDate)

      if (error) {
        console.log(error.message)
      } else {
        setPrinters(data)
        console.log(data)
        
      }
    }catch (error) {
        console.log(error)
    }
    
}