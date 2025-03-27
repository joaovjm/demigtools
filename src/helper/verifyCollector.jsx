import supabase from "./superBaseClient"

export const verifyCollector = async (collector, receipt, setMessage, setSearch) => {
    try{
        const {data} = await supabase.from("donation").select("collector_code_id").eq("receipt_donation_id", receipt)
        const {collector_code_id} = data[0]

        if(parseInt(collector) === collector_code_id){
            return true
        } else {
            return false
        }

    } catch {
        setMessage("Recibo não localizado")
        setSearch("")
    }

    setTimeout(() => {
        setMessage("");
      }, 2000);
    
}