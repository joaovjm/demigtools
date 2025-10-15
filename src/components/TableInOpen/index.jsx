import React from "react";
import "./index.css";
import { DataSelect } from "../DataTime";

const TableInOpen = ({
  fullNotReceivedDonations,
  setDonationOpen,
  setModalOpen,
  donationFilterPerId
}) => {
  const handleClick = (donation) => {
    setDonationOpen(donation);
    setModalOpen(true);
  };

  const filterFullNotReceiverDonations = fullNotReceivedDonations.filter(
    (filter) => filter.operator_code_id === donationFilterPerId  );

  const dataToShow = donationFilterPerId ? filterFullNotReceiverDonations : fullNotReceivedDonations;

  return (
    <div className="table-inopen-container">
      <div className="table-inopen-content">
        <h3 className="table-inopen-title">📋 Fichas em Aberto</h3>
        {dataToShow.length > 0 ? (
          <div className="table-inopen-wrapper">
            <div className="table-inopen-header">
              <div className="table-inopen-stats">
                <span className="stats-item">
                  <strong>{dataToShow.length}</strong> {dataToShow.length === 1 ? 'ficha' : 'fichas'} em aberto
                </span>
                <span className="stats-item">
                  Total: <strong>
                    {dataToShow.reduce((acc, item) => acc + (parseFloat(item.donation_value) || 0), 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </span>
              </div>
            </div>

            <div className="table-inopen-scroll">
              <table className="table-inopen">
                <thead>
                  <tr className="table-inopen-head-row">
                    <th className="table-inopen-head">A receber</th>
                    <th className="table-inopen-head">Nome</th>
                    <th className="table-inopen-head">Valor</th>
                    <th className="table-inopen-head">Coletador</th>
                  </tr>
                </thead>
                <tbody>
                  {dataToShow.map((donation) => (
                    <tr
                      className="table-inopen-row"
                      key={donation.receipt_donation_id}
                      onClick={() => handleClick(donation)}
                    >
                      <td className="table-inopen-cell">
                        <span className="date-info">
                          {DataSelect(donation.donation_day_to_receive)}
                        </span>
                      </td>
                      <td className="table-inopen-cell">
                        <span className="donor-name">
                          {donation.donor_name}
                        </span>
                      </td>
                      <td className="table-inopen-cell">
                        <span className="value-amount">
                          {parseFloat(donation.donation_value || 0).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </td>
                      <td className="table-inopen-cell">
                        <div className="collector-info">
                          <span className="collector-id">{donation.collector_code_id || "—"}</span>
                          {donation.collector_name && (
                            <span className="collector-name">{donation.collector_name}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="table-inopen-empty">
            <div className="empty-icon">📋</div>
            <h4>Nenhuma ficha em aberto</h4>
            <p>Não há fichas pendentes para recebimento no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableInOpen;
