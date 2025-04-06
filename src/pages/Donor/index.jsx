import "./index.css";
import React, { useState, useEffect } from "react";

import TableDonor from "../../components/TableDonor";
import { useParams } from "react-router";
import { editDonor } from "../../helper/editDonor";
import { getInfoDonor } from "../../helper/getDonor";
import ModalDonation from "../../components/ModalDonation";
import Loader from "../../components/Loader";
import {
  BUTTON_TEXTS,
  DONOR_TYPES,
  FORM_LABELS,
  ICONS,
} from "../../constants/constants";

import FormTextArea from "../../components/forms/FormTextArea";
import FormDonorInput from "../../components/forms/FormDonorInput";
import FormListSelect from "../../components/forms/FormListSelect";

const Donor = () => {
  const { id } = useParams();

  const [donorData, SetDonorData] = useState({
    nome: "",
    tipo: "",
    cpf: "",
    endereco: "",
    cidade: "",
    bairro: "",
    telefone1: "",
    telefone2: "",
    telefone3: "",
    dia: "",
    mensalidade: "",
    media: "",
    observacao: "",
    referencia: "",
  });

  const [uiState, setUiState] = useState({
    edit: true,
    btnEdit: BUTTON_TEXTS.EDIT,
    showBtn: true,
    modalShow: false,
    loading: false,
  });

  const params = {};
  if (id) params.id = id;
  useEffect(() => {
    const loadDonorData = async () => {
      try {
        const data = await getInfoDonor(id);
        const donor = data[0];

        SetDonorData({
          nome: donor.donor_name,
          endereco: donor.donor_address,
          cidade: donor.donor_city,
          bairro: donor.donor_neighborhood,
          telefone1: donor.donor_tel_1,
          cpf: donor.donor_cpf?.donor_cpf || null,
          telefone2: donor.donor_tel_2?.donor_tel_2 || null,
          telefone3: donor.donor_tel_3?.donor_tel_3 || null,
          dia: donor.donor_mensal?.donor_mensal_day || null,
          mensalidade: donor.donor_mensal?.donor_mensal_monthly_fee || null,
          observacao: donor.donor_observation?.donor_observation || "",
          referencia: donor.donor_reference?.donor_reference || "",
          tipo: donor.donor_type,
        });
      } catch (error) {
        console.error("Erro ao carregar os dados do doador: ", error.message);
      }
    };

    loadDonorData();
  }, [id]);

  const handleInputChange = (field, value) => {
    SetDonorData((prev) => ({ ...prev, [field]: value }));
  };

  // Responsável por editar e salvar as informações do doador
  const handleEditDonor = async () => {
    if (uiState.btnEdit === BUTTON_TEXTS.SAVE) {
      if (
        donorData.tipo === DONOR_TYPES.MONTHLY &&
        (donorData.dia === null || donorData.mensalidade === null)
      ) {
        window.alert(
          "Os campos DIA e MENSALIDADE precisam ser preenchidos corretamente!"
        );
        return;
      }

      setUiState((prev) => ({ ...prev, loading: true }));

      try {
        const success = await editDonor(
          id,
          donorData.nome,
          donorData.tipo,
          donorData.cpf,
          donorData.endereco,
          donorData.cidade,
          donorData.bairro,
          donorData.telefone1,
          donorData.telefone2,
          donorData.telefone3,
          donorData.dia,
          donorData.mensalidade,
          donorData.observacao,
          donorData.referencia
        );

        if (success) {
          setUiState({
            edit: true,
            btnEdit: BUTTON_TEXTS.EDIT,
            showBtn: true,
            loading: false,
            modalShow: uiState.modalShow,
          });
        }
      } catch (error) {
        console.error("Erro ao editar o doador: ", error.message);
        setUiState((prev) => ({ ...prev, loading: false }));
      }
    } else {
      setUiState((prev) => ({
        ...prev,
        edit: false,
        btnEdit: BUTTON_TEXTS.SAVE,
        showBtn: false,
      }));
    }
  };

  const handleBack = () => window.history.back();

  return (
    <main className="containerDonor">
      {/* Cabeçalho com botões */}
      <header className="header-btns">
        <h2>{ICONS.MONEY} Doador</h2>
        <div className="header-actions">
          <button onClick={handleBack} className="btn-back">
            {ICONS.BACK} {BUTTON_TEXTS.BACK}
          </button>
          <div className="btns">
            <button
              onClick={handleEditDonor}
              className="btn-edit"
              disabled={uiState.loading}
            >
              {uiState.loading ? <Loader /> : uiState.btnEdit}
            </button>

            {uiState.showBtn && (
              <button
                onClick={() =>
                  setUiState((prev) => ({ ...prev, modalShow: true }))
                }
                type="submit"
                className="btn-add"
              >
                {BUTTON_TEXTS.CREATE_MOVIMENT}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Formulario com informações do doador */}
      <form className="formDonor">
        <FormDonorInput
          label={FORM_LABELS.NAME}
          value={donorData.nome}
          onChange={(e) => handleInputChange("nome", e.target.value)}
          readOnly={uiState.edit}
          className={"label"}
        />

        <FormListSelect
          label={FORM_LABELS.TYPE}
          value={donorData.tipo}
          onChange={(e) => handleInputChange("tipo", e.target.value)}
          disabled={uiState.edit}
          options={Object.values(DONOR_TYPES)}
          className={"label"}
        />

        <FormDonorInput
          label={FORM_LABELS.CPF}
          value={donorData.cpf}
          onChange={(e) => handleInputChange("cpf", e.target.value)}
          readOnly={uiState.edit}
          className={"label"}
        />

        <FormDonorInput
          label={FORM_LABELS.ADDRESS}
          value={donorData.endereco}
          onChange={(e) => handleInputChange("endereco", e.target.value)}
          readOnly={uiState.edit}
          className={"label"}
        />

        <FormDonorInput
          label={FORM_LABELS.CITY}
          value={donorData.cidade}
          onChange={(e) => handleInputChange("cidade", e.target.value)}
          readOnly={uiState.edit}
          className={"label"}
        />

        <FormDonorInput
          label={FORM_LABELS.NEIGHBORHOOD}
          value={donorData.bairro}
          onChange={(e) => handleInputChange("bairro", e.target.value)}
          readOnly={uiState.edit}
          className={"label"}
        />

        <FormDonorInput
          label={FORM_LABELS.PHONE1}
          value={donorData.telefone1}
          onChange={(e) => handleInputChange("telefone1", e.target.value)}
          readOnly={uiState.edit}
          className={"label"}
        />

        <FormDonorInput
          label={FORM_LABELS.PHONE2}
          value={donorData.telefone2}
          onChange={(e) => handleInputChange("telefone2", e.target.value)}
          readOnly={uiState.edit}
          className={"label"}
        />

        <FormDonorInput
          label={FORM_LABELS.PHONE3}
          value={donorData.telefone3}
          onChange={(e) => handleInputChange("telefone3", e.target.value)}
          readOnly={uiState.edit}
          className={"label"}
        />

        <FormDonorInput
          label={FORM_LABELS.DAY}
          value={donorData.dia}
          onChange={(e) => handleInputChange("dia", e.target.value)}
          readOnly={uiState.edit}
          disabled={donorData.tipo !== DONOR_TYPES.MONTHLY}
          className={"label"}
          style={{ width: '100%', maxWidth: 100 }}
        />

        <FormDonorInput
          label={FORM_LABELS.FEE}
          value={donorData.mensalidade}
          onChange={(e) => handleInputChange("mensalidade", e.target.value)}
          readOnly={uiState.edit}
          disabled={donorData.tipo != DONOR_TYPES.MONTHLY}
          className={"label"}
          style={{ width: '100%', maxWidth: 100 }}
        />

        <FormDonorInput
          label={FORM_LABELS.AVERAGE}
          value={donorData.media}
          onChange={(e) => handleInputChange("media", e.target.value)}
          readOnly={uiState.edit}
          disabled={donorData.tipo !== DONOR_TYPES.MONTHLY}
          className={"label"}
          style={{ width: '100%', maxWidth: 100 }}
        />

        <FormTextArea
          label={FORM_LABELS.OBSERVATION}
          value={donorData.observacao}
          onChange={(e) => handleInputChange("observacao", e.target.value)}
          readOnly={uiState.edit}
          className={"label"}
          name="observacao"
        />

        <FormTextArea
          label={FORM_LABELS.REFERENCE}
          value={donorData.referencia}
          onChange={(e) => handleInputChange("referencia", e.target.value)}
          readOnly={uiState.edit}
          className={"label"}
          name="referencia"
        />
      </form>
      {uiState.showBtn && (
        <TableDonor idDonor={id} modalShow={uiState.modalShow} />
      )}

      {uiState.modalShow && (
        <ModalDonation
          modalShow={uiState.modalShow}
          setModalShow={(show) =>
            setUiState((prev) => ({ ...prev, modalShow: show }))
          }
          mensalidade={donorData.mensalidade}
          tipo={donorData.tipo}
          donor_id={id}
        />
      )}
    </main>
  );
};

export default Donor;
