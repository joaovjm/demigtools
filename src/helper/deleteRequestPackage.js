import supabase from "./superBaseClient";

export async function deleteRequestPackage(requestId) {
  try {
    const { data: requestNameData, error: requestNameError } = await supabase
      .from("request_name")
      .delete()
      .eq("id", requestId)
      .select();

    if (requestNameError) throw requestNameError;
  } catch (error) {
    console.error("Erro ao deletar pacote:", error);
  }
}
