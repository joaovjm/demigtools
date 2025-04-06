import { useEffect, useState, useRef, Fragment } from "react";
import "./index.css";
import { getDonation } from "../../helper/getDonation";

const TableDonor = ({ idDonor, modalShow }) => {
  const [dados, setDados] = useState([]);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [canScroll, setCanScroll] = useState(false);
  const tableContainerRef = useRef(null);

  // Carrega os dados da doação
  useEffect(() => {
    if (idDonor) {
      getDonation(idDonor)
        .then((data) => {
          setDados(data);
          // Verifica após renderização se a tabela precisa de rolagem
          setTimeout(checkScrollNeeded, 100);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [idDonor, modalShow]);

  // Verifica se a tabela precisa de rolagem horizontal
  const checkScrollNeeded = () => {
    const containerEl = tableContainerRef.current;
    if (containerEl) {
      // Se a largura do conteúdo for maior que a largura visível
      const hasScroll = containerEl.scrollWidth > containerEl.clientWidth;
      setCanScroll(hasScroll);
      if (!hasScroll) {
        setShowScrollHint(false);
      }
    }
  };

  // Monitora o scroll para esconder a dica após rolar
  useEffect(() => {
    const handleScroll = () => {
      if (tableContainerRef.current && showScrollHint) {
        setShowScrollHint(false);
      }
    };

    const containerEl = tableContainerRef.current;
    if (containerEl) {
      containerEl.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", checkScrollNeeded);
      
      // Verifica inicialmente se há necessidade de rolagem
      checkScrollNeeded();
    }

    return () => {
      if (containerEl) {
        containerEl.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", checkScrollNeeded);
    };
  }, [showScrollHint]);
  
  // Força a rolagem para o início quando os dados mudam
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollLeft = 0;
    }
  }, [dados]);

  return (
    <div className="table-wrapper">
      <div 
        className={`table-container ${canScroll ? 'has-scroll' : ''}`} 
        ref={tableContainerRef}
      >
        <table className="tabledonor">
          <thead>
            <tr className="trHead">
              <th className="tableHead">Recibo</th>
              <th className="tableHead">Operador</th>
              <th className="tableHead">Valor</th>
              <th className="tableHead">Comissão</th>
              <th className="tableHead">Contato</th>
              <th className="tableHead">Receber</th>
              <th className="tableHead">Recebida</th>
              <th className="tableHead">Impresso</th>
              <th className="tableHead">Recebido</th>
              <th className="tableHead">MesRef</th>
              <th className="tableHead">Coletador</th>
            </tr>
          </thead>

          <tbody>
            {dados && dados.length > 0 ? (
              dados.map((item) => (
                <Fragment key={item.receipt_donation_id}>
                  <tr className="trBody">
                    <td className="tableBody">
                      {item.receipt_donation_id}
                    </td>
                    <td className="tableBody">
                      {item.operator_code_id} - {item.operator?.operator_name}
                    </td>
                    <td className="tableBody">
                      {item.donation_value}
                    </td>
                    <td className="tableBody">
                      {item.donation_extra}
                    </td>
                    <td className="tableBody">
                      {item.donation_day_contact}
                    </td>
                    <td className="tableBody">
                      {item.donation_day_to_receive}
                    </td>
                    <td className="tableBody">
                      {item.donation_day_received}
                    </td>
                    <td className="tableBody">
                      {item.donation_print}
                    </td>
                    <td className="tableBody">
                      {item.donation_received}
                    </td>
                    <td className="tableBody">
                      {item.donation_monthref}
                    </td>
                    <td className="tableBody">
                      {item.collector_code_id} - {item.collector?.collector_name || ""}
                    </td>
                  </tr>
                  <tr className="trFoot">
                    <td colSpan="11" className="obs">
                      {item.donation_description ? item.donation_description : "..."}
                    </td>
                  </tr>
                </Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="tableBody no-data">
                  Não há dados de doação disponíveis
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showScrollHint && canScroll && (
        <div className="scroll-hint">
          ← Deslize para ver mais informações →
        </div>
      )}
    </div>
  );
};

export default TableDonor;
