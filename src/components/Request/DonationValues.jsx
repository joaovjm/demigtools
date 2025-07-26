import React, { useEffect, useState } from "react";
import { ICONS } from "../../constants/constants";
import Loader from "../Loader";

const DonationValues = ({ createPackage, setRequestForm, setFilterForm, handleCancel }) => {
  const [packageCount, setPackageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const countPackage = () => {
      const count = createPackage?.reduce((acc, item) => {
        return acc + item.donation_value;
      }, 0);

      setPackageCount(count);
    };
    countPackage();
  }, [createPackage]);

  const handleRequestTable = () => {
    setLoading(true);
    setFilterForm(false);
    setRequestForm(true);
    setLoading(false);
  };

  return (
    <div className="request-front-left-bottom-2">
      <div className="input-field">
        <label>Doação</label>
        <input type="text" value={createPackage.length} disabled />
      </div>
      <div className="input-field">
        <label>Total</label>
        <input
          type="text"
          value={packageCount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          disabled
        />
      </div>
      <div className="input-field">
        <label>Tipo</label>
        <select>
          <option value="" disabled>
            Selecione...
          </option>
          <option value="Normal">Normal</option>
        </select>
      </div>
      <div className="input-field" style={{ gridColumn: "span 2" }}>
        <label>Se não achar valor?</label>
        <select>
          <option value="" disabled>
            Selecione...
          </option>
          <option value="old">Buscar por mais velho</option>
        </select>
      </div>
      <div className="request-front-left-bottom-2-btn">
        <button onClick={handleCancel} className="btn-cancel">Cancelar</button>
        <button onClick={handleRequestTable} className="btn-search">
          {loading ? (<Loader/>) : (<>{ICONS.SEARCH} Buscar </>)}
        </button>
      </div>
    </div>
  );
};

export default DonationValues;
