import React from "react";

const TableInOpen = ({ fullNotReceivedDonations }) => {
  return (
    <table className="table-confirmation">
      <thead className="table-head-confirmation">
        <tr>
          <th className="table-head-confirmation-text">Recibo</th>
          <th className="table-head-confirmation-text">Nome</th>
          <th className="table-head-confirmation-text">Valor</th>
          <th className="table-head-confirmation-text">Coletador</th>
        </tr>
      </thead>
      <tbody className="table-body-confirmation">
        {fullNotReceivedDonations.map((donation) => (
          <tr
            className="table-body-confirmation-tr"
            key={donation.receipt_donation_id}
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
              {donation.collector_code_id ? donation.collector_code_id : "-"} -{" "}
              {donation.collector_name ? donation.collector_name : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableInOpen;
