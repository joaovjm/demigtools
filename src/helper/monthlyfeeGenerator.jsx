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
      count = data.length;
      data.map(async (item) => {
        const donation = await getDonation(item.donor_id);
        if (
          donation.length > 0 &&
          donation[0].collector_code_id !== undefined
        ) {
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
