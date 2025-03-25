import supabase from "./superBaseClient";

export const receiveDonation = async (
  date,
  setMessage,
  collector,
  setTypeAlert,
  search,
  setTableReceipt
) => {
  if (date !== "" && collector !== "") {
    //Busca do Nome do Doador
    try {
      const { data, error } = await supabase
        .from("donation")
        .select(
          `     donation_value,
                donation_received,
                donor:donor_id (donor_name)`
        )
        .eq("receipt_donation_id", search);

      if (error) throw error;

      if (data.length > 0) {
        const { donation_value, donor, donation_received } = data[0];
        const name = donor?.donor_name;
        const value = donation_value;
        const received = donation_received;

        if (received === "Não") {
          const { error: updateError } = await supabase
            .from("donation")
            .update({
              donation_received: "Sim",
              donation_day_received: date,
              collector_code_id: collector,
            })
            .eq("receipt_donation_id", search);

          if (updateError) throw updateError;

          const newItem = { search, name, value };
          setTableReceipt((prev) => [...prev, newItem]);
          setMessage("Doações recebidas com sucesso!");
          setTypeAlert("green");
        } else {
          setMessage("Doação já recebida")
          setTypeAlert("#940000");
        }
      } else {
        setMessage("Recibo não localizado");
        setTypeAlert("#940000");
      }
    } catch (error) {
      console.error("Erro: ", error.message);
    }
  } else {
    setMessage(
      "Os campos coletador, data e recibo, precisam ser preenchidos corretamente."
    );
    setTypeAlert("#F25205");
  }

  setTimeout(() => {
    setMessage("");
  }, 2000);
};
