import { useContext, useEffect, useState, useRef } from "react";
import styles from "./worklist.module.css";
import {
  fetchWorklist,
  worklistRequests,
} from "../../services/worklistService";
import { UserContext } from "../../context/UserContext";
import { DataSelect } from "../../components/DataTime";
import ModalWorklist from "../../components/ModalWorklist";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import supabase from "../../helper/superBaseClient";
import getWorklistRequestById from "../../helper/getWorklistRequestById";
import { registerOperatorActivity, ACTIVITY_TYPES } from "../../services/operatorActivityService";

const WorkList = () => {
  const { operatorData, setOperatorData } = useContext(UserContext);
  const [worklist, setWorklist] = useState();
  const [workSelect, setWorkSelect] = useState("");
  const [worklistRequest, setWorklistRequest] = useState();
  const [active, setActive] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [workListSelected, setWorkListSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [statusFilter, setStatusFilter] = useState("");
  const scrollContainerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const isRestoringScrollRef = useRef(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pkg = params.get("pkg");
    const activeID = params.get("active");
    const modalFlag = params.get("modal");
    const sortKey = params.get("sortKey");
    const sortDirection = params.get("sortDirection");
    const scrollPosition = params.get("scroll");

    // Restaurar configuração de ordenação da URL
    if (sortKey && sortDirection) {
      setSortConfig({ key: sortKey, direction: sortDirection });
    }

    if (pkg) {
      setWorkSelect(pkg);
      const fetchData = async () => {
        const listRequest = await worklistRequests(
          operatorData.operator_code_id,
          pkg
        );
        setWorklistRequest(listRequest);

        if (modalFlag === "true") {
          const selected = listRequest.find(
            (item) => item.receipt_donation_id === Number(activeID)
          );
          if (selected) {
            setActive(activeID);
            setWorkListSelected(selected);
            setModalOpen(true);
          }
        }
      };

      fetchData();
    }
  }, [location.search]);

  const getWorklist = async () => {
    let tempList = [];
    const worklistName = await fetchWorklist();
    for (const list of worklistName) {
      const { data, error } = await supabase
        .from("request")
        .select()
        .eq("operator_code_id", operatorData.operator_code_id)
        .eq("request_name", list.name);
      if (error) throw error;
      if (data.length > 0) {
        tempList.push(list);
      }
    }
    setWorklist(tempList);
  };
  const request = async () => {
    if (workSelect) {
      setLoading(true);
      const listRequest = await worklistRequests(
        operatorData.operator_code_id,
        workSelect
      );
      setWorklistRequest(listRequest);
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorklist();
  }, []);

  useEffect(() => {
    request();
  }, [workSelect]);

  // Efeito para restaurar scroll quando os dados são carregados
  useEffect(() => {
    if (!worklistRequest || !scrollContainerRef.current) return;

    const params = new URLSearchParams(location.search);
    const scrollPosition = params.get("scroll");

    if (scrollPosition) {
      // Marcar que estamos restaurando o scroll para evitar atualizar a URL
      isRestoringScrollRef.current = true;
      
      // Aguardar um pouco para garantir que o DOM está totalmente renderizado
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = Number(scrollPosition);
          // Resetar a flag após um pequeno delay
          setTimeout(() => {
            isRestoringScrollRef.current = false;
          }, 100);
        }
      }, 200);

      return () => {
        clearTimeout(timer);
        isRestoringScrollRef.current = false;
      };
    }
  }, [worklistRequest, location.search]);

  // Efeito para gerenciar o scroll e salvar na URL
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      // Ignorar eventos de scroll durante a restauração
      if (isRestoringScrollRef.current) return;

      // Limpar timeout anterior
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Aguardar um pouco antes de atualizar a URL (debounce)
      scrollTimeoutRef.current = setTimeout(() => {
        const scrollTop = scrollContainer.scrollTop;
        // Usar window.location.search para sempre pegar o valor atual
        const params = new URLSearchParams(window.location.search);
        
        if (scrollTop > 0) {
          params.set("scroll", scrollTop.toString());
        } else {
          params.delete("scroll");
        }
        
        navigate(`?${params.toString()}`, { replace: true });
      }, 150);
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [navigate]);

  const handleChange = async (e) => {
    const selected = e.target.value;
    setWorkSelect(selected);
    
    // Atualizar URL com o novo pkg, preservando ordenação
    const params = new URLSearchParams(location.search);
    if (selected) {
      params.set("pkg", selected);
    } else {
      params.delete("pkg");
    }
    // Remover active e modal ao trocar de lista
    params.delete("active");
    params.delete("modal");
    // Remover scroll ao trocar de lista (resetar posição)
    params.delete("scroll");
    // Manter sortKey e sortDirection
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleRequest = async (list) => {
    const nowDate = new Date();
    try {
      const { data, error } = await supabase
        .from("request")
        .update({ request_date_accessed: nowDate })
        .eq("id", list.id)
        .select();

      if (error) throw error;
      
      // Registrar atividade de clique no item da worklist
      await registerOperatorActivity({
        operatorId: operatorData.operator_code_id,
        operatorName: operatorData.operator_name,
        activityType: ACTIVITY_TYPES.WORKLIST_CLICK,
        donorId: list.donor_id,
        donorName: list.donor?.donor_name,
        requestName: workSelect,
      });
    } catch (error) {
      console.error(error);
    }

    // Preservar parâmetros de ordenação e scroll na URL ao abrir modal
    const params = new URLSearchParams(location.search);
    params.set("pkg", workSelect);
    params.set("active", list.receipt_donation_id);
    params.set("modal", "true");
    // Manter sortKey, sortDirection e scroll se existirem
    navigate(`?${params.toString()}`);

    setActive(list.receipt_donation_id);
    setWorkListSelected(list);
    setModalOpen(!modalOpen);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    const newSortConfig = { key, direction };
    setSortConfig(newSortConfig);

    // Atualizar URL com os parâmetros de ordenação
    const params = new URLSearchParams(location.search);
    if (key) {
      params.set("sortKey", key);
      params.set("sortDirection", direction);
    } else {
      params.delete("sortKey");
      params.delete("sortDirection");
    }
    // Manter scroll se existir
    navigate(`?${params.toString()}`, { replace: true });
  };

  // Função para atualizar apenas um item específico na lista sem recarregar tudo
  const updateWorklistItem = async (requestId) => {
    if (!workSelect || !requestId) return;

    try {
      const updatedItem = await getWorklistRequestById(
        operatorData.operator_code_id,
        workSelect,
        requestId
      );

      if (updatedItem) {
        setWorklistRequest((prevList) => {
          if (!prevList) return prevList;
          return prevList.map((item) =>
            item.id === requestId ? updatedItem : item
          );
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar item da lista:", error);
    }
  };

  const getFilteredAndSortedData = () => {
    if (!worklistRequest) {
      return worklistRequest;
    }

    // Aplicar filtro de status
    let filteredData = [...worklistRequest];
    if (statusFilter) {
      filteredData = filteredData.filter((item) => {
        const status = item.request_status;
        if (statusFilter === "Não visitado") {
          return !status || status === "";
        }
        return status === statusFilter;
      });
    }

    // Aplicar ordenação
    if (!sortConfig.key) {
      return filteredData;
    }

    return filteredData.sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.key === "mensal_day") {
        aValue = a?.donor_mensal?.donor_mensal?.donor_mensal_day || 0;
        bValue = b?.donor_mensal?.donor_mensal?.donor_mensal_day || 0;
      } else if (sortConfig.key === "value") {
        aValue = a.donation.donation_value || 0;
        bValue = b.donation.donation_value || 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  return (
    <main className={styles.worklistContainer}>
      <div className={styles.worklistContent}>
        {/* Header Section */}
        <header className={styles.worklistHeader}>
          <h2 className={styles.worklistTitle}>📋 Lista de Trabalho</h2>
          <div className={styles.worklistActions}>
            <div className={styles.worklistSelectContainer}>
              <label className={styles.worklistSelectLabel}>
                Selecionar Lista
              </label>
              <select
                value={workSelect}
                onChange={handleChange}
                className={styles.worklistSelect}
                disabled={loading}
              >
                <option value="" disabled>
                  Selecione uma lista...
                </option>
                {worklist &&
                  worklist?.map((list, index) => (
                    <option value={list.name} key={index}>
                      {list.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className={styles.worklistSelectContainer}>
              <label className={styles.worklistSelectLabel}>
                Filtrar por Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.worklistSelect}
                disabled={loading || !workSelect}
              >
                <option value="">Todos</option>
                <option value="NA">NA</option>
                <option value="NP">NP</option>
                <option value="Agendado">Agendado</option>
                <option value="Whatsapp">Whatsapp</option>
                <option value="Não visitado">Não visitado</option>
                <option value="Sucesso">Sucesso</option>
                <option value="Recebido">Recebido</option>
              </select>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className={styles.worklistMainContent}>
          {loading ? (
            <div className={styles.worklistLoading}>
              <div className={styles.loadingSpinner}></div>
              <p>Carregando lista de trabalho...</p>
            </div>
          ) : worklistRequest?.length > 0 ? (
            <div className={styles.worklistTableContainer}>
              <div className={styles.worklistTableHeader}>
                <div className={styles.worklistTableStats}>
                  <span className={styles.statsItem}>
                    <strong>{getFilteredAndSortedData()?.length || 0}</strong>{" "}
                    {getFilteredAndSortedData()?.length === 1
                      ? "item"
                      : "itens"}
                    {statusFilter && ` (filtrado por: ${statusFilter})`}
                  </span>
                  <span className={styles.statsItem}>
                    Lista: <strong>{workSelect}</strong>
                  </span>
                  <span className={styles.statsItem}>
                    Total:{" "}
                    <strong>
                      {(getFilteredAndSortedData() || [])
                        .reduce(
                          (sum, item) =>
                            sum + (item.donation.donation_value || 0),
                          0
                        )
                        .toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                    </strong>
                  </span>
                </div>
              </div>

              <div 
                className={styles.worklistTableScroll}
                ref={scrollContainerRef}
              >
                <table className={styles.worklistTable}>
                  <thead>
                    <tr className={styles.worklistTableHeadRow}>
                      <th className={styles.worklistTableHead}>Doador</th>
                      <th
                        className={`${styles.worklistTableHead} ${styles.sortable}`}
                        onClick={() => handleSort("mensal_day")}
                      >
                        Dia do Mensal
                        <span className={styles.sortArrow}>
                          {sortConfig.key === "mensal_day"
                            ? sortConfig.direction === "asc"
                              ? "↑"
                              : "↓"
                            : "↕"}
                        </span>
                      </th>
                      <th
                        className={`${styles.worklistTableHead} ${styles.sortable}`}
                        onClick={() => handleSort("value")}
                      >
                        Valor
                        <span className={styles.sortArrow}>
                          {sortConfig.key === "value"
                            ? sortConfig.direction === "asc"
                              ? "↑"
                              : "↓"
                            : "↕"}
                        </span>
                      </th>
                      <th className={styles.worklistTableHead}>
                        Data Recebida
                      </th>
                      <th className={styles.worklistTableHead}>Status</th>
                      <th className={styles.worklistTableHead}>
                        Data Abertura
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredAndSortedData()?.map((list) => (
                      <tr
                        className={`${styles.worklistTableRow} ${
                          active === list.receipt_donation_id
                            ? styles.active
                            : list.request_status === "NP"
                            ? styles.statusNp
                            : list.request_status === "Sucesso"
                            ? styles.statusSuccess
                            : list.request_status === "NA"
                            ? styles.statusNa
                            : list.request_status === "Agendado"
                            ? styles.statusScheduled
                            : list.request_status === "Whatsapp"
                            ? styles.statusWhatsapp
                            : list.request_status === "Recebido"
                            ? styles.statusReceived
                            : ""
                        }`}
                        key={list.receipt_donation_id}
                        onClick={() => handleRequest(list)}
                      >
                        <td className={styles.worklistTableCell}>
                          <div className={styles.donorInfo}>
                            <span className={styles.donorName}>
                              {list.donor.donor_name}
                            </span>
                          </div>
                        </td>
                        <td className={styles.worklistTableCell}>
                          <div className={styles.donorInfo}>
                            <span className={styles.donorName}>
                              {
                                list?.donor_mensal?.donor_mensal
                                  ?.donor_mensal_day
                              }
                            </span>
                          </div>
                        </td>
                        <td className={styles.worklistTableCell}>
                          <span className={styles.valueAmount}>
                            {list.donation.donation_value.toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )}
                          </span>
                        </td>
                        <td className={styles.worklistTableCell}>
                          <span className={styles.dateInfo}>
                            {DataSelect(list.donation.donation_day_received)}
                          </span>
                        </td>
                        <td className={styles.worklistTableCell}>
                          <span
                            className={`${styles.statusBadge} ${
                              styles[
                                `status${
                                  list?.request_status
                                    ?.charAt(0)
                                    .toUpperCase() +
                                  list?.request_status?.slice(1).toLowerCase()
                                }`
                              ]
                            }`}
                          >
                            {list.request_status}
                            {list?.donation?.operator_code_id === 521 &&
                              ` (${list.donation.operator_code_id})`}
                            {list?.operator_code_id === 1100 &&
                              list?.donation?.operator_code_id === 1098 &&
                              ` (${list.donation.operator_code_id})`}
                            {list?.operator_code_id === 1098 &&
                              list?.donation?.operator_code_id === 1100 &&
                              ` (${list.donation.operator_code_id})`}
                          </span>
                        </td>
                        <td className={styles.worklistTableCell}>
                          <span className={styles.dateInfo}>
                            {list?.request_date_accessed
                              ? `${new Date(
                                  list?.request_date_accessed
                                ).toLocaleDateString("pt-BR")} - ${new Date(
                                  list?.request_date_accessed
                                ).toLocaleTimeString("pt-BR")}`
                              : "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : workSelect ? (
            <div className={styles.worklistEmpty}>
              <div className={styles.emptyIcon}>📋</div>
              <h4>Nenhum item encontrado</h4>
              <p>A lista "{workSelect}" não possui itens disponíveis.</p>
            </div>
          ) : (
            <div className={styles.worklistEmpty}>
              <div className={styles.emptyIcon}>📋</div>
              <h4>Selecione uma lista</h4>
              <p>Escolha uma lista de trabalho para visualizar os itens.</p>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <ModalWorklist
          setModalOpen={setModalOpen}
          workListSelected={workListSelected}
          setActive={setActive}
          workSelect={workSelect}
          updateWorklistItem={updateWorklistItem}
        />
      )}
    </main>
  );
};

export default WorkList;
