import supabase from "./superBaseClient";

const getWorklistRequests = async (operatorID, workSelect) => {
  console.log(operatorID)
  const { data, error } = await supabase
    .from("request")
    .select(
      `id, donor_id, donor: donor_id(donor_name, donor_tel_1), donor_tel_2b: donor_id(donor_tel_2(donor_tel_2)), donor_tel_3b: donor_id(donor_tel_3(donor_tel_3)), request_name, request_start_date, request_end_date, request_status, receipt_donation_id, donation: receipt_donation_id(donation_value, donation_day_received)`
    )
    .eq("operator_code_id", operatorID)
    .eq("request_name", workSelect)
    .eq("request_active", "True");

  if (error) console.log(error.message); 
  if (!error) return data;
};

export default getWorklistRequests;
