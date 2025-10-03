import supabase from "./superBaseClient";

const getPackage = async ({ type, startDate, endDate }) => {
  let createPackage = [];
  try {
    const { data, error } = await supabase
      .from("donation")
      .select(
        "donor_id, donor: donor_id!inner(donor_name, donor_type, donor_tel_1), donation_value, donation_day_received, receipt_donation_id, operator_code_id, operator: operator_code_id!inner(operator_name)"
      )
      .eq("donor.donor_type", type)
      .eq("donation_received", "Sim")
      .gte("donation_day_received", startDate)
      .lte("donation_day_received", endDate)
      .order("donation_value", { ascending: false });

    if (error) console.log(error.message);

    if (data?.length > 0) {
      const newPackage = data.map((item) => {
        return {
          donor_id: item?.donor_id,
          donor_name: item?.donor?.donor_name,
          operator_name: item?.operator?.operator_name,
          donor_tel_1: item?.donor?.donor_tel_1,
          donation_value: item.donation_value,
          donation_day_received: item?.donation_day_received,
          receipt_donation_id: item?.receipt_donation_id,
          operator_code_id: item?.operator_code_id,
          donor_type: item?.donor?.donor_type,
        };
      });
      const count = newPackage.reduce((acc, curr) => {
        acc[curr.donor_id] = (acc[curr.donor_id] || 0) + 1;
        return acc;
      }, {});

      const duplicate = Object.keys(count).filter((f) => count[f] > 1);


      const filteredDp = duplicate.map((dp) => {
        const group = newPackage.filter((item) => item.donor_id === Number(dp));
        const selected = group.reduce((bigger, now) =>
          now.donation_value > bigger.donation_value ? now : bigger
        );

        return selected;
      });

      const unit = newPackage.filter(
        (dt) => !duplicate.includes(String(dt.donor_id))
      );

      const filteredPackage = [...unit, ...filteredDp];

      const { data: compareData, error: errorData } = await supabase
        .from("donation")
        .select()
        .gt("donation_day_received", endDate);
      if (errorData) console.log(errorData.message);

      if (compareData?.length > 0) {
        filteredPackage.forEach((id) => {
          if (!compareData.some((cp) => cp.donor_id === id.donor_id)) {
            createPackage.push(id);
          }
        });
      } else {
        createPackage.push(...filteredPackage);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
  console.log(createPackage)
  return createPackage;
};

export default getPackage;
