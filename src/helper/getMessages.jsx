import supabase from "./superBaseClient";

export async function getMessages() {
    try {
        const { data, error } = await supabase.from("messages").select("*");
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        throw error;
    }
}