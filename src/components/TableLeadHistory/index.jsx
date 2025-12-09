import { useState, useMemo } from "react";
import styles from "./tableleadhistory.module.css";
import ModalOperatorActivity from "../ModalOperatorActivity";
import { ACTIVITY_TYPES } from "../../services/operatorActivityService";

const TableLeadHistory = ({
  operatorActivities = { grouped: {} },
  dateFilter = {},
}) => {
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Usa dados exclusivamente da tabela operator_activity
  const combinedData = useMemo(() => {
    return Object.entries(operatorActivities.grouped || {}).map(([name, data]) => ({
      operatorName: name,
      operatorId: data.operatorId,
      leadsNA: data.counts?.[ACTIVITY_TYPES.NOT_ANSWERED] || 0,
      leadsNP: data.counts?.[ACTIVITY_TYPES.CANNOT_HELP] || 0,
      scheduled: data.counts?.[ACTIVITY_TYPES.SCHEDULED] || 0,
      newDonation: data.counts?.[ACTIVITY_TYPES.NEW_DONATION] || 0,
      worklistClicks: data.counts?.[ACTIVITY_TYPES.WORKLIST_CLICK] || 0,
      whatsapp: data.counts?.[ACTIVITY_TYPES.WHATSAPP] || 0,
      totalActivities: data.total || 0,
      counts: data.counts || {},
    }));
  }, [operatorActivities]);

  // Ordenação
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return combinedData;

    return [...combinedData].sort((a, b) => {
      const aValue = a[sortConfig.key] || 0;
      const bValue = b[sortConfig.key] || 0;

      if (sortConfig.direction === "asc") {
        return aValue - bValue;
      }
      return bValue - aValue;
    });
  }, [combinedData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleRowClick = (operatorData) => {
    setSelectedOperator({
      operatorId: operatorData.operatorId,
      operatorName: operatorData.operatorName,
      counts: operatorData.counts,
    });
    setIsModalOpen(true);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  // Calcula totais
  const totals = useMemo(() => {
    return sortedData.reduce(
      (acc, item) => ({
        leadsNA: acc.leadsNA + (item.leadsNA || 0),
        leadsNP: acc.leadsNP + (item.leadsNP || 0),
        scheduled: acc.scheduled + (item.scheduled || 0),
        newDonation: acc.newDonation + (item.newDonation || 0),
        worklistClicks: acc.worklistClicks + (item.worklistClicks || 0),
        whatsapp: acc.whatsapp + (item.whatsapp || 0),
        totalActivities: acc.totalActivities + (item.totalActivities || 0),
      }),
      {
        leadsNA: 0,
        leadsNP: 0,
        scheduled: 0,
        newDonation: 0,
        worklistClicks: 0,
        whatsapp: 0,
        totalActivities: 0,
      }
    );
  }, [sortedData]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.icon}>📊</span>
          Histórico de Atividades das Operadoras
        </h3>
        <p className={styles.subtitle}>
          Clique em uma linha para ver o histórico detalhado
        </p>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.th}>Operador</th>
              <th
                className={`${styles.th} ${styles.sortable}`}
                onClick={() => handleSort("worklistClicks")}
              >
                <span className={styles.thContent}>
                  <span className={styles.thIcon}>📋</span>
                  Acessos
                  <span className={styles.sortArrow}>
                    {getSortIndicator("worklistClicks")}
                  </span>
                </span>
              </th>
              <th
                className={`${styles.th} ${styles.sortable}`}
                onClick={() => handleSort("leadsNA")}
              >
                <span className={styles.thContent}>
                  <span className={styles.thIcon}>📵</span>
                  Não Atendeu
                  <span className={styles.sortArrow}>
                    {getSortIndicator("leadsNA")}
                  </span>
                </span>
              </th>
              <th
                className={`${styles.th} ${styles.sortable}`}
                onClick={() => handleSort("leadsNP")}
              >
                <span className={styles.thContent}>
                  <span className={styles.thIcon}>❌</span>
                  Não Pode
                  <span className={styles.sortArrow}>
                    {getSortIndicator("leadsNP")}
                  </span>
                </span>
              </th>
              <th
                className={`${styles.th} ${styles.sortable}`}
                onClick={() => handleSort("scheduled")}
              >
                <span className={styles.thContent}>
                  <span className={styles.thIcon}>📅</span>
                  Agendado
                  <span className={styles.sortArrow}>
                    {getSortIndicator("scheduled")}
                  </span>
                </span>
              </th>
              <th
                className={`${styles.th} ${styles.sortable}`}
                onClick={() => handleSort("whatsapp")}
              >
                <span className={styles.thContent}>
                  <span className={styles.thIcon}>💬</span>
                  Whatsapp
                  <span className={styles.sortArrow}>
                    {getSortIndicator("whatsapp")}
                  </span>
                </span>
              </th>
              <th
                className={`${styles.th} ${styles.sortable}`}
                onClick={() => handleSort("newDonation")}
              >
                <span className={styles.thContent}>
                  <span className={styles.thIcon}>💰</span>
                  Doações
                  <span className={styles.sortArrow}>
                    {getSortIndicator("newDonation")}
                  </span>
                </span>
              </th>
              <th
                className={`${styles.th} ${styles.sortable}`}
                onClick={() => handleSort("totalActivities")}
              >
                <span className={styles.thContent}>
                  <span className={styles.thIcon}>📊</span>
                  Total
                  <span className={styles.sortArrow}>
                    {getSortIndicator("totalActivities")}
                  </span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.emptyRow}>
                  <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>📭</span>
                    <p>Nenhuma atividade registrada</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((item) => (
                <tr
                  key={item.operatorName}
                  className={styles.tr}
                  onClick={() => handleRowClick(item)}
                >
                  <td className={styles.td}>
                    <span className={styles.operatorName}>
                      {item.operatorName}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.neutral}`}>
                      {item.worklistClicks}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.warning}`}>
                      {item.leadsNA}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.danger}`}>
                      {item.leadsNP}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.info}`}>
                      {item.scheduled}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.whatsapp}`}>
                      {item.whatsapp}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.success}`}>
                      {item.newDonation}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.total}`}>
                      {item.totalActivities}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {sortedData.length > 0 && (
            <tfoot className={styles.tableFoot}>
              <tr className={styles.totalRow}>
                <td className={styles.td}>
                  <strong>Total</strong>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles.neutral}`}>
                    {totals.worklistClicks}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles.warning}`}>
                    {totals.leadsNA}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles.danger}`}>
                    {totals.leadsNP}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles.info}`}>
                    {totals.scheduled}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles.whatsapp}`}>
                    {totals.whatsapp}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles.success}`}>
                    {totals.newDonation}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles.total}`}>
                    {totals.totalActivities}
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {isModalOpen && selectedOperator && (
        <ModalOperatorActivity
          operator={selectedOperator}
          dateFilter={dateFilter}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOperator(null);
          }}
        />
      )}
    </div>
  );
};

export default TableLeadHistory;
