import supabase from "./superBaseClient";

const getDonationNotReceived = (
  setConfirmations,
  setValueConfirmations,
  setOpenDonations,
  setValueOpenDonations,
  setDonationConfirmation,
  setFullNotReceivedDonations
) => {
  let confirmations = 0;
  let valueConfirmations = 0;
  let valueOpenDonations = 0;
  let tempFullNotReceivedDonations = [];
  let tempDonationConfirmations = [];
  const getValueDonation = async () => {
    const { data: operatorValue } = await supabase
      .from("donation")
      .select(
        `receipt_donation_id, 
        donor(donor_name, donor_address, donor_tel_1, donor_tel_2(donor_tel_2), donor_tel_3(donor_tel_3)),
        donation_value, 
        collector_code_id, 
        donor_confirmation_reason(donor_confirmation_reason),
        collector: collector_code_id (collector_name)`
      )
      .eq("donation_received", "Não");
    
    for (let i = 0; i < operatorValue.length; i++) {
      if (operatorValue[i].collector_code_id === 10) {
        confirmations += 1;
        let value = operatorValue[i].donation_value;
        valueConfirmations += value;

        //Preenche o array com os doadores na confirmação
        tempDonationConfirmations.push({
          receipt_donation_id: operatorValue[i].receipt_donation_id,
          donor_name: operatorValue[i].donor.donor_name,
          donor_address: operatorValue[i].donor.donor_address,
          donor_tel_1: operatorValue[i].donor.donor_tel_1,
          donor_tel_2: operatorValue[i].donor.donor_tel_2.donor_tel_2,
          donor_tel_3: operatorValue[i].donor.donor_tel_3.donor_tel_3,
          donation_value: operatorValue[i].donation_value,
          collector_code_id: operatorValue[i].collector_code_id,
          donor_confirmation_reason: operatorValue[i].donor_confirmation_reason[0]?.donor_confirmation_reason,
        });
      }

      //Preenche o array com todos os doadores
      tempFullNotReceivedDonations.push({
        receipt_donation_id: operatorValue[i].receipt_donation_id,
        donor_name: operatorValue[i].donor.donor_name,
        donation_value: operatorValue[i].donation_value,
        collector_code_id: operatorValue[i].collector_code_id,
        donor_confirmation_reason: operatorValue[i].donor_confirmation_reason[0]?.donor_confirmation_reason,
        collector_name: operatorValue[i].collector?.collector_name,
      });

      let value = operatorValue[i].donation_value;
      valueOpenDonations += value;
    }
    

    setDonationConfirmation(tempDonationConfirmations);
    setFullNotReceivedDonations(tempFullNotReceivedDonations);
    setOpenDonations(operatorValue.length);
    setConfirmations(confirmations);
    setValueConfirmations(valueConfirmations);
    setValueOpenDonations(valueOpenDonations);
  };
  getValueDonation();
};

export default getDonationNotReceived;
