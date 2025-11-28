import React, { useState, useRef, useEffect } from "react";
import supabase from "../../helper/superBaseClient";
import styles from "./monthhistory.module.css";

const MonthHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [allDonors, setAllDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [statusFilter, setStatusFilter] = useState(null); // null = todos, 'aberto', 'recebida', 'nao_gerado'
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const statusPopupRef = useRef(null);

  const fetchMonthHistory = async () => {
    if (!selectedMonth) {
      alert("Por favor, selecione um mês");
      return;
    }

    setLoading(true);
    try {
      // Buscar todos os doadores mensais com suas informações do donor
      const { data: mensalData, error: mensalError } = await supabase
        .from("donor_mensal")
        .select(`
          donor_id,
          donor_mensal_day,
          donor_mensal_monthly_fee,
          donor:donor_id (
            donor_name,
            donor_tel_1
          )
        `);

      if (mensalError) throw mensalError;

      // Buscar todas as doações do mês de referência
      // Criar datas para o primeiro dia do mês selecionado e o primeiro dia do próximo mês
      const startDate = `${selectedMonth}-01`;
      const [year, month] = selectedMonth.split('-');
      const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : year;
      const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

      const { data: donationsData, error: donationsError } = await supabase
        .from("donation")
        .select(`
          donor_id,
          donation_print,
          donation_received,
          donation_value,
          donation_monthref
        `)
        .gte("donation_monthref", startDate)
        .lt("donation_monthref", endDate);

      if (donationsError) throw donationsError;

      // Criar um mapa de doações por donor_id
      const donationsMap = {};
      donationsData?.forEach((donation) => {
        if (!donationsMap[donation.donor_id]) {
          donationsMap[donation.donor_id] = [];
        }
        donationsMap[donation.donor_id].push(donation);
      });

      // Criar lista unificada de doadores com informações de status
      const donorsList = [];

      mensalData?.forEach((mensal) => {
        const donations = donationsMap[mensal.donor_id] || [];
        
        // Verificar se há alguma doação impressa para este doador no mês
        const hasPrintedDonation = donations.some(
          (d) => d.donation_print === true || d.donation_print === "Sim"
        );

        // Verificar se há alguma doação recebida para este doador no mês
        const hasReceivedDonation = donations.some(
          (d) => d.donation_received === true || d.donation_received === "Sim"
        );

        const donorInfo = {
          donor_id: mensal.donor_id,
          donor_name: mensal.donor?.donor_name || "N/A",
          donor_tel_1: mensal.donor?.donor_tel_1 || "N/A",
          donor_mensal_day: mensal.donor_mensal_day || "N/A",
          donor_mensal_monthly_fee: mensal.donor_mensal_monthly_fee || 0,
          donations: donations,
          total_value: donations.reduce((sum, d) => sum + (d.donation_value || 0), 0),
          movements_count: donations.length,
          isPrinted: hasPrintedDonation,
          isReceived: hasReceivedDonation,
        };

        donorsList.push(donorInfo);
      });

      setAllDonors(donorsList);
    } catch (error) {
      console.error("Erro ao buscar histórico do mês:", error.message);
      alert("Erro ao buscar dados. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (donors) => {
    return donors.reduce((sum, donor) => sum + donor.total_value, 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Fechar popup ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusPopupRef.current && !statusPopupRef.current.contains(event.target)) {
        setShowStatusPopup(false);
      }
    };

    if (showStatusPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusPopup]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setShowStatusPopup(false);
  };

  const getStatusLabel = (donor) => {
    if (donor.movements_count === 0) {
      return 'nao_gerado';
    }
    return donor.isReceived ? 'recebida' : 'aberto';
  };

  const getFilteredAndSortedData = () => {
    let filtered = allDonors;

    // Aplicar filtro de status
    if (statusFilter) {
      filtered = filtered.filter((donor) => {
        const donorStatus = getStatusLabel(donor);
        return donorStatus === statusFilter;
      });
    }

    // Aplicar ordenação
    if (!sortConfig.key) {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.key === 'day') {
        aValue = a.donor_mensal_day || 0;
        bValue = b.donor_mensal_day || 0;
      }

      if (sortConfig.key === 'name') {
        aValue = (a.donor_name || '').toLowerCase();
        bValue = (b.donor_name || '').toLowerCase();
      }

      if (sortConfig.key === 'phone') {
        aValue = (a.donor_tel_1 || '').toLowerCase();
        bValue = (b.donor_tel_1 || '').toLowerCase();
      }

      if (sortConfig.key === 'monthly_fee') {
        aValue = parseFloat(a.donor_mensal_monthly_fee || 0);
        bValue = parseFloat(b.donor_mensal_monthly_fee || 0);
      }

      if (sortConfig.key === 'movements') {
        aValue = a.movements_count || 0;
        bValue = b.movements_count || 0;
      }

      if (sortConfig.key === 'value') {
        aValue = parseFloat(a.total_value || 0);
        bValue = parseFloat(b.total_value || 0);
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
    <div className={styles.monthHistory}>
      <div className={styles.monthHistoryHeader}>
        <div className={styles.inputGroup}>
          <label htmlFor="month">Mês</label>
          <input
            type="month"
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
        <div className={styles.button}>
          <button onClick={fetchMonthHistory} disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>

      <div className={styles.monthHistoryContent}>
        {/* Tabela Unificada */}
        <div className={styles.tableSection}>
          <h2 className={styles.tableTitle}>
            Doadores ({dataToShow.length})
          </h2>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th
                    className={styles.sortable}
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
                  <th
                    className={styles.sortable}
                    onClick={() => handleSort('name')}
                    style={{ cursor: 'pointer' }}
                  >
                    Doador
                    <span className={styles.sortArrow}>
                      {sortConfig.key === 'name' ? (
                        sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                      ) : ' ↕'}
                    </span>
                  </th>
                  <th
                    className={styles.sortable}
                    onClick={() => handleSort('phone')}
                    style={{ cursor: 'pointer' }}
                  >
                    Telefone
                    <span className={styles.sortArrow}>
                      {sortConfig.key === 'phone' ? (
                        sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                      ) : ' ↕'}
                    </span>
                  </th>
                  <th
                    className={styles.sortable}
                    onClick={() => handleSort('monthly_fee')}
                    style={{ cursor: 'pointer' }}
                  >
                    Mensalidade
                    <span className={styles.sortArrow}>
                      {sortConfig.key === 'monthly_fee' ? (
                        sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                      ) : ' ↕'}
                    </span>
                  </th>
                  <th
                    className={styles.sortable}
                    onClick={() => handleSort('movements')}
                    style={{ cursor: 'pointer' }}
                  >
                    Movimentos
                    <span className={styles.sortArrow}>
                      {sortConfig.key === 'movements' ? (
                        sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                      ) : ' ↕'}
                    </span>
                  </th>
                  <th
                    className={styles.sortable}
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
                  <th 
                    className={styles.statusHeader}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStatusPopup(!showStatusPopup);
                    }}
                    style={{ cursor: 'pointer', position: 'relative' }}
                  >
                    Status
                    {statusFilter && (
                      <span className={styles.filterIndicator}>●</span>
                    )}
                    {showStatusPopup && (
                      <div 
                        ref={statusPopupRef}
                        className={styles.statusPopup}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div 
                          className={`${styles.popupOption} ${statusFilter === null ? styles.popupOptionActive : ''}`}
                          onClick={() => handleStatusFilter(null)}
                        >
                          Todos
                        </div>
                        <div 
                          className={`${styles.popupOption} ${statusFilter === 'aberto' ? styles.popupOptionActive : ''}`}
                          onClick={() => handleStatusFilter('aberto')}
                        >
                          Aberto
                        </div>
                        <div 
                          className={`${styles.popupOption} ${statusFilter === 'recebida' ? styles.popupOptionActive : ''}`}
                          onClick={() => handleStatusFilter('recebida')}
                        >
                          Recebida
                        </div>
                        <div 
                          className={`${styles.popupOption} ${statusFilter === 'nao_gerado' ? styles.popupOptionActive : ''}`}
                          onClick={() => handleStatusFilter('nao_gerado')}
                        >
                          Não gerado
                        </div>
                      </div>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataToShow.length > 0 ? (
                  dataToShow.map((donor) => (
                    <tr key={donor.donor_id}>
                      <td>{donor.donor_mensal_day}</td>
                      <td>{donor.donor_name}</td>
                      <td>{donor.donor_tel_1}</td>
                      <td>{formatCurrency(donor.donor_mensal_monthly_fee)}</td>
                      <td>{donor.movements_count}</td>
                      <td>{formatCurrency(donor.total_value)}</td>
                      <td>
                        {donor.movements_count === 0 ? (
                          <span className={`${styles.statusBadge} ${styles.statusNotGenerated}`}>
                            ○ Não gerado
                          </span>
                        ) : (
                          <span className={`${styles.statusBadge} ${donor.isReceived ? styles.statusSuccess : styles.statusPending}`}>
                            {donor.isReceived ? "✓ Recebida" : "○ Aberto"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      {loading
                        ? "Carregando..."
                        : "Nenhum doador encontrado"}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="6" style={{ textAlign: "right", fontWeight: "bold" }}>
                    Total:
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {formatCurrency(calculateTotal(dataToShow))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthHistory;
