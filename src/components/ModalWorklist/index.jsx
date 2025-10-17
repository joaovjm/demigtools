import "./index.css";
import updateRequestSelected from "../../helper/updateRequestSelected";
import { fetchMaxAndMedDonations } from "../../services/worklistService";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DataNow, DataSelect } from "../DataTime";
import { getCampains } from "../../helper/getCampains";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import { insertDonation } from "../../helper/insertDonation";
import { updateRequestList } from "../../helper/updateRequestList";

const ModalWorklist = ({
  setModalOpen,
  workListSelected,
  setActive,
  workSelect,
}) => {
  const { operatorData } = useContext(UserContext);
  const [newDonationOpen, setNewDonationOpen] = useState(false);
  const [newSchedulingOpen, setNewSchedulingOpen] = useState(false);
  const [maxDonation, setMaxDonation] = useState();
  const [medDonation, setMedDonation] = useState();
  const [day, setDay] = useState();
  const [penultimate, setPenultimate] = useState();
  const [campains, setCampains] = useState([]);
  const [campainSelected, setCampainSelected] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [observation, setObservation] = useState("");
  const [dateScheduling, setDateScheduling] = useState("");
  const [telScheduling, setTelScheduling] = useState("");
  const [observationScheduling, setObservationScheduling] = useState("");

  const {
    id,
    donor_id,
    request_name,
    donor: { donor_name, donor_tel_1 },
  } = workListSelected;
  const donor_tel_2 = workListSelected?.donor_tel_2b?.donor_tel_2?.donor_tel_2;
  const donor_tel_3 = workListSelected?.donor_tel_3b?.donor_tel_3?.donor_tel_3;

  const navigate = useNavigate();
  const MaxAndMedDonations = async () => {
    const { max, day, med, penultimate } = await fetchMaxAndMedDonations(
      workListSelected.donor_id
    );
    if ([max, day, med, penultimate].some((v) => v)) {
      setMaxDonation(max);
      setMedDonation(med);
      setDay(day);
      setPenultimate(penultimate);
    }
  };

  const fetchCampains = async () => {
    const response = await getCampains();
    setCampains(response);
  };

  useEffect(() => {
    MaxAndMedDonations();
    fetchCampains();
  }, []);

  const handleClose = () => {
    setModalOpen(false);
    setActive("");
    navigate(`?pkg=${workSelect}`);
  };

  const handleNP = async () => {
    updateRequestSelected("NP", id, setModalOpen, setActive);
    navigate(`?pkg=${workSelect}`);
  };

  const handleNA = () => {
    updateRequestSelected("NA", id, setModalOpen, setActive);
    navigate(`?pkg=${workSelect}`);
  };

  const handleNewDonation = () => {
    setNewDonationOpen(true);
  };

  const handleCancel = () => {
    setNewDonationOpen(false);
  };

  const handleSchedulingOpen = () => {
    setNewSchedulingOpen(true);
  };

  const handleSchedulingClick = () => {
    if(!telScheduling) {
      toast.warning("Escolha o telefone de contato usado...")
      return;
    } 
    const response = updateRequestList({
      id: id,
      observationScheduling: observationScheduling,
      dateScheduling: dateScheduling,
      telScheduling: telScheduling,
    });
    if (response) {
      toast.success("Agendado com sucesso!");
      setModalOpen(false)

    } else {
      toast.error("Erro ao agendar!");
    }
  };

  const handleSaveNewDonation = async () => {
    if ([campainSelected, value, date].some((v) => v === "")) {
      toast.warning("Preencha todos os campos corretamente");
      return;
    }
    const response = await insertDonation(
      donor_id,
      operatorData.operator_code_id,
      value,
      value,
      DataNow("noformated"),
      date,
      false,
      false,
      observation,
      null,
      campainSelected,
      null,
      request_name
    );

    if (response.length > 0) {
      updateRequestSelected("Sucesso", id, setModalOpen, setActive);
      navigate(`?pkg=${workSelect}`);
    }
  };

  const handleOpenDonator = () => {
    navigate(`/donor/${workListSelected.donor_id}`);
  };
  return (
    <div className="modal-worklist">
      <div className="modal-worklist-main">
        <div className="modal-worklist-main-header">
          <h3>{donor_name}</h3>
          <button onClick={handleClose}>Fechar</button>
        </div>
        <div className="modal-worklist-main-body">
          <div className="modal-worklist-main-body-tel">
            <label>telefone 1: {donor_tel_1}</label>
            <label>telefone 2:{donor_tel_2 ? donor_tel_2 : "*****-****"}</label>
            <label>
              telefone 3: {donor_tel_3 ? donor_tel_3 : "*****-****"}
            </label>
          </div>

          <div className="modal-worklist-main-body-values">
            <label>
              Doação anterior:{" "}
              {penultimate?.[0]?.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
              |{" "}
              {new Date(penultimate?.[1])?.toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              }) || "**/**/***"}
            </label>
            <label>
              Maior Doação:{" "}
              {maxDonation?.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
              | DT:{" "}
              {new Date(day)?.toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              }) || "**/**/***"}
            </label>
            <label>
              Média:{" "}
              {medDonation?.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </label>
          </div>
        </div>

        {!newDonationOpen && !newSchedulingOpen ? (
          <div className="modal-worklist-main-buttons">
            <button onClick={handleNP}>Não pode ajudar</button>
            <button onClick={handleNA}>Não atendeu</button>
            <button onClick={handleSchedulingOpen}>Agendar</button>
            <button onClick={handleNewDonation}>Nova doação</button>
            <button onClick={handleOpenDonator}>Abrir Doação</button>
          </div>
        ) : (
          <>
            <hr />
            {newDonationOpen ? (
              <div className="modal-worklist-main-newdonation">
                <div className="modal-worklist-main-newdonation-header">
                  <h4> Nova Doação</h4>
                </div>
                <div className="modal-worklist-main-newdonation-body">
                  <div className="input-group">
                    <div className="input-field">
                      <label>Valor</label>
                      <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        type="text"
                      />
                    </div>
                    <div className="input-field">
                      <label>Dt. Receber</label>
                      <input
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        type="date"
                      />
                    </div>
                    <div className="input-field">
                      <label>Campanha</label>
                      <select
                        value={campainSelected}
                        onChange={(e) => setCampainSelected(e.target.value)}
                      >
                        <option value="" disabled>
                          Selecione...
                        </option>
                        {campains.map((cp) => (
                          <option key={cp.id} value={cp.campain_name}>
                            {cp.campain_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div
                      className="input-field"
                      style={{ gridColumn: "span 2" }}
                    >
                      <label>Observação</label>
                      <input
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="modal-worklist-main-newdonation-footer">
                    <button onClick={handleCancel}>Cancelar</button>
                    <button onClick={handleSaveNewDonation}>Salvar</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="schedulingWorkList">
                <form className="schedulingWorkList-form">
                  <h3>Agendamento</h3>
                  <div className="input-field">
                    <label>Data</label>
                    <input
                      type="date"
                      value={dateScheduling}
                      onChange={(e) => setDateScheduling(e.target.value)}
                    />
                  </div>
                  <div className="input-field">
                    <label>Telefone contactado</label>
                    <select
                      value={telScheduling}
                      onChange={(e) => setTelScheduling(e.target.value)}
                    >
                      <option value="" disabled>
                        Selecione...
                      </option>
                      <option value={donor_tel_1}>{donor_tel_1}</option>
                      {donor_tel_2 && (
                        <option value={donor_tel_2}>{donor_tel_2}</option>
                      )}
                      {donor_tel_3 && (
                        <option value={donor_tel_3}>{donor_tel_3}</option>
                      )}
                    </select>
                  </div>
                  <div className="input-field">
                    <label>Observação</label>
                    <textarea
                      value={observationScheduling}
                      onChange={(e) => {
                        setObservationScheduling(e.target.value);
                      }}
                    />
                  </div>
                  <div className="schedulingWorkList-foot">
                    <button
                      className="btn-cencel"
                      onClick={() => setNewSchedulingOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn-scheduling"
                      onClick={handleSchedulingClick}
                    >
                      Concluir
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ModalWorklist;
