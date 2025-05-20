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

  const fillDonationConfirmation = (item) => {
    tempDonationConfirmations.push({
      receipt_donation_id: item.receipt_donation_id,
      donor_id: item.donor_id,
      donor_name: item.donor.donor_name,
      donor_address: item.donor.donor_address,
      donor_tel_1: item.donor.donor_tel_1,
      donor_tel_2: item.donor.donor_tel_2?.donor_tel_2,
      donor_tel_3: item.donor.donor_tel_3?.donor_tel_3,
      donation_extra: item.donation_extra,
      donation_day_contact: item.donation_day_contact,
      donation_day_to_receive: item.donation_day_to_receive,
      donation_print: item.donation_print,
      donation_monthref: item.donation_monthref,
      donation_description: item.donation_description,
      operator_code_id: item.operator_code_id,
      donation_received: item.donation_received,
      donation_value: item.donation_value,
      collector_code_id: item.collector_code_id,
      donor_confirmation_reason: item.donor_confirmation_reason?.donor_confirmation_reason,
    });
  };

  const fillFullNotReceivedDonations = (item) => {
    tempFullNotReceivedDonations.push({
      receipt_donation_id: item.receipt_donation_id,
      donor_name: item.donor.donor_name,
      donation_value: item.donation_value,
      collector_code_id: item.collector_code_id,
      donor_confirmation_reason: item.donor_confirmation_reason?.donor_confirmation_reason,
      collector_name: item.collector?.collector_name,
      donation_day_to_receive: item.donation_day_to_receive,
    });
  };

  const getValueDonation = async () => {
    const { data: operatorValue } = await supabase
      .from("donation")
      .select(`receipt_donation_id, donor_id, donation_description, donor(donor_name, donor_address, donor_tel_1, donor_tel_2(donor_tel_2), donor_tel_3(donor_tel_3)), donation_value, donation_extra, donation_day_contact, donation_day_to_receive, donation_print, donation_received, donation_monthref, operator_code_id, collector_code_id, donor_confirmation_reason(donor_confirmation_reason), collector: collector_code_id (collector_name)`)
      .eq("donation_received", "Não");

    for (let i = 0; i < operatorValue.length; i++) {
      const item = operatorValue[i];
      // Confirmações
      if (item.collector_code_id === 10) {
        if (operatorType === "Admin") {
          confirmations += 1;
          valueConfirmations += item.donation_value;
          fillDonationConfirmation(item);
        } else if (operatorType === "Operador" && item.operator_code_id) {
          confirmations += 1;
          valueConfirmations += item.donation_value;
          fillDonationConfirmation(item);
        }
      }
      // Em aberto
      if (
        (operatorType === "Operador" && operatorID === item.operator_code_id) ||
        operatorType === "Admin"
      ) {
        fillFullNotReceivedDonations(item);
        valueOpenDonations += item.donation_value;
        openCount += 1;
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
