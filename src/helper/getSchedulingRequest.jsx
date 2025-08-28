import supabase from "./superBaseClient";

export const getSchedulingRequest = async ({operatorID}) => { 
  const { data, error } = await supabase
    .from("request")
    .select(
      "donor_id, donor: donor_id(donor_name), request_scheduled_date, request_observation"
    )
    .eq("operator_code_id", operatorID)
    .eq("request_status", "Agendado")
    if(error) throw error
    if(data.length > 0) {
        console.log(data)
    }
};
