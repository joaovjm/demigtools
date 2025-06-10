import React from 'react'
import supabase from './superBaseClient';

const getPackage = async ({ type, startDate, endDate }) => {
  const { data, error } = await supabase
    .from("donation_with_donor_operator")
    .select(
      "donor_name, donor_type, donor_tel_1, donation_value, receipt_donation_id, operator_code_id, operator_name"
    )
    .eq("donor_type", type)
    .eq("donation_received", "Sim")
    .gte("donation_day_received", startDate)
    .lte("donation_day_received", endDate);

  if (error) console.log(error.message);
  if (data.length !== 0) return data;
}

export default getPackage;
