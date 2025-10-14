import { FaCalendarAlt, FaMotorcycle } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";
import { GoAlertFill } from "react-icons/go";
import { IoMdArrowRoundBack } from "react-icons/io";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { TbArrowsExchange } from "react-icons/tb";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";

export const ICONS = {
  EXCHANGE: <TbArrowsExchange />,
  MOTORCYCLE: <FaMotorcycle />,
  CALENDAR: <FaCalendarAlt />,
  SEARCH: <PiMagnifyingGlassBold />,
  CONFIRMED: <GiConfirmed />,
  ALERT: <GoAlertFill />,
  MONEY: <FaMoneyCheckDollar />,
  BACK: <IoMdArrowRoundBack />,
  EDIT: <MdEdit />,
  TRASH: <FaTrashAlt />,
  CIRCLEOUTLINE: <IoMdAddCircleOutline />,
  PHONE: <FaPhoneAlt />
};

export const MESSAGES = {
    COLLECTOR_SUCCESS: "Coletador alterado com sucesso",
    DONATION_RECEIVED: "Doação já recebida",
    RECEIPT_NOT_FOUND: "Recibo não localizado"
}

export const ALERT_TYPES = {
    SUCCESS: "green",
    ERROR: "#940000",
    ATTENTION: "#F25205"
}

export const DONOR_TYPES = {
  CASUAL: "Avulso",
  MONTHLY: "Mensal",
  LIST: "Lista",
  EXCLUDE: "Excluso",
  OTHERS: "Outros"
}

export const FORM_LABELS = {
  NAME: "Nome",
  TYPE: "Tipo",
  CPF: "CPF",
  ADDRESS: "Endereço",
  CITY: "Cidade",
  NEIGHBORHOOD:"Bairro",
  PHONE1: "Whatsapp",
  PHONE2: "Telefone 2",
  PHONE3: "Telefone 3",
  DAY: "Dia",
  FEE: "Mensalidade",
  AVERAGE: "Média",
  OBSERVATION: "Observação",
  REFERENCE: "Referência"
}

export const BUTTON_TEXTS = {
  BACK: "Voltar",
  EDIT: "Editar",
  SAVE: "Salvar",
  CREATE_MOVIMENT: "Criar Movimento"
}