import supabase from "../helper/superBaseClient";
import { toast } from "react-toastify";

const insertNewLeads = async (excelData) => {
  return toast.promise(
    (async () => {
      try {
        // Busca os dados no supabase
        const { data: existingCheck, error } = await supabase
          .from("leads")
          .select("leads_icpf, leads_name")
          .in(
            "leads_icpf",
            excelData.map((row) => row.leads_icpf)
          );

        if (error) {
          throw new Error("Erro ao buscar os dados");
        }

        const existingMap = new Map();
        existingCheck.forEach((item) => {
          if (!existingMap.has(item.leads_icpf)) {
            existingMap.set(item.leads_icpf, new Set());
          }
          existingMap.get(item.leads_icpf).add(item.leads_name);
        });

        // Filtra apenas os novos leads
        const itemsToAdd = excelData.filter((excelItem) => {
          const existingNames = existingMap.get(excelItem.leads_icpf);
          return !existingNames || !existingNames.has(excelItem.leads_name);
        });

        if (itemsToAdd.length > 0) {
          try {
            const { data, error } = await supabase
              .from("leads")
              .insert(itemsToAdd)
              .select();

            if (error) throw error;

            return "Novos leads armazenados com sucesso!";
          } catch (error) {
            console.log(error.message);
          }
        } else {
          throw new Error("Nenhum lead novo para ser armazenado.");
        }
      } catch (error) {
        throw new Error(error.message || "Erro ao inserir novos leads.");
      }
    })(),
    {
      pending: "Processando novos leads...",
      success: "Novos leads armazenados com sucesso! 🎉",
      error: {
        render({ data }) {
          return data.message || "Erro inesperado ao armazenar os leads.";
        },
      },
    }
  );
};

export default insertNewLeads;
