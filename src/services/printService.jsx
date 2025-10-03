import supabase from "../helper/superBaseClient";

export async function getDonationsPrint(startDate, endDate) {
  let newCollectorInDonation = [];
  try {
    //pega as doações que não foram impressas e não foram recebidas
    const { data: dateDonations, error } = await supabase
      .from("donation")
      .select(
        `donation_campain, donation_day_to_receive, donation_description, donation_value, donation_campain, receipt_donation_id,collector_code_id, collector: collector_code_id(collector_name), donor: donor_id(donor_id, donor_name, donor_address, donor_city, donor_neighborhood, donor_tel_1, donor_type, donor_observation: donor_observation_donor_id_fkey(donor_observation), donor_reference:donor_reference_donor_id_fkey(donor_reference)), operator_code_id, operator: operator_code_id(operator_name)`
      )
      .eq("donation_print", "Não")
      .eq("donation_received", "Não")
      .gte("donation_day_to_receive", startDate)
      .lte("donation_day_to_receive", endDate);

    if (error) {
      console.log(error.message);
    } else {
      newCollectorInDonation = dateDonations;
      const donor_id = dateDonations.map((item) => item?.donor?.donor_id);
      //Verificar se o doador já tem uma doação recebida e retorna
      if (donor_id.length > 0) {
        for (let id of donor_id) {
          const { data: donationData, error: donationDataError } = await supabase
            .from("donation")
            .select("donor_id, donation_received, collector: collector_code_id(collector_code_id, collector_name)")
            .eq("donor_id", id)
            .eq("donation_received", "Sim")
            .order("donation_day_received", { ascending: false })
            .limit(1);

            if (donationDataError) {
              console.log(donationDataError.message);
            } else {
              if (donationData?.length > 0) {
                newCollectorInDonation = newCollectorInDonation.map((item) =>
                  item.donor.donor_id === donationData[0].donor_id
                    ? {
                        ...item,
                        collector_code_id: donationData[0].collector.collector_code_id,
                        collector: { collector_name: donationData[0].collector.collector_name },
                      }
                    : item
                ); 
              }
            }
        }
      }

      //pega os coletores e adiciona no map
      const collectorsById = newCollectorInDonation.reduce((acc, item) => {
        const id = item?.collector_code_id;
        if (!acc.has(id)) {
          acc.set(id, {
            collector_code_id: id,
            collector_name: item?.collector?.collector_name,
          });
        }
        return acc;
      }, new Map());

      //converte o map para array
      const collectorsPrint = Array.from(collectorsById.values());

      return { newCollectorInDonation, collectorsPrint };
    }
  } catch (error) {
    console.log(error);
  }
}