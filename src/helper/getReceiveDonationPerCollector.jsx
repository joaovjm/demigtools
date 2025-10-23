import supabase from "./superBaseClient";

const getCollectorPerReceived = async (startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from("donation")
      .select(
        "collector_code_id, collector_name: collector_code_id(collector_name), donation_received, donation_value"
      )
      .gte("donation_day_to_receive", startDate)
      .lte("donation_day_to_receive", endDate)
      .not("collector_code_id", "is", null)
    if (error) throw error;

    return data;
  } catch (error) {
    console.log("Erro: ", error.message);
  }
};

export default getCollectorPerReceived;
