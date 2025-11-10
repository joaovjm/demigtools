import React, { useState } from "react";
import supabase from "../../helper/superBaseClient";
import styles from "./monthhistory.module.css";

const MonthHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [notPrintedDonors, setNotPrintedDonors] = useState([]);
  const [printedDonors, setPrintedDonors] = useState([]);
  const [loading, setLoading] = useState(false);

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

      console.log(mensalData)

      // Buscar todas as doações do mês de referência
      const { data: donationsData, error: donationsError } = await supabase
        .from("donation")
        .select(`
          donor_id,
          donation_print,
          donation_received,
          donation_value,
          donation_monthref
        `)
        .eq("donation_monthref", `${selectedMonth}-01`);

      if (donationsError) throw donationsError;

      // Criar um mapa de doações por donor_id
      const donationsMap = {};
      donationsData?.forEach((donation) => {
        if (!donationsMap[donation.donor_id]) {
          donationsMap[donation.donor_id] = [];
        }
        donationsMap[donation.donor_id].push(donation);
      });

      // Separar doadores em impressos e não impressos
      const notPrinted = [];
      const printed = [];

      mensalData?.forEach((mensal) => {
        const donations = donationsMap[mensal.donor_id] || [];
        
        // Verificar se há alguma doação impressa para este doador no mês
        const hasPrintedDonation = donations.some(
          (d) => d.donation_print === true || d.donation_print === "Sim"
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
        };

        if (hasPrintedDonation) {
          printed.push(donorInfo);
        } else {
          notPrinted.push(donorInfo);
        }
      });

      // Ordenar por dia
      notPrinted.sort((a, b) => a.donor_mensal_day - b.donor_mensal_day);
      printed.sort((a, b) => a.donor_mensal_day - b.donor_mensal_day);

      setNotPrintedDonors(notPrinted);
      setPrintedDonors(printed);
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

  console.log(selectedMonth)
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
        {/* Tabela de Não Impressos */}
        <div className={styles.tableSection}>
          <h2 className={styles.tableTitle}>
            Doadores Não Impressos ({notPrintedDonors.length})
          </h2>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>Dia</th>
                  <th>Doador</th>
                  <th>Telefone</th>
                  <th>Mensalidade</th>
                  <th>Movimentos</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {notPrintedDonors.length > 0 ? (
                  notPrintedDonors.map((donor) => (
                    <tr key={donor.donor_id}>
                      <td>{donor.donor_mensal_day}</td>
                      <td>{donor.donor_name}</td>
                      <td>{donor.donor_tel_1}</td>
                      <td>{formatCurrency(donor.donor_mensal_monthly_fee)}</td>
                      <td>{donor.movements_count}</td>
                      <td>{formatCurrency(donor.total_value)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      {loading
                        ? "Carregando..."
                        : "Nenhum doador não impresso encontrado"}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>
                    Total:
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {formatCurrency(calculateTotal(notPrintedDonors))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Tabela de Impressos */}
        <div className={styles.tableSection}>
          <h2 className={styles.tableTitle}>
            Doadores Impressos ({printedDonors.length})
          </h2>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>Dia</th>
                  <th>Doador</th>
                  <th>Telefone</th>
                  <th>Mensalidade</th>
                  <th>Movimentos</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {printedDonors.length > 0 ? (
                  printedDonors.map((donor) => (
                    <tr key={donor.donor_id}>
                      <td>{donor.donor_mensal_day}</td>
                      <td>{donor.donor_name}</td>
                      <td>{donor.donor_tel_1}</td>
                      <td>{formatCurrency(donor.donor_mensal_monthly_fee)}</td>
                      <td>{donor.movements_count}</td>
                      <td>{formatCurrency(donor.total_value)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      {loading
                        ? "Carregando..."
                        : "Nenhum doador impresso encontrado"}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>
                    Total:
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {formatCurrency(calculateTotal(printedDonors))}
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
