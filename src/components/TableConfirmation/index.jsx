import React, { useEffect, useState } from "react";
import "./index.css";
import { DataSelect } from "../DataTime";

const TableConfirmation = ({
  donationConfirmation,
  setModalOpen,
  setDonationConfirmationOpen,
  donationFilterPerId,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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
      confirmation_scheduled: donation.confirmation_scheduled,
      confirmation_status: donation.confirmation_status,
    });
    setModalOpen(true);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filterDonationConfirmation = donationConfirmation.filter(
    (dc) => dc.operator_code_id === donationFilterPerId
  );

  const getFilteredAndSortedData = () => {
    const filtered = donationFilterPerId ? filterDonationConfirmation : donationConfirmation;
    
    if (!sortConfig.key) {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.key === 'date') {
        aValue = new Date(a.donation_day_to_receive || 0).getTime();
        bValue = new Date(b.donation_day_to_receive || 0).getTime();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const dataToShow = getFilteredAndSortedData();

  return (
    <div className="table-confirmation-container">
      <div className="table-confirmation-content">
        {dataToShow.length > 0 ? (
          <div className="table-confirmation-wrapper">
            <div className="table-confirmation-header">
              <div className="table-confirmation-stats">
                <span className="stats-item">
                  <strong>{dataToShow.length}</strong> {dataToShow.length === 1 ? 'confirmação' : 'confirmações'} pendente{dataToShow.length === 1 ? '' : 's'}
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

            <div className="table-confirmation-scroll">
              <table className="table-confirmation">
                <thead>
                  <tr className="table-confirmation-head-row">
                    <th 
                      className="table-confirmation-head sortable"
                      onClick={() => handleSort('date')}
                      style={{ cursor: 'pointer' }}
                    >
                      Data
                      <span className="sort-arrow">
                        {sortConfig.key === 'date' ? (
                          sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                        ) : ' ↕'}
                      </span>
                    </th>
                    <th className="table-confirmation-head">Nome</th>
                    <th className="table-confirmation-head">Valor</th>
                    <th className="table-confirmation-head">Motivo</th>
                    <th className="table-confirmation-head">Status</th>
                    <th className="table-confirmation-head">Agendado</th>
                  </tr>
                </thead>
                <tbody>
                  {dataToShow.map((donation) => (
                    <tr
                      className="table-confirmation-row"
                      key={donation.receipt_donation_id}
                      onClick={() => handleClick(donation)}
                    >
                      <td className="table-confirmation-cell">
                        <span className="date-info">
                          {DataSelect(donation.donation_day_to_receive)}
                        </span>
                      </td>
                      <td className="table-confirmation-cell">
                        <span className="donor-name">
                          {donation.donor_name}
                        </span>
                      </td>
                      <td className="table-confirmation-cell">
                        <span className="value-amount">
                          {parseFloat(donation.donation_value || 0).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </td>
                      <td className="table-confirmation-cell">
                        <span className="reason-text">
                          {donation.donor_confirmation_reason}
                        </span>
                      </td>
                      <td className="table-confirmation-cell">
                        <span className={`status-badge ${donation.confirmation_status === 'Agendado' ? 'status-scheduled' : donation.confirmation_status === 'Não Atendeu' ? 'status-not-attended' : 'status-none'}`}>
                          {donation.confirmation_status || '-'}
                        </span>
                      </td>
                      <td className="table-confirmation-cell">
                        <span className="schedule-date">
                          {donation.confirmation_scheduled ? DataSelect(donation.confirmation_scheduled) : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="table-confirmation-empty">
            <div className="empty-icon">✅</div>
            <h4>Nenhuma confirmação pendente</h4>
            <p>Não há fichas a serem confirmadas no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableConfirmation;
