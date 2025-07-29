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

const WorkList = () => {
  const { operatorData, setOperatorData } = useContext(UserContext);
  const [worklist, setWorklist] = useState([]);
  const [workSelect, setWorkSelect] = useState("");
  const [worklistRequest, setWorklistRequest] = useState();
  const [active, setActive] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [workListSelected, setWorkListSelected] = useState([]);

  // const navigate = useNavigate();

  useEffect(() => {
    const getWorklist = async () => {
      const worklistName = await fetchWorklist();
      setWorklist(worklistName);
    };
    getWorklist();
  }, [workSelect, modalOpen]);

  const handleChange = async (e) => {
    const selected = e.target.value;
    setWorkSelect(selected)
    const listRequest = await worklistRequests(
      operatorData.operator_code_id,
      selected
    );
    setWorklistRequest(listRequest);
  };

  const handleRequest = (list) => {
    setActive(list.receipt_donation_id);
    setWorkListSelected(list);
    setModalOpen(!modalOpen);
    // navigate(`/donor/${id}`);
  };

  return (
    <div className="worklist-container">
      <div className="input-field">
        <label>Lista de trabalho</label>
        <select value={workSelect} onChange={handleChange}>
          <option value="" disabled>
            Selecione...
          </option>
          {worklist &&
            worklist?.map((list, index) => (
              <option value={list.name} key={index}>
                {list.name}
              </option>
            ))}
        </select>
      </div>
      {worklistRequest?.length > 0 ? (
        <div className="worklist-list">
          <table>
            <thead className="worklist-list-head">
              <tr className="worklist-list-head-tr">
                <th>Nome</th>
                <th>Valor</th>
                <th>Data Recebida</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="worklist-list-body">
              {worklistRequest?.map((list) => (
                <tr
                  className={`worklist-list-body-tr ${
                    active === list.receipt_donation_id
                      ? "active"
                      : list.request_status === "Não Pode Ajudar"
                      ? "NP"
                      : list.request_status === "sucesso"
                      ? "sucesso"
                      : list.request_status === "Não Atendeu"
                      ? "NA"
                      : ""
                  }`}
                  key={list.receipt_donation_id}
                  onClick={() => handleRequest(list)}
                >
                  <td>{list.donor.donor_name}</td>
                  <td>
                    {list.donation.donation_value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td>{DataSelect(list.donation.donation_day_received)}</td>
                  <td>{list.request_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <></>}
      {modalOpen && (
        <ModalWorklist
          setModalOpen={setModalOpen}
          workListSelected={workListSelected}
          setActive={setActive}
        />
      )}
    </div>
  );
};

export default WorkList;
