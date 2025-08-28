import supabase from "./superBaseClient";

export const getMaxAndMedDonations = async (id) => {
    let max = 0;
    let total = 0;
    let med = 0;
    let penultimate;
    let day;
  const { data, error } = await supabase
    .from("donation")
    .select("donation_value, donation_day_received")
    .eq("donor_id", id)
    .order("donation_day_received", {ascending: false})
    if(error){
        console.log(error.message)
    }
    console.log(data)
    if (data.length > 0){
        for(let i = 0; i < data.length; i++){
            if(data[i].donation_value > max){
                max = data[i]?.donation_value
                day = data[i]?.donation_day_received
                penultimate = [data[i+1]?.donation_value, data[i+1]?.donation_day_received]
            }
            total += data[i].donation_value;
        }
        med = total/data.length

        return {max, day, med, penultimate}
    }
};
