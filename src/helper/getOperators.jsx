import supabase from "./superBaseClient"

export const getOperators = async (active, item) => {
    let query = supabase.from("operator")
    
    if (item){
        query = query.select(item)
    } else {
        query = query.select()
    }
    if (active) query = query.eq("operator_active", active)

    const {data, error} = await query;

    if (data){
        return data
    }
    if (error){
        return error
    }
    
}  