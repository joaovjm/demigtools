import supabase from "./superBaseClient"

const getScheduledLeads = async (operator_code_id, setScheduled) => {
    const { data, error} = await supabase.from("leads")
        .select("*")
        .eq("operator_code_id", operator_code_id)
        .order("leads_scheduling_date", { ascending: false })
        .limit(10);

    if(error) {
        console.error("Error fetching scheduled leads:", error);
        setScheduled([]);
    }

    if (data.length > 0) {
        setScheduled(data)
    }
}

export default getScheduledLeads;