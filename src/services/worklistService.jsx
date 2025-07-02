import supabase from "../helper/superBaseClient";

export async function fetchWorklist() {
  const { data, error } = await supabase
    .from("request")
    .select()
    .eq("request_active", "True");
  if (error) console.error(error.message);

  if (data.length > 0) {
    const worklist = [
      ...new Map(
        data.map((dt) => [
          dt.request_name,
          {
            name: dt.request_name,
          },
        ])
      ).values(),
    ];
    return worklist;
  }
}

export async function getWorklistRequests(operatorID, workSelect) {
  const { data, error } = await supabase
    .from("request")
    .select(
      "donor_id, donor: donor_id(donor_name), request_end_date, request_status, receipt_donation_id, donation: receipt_donation_id(donation_value, donation_day_received)"
    )
    .eq("operator_code_id", operatorID)
    .eq("request_name", workSelect)
    .eq("request_active", "True");

  if (error) throw error;
  if (!error) return data;
}
