import supabase from "./superBaseClient";

const getDonationNotReceived = (setConfirmations, setValueConfirmations, setOpenDonations, setValueOpenDonations) => {
    let confirmations = 0;
    let valueConfirmations = 0;
    let valueOpenDonations = 0;
    const getValueDonation = async () => {
        const { data: operatorValue } = await supabase
          .from("donation")
          .select("donation_value, collector_code_id")
          .eq("donation_received", "Não");
    
        for (let i = 0; i < operatorValue.length; i++) {
            if( operatorValue[i].collector_code_id === 10 ){
                confirmations += 1
                let value = operatorValue[i].donation_value;
                valueConfirmations += value
            }
            let value = operatorValue[i].donation_value
            valueOpenDonations += value

        }
        setOpenDonations(operatorValue.length)
        setConfirmations(confirmations)
        setValueConfirmations(valueConfirmations)
        setValueOpenDonations(valueOpenDonations)
      };
      getValueDonation();
}

export default getDonationNotReceived;