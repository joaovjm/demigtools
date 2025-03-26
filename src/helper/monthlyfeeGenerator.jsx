import { DataNow } from "../assets/components/DataTime";
import { insertDonation } from "./insertDonation";
import { insertMonthHistory } from "./insertMonthHistory";
import supabase from "./superBaseClient";

export const monthlyfeeGenerator = async (dataSelected, mesref, day, month, year) => {

  let count = 0;
  try {
    const { data } = await supabase
      .from("donor")
      .select(
        `donor_id,
        donor_mensal (donor_mensal_day, donor_mensal_monthly_fee),
        donation (donation_monthref)`
      )
      .eq("donor_type", "Mensal");

      if (data) {
        data.map((item) => {
          if (item.donation?.[0]?.donation_monthref !== mesref && item.donor_mensal.donor_mensal_day === day) {
            insertDonation(
              item.donor_id,
              521,
              item.donor_mensal.donor_mensal_monthly_fee,
              null,
              `${DataNow().toLocaleString('pt-BR')}`, //data do contato
              `${item.donor_mensal.donor_mensal_day}/${month}/${year}`, //Data a receber
              false,
              false,
              `Auto Criado ${DataNow().toLocaleString('pt-BR')}`,
              `${month}/${year}` //Mês Referente
              
            );
            count = count + 1
            console.log("A inserção ocorreu normalmente")
          }
        });
      }

    const status = await insertMonthHistory(dataSelected)

    if(status){
      
      return count
      
    }

    console.log("Tudo completado com sucesso! ")
  } catch {
    console.log("Erro")
  }

};
