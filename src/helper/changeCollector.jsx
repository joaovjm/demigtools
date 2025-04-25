import supabase from "./superBaseClient";

let resolver;
let setReason = "";

export const changeCollector = async (
  collector_code_id,
  receipt_donation_id,
  dateFormat,
  setOpenReason,
) => {

  try {
    console.log("Verificando se a ficha está recebida...")
    const { data, error } = await supabase
      .from("donation")
      .select("donation_received")
      .eq("receipt_donation_id", receipt_donation_id);

    if (error) throw error;

    console.log("Concluido a verificação da ficha recebida...")
    if (data[0].donation_received === "Não") {
      if (collector_code_id === 10) {
        setOpenReason(true);
        console.log("Aguardando o motivo da mudança...");
        await new Promise((resolve) => {
          resolver = resolve;
        });

        setOpenReason(false);
        console.log("Concluido a espera do motivo da mudança...")

        console.log("Salvando o motivo da mudança...")
        const { data, error } = await supabase
          .from("donor_confirmation_reason")
          .upsert(
            {
              receipt_donation_id: receipt_donation_id,
              donor_confirmation_reason: setReason,
            }, {onConflict: "receipt_donation_id" }
          )
          .select();

          console.log("Concluido o salvamento do motivo da mudança...")
      }
        console.log("Salvando a mudança de coletor...")
      const { data, error } = await supabase
        .from("donation")
        .update([
          {
            collector_code_id: collector_code_id,
            donation_day_to_receive: dateFormat,
          },
        ])
        .eq("receipt_donation_id", receipt_donation_id)
        .select();

        console.log("Concluido o salvamento da mudança de coletor...")
      return "Ok";
    } else {
      return "Yes";
    }
  } catch (error) {
    return 0;
  }
};

export const handleReasonButtonPressed = (reason) => {
    if (reason !== "") {
        setReason = reason;
        resolver()
        resolver = null;
    } else (
        console.log("Reason not provided")
    )
}
