import React, { useEffect, useState } from "react";
import styles from "./tableconfirmation.module.css";
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

      if (sortConfig.key === 'day') {
        aValue = a.donor_mensal_day || 0;
        bValue = b.donor_mensal_day || 0;
      }

      if (sortConfig.key === 'value') {
        aValue = parseFloat(a.donation_value || 0);
        bValue = parseFloat(b.donation_value || 0);
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
    <div className={styles.tableConfirmationContainer}>
      <div className={styles.tableConfirmationContent}>
        {dataToShow.length > 0 ? (
          <div className={styles.tableConfirmationWrapper}>
            <div className={styles.tableConfirmationHeader}>
              <div className={styles.tableConfirmationStats}>
                <span className={styles.statsItem}>
                  <strong>{dataToShow.length}</strong> {dataToShow.length === 1 ? 'confirmação' : 'confirmações'} pendente{dataToShow.length === 1 ? '' : 's'}
                </span>
                <span className={styles.statsItem}>
                  Total: <strong>
                    {dataToShow.reduce((acc, item) => acc + (parseFloat(item.donation_value) || 0), 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </span>
              </div>
            </div>

            <div className={styles.tableConfirmationScroll}>
              <table className={styles.tableConfirmation}>
                <thead>
                  <tr className={styles.tableConfirmationHeadRow}>
                    <th
                      className={`${styles.tableConfirmationHead} ${styles.sortable}`}
                      onClick={() => handleSort('date')}
                      style={{ cursor: 'pointer' }}
                    >
                      Data
                      <span className={styles.sortArrow}>
                        {sortConfig.key === 'date' ? (
                          sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                        ) : ' ↕'}
                      </span>
                    </th>
                    <th
                      className={`${styles.tableConfirmationHead} ${styles.sortable}`}
                      onClick={() => handleSort('day')}
                      style={{ cursor: 'pointer' }}
                    >
                      Dia
                      <span className={styles.sortArrow}>
                        {sortConfig.key === 'day' ? (
                          sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                        ) : ' ↕'}
                      </span>
                    </th>
                    <th className={styles.tableConfirmationHead}>Nome</th>
                    <th
                      className={`${styles.tableConfirmationHead} ${styles.sortable}`}
                      onClick={() => handleSort('value')}
                      style={{ cursor: 'pointer' }}
                    >
                      Valor
                      <span className={styles.sortArrow}>
                        {sortConfig.key === 'value' ? (
                          sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                        ) : ' ↕'}
                      </span>
                    </th>
                    <th className={styles.tableConfirmationHead}>Motivo</th>
                    <th className={styles.tableConfirmationHead}>Status</th>
                    <th className={styles.tableConfirmationHead}>Agendado</th>
                  </tr>
                </thead>
                <tbody>
                  {dataToShow.map((donation) => (
                    <tr
                      className={styles.tableConfirmationRow}
                      key={donation.receipt_donation_id}
                      onClick={() => handleClick(donation)}
                    >
                      <td className={styles.tableConfirmationCell}>
                        <span className={styles.dateInfo}>
                          {DataSelect(donation.donation_day_to_receive)}
                        </span>
                      </td>
                      <td className={styles.tableConfirmationCell}>
                        <span className={styles.dayInfo}>
                          {donation.donor_mensal_day ? `Dia ${donation.donor_mensal_day}` : '-'}
                        </span>
                      </td>
                      <td className={styles.tableConfirmationCell}>
                        <span className={styles.donorName}>
                          {donation.donor_name}
                        </span>
                      </td>
                      <td className={styles.tableConfirmationCell}>
                        <span className={styles.valueAmount}>
                          {parseFloat(donation.donation_value || 0).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </td>
                      <td className={styles.tableConfirmationCell}>
                        <span className={styles.reasonText}>
                          {donation.donor_confirmation_reason}
                        </span>
                      </td>
                      <td className={styles.tableConfirmationCell}>
                        <span className={`${styles.statusBadge} ${donation.confirmation_status === 'Agendado' ? styles.statusScheduled : donation.confirmation_status === 'Não Atendeu' ? styles.statusNotAttended : styles.statusNone}`}>
                          {donation.confirmation_status || '-'}
                        </span>
                      </td>
                      <td className={styles.tableConfirmationCell}>
                        <span className={styles.scheduleDate}>
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
          <div className={styles.tableConfirmationEmpty}>
            <div className={styles.emptyIcon}>✅</div>
            <h4>Nenhuma confirmação pendente</h4>
            <p>Não há fichas a serem confirmadas no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableConfirmation;
