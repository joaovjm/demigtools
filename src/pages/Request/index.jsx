import { useEffect, useRef, useState } from "react";
import "./index.css";
import DateSelected from "../../components/Request/DateSelected";
import DonationValues from "../../components/Request/DonationValues";
import CreatePackage from "../../components/Request/CreatePackage";
import DonationTable from "../../components/Request/DonationTable";
import RequestCard from "../../components/Request/RequestCard";
import RequestsTable from "../../components/Request/RequestsTable";
import {
  addEndDataInCreatePackage,
  distributePackageService,
  fetchOperatorID,
} from "../../services/distributePackageService";
import insertRequest from "../../helper/insertRequest";
import { toast } from "react-toastify";
import PackagesRequest from "../../components/Request/PackagesRequest";
import { DataNow } from "../../components/DataTime";
import ExportToExcel from "../../components/XLSX";
import { ICONS } from "../../constants/constants";

const Request = () => {
  // Sistema de etapas
  const [currentStep, setCurrentStep] = useState(1);
  const [createPackage, setCreatePackage] = useState([]);
  const [date, setDate] = useState([]);
  const [perOperator, setPerOperator] = useState({});
  const [unassigned, setUnassigned] = useState([]);
  const [operatorID, setOperatorID] = useState();
  const [operatorIDState, setOperatorIDState] = useState();
  const [operatorName, setOperatorName] = useState({});
  const [selected, setSelected] = useState(null);
  const [continueClick, setContinueClick] = useState(false);
  const [cancelClick, setCancelClick] = useState(false);
  const [createPackageState, setCreatePackageState] = useState([]);
  const [selection, setSelection] = useState([]);
  const [endDateRequest, setEndDateRequest] = useState("");
  const [buttonTest, setButtonTest] = useState(false);
  const [showCreatePackage, setShowCreatePackage] = useState(false);

  const divRef = useRef();

  useEffect(() => {
    if (createPackage.length > 0) {
      // Scroll automático para o final da tela quando a Etapa 1 aparecer
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }, 400); // Pequeno delay para garantir que o conteúdo foi renderizado
    }
  }, [createPackage.length]);

  useEffect(() => {
    distributePackageService(
      createPackage,
      setPerOperator,
      setUnassigned,
      setOperatorName
    );
  }, [createPackage]);

  useEffect(() => {
    setCreatePackageState(createPackage);
  }, [currentStep === 2]);

  useEffect(() => {
    fetchOperatorID(setOperatorID, setOperatorIDState);
  }, [showCreatePackage]);

  const handleCancel = () => {
    setCurrentStep(1);
    setCreatePackage([]);
    setDate([]);
    setPerOperator({});
    setUnassigned([]);
    setOperatorID([]);
    setOperatorName({});
    setSelected(null);
    setContinueClick(false);
    setCancelClick((c) => !c);
    setCreatePackageState([]);
    setOperatorIDState([]);
    setButtonTest(false);
    setEndDateRequest("");
    setShowCreatePackage(false);
  };

  const handleStartNewPackage = () => {
    setShowCreatePackage(true);
    setCurrentStep(1);
    setCreatePackage([]);
    setDate([]);
    setPerOperator({});
    setUnassigned([]);
    setOperatorID([]);
    setOperatorName({});
    setSelected(null);
    setContinueClick(false);
    setCreatePackageState([]);
    setOperatorIDState([]);
    setButtonTest(false);
    setEndDateRequest("");
  };

  const handleReset = () => {
    setCreatePackage(createPackageState);
    setOperatorID(operatorIDState);
  };

  const handleConclude = async () => {
    if (endDateRequest === "") {
      toast.warning("Preencha a data final da requisição!");
      return;
    }
    if (endDateRequest < DataNow("noformated")) {
      toast.warning("A data final não pode ser menor que a data atual!");
      return;
    }
    const updatePackage = await addEndDataInCreatePackage(
      createPackage,
      setCreatePackage,
      endDateRequest
    );
    try {
      await toast.promise(insertRequest(updatePackage), {
        loading: "Criando o pacote da requisição...",
        success: "Pacote criado com sucesso!",
        error: "Não fio possível criar o pacote! Contacte o administrador!",
      });

      handleCancel();
    } catch (error) {
      console.error(error.message);
    }
  };

  /*const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };*/

  const handleStep1Complete = () => {
    setCurrentStep(2);
  };

  const handleStep2Complete = () => {
    setCurrentStep(3);
  };

  console.log(operatorID);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <CreatePackage
              createPackage={createPackage}
              setCreatePackage={setCreatePackage}
              setDate={setDate}
              date={date}
              setShowCreatePackage={setShowCreatePackage}
            />

            {createPackage.length > 0 && (
              <DateSelected
                date={date}
                onComplete={handleStep1Complete}
                onCancel={handleCancel}
                divRef={divRef}
              />
            )}
          </>
        );
      case 2:
        return (
          <DonationValues
            createPackage={createPackage}
            onComplete={handleStep2Complete}
            onCancel={handleCancel}
            divRef={divRef}
          />
        );

      case 3:
        return (
          <div className="request-step-4">
            <div className="request-step-4-left">
              <DonationTable
                unassigned={unassigned}
                selected={selected}
                setSelected={setSelected}
                createPackage={createPackage}
                setCreatePackage={setCreatePackage}
                operatorID={operatorID}
                selection={selection}
                buttonTest={buttonTest}
                setButtonTest={setButtonTest}
              />
            </div>
            <div className="request-step-4-right">
              <div className="request-step-4-right-body">
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
                    allOperator={operatorID}
                    setAllOperator={setOperatorID}
                    selection={selection}
                    setSelection={setSelection}
                  />
                ))}
              </div>
              <div className="request-step-4-right-bottom">
                <div className="input-field">
                  <label>Data fim da requisição</label>
                  <input
                    type="date"
                    value={endDateRequest}
                    onChange={(e) => setEndDateRequest(e.target.value)}
                  />
                </div>
                <button onClick={handleCancel} className="request-btn cancel">
                  Cancelar
                </button>
                <button onClick={handleReset} className="request-btn reset">
                  Resetar
                </button>
                {buttonTest ? (
                  <ExportToExcel
                    jsonData={createPackage}
                    fileName={createPackage[0].request_name}
                  />
                ) : (
                  <button
                    onClick={handleConclude}
                    className="request-btn conclude"
                  >
                    Concluir
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="request-main">
      <div className="request-container">
        {/* Header compacto com navegação das etapas - só aparece quando showCreatePackage é true */}
        {showCreatePackage && (
          <div className="request-header-compact">
            <h2 className="request-title-compact">
              {ICONS.MONEY} Gerenciamento de Requisições
            </h2>
            <div className="request-steps-compact">
              <div
                className={`step-compact ${currentStep >= 1 ? "active" : ""} ${
                  currentStep > 1 ? "completed" : ""
                }`}
              >
                <span className="step-number-compact">1</span>
                <span className="step-label-compact">Criar Pacote</span>
              </div>
              <div
                className={`step-compact ${currentStep >= 2 ? "active" : ""} ${
                  currentStep > 2 ? "completed" : ""
                }`}
              >
                <span className="step-number-compact">2</span>
                <span className="step-label-compact">Valores</span>
              </div>
              <div className={`step-compact ${currentStep >= 3 ? "active" : ""}`}>
                <span className="step-number-compact">3</span>
                <span className="step-label-compact">Distribuir</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabela de Requisições Criadas */}
        {!showCreatePackage && (
          <RequestsTable />
        )}

        {/* Botão para iniciar criação de novo pacote */}
        {!showCreatePackage && (
          <div className="new-package-button-container">
            <button 
              onClick={handleStartNewPackage}
              className="request-btn primary new-package-btn"
            >
              {ICONS.PLUS} Criar Novo Pacote
            </button>
          </div>
        )}

        {/* Conteúdo da etapa atual - só aparece quando showCreatePackage é true */}
        {showCreatePackage && (
          <div className="request-content">{renderStepContent()}</div>
        )}
      </div>
    </div>
  );
};

export default Request;
