import "./index.css";
import updateRequestSelected from "../../helper/updateRequestSelected";
import {
  fetchMaxAndMedDonations,
  newDonation,
} from "../../services/worklistService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DataSelect } from "../DataTime";
import { getCampains } from "../../helper/getCampains";

const ModalWorklist = ({
  setModalOpen,
  workListSelected,
  setActive,
  workSelect,
}) => {
  const [newDonationOpen, setNewDonationOpen] = useState(false);
  const [maxDonation, setMaxDonation] = useState();
  const [medDonation, setMedDonation] = useState();
  const [day, setDay] = useState();
  const [penultimate, setPenultimate] = useState();
  const [campains, setCampains] = useState([]);
  const [campainSelected, setCampainSelected] = useState("");
  const {
    id,
    donor: { donor_name, donor_tel_1 },
  } = workListSelected;
  const donor_tel_2 = workListSelected?.donor_tel_2b?.donor_tel_2?.donor_tel_2;
  const donor_tel_3 = workListSelected?.donor_tel_3b?.donor_tel_3?.donor_tel_3;

  const navigate = useNavigate();

  const MaxAndMedDonations = async () => {
    const { max, day, med, penultimate } = await fetchMaxAndMedDonations(
      workListSelected.donor_id
    );
    setMaxDonation(max);
    setMedDonation(med);
    setDay(day);
    setPenultimate(penultimate);
  };

  const fetchCampains = async () => {
    const response = await getCampains();
    setCampains(response)
  }

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
    newDonation();
  };

  const handleCancel = () => {
    setNewDonationOpen(false);
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
              Doação anterior: {penultimate?.[0].toLocaleString("pt-BR", {style: "currency", currency: "BRL"})} | {DataSelect(penultimate?.[1])}
            </label>
            <label>
              Maior Doação: {maxDonation?.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
              | DT: {DataSelect(day)}
            </label>
            <label>
              Média: {medDonation?.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
              
            </label>
          </div>
        </div>

        {!newDonationOpen ? (
          <div className="modal-worklist-main-buttons">
            <button onClick={handleNP}>Não pode ajudar</button>
            <button onClick={handleNA}>Não atendeu</button>
            <button onClick={handleNewDonation}>Nova doação</button>
            <button onClick={handleOpenDonator}>Abrir Doação</button>
          </div>
        ) : (
          <>
            <hr />
            <div className="modal-worklist-main-newdonation">
              <div className="modal-worklist-main-newdonation-header">
                <h4> Nova Doação</h4>
              </div>
              <div className="modal-worklist-main-newdonation-body">
                <div className="input-group">
                  <div className="input-field">
                    <label>Valor</label>
                    <input type="text" />
                  </div>
                  <div className="input-field">
                    <label>Dt. Receber</label>
                    <input type="date" />
                  </div>
                  <div className="input-field">
                    <label>Campanha</label>
                    <select value={campainSelected} onChange={(e) => setCampainSelected(e.target.value)}>
                      <option value="" disabled>
                        Selecione...
                      </option>
                      {campains.map((cp) => (
                        <option>{cp.campain_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-field" style={{ gridColumn: "span 2" }}>
                    <label>Observação</label>
                    <input type="text" />
                  </div>
                </div>
                <div className="modal-worklist-main-newdonation-footer">
                  <button onClick={handleCancel}>Cancelar</button>
                  <button onClick={handleCancel}>Salvar</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalWorklist;
