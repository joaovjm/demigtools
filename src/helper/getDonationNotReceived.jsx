import supabase from "./superBaseClient";

const getDonationNotReceived = (
  setConfirmations,
  setValueConfirmations,
  setOpenDonations,
  setValueOpenDonations,
  setDonationConfirmation,
  setFullNotReceivedDonations,
  operatorID,
  operatorType
) => {
  let confirmations = 0;
  let valueConfirmations = 0;
  let valueOpenDonations = 0;
  let openCount = 0;
  let tempFullNotReceivedDonations = [];
  let tempDonationConfirmations = [];
  const getValueDonation = async () => {
    const { data: operatorValue } = await supabase
      .from("donation")
      .select(
        `receipt_donation_id, 
        donor_id,
        donation_description,
        donor(donor_name, donor_address, donor_tel_1, donor_tel_2(donor_tel_2), donor_tel_3(donor_tel_3)),
        donation_value, 
        donation_extra,
        donation_day_contact,
        donation_day_to_receive,
        donation_print,
        donation_received,
        donation_monthref,
        operator_code_id,
        collector_code_id, 
        donor_confirmation_reason(donor_confirmation_reason),
        collector: collector_code_id (collector_name)`
      )
      .eq("donation_received", "Não");

    for (let i = 0; i < operatorValue.length; i++) {
      if (operatorValue[i].collector_code_id === 10) {
        if (operatorType === "Admin" && operatorID === operatorValue.operator_code_id) {
          confirmations += 1;
          let value = operatorValue[i].donation_value;
          valueConfirmations += value;

          //Preenche o array com os doadores na confirmação
          tempDonationConfirmations.push({
            receipt_donation_id: operatorValue[i].receipt_donation_id,
            donor_id: operatorValue[i].donor_id,
            donor_name: operatorValue[i].donor.donor_name,
            donor_address: operatorValue[i].donor.donor_address,
            donor_tel_1: operatorValue[i].donor.donor_tel_1,
            donor_tel_2: operatorValue[i].donor.donor_tel_2?.donor_tel_2,
            donor_tel_3: operatorValue[i].donor.donor_tel_3?.donor_tel_3,
            donation_extra: operatorValue[i].donation_extra,
            donation_day_contact: operatorValue[i].donation_day_contact,
            donation_day_to_receive: operatorValue[i].donation_day_to_receive,
            donation_print: operatorValue[i].donation_print,
            donation_monthref: operatorValue[i].donation_monthref,
            donation_description: operatorValue[i].donation_description,
            operator_code_id: operatorValue[i].operator_code_id,
            donation_received: operatorValue[i].donation_received,
            donation_value: operatorValue[i].donation_value,
            collector_code_id: operatorValue[i].collector_code_id,
            donor_confirmation_reason:
              operatorValue[i].donor_confirmation_reason
                ?.donor_confirmation_reason,
          });
        } else if (operatorType === "Operador" && operatorValue.operator_code_id){
          confirmations += 1;
          let value = operatorValue[i].donation_value;
          valueConfirmations += value;

          //Preenche o array com os doadores na confirmação
          tempDonationConfirmations.push({
            receipt_donation_id: operatorValue[i].receipt_donation_id,
            donor_id: operatorValue[i].donor_id,
            donor_name: operatorValue[i].donor.donor_name,
            donor_address: operatorValue[i].donor.donor_address,
            donor_tel_1: operatorValue[i].donor.donor_tel_1,
            donor_tel_2: operatorValue[i].donor.donor_tel_2?.donor_tel_2,
            donor_tel_3: operatorValue[i].donor.donor_tel_3?.donor_tel_3,
            donation_extra: operatorValue[i].donation_extra,
            donation_day_contact: operatorValue[i].donation_day_contact,
            donation_day_to_receive: operatorValue[i].donation_day_to_receive,
            donation_print: operatorValue[i].donation_print,
            donation_monthref: operatorValue[i].donation_monthref,
            donation_description: operatorValue[i].donation_description,
            operator_code_id: operatorValue[i].operator_code_id,
            donation_received: operatorValue[i].donation_received,
            donation_value: operatorValue[i].donation_value,
            collector_code_id: operatorValue[i].collector_code_id,
            donor_confirmation_reason:
              operatorValue[i].donor_confirmation_reason
                ?.donor_confirmation_reason,
          });
        }
      }

      //Preenche o array com todos os doadores
      if (operatorType === "Operador" && operatorID === operatorValue[i].operator_code_id) {
        tempFullNotReceivedDonations.push({
          receipt_donation_id: operatorValue[i].receipt_donation_id,
          donor_name: operatorValue[i].donor.donor_name,
          donation_value: operatorValue[i].donation_value,
          collector_code_id: operatorValue[i].collector_code_id,
          donor_confirmation_reason:
            operatorValue[i].donor_confirmation_reason?.donor_confirmation_reason,
          collector_name: operatorValue[i].collector?.collector_name,
        });
  
        let value = operatorValue[i].donation_value;
        valueOpenDonations += value;
        openCount += 1
        console.log("Caiu aqui")
        console.log(operatorValue)
      } else if (operatorType === "Admin" && operatorID === operatorValue[i].operator_code_id){
         tempFullNotReceivedDonations.push({
           receipt_donation_id: operatorValue[i].receipt_donation_id,
           donor_name: operatorValue[i].donor.donor_name,
           donation_value: operatorValue[i].donation_value,
           collector_code_id: operatorValue[i].collector_code_id,
           donor_confirmation_reason:
             operatorValue[i].donor_confirmation_reason?.donor_confirmation_reason,
           collector_name: operatorValue[i].collector?.collector_name,
         });
  
         let value = operatorValue[i].donation_value;
         valueOpenDonations += value;
         openCount += 1
         console.log("Caiu no segundo ")
         console.log(operatorValue)
         console.log(operatorID)
      }
      
    }

    setDonationConfirmation(tempDonationConfirmations);
    setFullNotReceivedDonations(tempFullNotReceivedDonations);
    setOpenDonations(openCount);
    setConfirmations(confirmations);
    setValueConfirmations(valueConfirmations);
    setValueOpenDonations(valueOpenDonations);
  };
  getValueDonation();
};

export default getDonationNotReceived;
