import { useEffect, useState } from "react";
import "./index.css";
import { DataSelect } from "../../components/DataTime";
import { monthHystoryChecker } from "../../helper/monthHistoryChecker";
import { monthlyfeeGenerator } from "../../helper/monthlyfeeGenerator";
import { GiConfirmed } from "react-icons/gi";
import { FaCalendarAlt, FaBullhorn, FaCog } from "react-icons/fa";
import Loader from "../../components/Loader";
import { getCampains } from "../../helper/getCampains";

const CreateMensalDonation = () => {
  const [mesrefGenerator, setMesrefGenerator] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [contador, setContador] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [campain, setCampain] = useState([]);
  const [campainSelected, setCampainSelected] = useState("");

  const fetchCampains = async () => {
    const response = await getCampains();
    setCampain(response);
  };

  useEffect(() => {
    fetchCampains();
  }, []);

  const onMonthHystoryChecker = async (e) => {
    const value = e.target.value;
    setMesrefGenerator(value);
    setIsDisable(await monthHystoryChecker(value));
    setConfirmed(false);
  };

  const handleGerar = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    const count = await monthlyfeeGenerator({
      mesRefGenerator: mesrefGenerator,
      campain: campainSelected,
    });

    if (count >= 0) {
      setContador(count);
      setConfirmed(true);
    }
    setIsLoading(false)
  };

  return (
    <div className="create-mensal-donation-container">
      <div className="create-mensal-donation-content">
        <div className="create-mensal-donation-header">
          <h3 className="create-mensal-donation-title">
            <FaCog className="title-icon" />
            Gerador de Mensalidades
          </h3>
          <p className="create-mensal-donation-subtitle">
            Configure e gere mensalidades para campanhas específicas
          </p>
        </div>

        <div className="create-mensal-donation-form">
          {/* Seção de Configuração */}
          <div className="create-mensal-donation-section">
            <h4 className="section-title">
              <FaCalendarAlt className="section-icon" />
              Configuração da Mensalidade
            </h4>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Mês Referente *</label>
                <input
                  type="date"
                  value={mesrefGenerator}
                  onChange={onMonthHystoryChecker}
                  className="create-mensal-donation-input"
                  placeholder="Selecione o mês"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Campanha *</label>
                <select
                  value={campainSelected}
                  onChange={(e) => setCampainSelected(e.target.value)}
                  className="create-mensal-donation-select"
                >
                  <option value="" disabled>
                    Selecione uma campanha...
                  </option>
                  {campain?.map((cp) => (
                    <option key={cp.id} value={cp.campain_name}>
                      {cp.campain_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                className="create-mensal-donation-btn primary"
                onClick={handleGerar}
                disabled={isDisable || confirmed || !mesrefGenerator || !campainSelected}
              >
                {isLoading ? (
                  <>
                    <Loader />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <FaBullhorn className="btn-icon" />
                    <span>Gerar Mensalidade</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Seção de Status */}
          <div className="create-mensal-donation-section">
            <h4 className="section-title">
              <GiConfirmed className="section-icon" />
              Status da Operação
            </h4>
            
            <div className="status-container">
              {!isDisable && !confirmed && !isLoading && (
                <div className="status-message info">
                  <div className="status-icon">
                    <FaCog />
                  </div>
                  <div className="status-content">
                    <h5>Pronto para Gerar</h5>
                    <p>Configure o mês e a campanha para gerar as mensalidades</p>
                  </div>
                </div>
              )}

              {isDisable && (
                <div className="status-message warning">
                  <div className="status-icon">
                    <GiConfirmed />
                  </div>
                  <div className="status-content">
                    <h5>Mensalidade Já Gerada</h5>
                    <p>As mensalidades para este mês já foram processadas anteriormente</p>
                  </div>
                </div>
              )}

              {confirmed && (
                <div className="status-message success">
                  <div className="status-icon">
                    <GiConfirmed />
                  </div>
                  <div className="status-content">
                    <h5>Mensalidade Gerada com Sucesso!</h5>
                    <p>
                      <strong>{contador}</strong> mensalidades foram criadas para a campanha selecionada
                    </p>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="status-message loading">
                  <div className="status-icon">
                    <Loader />
                  </div>
                  <div className="status-content">
                    <h5>Processando...</h5>
                    <p>Gerando mensalidades, aguarde um momento</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMensalDonation;
