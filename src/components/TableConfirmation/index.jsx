import React, { useEffect } from "react";
import "./index.css";

const TableConfirmation = ({
  donationConfirmation,
  setModalOpen,
  setDonationConfirmationOpen,
}) => {
  

  const handleClick = (donation) => {

    setDonationConfirmationOpen({
      id: donation.receipt_donation_id,
      donor_id: donation.donor_id,
      name: donation.donor_name,
      value: donation.donation_value,
      reason: donation.donor_confirmation_reason,
      address: donation.donor_address,
      phone: donation.donor_tel_1,
      phone2: donation.donor_tel_2,
      phone3: donation.donor_tel_3,
      extra: donation.donation_extra,
      day_contact: donation.donation_day_contact,
      day_to_receive: donation.donation_day_to_receive,
      print: donation.donation_print,
      monthref: donation.donation_monthref,
      description: donation.donation_description,
      operator_code_id: donation.operator_code_id,
      collector_code_id: donation.collector_code_id,
      donation_received: donation.donation_received,
    });
    setModalOpen(true);
  };


  return (
    <>
      {donationConfirmation.length !== 0 ? (
        <table className="table-confirmation">
          <thead className="table-head-confirmation">
            <tr>
              <th className="table-head-confirmation-text">Data</th>
              <th className="table-head-confirmation-text">Nome</th>
              <th className="table-head-confirmation-text">Valor</th>
              <th className="table-head-confirmation-text">Motivo</th>
            </tr>
          </thead>
          <tbody className="table-body-confirmation">
            {donationConfirmation.map((donation) => (
              <tr
                className="table-body-confirmation-tr"
                key={donation.receipt_donation_id}
                onClick={() => handleClick(donation)}
              >
                <td className="table-body-confirmation-text">
                  {donation.donation_day_to_receive}
                </td>
                <td className="table-body-confirmation-text">
                  {donation.donor_name}
                </td>
                <td className="table-body-confirmation-text">
                  {donation.donation_value}
                </td>
                <td className="table-body-confirmation-text">
                  {donation.donor_confirmation_reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        "Não há fichas a serem confirmadads"
      )}
    </>
  );
};

export default TableConfirmation;
