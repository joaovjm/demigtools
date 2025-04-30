import supabase from "./superBaseClient";

const updateLeads = async (status_leads, leads_id) => {
  console.log(status_leads)
  const {data} = await supabase
    .from("leads")
    .update([
      {
        leads_status: status_leads,
      },
    ])
    .eq("leads_id", leads_id)
    .select()

    return data
};

export default updateLeads;