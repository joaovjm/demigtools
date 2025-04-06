import supabase from "../helper/superBaseClient";
import { toast } from "react-toastify";

const insertNewLeads = async (excelData) => {
  return toast.promise(
    (async () => {
      try {
        
        const existingMap = new Map();
        const batchSize = 900;
        
       
        for (let i = 0; i < excelData.length; i += batchSize) {
          const batch = excelData.slice(i, i + batchSize);
          const cpfBatch = batch.map(row => row.leads_icpf);
          
          const { data: existingCheck, error } = await supabase
            .from("leads")
            .select("leads_icpf, leads_name")
            .in("leads_icpf", cpfBatch);

          if (error) {
            throw new Error("Erro ao buscar os dados: " + error.message);
          }
          
 
          existingCheck.forEach((item) => {
            if (!existingMap.has(item.leads_icpf)) {
              existingMap.set(item.leads_icpf, new Set());
            }
            existingMap.get(item.leads_icpf).add(item.leads_name);
          });
        }

        // Filtra apenas os novos leads
        const itemsToAdd = excelData.filter((excelItem) => {
          const existingNames = existingMap.get(excelItem.leads_icpf);
          return !existingNames || !existingNames.has(excelItem.leads_name);
        });

        if (itemsToAdd.length === 0) {
          throw new Error("Nenhum lead novo para ser armazenado.");
        }
        
        // Insert new leads in batches
        let insertedCount = 0;
        for (let i = 0; i < itemsToAdd.length; i += batchSize) {
          const insertBatch = itemsToAdd.slice(i, i + batchSize);
          
          const { error } = await supabase
            .from("leads")
            .upsert(insertBatch);

          if (error) throw error;
          
          insertedCount += insertBatch.length;
        }

        return `${insertedCount} novos leads armazenados com sucesso!`;
      } catch (error) {
        throw new Error(error.message || "Erro ao inserir novos leads.");
      }
    })(),
    {
      pending: "Processando novos leads...",
      success: (message) => message,
      error: {
        render({ data }) {
          return data.message || "Erro inesperado ao armazenar os leads.";
        },
      },
    }
  );
};

export default insertNewLeads;
