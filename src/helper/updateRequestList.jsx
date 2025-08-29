import supabase from "./superBaseClient";

export async function updateRequestList({ id, observationScheduling, dateScheduling, telScheduling }) {
    try{
        const { data, error } = await supabase
    .from("request")
    .update({
      request_status: "Agendado",
      request_scheduled_date: dateScheduling,
      request_observation: observationScheduling,
      request_tel_success: telScheduling
    })
    .eq("id", id)
    .select()
    if(error) throw error;
    if(!error) return data;
    } catch {
        console.log(error)
    }
  
}
