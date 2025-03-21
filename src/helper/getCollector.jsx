import supabase from "./superBaseClient"

export const getCollector = async () => {
    const {data, error} = await supabase.from("collector").select(`*`)

    if(error) throw error

    if(data){
        console.log("dados acessados com sucesso")
    }
    if(error){
        console.log("Erro ao buscar os coletadores: ", error.message)
    }

    return data
}