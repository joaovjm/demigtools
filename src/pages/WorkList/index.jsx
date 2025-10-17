import { useContext, useEffect, useState } from "react";
import "./index.css";
import {
  fetchWorklist,
  worklistRequests,
} from "../../services/worklistService";
import { UserContext } from "../../context/UserContext";
import { DataSelect } from "../../components/DataTime";
//
import ModalWorklist from "../../components/ModalWorklist";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import supabase from "../../helper/superBaseClient";

const WorkList = () => {
  const { operatorData, setOperatorData } = useContext(UserContext);
  const [worklist, setWorklist] = useState();
  const [workSelect, setWorkSelect] = useState("");
  const [worklistRequest, setWorklistRequest] = useState();
  const [active, setActive] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [workListSelected, setWorkListSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateAccessed, setDateAccessed] = useState();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pkg = params.get("pkg");
    const activeID = params.get("active");
    const modalFlag = params.get("modal");

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
  }, [modalOpen, workSelect]);

  const handleChange = async (e) => {
    const selected = e.target.value;
    setWorkSelect(selected);
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
     
    } catch (error) {
      console.error(error);
    }
    
    navigate(
      `?pkg=${workSelect}&active=${list.receipt_donation_id}&modal=true`
    );
    setActive(list.receipt_donation_id);
    setWorkListSelected(list);
    setModalOpen(!modalOpen);
  };

  return (
    <main className="worklist-container">
      <div className="worklist-content">
        {/* Header Section */}
        <header className="worklist-header">
          <h2 className="worklist-title">📋 Lista de Trabalho</h2>
          <div className="worklist-actions">
            <div className="worklist-select-container">
              <label className="worklist-select-label">Selecionar Lista</label>
              <select 
                value={workSelect} 
                onChange={handleChange}
                className="worklist-select"
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
          </div>
        </header>

        {/* Content Section */}
        <div className="worklist-main-content">
          {loading ? (
            <div className="worklist-loading">
              <div className="loading-spinner"></div>
              <p>Carregando lista de trabalho...</p>
            </div>
          ) : worklistRequest?.length > 0 ? (
            <div className="worklist-table-container">
              <div className="worklist-table-header">
                <div className="worklist-table-stats">
                  <span className="stats-item">
                    <strong>{worklistRequest.length}</strong> {worklistRequest.length === 1 ? 'item' : 'itens'}
                  </span>
                  <span className="stats-item">
                    Lista: <strong>{workSelect}</strong>
                  </span>
                </div>
              </div>

              <div className="worklist-table-scroll">
                <table className="worklist-table">
                  <thead>
                    <tr className="worklist-table-head-row">
                      <th className="worklist-table-head">Doador</th>
                      <th className="worklist-table-head">Valor</th>
                      <th className="worklist-table-head">Data Recebida</th>
                      <th className="worklist-table-head">Status</th>
                      <th className="worklist-table-head">Data Abertura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {worklistRequest?.map((list) => (
                      <tr
                        className={`worklist-table-row ${
                          active === list.receipt_donation_id
                            ? "active"
                            : list.request_status === "NP"
                            ? "status-np"
                            : list.request_status === "Sucesso"
                            ? "status-success"
                            : list.request_status === "NA"
                            ? "status-na"
                            : list.request_status === "Agendado"
                            ? "status-scheduled"
                            : ""
                        }`}
                        key={list.receipt_donation_id}
                        onClick={() => handleRequest(list)}
                      >
                        <td className="worklist-table-cell">
                          <div className="donor-info">
                            <span className="donor-name">{list.donor.donor_name}</span>
                          </div>
                        </td>
                        <td className="worklist-table-cell">
                          <span className="value-amount">
                            {list.donation.donation_value.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </td>
                        <td className="worklist-table-cell">
                          <span className="date-info">
                            {DataSelect(list.donation.donation_day_received)}
                          </span>
                        </td>
                        <td className="worklist-table-cell">
                          <span className={`status-badge status-${list?.request_status?.toLowerCase()}`}>
                            {list.request_status}
                          </span>
                        </td>
                        <td className="worklist-table-cell">
                          <span className="date-info">
                            {list?.request_date_accessed
                              ? `${new Date(list?.request_date_accessed).toLocaleDateString("pt-BR")} - ${new Date(list?.request_date_accessed).toLocaleTimeString("pt-BR")}`
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
            <div className="worklist-empty">
              <div className="empty-icon">📋</div>
              <h4>Nenhum item encontrado</h4>
              <p>A lista "{workSelect}" não possui itens disponíveis.</p>
            </div>
          ) : (
            <div className="worklist-empty">
              <div className="empty-icon">📋</div>
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
        />
      )}
    </main>
  );
};

export default WorkList;
