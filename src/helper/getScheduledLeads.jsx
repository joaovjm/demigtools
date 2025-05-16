import supabase from "./superBaseClient"



const getScheduledLeads = async (operator_code_id, setScheduled, setScheduling) => {
    const { data, error} = await supabase.from("leads")
        .select("*")
        .eq("operator_code_id", operator_code_id)
        .eq("leads_status", "agendado")
        .order("leads_scheduling_date", { ascending: true })
        .limit(10);

    if(error) {
        console.error("Error fetching scheduled leads:", error);
        setScheduled([]);
    }

    if (data.length > 0) {
        let count = 0;
        for(let i = 0; i < data.length; i++) {
            count += 1
        }
        
        setScheduled(data)
        setScheduling(count)
    }
    
}

export default getScheduledLeads;