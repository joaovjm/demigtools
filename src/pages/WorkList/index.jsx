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
    console.log(list);
    const nowDate = new Date();
    try {
      const { data, error } = await supabase
        .from("request")
        .update({ request_date_accessed: nowDate })
        .eq("id", list.id)
        .select();

      if (error) throw error;
      console.log(dateAccessed);
    } catch (error) {
      console.error(error);
    }
    if (list.request_status === "NP") {
      toast.warning("Este colaborador não poderá ajudar nesta requisição...");
      return;
    }
    navigate(
      `?pkg=${workSelect}&active=${list.receipt_donation_id}&modal=true`
    );
    setActive(list.receipt_donation_id);
    setWorkListSelected(list);
    setModalOpen(!modalOpen);
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
      {loading ? (
        <p>CARREGANDO...</p>
      ) : worklistRequest?.length > 0 ? (
        <div className="worklist-list">
          <table>
            <thead className="worklist-list-head">
              <tr className="worklist-list-head-tr">
                <th>Nome</th>
                <th>Valor</th>
                <th>Data Recebida</th>
                <th>Status</th>
                <th>Data Abertura</th>
              </tr>
            </thead>
            <tbody className="worklist-list-body">
              {worklistRequest?.map((list) => (
                <tr
                  className={`worklist-list-body-tr ${
                    active === list.receipt_donation_id
                      ? "active"
                      : list.request_status === "NP"
                      ? "NP"
                      : list.request_status === "Sucesso"
                      ? "Sucesso"
                      : list.request_status === "NA"
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
                  <td>
                    {list?.request_date_accessed
                      ? `${
                          new Date(
                            list?.request_date_accessed
                          ).toLocaleDateString("pt-BR") || ""
                        } - ${new Date(
                          list?.request_date_accessed
                        ).toLocaleTimeString("pt-BR")}`
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}
      {modalOpen && (
        <ModalWorklist
          setModalOpen={setModalOpen}
          workListSelected={workListSelected}
          setActive={setActive}
          workSelect={workSelect}
        />
      )}
    </div>
  );
};

export default WorkList;
