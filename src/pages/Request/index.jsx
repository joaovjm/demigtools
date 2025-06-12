import { useEffect, useState } from "react";
import "./index.css";
import DateSelected from "../../components/Request/DateSelected";
import DonationValues from "../../components/Request/DonationValues";
import CreatePackage from "../../components/Request/CreatePackage";
import DonationTable from "../../components/Request/DonationTable";
import RequestCard from "../../components/Request/RequestCard";
import { distributePackageService } from "../../services/distributePackageService";

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
    setCreatePackage(createPackageState);
  };

  const handleConclude = () => {
    console.log("Conclude button clicked");
  };

  return (
    <div className="request-main">
      <div className="request-front">
        <div className="request-front-left">
          <CreatePackage
            setDataForm={setDataForm}
            setCreatePackage={setCreatePackage}
            setDate={setDate}
            date={date}
          />

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
            />
          ) : (
            requestForm && (
              <DonationTable
                unassigned={unassigned}
                selected={selected}
                setSelected={setSelected}
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
                />
              ))}
            </div>
            <div className="request-front-right-bottom">
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
