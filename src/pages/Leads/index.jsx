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
  insertDonor_tel_3,
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
  const [operatorType, setOperatorType] = useState(null);

  useEffect(() => {
    const operatorData = JSON.parse(localStorage.getItem("operatorData"));
    setOperatorID(operatorData?.operator_code_id);
    setOperatorType(operatorData?.operator_type);
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
      operatorData.operator_type
    );

    if (lead[0].leads_id) {
      await updateLeads(
        "Aberto",
        Number(currentOperatorID),
        lead[0].leads_id,
        operatorData.operator_type
      );
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [currentItem]);

  const handleNext = async () => {
    if (operatorType === "Operador Casa") {
      if (currentItem < items && currentLead?.leads_id) {
        const data = await updateLeads(
          "Não Atendeu",
          operatorID,
          currentLead.leads_id,
          "Operador Casa"
        );
        if (data[0].leads_status === "Não Atendeu") {
          const next = currentItem + 1;
          setCurrentItem(next);
        }
      }
    } else {
      if (currentItem < items && currentLead?.leads_id) {
        const data = await updateLeads(
          "Não Atendeu",
          operatorID,
          currentLead.leads_id
        );
        if (data[0].leads_status === "Não Atendeu") {
          const next = currentItem + 1;
          setCurrentItem(next);
        }
      }
    }
  };

  const handleNoDonation = async () => {
    if (operatorType === "Operador Casa") {
      const response = await updateLeads(
        "Não pode ajudar",
        Number(operatorID),
        currentLead.leads_id,
        "Operador Casa"
      );
      if (response.length > 0) {
        const next = currentItem + 1;
        setCurrentItem(next);
      }
    } else {
      const response = await updateLeads(
        "Não pode ajudar",
        Number(operatorID),
        currentLead.leads_id
      );
      if (response.length > 0) {
        const next = currentItem + 1;
        setCurrentItem(next);
      }
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
    setDateScheduling(value);
  };

  const handleAction = (e) => {
    setIsSchedulingOpen(false);
    setIsOpen(true);
    setAddress(currentLead.leads_address);
    setCity(currentLead.leads_city ? currentLead.leads_city : "RIO DE JANEIRO");
    setNeighborhood(currentLead.leads_neighborhood);
  };

  const handleSchedulingClick = async () => {
    let typeOperator;
    if (operatorType === "Operador Casa") {
      typeOperator = "leads_casa";
    } else {
      typeOperator = "leads";
    }
    try {
      const { data, error } = await supabase
        .from(typeOperator)
        .update([
          {
            leads_date_accessed: DataNow("noformated"),
            leads_scheduling_date: dateScheduling,
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
    let type;
    if (operatorType === "Operador Casa") {
      type = "leads_casa";
    } else {
      type = "leads";
    }
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
              await insertDonor_tel_3(data[0].donor_id, newTel3);
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
                    donation_day_contact: DataNow("noformated"),
                    donation_day_to_receive: dateDonation,
                    donation_print: "Não",
                    donation_received: "Não",
                    donation_description: observation,
                    donation_campain: campain,
                  },
                ])
                .select();

              if (donationError) throw donationError;
            }

            console.log(type);

            const { data: update, error } = await supabase
              .from(type)
              .update({ leads_status: "Sucesso" })
              .eq("leads_id", currentLead.leads_id);
            if (error) throw error;

            const next = currentItem + 1;
            setCurrentItem(next);
            setIsOpen(false);

            setAddress("");
            setCity("");
            setNeighborhood("");
            setNewTel2("");
            setNewTel3("");
            setTelSuccess("");
            setCampain("");
            setObservation("");
            setReference("");
            setDateDonation("");
            setValueDonation("");

            return "Processo concluido com sucesso!";
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
                    marginTop: "10px",
                  }}
                >
                  <button className="btn-next" onClick={handleNext}>
                    Não Atendeu
                  </button>
                </div>
                <div>
                  <p>{items}</p>
                </div>
              </>
            )}
          </div>
        )}

        {isOpen && (
          <form className="menu-action-lead">
            <div className="input-group">
              <FormInput
                label="Endereço"
                value={address}
                type="text"
                name="address"
                onChange={(e) => setAddress(e.target.value)}
              />
              <FormInput
                label="Cidade"
                value={city}
                type="text"
                name="city"
                onChange={(e) => setCity(e.target.value)}
              />
              <FormInput
                label="Bairro"
                value={neighborhood}
                type="text"
                name="neighborhood"
                onChange={(e) => setNeighborhood(e.target.value)}
              />
            </div>
            <div className="input-group">
              <div className="input-field">
                <label htmlFor="telSuccess">
                  Qual telefone conseguiu contato?{" "}
                </label>
                <select
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
                label="Tel. 2"
                value={newTel2}
                type="text"
                name="newtel2"
                onChange={(e) => setNewTel2(e.target.value)}
              />
              <FormInput
                label="Tel. 3"
                value={newTel3}
                type="text"
                name="newtel3"
                onChange={(e) => setNewTel3(e.target.value)}
              />
            </div>

            <div className="input-group">
              <FormInput
                label="Valor"
                value={valueDonation}
                onChange={(e) => setValueDonation(e.target.value)}
              />
              <FormInput
                label="Data"
                value={dateDonation}
                type="date"
                onChange={(e) => setDateDonation(e.target.value)}
              />
              <div className="input-field">
                <label>Campanha</label>
                <select
                  value={campain}
                  onChange={(e) => setCampain(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  <option value="fralda">Fralda</option>
                  <option value="manutenção">Manutenção</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <div className="input-field">
                <label>Observação da Ficha</label>
                <textarea
                  className="text-area"
                  value={observation}
                  onChange={(e) => {
                    setObservation(e.target.value);
                  }}
                />
              </div>
              <div className="input-field">
                <label>Referência do Doador</label>
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
            />
            <div className="input-field">
              <label>Observação</label>
              <textarea
                value={observationScheduling}
                onChange={(e) => {
                  setObservationScheduling(e.target.value);
                }}
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
