import supabase from "./superBaseClient"

export const getOperators = async () => {
    const {data, error} = await supabase.from("operator").select()

    if (data){
        return data
    }
    if (error){
        return error
    }
    
}  