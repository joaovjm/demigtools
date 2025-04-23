import React from "react";
import "./index.css";

const TableConfirmation = ({ donationConfirmation, setModalOpen, setDonationOpen}) => {
  
  const handleClick = (donation) => {
    
    setDonationOpen({
      id: donation.receipt_donation_id, 
      name: donation.donor_name, 
      value: donation.donation_value, 
      reason: donation.donor_confirmation_reason, 
      address: donation.donor_address, 
      phone: donation.donor_tel_1,
      phone2: donation.donor_tel_2,
      phone3: donation.donor_tel_3,
    })
    setModalOpen(true);
  };
  return (
    <>
      <table className="table-confirmation">
        <thead className="table-head-confirmation">
          <tr>
            <th className="table-head-confirmation-text">Recibo</th>
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
                {donation.receipt_donation_id}
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
    </>
  );
};

export default TableConfirmation;
