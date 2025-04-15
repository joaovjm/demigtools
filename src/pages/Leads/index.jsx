import React, { useEffect, useState } from "react";
import "./index.css";
import GetLeads from "../../helper/getLeads";
import Loader from "../../components/Loader";
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

const Leads = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [active, setActive] = useState(null);
  const [isOpen, setIsOpen] = useState(null);
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [idSession, setIdSession] = useState("");
  const [isLead, setIsLead] = useState([]);
  const [formatedDate, setFormatedDate] = useState("");
  const [name, setName] = useState("");
  const [tel1, setTel1] = useState("");
  const [tel2, setTel2] = useState("");
  const [tel3, setTel3] = useState("");
  const [tel4, setTel4] = useState("");
  const [tel5, setTel5] = useState("");
  const [tel6, setTel6] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [newTel2, setNewTel2] = useState("");
  const [newTel3, setNewTel3] = useState("");
  const [telSuccess, setTelSuccess] = useState("");
  const [observation, setObservation] = useState("");
  const [reference, setReference] = useState("");
  const [dateDonation, setDateDonation] = useState("");
  const [dateScheduling, setDateScheduling] = useState("");
  const [observationScheduling, setObservationScheduling] = useState("");
  const [valueDonation, setValueDonation] = useState("");
  const [operatorData, setOperatorData] = useState([]);

  useEffect(() => {
    const GetSession = async () => {
      const session = await getSession();
      setIdSession(session.user.id);
    };

    GetSession();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    GetLeads(itemsPerPage, currentPage, setItems, setTotalItems);
    setIsLoading(false);
  }, [currentPage, isSchedulingOpen === false, isOpen === false]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const goToPages = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOpenDetails = (e) => {
    setIsLead(e);
    setIsOpen(false);
    setActive(e.leads_id);
    setName(e.leads_name);
    setTel1(e.leads_tel_1);
    setTel2(e.leads_tel_2);
    setTel3(e.leads_tel_3);
    setTel4(e.leads_tel_4);
    setTel5(e.leads_tel_5);
    setTel6(e.leads_tel_6);
  };

  const handleAccident = () => {
    setActive(false);
    setIsSchedulingOpen(false);
    setIsOpen(false);
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
      console.log(value);
    }
    setFormatedDate(`${DataSelect(value)}`);
    setDateScheduling(value);
  };

  const handleAction = (e) => {
    setIsSchedulingOpen(false);
    setIsOpen(true);
    setAddress(isLead.leads_address);
    setCity(isLead.leads_city);
    setNeighborhood(isLead.leads_neighborhood);
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
        .eq("leads_id", isLead.leads_id)
        .select();

      if (error) throw error;

      if (!error) {
        toast.success("Agendado com sucesso!");
        setIsSchedulingOpen(false);
        setActive(false);
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
      telSuccess === ""
    ) {
      toast.warning("Preencha todos os campos obrigatórios!");
    } else {
      toast.promise(
        (async () => {
          try {
            const data = await insertDonor(
              isLead.leads_name,
              "Lista",
              isLead.leads_address,
              isLead.leads_city,
              isLead.leads_neighborhood,
              telSuccess
            );

            if (data.length > 0) {
              console.log("Doador Criado com Sucesso");
            }

            const cpf = await insertDonor_cpf(
              data[0].donor_id,
              isLead.leads_icpf
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
              const { data: operator } = await supabase
                .from("operator")
                .select("operator_code_id")
                .eq("operator_uuid", idSession);

              const { data: donation, error: donationError } = await supabase
                .from("donation")
                .insert([
                  {
                    donor_id: data[0].donor_id,
                    operator_code_id: operator[0].operator_code_id,
                    donation_value: valueDonation,
                    donation_day_contact: DataNow(),
                    donation_day_to_receive: DataSelect(dateDonation),
                    donation_print: "Não",
                    donation_received: "Não",
                    donation_description: observation,
                  },
                ])
                .select();

              if (donationError) throw donationError;
              successMessage = "Doação criada com sucesso!";
            }

            // Independente da doação, mover o lead para leads_excludes e deletar
            const { data: ChangeLead, error: ErroChange } = await supabase
              .from("leads_excludes")
              .insert(isLead)
              .select();
            
            if (ErroChange) {
              console.error("Erro ao inserir em leads_excludes:", ErroChange.message);
              throw ErroChange;
            }

            const { data: DeleteLead, error: ErroDelete } = await supabase
              .from("leads")
              .delete()
              .eq("leads_id", isLead.leads_id)
              .select();
            
            if (ErroDelete) {
              console.error("Erro ao deletar de leads:", ErroDelete.message);
              throw ErroDelete;
            }

            // Reset form after successful operation
            setIsOpen(false);
            setActive(false);

            return successMessage;
          } catch (error) {
            console.error("Erro na operação:", error.message);
            throw error;
          }
        })(),
        {
          pending: "Processando doação...",
          success: (message) => message,
          error: "Erro ao processar a operação"
        }
      );
    }
  };
  return (
    <main className="main-leads">
      <div className="section-leads">
        <h3 className="header-leads">Leads</h3>
        <div className="container-leads">
          {isLoading ? (
            <p>
              <Loader />
            </p>
          ) : (
            <div className="container-pagination">
              <div className="card-lead">
                {items.map((item) => (
                  <div
                    onClick={(e) => handleOpenDetails(item)}
                    key={item.leads_id}
                    className={`names-leads ${
                      active === item.leads_id ? "active" : ""
                    }`}
                  >
                    {item.leads_name}
                    <div className="status-lead">
                      <p style={{ fontSize: 12 }}>
                        contato:{" "}
                        {item.leads_date_accessed
                          ? item.leads_date_accessed
                          : "--/--/----"}
                      </p>
                      <p style={{ fontSize: 12 }}>
                        status:{" "}
                        {item.leads_status ? item.leads_status : "Nunca Ligado"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => goToPages(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>

                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className="pagination-button"
                  onClick={() => goToPages(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="section-info-leads">
        {active && (
          <div className="info-possible-donor">
            <h3>{name}</h3>
            <div className="info-lead">
              <div className="tel-lead">
                <p className="paragraph">Telefone 1: {tel1}</p>
                <p className="paragraph">Telefone 2: {tel2}</p>
                <p className="paragraph">Telefone 3: {tel3}</p>
                <p className="paragraph">Telefone 4: {tel4}</p>
                <p className="paragraph">Telefone 5: {tel5}</p>
                <p className="paragraph">Telefone 6: {tel6}</p>
              </div>
              <div className="btn-lead">
                <button onClick={handleAccident} className="info-lead-button-a">
                  Abrir por acidente
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
            </div>
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
                  {tel1 && <option value={tel1}>{tel1}</option>}
                  {tel2 && <option value={tel2}>{tel2}</option>}
                  {tel3 && <option value={tel3}>{tel3}</option>}
                  {tel4 && <option value={tel4}>{tel4}</option>}
                  {tel5 && <option value={tel5}>{tel5}</option>}
                  {tel6 && <option value={tel6}>{tel6}</option>}
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
                name="mewtel3"
                onChange={(e) => setNewTel3(e.target.value)}
                style={{ width: 120 }}
              />
            </div>

            <div className="date-value">
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
            </div>

            <div className="obs-area">
              <div className="obs-input">
                <label className="label" style={{ width: 100 }}>
                  Observação da Ficha
                </label>
                <textarea
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
                  value={reference}
                  onChange={(e) => {
                    setReference(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="menu-action-button">
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
