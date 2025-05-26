import React from "react";
import supabase from "./superBaseClient";

const getCollectorPerReceived = async () => {
  try {
    const { data, error } = await supabase
      .from("donation")
      .select(
        "collector_code_id, collector_name: collector_code_id(collector_name), donation_received, donation_value"
      );
    if (error) throw error;

    return data;
  } catch (error) {
    console.log("Erro: ", error.message);
  }
};

export default getCollectorPerReceived;
