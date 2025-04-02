import { ICONS } from "../../constants/constants";

export const BtnEdit = ({ onClick, type, label }) => (
  <button onClick={onClick} type={type} className="btn-edit">
    {ICONS.EDIT} {label}
  </button>
);

export const BtnDelete = ({ onClick, type }) => (
  <button onClick={onClick} type={type} className="btn-delete">
    {ICONS.TRASH} Delete
  </button>
);

export const BtnNewOperator = ({ className, onClick, type, icon}) => (
  <button onClick={onClick} type={type} className={className}>
    {icon} Novo Operador
  </button>
);
