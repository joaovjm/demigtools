import { DataNow, DataSelect } from "../components/DataTime";
import { insertDonation } from "./insertDonation";
import { insertMonthHistory } from "./insertMonthHistory";
import supabase from "./superBaseClient";

export const monthlyfeeGenerator = async ({ mesRefGenerator }) => {
  let count = 0;

  try {
    const { data, error } = await supabase.rpc(
      "donors_without_monthly_donation",
      {
        month_ref: mesRefGenerator,
        month_day: Number(DataSelect(mesRefGenerator, "day")),
      }
    );
    if (error) throw error;
    if (data?.length) {
      count = data.length;
      data.map(async (item) => {
        const response = await insertDonation(
          item.donor_id,
          521,
          item.donor_mensal_monthly_fee,
          null,
          DataNow("noformated"),
          `${DataSelect(mesRefGenerator, "year")}-${DataSelect(
            mesRefGenerator,
            "month"
          )}-${item.donor_mensal_day}`,
          false,
          false,
          `Auto Criado ${DataNow("noformated")}`,
          mesRefGenerator
        );
      });
    }
    const status = await insertMonthHistory(mesRefGenerator)

    if(status){
      return count
    }

    console.log("Tudo completado com sucesso! ");
  } catch (err) {
    console.log(err);
  }
};
