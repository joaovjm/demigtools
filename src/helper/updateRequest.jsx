import supabase from "./superBaseClient";
import { DataNow } from "../components/DataTime";

const updateRequest = async (requestId, createPackage, endDate) => {
  try {
    // Atualizar o nome da requisição
    const { error: requestNameError } = await supabase
      .from("request_name")
      .update({
        date_validate: endDate,
        date_updated: DataNow("noformated")
      })
      .eq("id", requestId);

    if (requestNameError) {
      console.error("Erro ao atualizar nome da requisição:", requestNameError);
      throw requestNameError;
    }

    // Primeiro, desativar todas as requisições existentes
    const { error: deactivateError } = await supabase
      .from("request")
      .update({ request_active: "False" })
      .eq("request_name_id", requestId);

    if (deactivateError) {
      console.error("Erro ao desativar requisições existentes:", deactivateError);
      throw deactivateError;
    }

    // Preparar dados para inserção
    const validColumn = [
      "donor_id",
      "operator_code_id",
      "receipt_donation_id",
      "request_end_date",
      "request_name",
    ];

    const filterPackage = createPackage.map((pkg) =>
      Object.fromEntries(
        Object.entries(pkg).filter(([key]) => validColumn.includes(key))
      )
    );

    // Inserir novas requisições
    const update = filterPackage.map((pkg) => ({
      ...pkg,
      request_start_date: DataNow("noformated"),
      request_name_id: requestId,
      request_active: "True"
    }));

    const { data, error } = await supabase
      .from("request")
      .insert(update)
      .select();

    if (error) {
      console.error("Erro ao inserir requisições atualizadas:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro na função updateRequest:", error);
    throw error;
  }
};

export default updateRequest;
