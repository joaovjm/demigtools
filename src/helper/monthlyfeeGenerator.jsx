import { DataNow, DataSelect } from "../components/DataTime";
import { getDonation } from "./getDonation";
import { insertDonation } from "./insertDonation";
import { insertMonthHistory } from "./insertMonthHistory";
import supabase from "./superBaseClient";

export const monthlyfeeGenerator = async ({ mesRefGenerator, campain }) => {
  let count = 0;

  try {
    const { data, error } = await supabase
      .from("donor_mensal")
      .select("*")
      .eq("donor_mensal_day", Number(DataSelect(mesRefGenerator, "day")));

    const status = await insertMonthHistory(mesRefGenerator);

    if (error) throw error;
    if (data?.length) {

      //Verifica se esse doador já tem ficha naquele mês
      data.map(async (item) => {
        const donation = await getDonation(item.donor_id);
        
        // Verifica se já existe uma doação para o mês de referência
        const donationExistsForMonth = donation?.some(
          (d) => d.donation_monthref === mesRefGenerator
        );

        // Só cria a doação se NÃO existir uma para aquele mês
        if (!donationExistsForMonth) {
          console.log(`Criando doação para o doador ${item.donor_id} - mês ${mesRefGenerator}`);
          
          const response = await insertDonation(
            item.donor_id,
            521,
            item.donor_mensal_monthly_fee,
            null,
            DataNow("noformated"),
            mesRefGenerator,
            false,
            false,
            `Criado Automaticamente ${DataNow()}`,
            mesRefGenerator,
            campain,
            22,
            status.monthly_fee_history_id
          );
          count += 1;
        } else {
          console.log(`Doação já existe para o doador ${item.donor_id} no mês ${mesRefGenerator} - pulando`);
        }
      });
    }

    if (status) {
      return count;
    }

    console.log("Tudo completado com sucesso! ");
  } catch (err) {
    console.log(err);
  }
};
