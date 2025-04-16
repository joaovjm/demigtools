import supabase from "./superBaseClient";

const getDonationReceived = ( setQReceived, setValueReceived) => {
  let totalValue = 0;
  let cont = 0;
  const getValueDonation = async () => {
    const { data: operatorValue } = await supabase
      .from("donation")
      .select("donation_value")
      .eq("donation_received", "Sim");

    setQReceived(operatorValue.length);

    for (let i = 0; i < operatorValue.length; i++) {
      cont = i;
      let value = operatorValue[i].donation_value;
      totalValue = totalValue + value;
    }

    setValueReceived(totalValue);
  };
  getValueDonation();
};

export default getDonationReceived;