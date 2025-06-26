import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Loader";
import getPackage from "../../helper/getPackage";

const CreatePackage = ({setDataForm, setCreatePackage, setDate, date}) => {
  const [requestPackage, setRequestPackage] = useState({
    name: "",
    type: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);

  const handlePackageChange = (field, value) => {
    setRequestPackage((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddData = async () => {
    if 
      ([requestPackage.startDate,
      requestPackage.endDate,
      requestPackage.name,
      requestPackage.type].some((v) => v === ""))
     {
      toast.warning("Preencha todos os campos necessários");
      return;
    }
    setLoading(true)
    if (new Date(requestPackage.startDate) > new Date(requestPackage.endDate)) {
      toast.error("A data de início não pode ser maior que a data de término");
      setLoading(false)
      return;
    }
    if (date.some((d) => requestPackage.startDate >= d.startDate && requestPackage.startDate <= d.endDate)) {
      toast.error("Já existe um pacote com essas datas");
      setLoading(false)
      return;
    }

    const response = await getPackage(requestPackage)
  
    if (response){
       setDataForm(true)
       const cPackage = response.map((item) => ({
        ...item, request_name: requestPackage.name
       }))
       setCreatePackage((cp) => ([...(cp || []), ...cPackage]))
       setDate((date) => [...date, {startDate: requestPackage.startDate, endDate: requestPackage.endDate}])
    }
    setLoading(false)
  };

  return (
    <div className="request-front-left-top">
      <div className="input-field">
        <label>Nome Pacote</label>
        <input
          type="text"
          value={requestPackage.name}
          onChange={(e) => handlePackageChange("name", e.target.value)}
        />
      </div>
      <div className="input-field">
        <label>Tipo</label>
        <select
          value={requestPackage.type}
          onChange={(e) => handlePackageChange("type", e.target.value)}
        >
          <option value="" disabled>
            Selecione...
          </option>
          <option value="Avulso">Avulso</option>
          <option value="Mensal">Mensal</option>
          <option value="Todos">Todos</option>
        </select>
      </div>
      <div className="request-date">
        <div className="input-field">
          <label>De</label>
          <input
            type="date"
            value={requestPackage.startDate}
            onChange={(e) => handlePackageChange("startDate", e.target.value)}
          />
        </div>
        <div className="input-field">
          <label>Até</label>
          <input
            type="date"
            value={requestPackage.endDate}
            onChange={(e) => handlePackageChange("endDate", e.target.value)}
          />
        </div>
        <button onClick={handleAddData}>{loading ? <Loader/> : "Adicionar Data"}</button>
      </div>
    </div>
  );
};

export default CreatePackage;
