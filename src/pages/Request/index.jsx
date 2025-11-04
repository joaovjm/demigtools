import { useEffect, useRef, useState } from "react";
import styles from "./request.module.css";
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
import EditRequestCreated from "../../components/Request/EditRequestCreated";

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
  const [showEditRequestCreated, setShowEditRequestCreated] = useState(false);
  const [requestId, setRequestId] = useState(null);
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

  // Ativar edição quando requestId for definido
  useEffect(() => {
    if (requestId) {
      setShowEditRequestCreated(true);
    }
  }, [requestId]);

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

  const handleStep1Complete = () => {
    setCurrentStep(2);
  };

  const handleStep2Complete = () => {
    setCurrentStep(3);
  };

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
          <div className={styles.requestStep4}>
            <div className={styles.requestStep4Left}>
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
            <div className={styles.requestStep4Right}>
              <div className={styles.requestStep4RightBody}>
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
              <div className={styles.requestStep4RightBottom}>
                <div className={styles.inputField}>
                  <label>Data fim da requisição</label>
                  <input
                    type="date"
                    value={endDateRequest}
                    onChange={(e) => setEndDateRequest(e.target.value)}
                  />
                </div>
                <button onClick={handleCancel} className={`${styles.requestBtn} ${styles.cancel}`}>
                  Cancelar
                </button>
                <button onClick={handleReset} className={`${styles.requestBtn} ${styles.reset}`}>
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
                    className={`${styles.requestBtn} ${styles.conclude}`}
                  >
                    Concluir
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case showEditRequestCreated: 
        return <EditRequestCreated requestId={requestId} onClose={() => setShowEditRequestCreated(false)} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.requestMain}>
      <div className={styles.requestContainer}>
        {/* Header compacto com navegação das etapas - só aparece quando showCreatePackage é true */}
        {showCreatePackage && (
          <div className={styles.requestHeaderCompact}>
            <h2 className={styles.requestTitleCompact}>
              {ICONS.MONEY} Gerenciamento de Requisições
            </h2>
            <div className={styles.requestStepsCompact}>
              <div
                className={`${styles.stepCompact} ${currentStep >= 1 ? styles.active : ""} ${
                  currentStep > 1 ? styles.completed : ""
                }`}
              >
                <span className={styles.stepNumberCompact}>1</span>
                <span className={styles.stepLabelCompact}>Criar Pacote</span>
              </div>
              <div
                className={`${styles.stepCompact} ${currentStep >= 2 ? styles.active : ""} ${
                  currentStep > 2 ? styles.completed : ""
                }`}
              >
                <span className={styles.stepNumberCompact}>2</span>
                <span className={styles.stepLabelCompact}>Valores</span>
              </div>
              <div className={`${styles.stepCompact} ${currentStep >= 3 ? styles.active : ""}`}>
                <span className={styles.stepNumberCompact}>3</span>
                <span className={styles.stepLabelCompact}>Distribuir</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabela de Requisições Criadas */}
        {!showCreatePackage && !showEditRequestCreated && (
            <RequestsTable setRequestId={setRequestId} />
        )}

        {showEditRequestCreated && (
          <EditRequestCreated 
            requestId={requestId} 
            onClose={() => {
              setShowEditRequestCreated(false);
              setRequestId(null);
            }} 
          />
        )}

        {/* Botão para iniciar criação de novo pacote */}
        {!showCreatePackage && !showEditRequestCreated && (
          <div className={styles.newPackageButtonContainer}>
            <button 
              onClick={handleStartNewPackage}
              className={`${styles.requestBtn} ${styles.primary} ${styles.newPackageBtn}`}
            >
              {ICONS.PLUS} Criar Novo Pacote
            </button>
          </div>
        )}

        {/* Conteúdo da etapa atual - só aparece quando showCreatePackage é true */}
        {showCreatePackage && (
          <div className={styles.requestContent}>{renderStepContent()}</div>
        )}
      </div>
    </div>
  );
};

export default Request;
