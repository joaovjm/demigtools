import React, { useState } from "react";
import "./index.css";
import { monthlyfeeGenerator } from "../../../helper/monthlyfeeGenerator";
import { monthHystoryChecker } from "../../../helper/monthHistoryChecker";
import { GiConfirmed } from "react-icons/gi";
import { DataSelect } from "../DataTime";

const MonthlyfeeGeneratorComponent = () => {
  const [mesrefGenerator, setMesrefGenerator] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const onMonthHystoryChecker = async (e) => {
    const value = e.target.value;
    const valueFormated = DataSelect(value)
    setMesrefGenerator(value);
    setIsDisable(await monthHystoryChecker(valueFormated));
    setConfirmed(false)
    
  };

  const handleGerar = async (e) => {
    e.preventDefault();
    const status = await monthlyfeeGenerator(
      DataSelect(mesrefGenerator),
      DataSelect(mesrefGenerator, "mesref"),
      DataSelect(mesrefGenerator, "day"),
      DataSelect(mesrefGenerator, "month"),
      DataSelect(mesrefGenerator, "year")
    );

    if (status === true) {
      setConfirmed(true)
    }
    
  };
  return (
    <div className="MonthlyfeeGeneratorComponent_div">
      <h1>Gerar Mensal</h1>
      <div className="form_inputs">
        <div className="imputs">
          <label className="label">Mês Referente</label>
          <input
            type="date"
            value={mesrefGenerator}
            onChange={onMonthHystoryChecker}
          />
        </div>

        <button
          className="btn_gerar"
          onClick={handleGerar}
          disabled={isDisable}
        >
          Gerar
        </button>
      </div>
      <div className="status_mensal">
        {isDisable && (
          <label className="label_status_mensal">
            <GiConfirmed />
            <p>Mensal já foi gerado!</p>
          </label>
        )}
        {confirmed && (
          <label className="label_status_mensal">
            <GiConfirmed />
            <p>Mensal gerado com sucesso!</p>
          </label>
        )}
      </div>
    </div>
  );
};

export default MonthlyfeeGeneratorComponent;
