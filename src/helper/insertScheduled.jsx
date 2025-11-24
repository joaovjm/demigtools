import supabase from "./superBaseClient";
import { toast } from "react-toastify";

export const insertScheduled = async ({
  scheduled_date,
  observation,
  entity_type,
  entity_id,
  operator_code_id,
}) => {
  try {
    // Validar campos obrigatórios
    if (!scheduled_date) {
      toast.error("A data do agendamento é obrigatória");
      return null;
    }

    if (!entity_type) {
      toast.error("O tipo de entidade é obrigatório");
      return null;
    }

    if (!entity_id) {
      toast.error("O ID da entidade é obrigatório");
      return null;
    }

    // Inserir na tabela scheduled
    // scheduled_date pode ser uma string ISO ou timestamp
    const { data, error } = await supabase
      .from("scheduled")
      .insert([
        {
          scheduled_date: scheduled_date,
          status: "pendente",
          observation: observation || null,
          entity_type: entity_type,
          entity_id: entity_id,
          operator_code_id: operator_code_id || null,
        },
      ])
      .select();

    if (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error("Erro ao criar agendamento: " + error.message);
      return null;
    }

    toast.success("Agendamento criado com sucesso!");
    return data;
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    toast.error("Erro ao criar agendamento");
    return null;
  }
};

