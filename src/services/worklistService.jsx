import { getMaxAndMedDonations } from "../helper/getMaxAndMedDonations";
import getWorklistRequests from "../helper/getWorklistRequests";
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

export async function worklistRequests(operatorID, workSelect) {
  const response = await getWorklistRequests(operatorID, workSelect);
  return response;
}

export async function fetchMaxAndMedDonations(id, requestName) {
  const { maxGeneral, maxPeriod, penultimate } = await getMaxAndMedDonations(id, requestName);
  return { maxGeneral, maxPeriod, penultimate };
}
