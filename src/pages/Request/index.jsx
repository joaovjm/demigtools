import { useEffect, useState } from "react";
import "./index.css";
import DateSelected from "../../components/Request/DateSelected";
import DonationValues from "../../components/Request/DonationValues";
import CreatePackage from "../../components/Request/CreatePackage";
import DonationTable from "../../components/Request/DonationTable";
import RequestCard from "../../components/Request/RequestCard";
import {
  addEndDataInCreatePackage,
  distributePackageService,
} from "../../services/distributePackageService";
import insertRequest from "../../helper/insertRequest";
import { toast } from "react-toastify";
import PackagesRequest from "../../components/Request/PackagesRequest";
import { DataNow } from "../../components/DataTime";

const Request = () => {
  const [dataForm, setDataForm] = useState(false);
  const [filterForm, setFilterForm] = useState(false);
  const [requestForm, setRequestForm] = useState(false);
  const [createPackage, setCreatePackage] = useState([]);
  const [date, setDate] = useState([]);
  const [perOperator, setPerOperator] = useState({});
  const [unassigned, setUnassigned] = useState([]);
  const [operatorID, setOperatorID] = useState([]);
  const [operatorName, setOperatorName] = useState({});
  const [selected, setSelected] = useState(null);
  const [continueClick, setContinueClick] = useState(false);
  const [createPackageState, setCreatePackageState] = useState([]);
  const [endDateRequest, setEndDateRequest] = useState("");

  useEffect(() => {
    distributePackageService(
      createPackage,
      setPerOperator,
      setUnassigned,
      setOperatorID,
      setOperatorName
    );
  }, [createPackage]);
  useEffect(() => {
    if (continueClick) {
      setCreatePackageState(createPackage);
    }

  }, [continueClick]);

  const handleCancel = () => {
    setDataForm(false);
    setFilterForm(false);
    setRequestForm(false);
    setCreatePackage([]);
    setDate([]);
    setPerOperator({});
    setUnassigned([]);
    setOperatorID([]);
    setOperatorName({});
    setSelected(null);
    setContinueClick(false);
    setCreatePackageState([]);
  };

  const handleReset = () => {
    console.log(createPackageState)
    setCreatePackage(createPackageState);
  };

  const handleConclude = async () => {
    if(endDateRequest === ""){
    toast.warning("Preencha a data final da requisição!")
    return;
    }
    if(endDateRequest < DataNow("noformated")){
      toast.warning("A data final não pode ser menor que a data atual!")
      return;
    }
    const updatePackage = await addEndDataInCreatePackage(
      createPackage,
      setCreatePackage,
      endDateRequest
    );
    try {
      await toast.promise(insertRequest(updatePackage), {
        loading: 'Criando o pacote da requisição...',
        success: 'Pacote criado com sucesso!',
        error: 'Não fio possível criar o pacote! Contacte o administrador!'
      });

      setDataForm(false);
      setFilterForm(false);
      setRequestForm(false);
      setCreatePackage([]);
      setDate([]);
      setPerOperator({});
      setUnassigned([]);
      setOperatorID([]);
      setOperatorName({});
      setSelected(null);
      setContinueClick(false);
      setCreatePackageState([]);
      setEndDateRequest("");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="request-main">
      <div className="request-front">
        <div className="request-front-left">
          {!filterForm && !requestForm && (
              <CreatePackage
                setDataForm={setDataForm}
                createPackage={createPackage}
                setCreatePackage={setCreatePackage}
                setDate={setDate}
                date={date}
              />
          )}

          {!dataForm && !filterForm && !requestForm && (
            <PackagesRequest />
          )}

          {dataForm ? (
            <DateSelected
              date={date}
              setDataForm={setDataForm}
              setFilterForm={setFilterForm}
              setContinueClick={setContinueClick}
            />
          ) : filterForm ? (
            <DonationValues
              createPackage={createPackage}
              setFilterForm={setFilterForm}
              setRequestForm={setRequestForm}
              handleCancel={handleCancel}
            />
          ) : (
            requestForm && (
              <DonationTable
                unassigned={unassigned}
                selected={selected}
                setSelected={setSelected}
                createPackage={createPackage}
                setCreatePackage={setCreatePackage}
                operatorID={operatorID}
              />
            )
          )}
        </div>
        {requestForm && (
          <div className="request-front-right">
            <div className="request-front-right-body">
              {operatorID?.map((cp) => (
                <RequestCard
                  perOperator={perOperator[cp]}
                  setPerOperator={setPerOperator}
                  key={cp}
                  operatorName={operatorName[cp]}
                  operatorID={cp}
                  selected={selected}
                  setSelected={setSelected}
                  createPackage={createPackage}
                  setCreatePackage={setCreatePackage}
                  unassigned={unassigned}
                  setUnassigned={setUnassigned}
                />
              ))}
            </div>
            <div className="request-front-right-bottom">
              <div className="input-field">
                <label>Data fim da requisição</label>
                <input
                  type="date"
                  value={endDateRequest}
                  onChange={(e) => setEndDateRequest(e.target.value)}
                />
              </div>
              <button
                onClick={handleCancel}
                className="request-front-right-bottom-cancel"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                className="request-front-right-bottom-reset"
              >
                Resetar
              </button>
              <button
                onClick={handleConclude}
                className="request-front-right-bottom-conclude"
              >
                Concluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Request;
