import { useState } from "react";
import "./index.css";
import { DataSelect } from "../../components/DataTime";
import { monthHystoryChecker } from "../../helper/monthHistoryChecker";
import { monthlyfeeGenerator } from "../../helper/monthlyfeeGenerator";
import { GiConfirmed } from "react-icons/gi";

const CreateMensalDonation = () => {
  const [mesrefGenerator, setMesrefGenerator] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [contador, setContador] = useState(null);

  const onMonthHystoryChecker = async (e) => {
    const value = e.target.value;
    setMesrefGenerator(value);
    const formatedValue = DataSelect(value);
    setIsDisable(await monthHystoryChecker(formatedValue));
    setConfirmed(false);
  };

  const handleGerar = async (e) => {
    e.preventDefault();
    const count = await monthlyfeeGenerator(
      mesrefGenerator,
      DataSelect(mesrefGenerator, "mesrefnf"),
      DataSelect(mesrefGenerator, "day"),
      DataSelect(mesrefGenerator, "month"),
      DataSelect(mesrefGenerator, "year")
    );

    if (count >= 0) {
      setContador(count);
      setConfirmed(true);
    }
  };

  return (
    <div className="CreateMensalDonation">
      <div className="MonthlyfeeGeneratorComponent_div">
        <h1>Gerar Mensal</h1>
        <div className="form_inputs">
          <div className="input-field">
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
            disabled={isDisable || confirmed}
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
              <h3>
                {contador} <GiConfirmed />
              </h3>
              <p>Mensal gerado com sucesso!</p>
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMensalDonation;
