import { DataNow } from "../components/DataTime";
import { insertDonation } from "./insertDonation";
import { insertMonthHistory } from "./insertMonthHistory";
import supabase from "./superBaseClient";

export const monthlyfeeGenerator = async (mesRefGenerator, mesref, day, month, year) => {

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
              `${DataNow("noformated")}`, //data do contato
              `${year}-${month}-${item.donor_mensal.donor_mensal_day}`, //Data a receber
              false,
              false,
              `Auto Criado ${DataNow("noformated")}`,
              `${year}-${month}` //Mês Referente
              
            );
            count = count + 1
            console.log("A inserção ocorreu normalmente")
          }
        });
      }

    const status = await insertMonthHistory(mesRefGenerator)

    if(status){
      
      return count
      
    }

    console.log("Tudo completado com sucesso! ")
  } catch {
    console.log("Erro")
  }

};
