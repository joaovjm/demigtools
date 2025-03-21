import React, { useEffect, useState } from "react";
import "./index.css";

import { TbArrowsExchange } from "react-icons/tb";
import { FaMotorcycle } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { GiConfirmed } from "react-icons/gi";
import { getCollector } from "../../helper/getCollector";
import { changeCollector } from "../../helper/changeCollector";

const ChangeCollector = () => {
  const [collector, setCollector] = useState("");
  const [collectors, setCollectors] = useState([]);
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getCollector().then((data) => {
      setCollectors(data);
    });
  }, []);

  const handleChangeCollector = (e) => {
    e.preventDefault();

    const data = changeCollector(collector, search);

    if (data) {
      setMessage("Coletador alterado com sucesso!");
      const messageTimeOut = setTimeout(() => {
        setMessage("");
      }, 1000);
      return () => clearTimeout(messageTimeOut);
    }
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
        <div className="collector-form-message">
          <p className="collector-form-message-text">
            {message} <GiConfirmed />
          </p>
        </div>
      )}
    </main>
  );
};

export default ChangeCollector;
