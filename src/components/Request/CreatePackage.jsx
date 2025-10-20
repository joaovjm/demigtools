import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Loader";
import getPackage from "../../helper/getPackage";
import { FaTimes } from "react-icons/fa";

const CreatePackage = ({
  createPackage,
  setCreatePackage,
  setDate,
  date,
  setShowCreatePackage,
}) => {
  const [requestPackage, setRequestPackage] = useState({
    name: "",
    type: "",
    startDate: "",
    endDate: "",
    filterPackage: "",
  });
  const [loading, setLoading] = useState(false);

  const handlePackageChange = (field, value) => {
    setRequestPackage((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddData = async () => {
    if (
      [
        requestPackage.startDate,
        requestPackage.endDate,
        requestPackage.name,
        requestPackage.type,
        requestPackage.filterPackage,
      ].some((v) => v === "")
    ) {
      toast.warning("Preencha todos os campos necessários");
      return;
    }
    setLoading(true);
    if (new Date(requestPackage.startDate) > new Date(requestPackage.endDate)) {
      toast.error("A data de início não pode ser maior que a data de término");
      setLoading(false);
      return;
    }
    if (
      date.some(
        (d) =>
          requestPackage.startDate >= d.startDate &&
          requestPackage.startDate <= d.endDate
      ) &&
      createPackage.some((cp) => cp.donor_type === requestPackage.type)
    ) {
      toast.error("Já existe um pacote mesmo nome e mesma datas");
      setLoading(false);
      return;
    }

    const response = await getPackage(requestPackage);
   
    if (response) {
      const cPackage = response.map((item) => ({
        ...item,
        request_name: requestPackage.name,
      }));
      setCreatePackage((cp) => [...(cp || []), ...cPackage]);
      setDate((date) => [
        ...date,
        {
          startDate: requestPackage.startDate,
          endDate: requestPackage.endDate,
        },
      ]);
      
    } else {
      toast.error("Não foi possível criar o pacote, altere a data final");
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  return (
    <div className="request-step-container">
      <div className="request-step-header">
        <h3>Etapa 1: Criação do Pacote Base</h3>
        <p>Configure o nome do pacote e as datas para busca das doações</p>
      </div>
      
      <div className="request-step-content">
        <div className="request-form">
          <div className="form-section">
            <h4>Informações do Pacote</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Nome do Pacote *</label>
                <input
                  type="text"
                  value={requestPackage.name}
                  onChange={(e) => handlePackageChange("name", e.target.value)}
                  placeholder="Ex: Campanha Leite 2024"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Tipo de Doação *</label>
                <select
                  value={requestPackage.type}
                  onChange={(e) => handlePackageChange("type", e.target.value)}
                  className="form-select"
                >
                  <option value="" disabled>
                    Selecione o tipo...
                  </option>
                  <option value="Avulso">Avulso</option>
                  <option value="Mensal">Mensal</option>
                  <option value="Lista">Lista</option>
                  <option value="Todos">Todos</option>
                </select>
              </div>
              <div className="form-group">
                <label>Buscar Por </label>
                <select value={requestPackage.filterPackage} onChange={(e) => handlePackageChange("filterPackage", e.target.value)} className="form-select">
                  <option value="" disabled>
                    Selecione o tipo de filtro...
                  </option>
                  <option value="max">Maior valor</option>
                  <option value="min">Menor valor</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Período de Busca</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Data Inicial *</label>
                <input
                  type="date"
                  value={requestPackage.startDate}
                  onChange={(e) => handlePackageChange("startDate", e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Data Final *</label>
                <input
                  type="date"
                  value={requestPackage.endDate}
                  onChange={(e) => handlePackageChange("endDate", e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button onClick={() => setShowCreatePackage(false)} className="request-btn secondary">
              <FaTimes /> Cancelar
            </button>
            <button 
              onClick={handleAddData}
              disabled={loading}
              className="request-btn primary"
            >
              {loading ? <Loader /> : "Criar Pacote"}
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePackage;
