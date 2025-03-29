import supabase from "./superBaseClient"

export const changeCollector = async (collector_code_id, receipt_donation_id, dateFormat) => {
 
    try{
        const { data, error } = await supabase.from("donation").select("donation_received").eq("receipt_donation_id", receipt_donation_id)

        if (error) throw error

        if (data[0].donation_received === "Não") {
            const {data, error} = await supabase.from("donation").update([{
                collector_code_id: collector_code_id,
                donation_day_to_receive: dateFormat
            }]).eq("receipt_donation_id", receipt_donation_id).select()
    
            return "Ok"
        } else {
            return "Yes"
        }
    } catch (error) {
        return 0
    }
    
}