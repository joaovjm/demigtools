import React from "react";

const TableInOpen = ({ fullNotReceivedDonations }) => {
  const handleClick = (e) => {
    console.log(e.target.parentElement.children[0].textContent);
  };

  return (
    <>
      {fullNotReceivedDonations.length !== 0 ? (
        <table className="table-confirmation">
          <thead className="table-head-confirmation">
            <tr>
              <th className="table-head-confirmation-text">A receber</th>
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
                onClick={handleClick}
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
                  {donation.collector_code_id
                    ? donation.collector_code_id
                    : "-"}{" "}
                  - {donation.collector_name ? donation.collector_name : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        "Nenhuma ficha em aberto"
      )}
    </>
  );
};

export default TableInOpen;
