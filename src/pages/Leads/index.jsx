import React, { useEffect, useState } from "react";
import "./index.css";
import GetLeadsWithPagination from "../../helper/getLeadsWithPagination";

import { ICONS } from "../../constants/constants";
import { toast, ToastContainer } from "react-toastify";
import FormInput from "../../components/forms/FormInput";
import supabase from "../../helper/superBaseClient";
import { DataNow, DataSelect } from "../../components/DataTime";
import {
  insertDonor,
  insertDonor_cpf,
  insertDonor_reference,
  insertDonor_tel_2,
} from "../../helper/insertDonor";
import getSession from "../../auth/getSession";
import Loader from "../../components/Loader";
import updateLeads from "../../helper/updateLeads";

const Leads = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState(0);
  const [currentItem, setCurrentItem] = useState(1);
  const [currentLead, setCurrentLead] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [idSession, setIdSession] = useState("");
  const [formatedDate, setFormatedDate] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [newTel2, setNewTel2] = useState("");
  const [newTel3, setNewTel3] = useState("");
  const [telSuccess, setTelSuccess] = useState("");
  const [campain, setCampain] = useState("");
  const [observation, setObservation] = useState("");
  const [reference, setReference] = useState("");
  const [dateDonation, setDateDonation] = useState("");
  const [dateScheduling, setDateScheduling] = useState("");
  const [observationScheduling, setObservationScheduling] = useState("");
  const [valueDonation, setValueDonation] = useState("");
  const [nowLead, setNowLead] = useState("");
  const [operatorID, setOperatorID] = useState(null);

  useEffect(() => {
    const operatorData = JSON.parse(localStorage.getItem("operatorData"));
    setOperatorID(operatorData?.operator_code_id);
  }, []);

  useEffect(() => {
    const GetSession = async () => {
      const session = await getSession();
      setIdSession(session.user.id);
    };

    GetSession();
  }, []);

  const fetchLeads = async () => {
    const operatorData = JSON.parse(localStorage.getItem("operatorData"));
    const currentOperatorID = operatorData?.operator_code_id;

    setIsLoading(true);
    const start = currentItem - 1;
    const end = currentItem - 1;

    const lead = await GetLeadsWithPagination(
      start,
      end,
      setItems,
      setCurrentLead,
      currentOperatorID,
      nowLead
    );

    setNowLead(lead.leads_id);
    if (lead[0].leads_id) {
      await updateLeads("Aberto", Number(currentOperatorID), lead[0].leads_id);
    }


    setIsLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [currentItem]);

  const handleNext = async () => {
    if (currentItem < items && currentLead?.leads_id) {
      const data = await updateLeads("Não Atendeu", operatorID, currentLead.leads_id);
      if (data[0].leads_status === "Não Atendeu") {
        const next = currentItem + 1;
        setCurrentItem(next);
        
      }
    }
  };

  const handleNoDonation = async () => {
    const response = await updateLeads(
      "Não pode ajudar",
      Number(operatorID),
      currentLead.leads_id
    );
    if (response.length > 0) {
      const next = currentItem + 1;
      setCurrentItem(next);
    }
  };

  const handleScheduling = (e) => {
    setIsOpen(false);
    setIsSchedulingOpen(true);
  };

  const handleSchedulingDateChange = (e) => {
    var value = e.target.value;
    const now = DataNow("noformated");
    if (value < now) {
      value = now;
    }
    setFormatedDate(`${DataSelect(value)}`);
    setDateScheduling(value);
  };

  const handleAction = (e) => {
    setIsSchedulingOpen(false);
    setIsOpen(true);
    setAddress(currentLead.leads_address);
    setCity(currentLead.leads_city);
    setNeighborhood(currentLead.leads_neighborhood);
  };

  const handleSchedulingClick = async () => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .update([
          {
            leads_date_accessed: DataNow(),
            leads_scheduling_date: formatedDate,
            leads_status: "agendado",
            leads_observation: observationScheduling,
          },
        ])
        .eq("leads_id", currentLead.leads_id)
        .select();

      if (error) throw error;

      if (!error) {
        toast.success("Agendado com sucesso!");
        setDateScheduling("");
        setObservationScheduling("");
        setIsSchedulingOpen(false);
        const next = currentItem + 1;
        setCurrentItem(next);
      }
    } catch (error) {
      console.error("Erro: ", error.message);
    }
  };

  const handleNewDonorAndDonation = async () => {
    if (
      address === "" ||
      city === "" ||
      neighborhood === "" ||
      telSuccess === "" ||
      valueDonation === "" ||
      dateDonation === "" ||
      campain === ""
    ) {
      toast.warning("Preencha todos os campos obrigatórios!");
    } else {
      toast.promise(
        (async () => {
          try {
            const data = await insertDonor(
              currentLead.leads_name,
              "Lista",
              address,
              city,
              neighborhood,
              telSuccess
            );

            if (data.length > 0) {
              console.log("Doador Criado com Sucesso");
            }

            const cpf = await insertDonor_cpf(
              data[0].donor_id,
              currentLead.leads_icpf
            );

            if (newTel2 !== "") {
              await insertDonor_tel_2(data[0].donor_id, newTel2);
            }
            if (newTel3 !== "") {
              await insertDonor_tel_2(data[0].donor_id, newTel3);
            }
            if (reference !== "") {
              await insertDonor_reference(data[0].donor_id, reference);
            }

            let successMessage = "Operação concluída com sucesso!";

            if (valueDonation !== "" && dateDonation !== "") {
              const { data: donation, error: donationError } = await supabase
                .from("donation")
                .insert([
                  {
                    donor_id: data[0].donor_id,
                    operator_code_id: operatorID,
                    donation_value: valueDonation,
                    donation_day_contact: DataNow(),
                    donation_day_to_receive: DataSelect(dateDonation),
                    donation_print: "Não",
                    donation_received: "Não",
                    donation_description: observation,
                    donation_campain: campain,
                  },
                ])
                .select();

              if (donationError) throw donationError;
              successMessage = "Doação criada com sucesso!";
            }

            const { data: ChangeLead, error: ErroChange } = await supabase
              .from("leads_excludes")
              .insert(currentLead)
              .select();

            if (ErroChange) {
              console.error(
                "Erro ao inserir em leads_excludes:",
                ErroChange.message
              );
              throw ErroChange;
            }

            const { data: DeleteLead, error: ErroDelete } = await supabase
              .from("leads")
              .delete()
              .eq("leads_id", currentLead.leads_id)
              .select();

            if (ErroDelete) {
              console.error("Erro ao deletar de leads:", ErroDelete.message);
              throw ErroDelete;
            }

            // Reset form after successful operation
            const next = currentItem + 1;
            setCurrentItem(next);
            setIsOpen(false);

            return successMessage;
          } catch (error) {
            console.error("Erro na operação:", error.message);
            throw error;
          }
        })(),
        {
          pending: "Processando doação...",
          success: (message) => message,
          error: "Erro ao processar a operação",
        }
      );
    }
  };
  return (
    <main className="main-leads">
      <div className="section-info-leads">
        {isLoading ? (
          <div className="info-possible-donor-loading">
            <Loader />
          </div>
        ) : (
          <div className="info-possible-donor">
            <h3>{currentLead.leads_name}</h3>
            <div className="info-lead">
              <div className="tel-lead">
                <p className="paragraph">
                  Telefone 1: {currentLead.leads_tel_1}
                </p>
                <p className="paragraph">
                  Telefone 2: {currentLead.leads_tel_2}
                </p>
                <p className="paragraph">
                  Telefone 3: {currentLead.leads_tel_3}
                </p>
                <p className="paragraph">
                  Telefone 4: {currentLead.leads_tel_4}
                </p>
                <p className="paragraph">
                  Telefone 5: {currentLead.leads_tel_5}
                </p>
                <p className="paragraph">
                  Telefone 6: {currentLead.leads_tel_6}
                </p>
              </div>
              <div className="neighborhood">
                <p className="paragraph">
                  Bairro: {currentLead.leads_neighborhood}{" "}
                </p>
              </div>
              {!isOpen && !isSchedulingOpen && (
                <div className="btn-lead">
                  <button
                    onClick={handleNoDonation}
                    className="info-lead-button-a"
                  >
                    Não pode ajudar
                  </button>
                  <button
                    onClick={handleScheduling}
                    className="info-lead-button-b"
                  >
                    Agendar
                  </button>
                  <button onClick={handleAction} className="info-lead-button-c">
                    {ICONS.CIRCLEOUTLINE} Nova doação
                  </button>
                </div>
              )}
            </div>
            {!isOpen && !isSchedulingOpen && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "50px",
                  }}
                >
                  <button className="btn-next" onClick={handleNext}>
                    Proximo
                  </button>
                </div>
                <div>
                  <p>
                    {items}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {isOpen && (
          <form className="menu-action-lead">
            <div className="address-area">
              <FormInput
                label="Endereço"
                value={address}
                type="text"
                name="address"
                onChange={(e) => setAddress(e.target.value)}
                classinput="address-area-input"
              />
              <FormInput
                label="Cidade"
                value={city}
                type="text"
                name="city"
                onChange={(e) => setCity(e.target.value)}
                classinput="address-area-input"
              />
              <FormInput
                label="Bairro"
                value={neighborhood}
                type="text"
                name="neighborhood"
                onChange={(e) => setNeighborhood(e.target.value)}
                classinput="address-area-input"
              />
            </div>
            <div className="tel-area">
              <div className="div-inputs">
                <label htmlFor="telSuccess" className="label">
                  Qual telefone conseguiu contato?{" "}
                </label>
                <select
                  style={{ width: 135 }}
                  name=""
                  id="telSuccess"
                  defaultValue=""
                  onChange={(e) => setTelSuccess(e.target.value)}
                >
                  <option value={telSuccess} disabled>
                    Selecione...
                  </option>
                  {currentLead.leads_tel_1 && (
                    <option value={currentLead.leads_tel_1}>
                      {currentLead.leads_tel_1}
                    </option>
                  )}
                  {currentLead.leads_tel_2 && (
                    <option value={currentLead.leads_tel_2}>
                      {currentLead.leads_tel_2}
                    </option>
                  )}
                  {currentLead.leads_tel_3 && (
                    <option value={currentLead.leads_tel_3}>
                      {currentLead.leads_tel_3}
                    </option>
                  )}
                  {currentLead.leads_tel_4 && (
                    <option value={currentLead.leads_tel_4}>
                      {currentLead.leads_tel_4}
                    </option>
                  )}
                  {currentLead.leads_tel_5 && (
                    <option value={currentLead.leads_tel_5}>
                      {currentLead.leads_tel_5}
                    </option>
                  )}
                  {currentLead.leads_tel_6 && (
                    <option value={currentLead.leads_tel_6}>
                      {currentLead.leads_tel_6}
                    </option>
                  )}
                </select>
              </div>

              <FormInput
                label="Telefone 2"
                value={newTel2}
                type="text"
                name="newtel2"
                onChange={(e) => setNewTel2(e.target.value)}
                style={{ width: 120 }}
              />
              <FormInput
                label="Telefone 3"
                value={newTel3}
                type="text"
                name="newtel3"
                onChange={(e) => setNewTel3(e.target.value)}
                style={{ width: 120 }}
                classinput="tel"
              />
            </div>

            <div className="date-value">
              <FormInput
                label="Valor"
                value={valueDonation}
                onChange={(e) => setValueDonation(e.target.value)}
                style={{ width: 120 }}
                classinput="value-campain"
              />
              <FormInput
                label="Data"
                value={dateDonation}
                type="date"
                onChange={(e) => setDateDonation(e.target.value)}
                style={{ width: 180 }}
                classinput="value-campain"
              />
              <FormInput
                label="Campanha"
                value={campain}
                type="text"
                onChange={(e) => setCampain(e.target.value)}
                style={{ width: 220 }}
                classinput="value-campain"
              />
            </div>

            <div className="obs-area">
              <div className="obs-input">
                <label className="label" style={{ width: 100 }}>
                  Observação da Ficha
                </label>
                <textarea
                  className="text-area"
                  value={observation}
                  onChange={(e) => {
                    setObservation(e.target.value);
                  }}
                />
              </div>
              <div className="obs-input">
                <label className="label" style={{ width: 100 }}>
                  Referência do Doador
                </label>
                <textarea
                  className="text-area"
                  value={reference}
                  onChange={(e) => {
                    setReference(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="menu-action-button">
              <button
                onClick={() => setIsOpen(false)}
                className="info-lead-button-a"
              >
                {ICONS.BACK}Voltar
              </button>
              <button
                type="button"
                onClick={handleNewDonorAndDonation}
                className="info-lead-button-c"
                style={{ padding: 12 }}
              >
                Criar Nova doação
              </button>
            </div>
          </form>
        )}

        {isSchedulingOpen && (
          <form className="scheduling">
            <h3>Agendamento</h3>

            <FormInput
              label="Data"
              value={dateScheduling}
              onChange={handleSchedulingDateChange}
              type="date"
              style={{ width: 160 }}
            />
            <div className="obs-input">
              <label className="label" style={{ width: 100 }}>
                Observação
              </label>
              <textarea
                value={observationScheduling}
                onChange={(e) => {
                  setObservationScheduling(e.target.value);
                }}
                style={{ width: 200 }}
              />
            </div>
            <button
              type="button"
              className="btn-scheduling"
              onClick={handleSchedulingClick}
            >
              Concluir
            </button>
          </form>
        )}

        <ToastContainer closeOnClick="true" />
      </div>
    </main>
  );
};

export default Leads;
