import supabase from "./superBaseClient"

export const getCampains = async () => {
    const {data, error} = await supabase.from("campain").select();
    if (error){
        console.log(error.message)
    } else {
        return data;
    }

    
}