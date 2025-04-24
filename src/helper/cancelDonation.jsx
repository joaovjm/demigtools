import supabase from "./superBaseClient";

const cancelDonation = async ({ donation }) => {
  try {
    const { data, error } = await supabase
      .from("donation_canceled")
      .insert(donation);

    if (error) throw error;

    if (!error) {
      const { data: donationData, error: donationError } = await supabase
        .from("donation")
        .delete()
        .eq("receipt_donation_id", donation.receipt_donation_id);
      if (donationError) throw donationError;
    }

    return "OK"
  } catch (donationError) {
    console.error("Erroao cancelar doação:", donationError);
  }
};

export default cancelDonation;
