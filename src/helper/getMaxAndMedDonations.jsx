import supabase from "./superBaseClient";

export const getMaxAndMedDonations = async (id) => {
  let max = [];
  let total = 0;
  let penultimate = [];
  let history = [];
  const { data, error } = await supabase
    .from("donation")
    .select("donation_value, donation_day_received, donation_received")
    .eq("donor_id", id)
    .order("donation_day_received", { ascending: false });
  if (error) {
    console.log(error.message);
  }
 
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      if ((data[i]?.donation_value > max[0]?.value || max.length === 0) && data[i]?.donation_received === "Sim") {
        max = [{
          value: data[i]?.donation_value,
          day: data[i]?.donation_day_received,
        }];
      }  
      if (data[i]?.donation_received === "Sim" && penultimate.length === 0) {
        penultimate = [{
          value: data[i]?.donation_value,
          day: data[i]?.donation_day_received,
        }];
      }
      if (data[i]?.donation_received === "Sim") {
          history.push({
              value: data[i]?.donation_value,
              day: data[i]?.donation_day_received,
          });
      }
      total += data[i].donation_value;
    }
    console.log(max)

    return { max, penultimate };
  }
};
