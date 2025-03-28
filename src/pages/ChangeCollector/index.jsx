import React, { useEffect, useState } from "react";
import "./index.css";

import { TbArrowsExchange } from "react-icons/tb";
import { FaMotorcycle } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { GiConfirmed } from "react-icons/gi";
import { getCollector } from "../../helper/getCollector";
import { changeCollector } from "../../helper/changeCollector";
import { GoAlertFill } from "react-icons/go";
import { DataSelect } from "../../components/DataTime";

const ChangeCollector = () => {
  const [collector, setCollector] = useState("");
  const [collectors, setCollectors] = useState([]);
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [typeAlert, setTypeAlert] = useState("")

  useEffect(() => {
    getCollector().then((data) => {
      setCollectors(data);
    });
  }, []);

  const handleChangeCollector = async (e) => {
    e.preventDefault();
    const dateFormat = DataSelect(date)
    const data = await changeCollector(collector, search, dateFormat);

    if (data === "Ok") {
      setMessage("Coletador alterado com sucesso!");
      setTypeAlert("green")
    } else if (data === "Sim") {
      setTypeAlert("#940000")
      setMessage("Doação já recebida")
    } else if (data === 0) {
      setTypeAlert("#940000")
      setMessage("Recibo não localizado")
    }
    setSearch("")

    setTimeout(() => {
      setMessage("");
    }, 500);
  };

  return (
    <main className="collector-main">
      <div className="collector-header">
        <div className="collector-title">
          <h2 className="collector-title-text">
            <TbArrowsExchange /> Mudar Coletador
          </h2>
        </div>
      </div>
      <form className="collector-form" onSubmit={handleChangeCollector}>
        {/* Coletador */}
        <div className="collector-form-inputs">
          <label className="label">
            <FaMotorcycle />
            Coletador
          </label>
          <select
            value={collector}
            onChange={(e) => setCollector(e.target.value)}
          >
            <option value="" disabled>
              Selecione o coletador...
            </option>
            {collectors?.map((item) => (
              <option
                key={item.collector_code_id}
                value={item.collector_code_id}
              >
                {item.collector_name}
              </option>
            ))}
          </select>
        </div>

        {/* Data */}
        <div className="collector-form-input">
          <label className="label">
            <FaCalendarAlt /> Data
          </label>
          <input
            type="date"
            style={{ width: "180px" }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Buscar */}
        <div className="collector-form-input">
          <label className="label">
            <PiMagnifyingGlassBold /> Buscar
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>

      {message && (
        <div style={{backgroundColor: typeAlert}} className="collector-form-message">
          <p className="collector-form-message-text">
            {message} 
            {typeAlert === "green" && <GiConfirmed />}
            {typeAlert === "#940000" && <GoAlertFill />}
          </p>
        </div>
      )}
    </main>
  );
};

export default ChangeCollector;
