import supabase from "./superBaseClient"

export const changeCollector = async (collector_code_id, receipt_donation_id) => {
    await supabase.from("donation").update([{
        collector_code_id: collector_code_id
    }]).eq("receipt_donation_id", receipt_donation_id)
}