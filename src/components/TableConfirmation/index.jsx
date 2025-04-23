import React, { useState } from "react";
import "./index.css";
import ModalConfirmations from "../ModalConfirmations";

const TableConfirmation = ({ donationConfirmation, setModalOpen}) => {
  
  const handleClick = (e) => {
    console.log(e.target.parentElement.children[0].textContent);
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
              onClick={handleClick}
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
