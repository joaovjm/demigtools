import React, { useEffect, useState } from "react";
import "./index.css";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";
import { getCollector } from "../../helper/getCollector";
import { receiveDonation } from "../../helper/receiveDonation";
import { GoAlertFill } from "react-icons/go";
import { BiSolidErrorAlt } from "react-icons/bi";
import { DataSelect } from "../../assets/components/DataTime";
import { verifyCollector } from "../../helper/verifyCollector";

const ReceiverDonations = () => {
  const [collector, setCollector] = useState("");
  const [date, setDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [collectors, setCollectors] = useState([]);
  const [tableReceipt, setTableReceipt] = useState([]);
  const [typeAlert, setTypeAlert] = useState("");
  const [isEqual, setIsEqual] = useState(true);

  const handleReceiverDonations = async (e) => {
    e.preventDefault();
    const verify = await verifyCollector(collector, search, setMessage, setSearch);

    if (verify) {
      receiveDonation(
        modifiedDate,
        setMessage,
        collector,
        setTypeAlert,
        search,
        setTableReceipt
      );
      setSearch("")
    }
    if (verify === false){
      console.log(verify);
      setIsEqual(verify);
    }
  };

  const btnYes = () => {
    receiveDonation(
      modifiedDate,
      setMessage,
      collector,
      setTypeAlert,
      search,
      setTableReceipt
    );
    setSearch("")
    setIsEqual(true);
  };
  const btnNo = () => {
    setIsEqual(true);
    return null;
  };
  useEffect(() => {
    setTableReceipt([]);
  }, [collector]);
  useEffect(() => {
    getCollector().then((data) => {
      setCollectors(data);
    });
  }, []);

  const handleDate = (e) => {
    const value = e.target.value;
    setDate(value);
    setModifiedDate(DataSelect(value));
  };

  return (
    <main className="receiver-donations-main">
      <div className="receiver-donations-header">
        <div>
          <h2 className="receiver-donations-header-title-text">
            <FaMoneyCheckDollar /> Receber Doações
          </h2>
        </div>
      </div>

      <form
        onSubmit={handleReceiverDonations}
        className="receiver-donations-form"
      >
        <div className="receiver-donations-form-input">
          <label className="label">Coletador</label>
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

        <div className="receiver-donations-form-input">
          <label className="label">Data</label>
          <input type="date" value={date} onChange={handleDate} />
        </div>

        <div className="receiver-donations-form-input">
          <label className="label">Buscar</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            readOnly={!isEqual}
          />
        </div>
      </form>

      {/*MENSAGEM*/}
      <div className="receiver-donations-form-message">
        {!isEqual && (
          <div
            style={{ backgroundColor: "#940000", width: "100%" }}
            className="receiver-donations-form-message"
          >
            <p className="receiver-donations-form-message-text">
              Coletador é diferente do recibo.
            </p>
            <p className="receiver-donations-form-message-text">
              Deseja dar baixa mesmo assim?
            </p>
            <div className="btns">
              <button onClick={btnYes} className="btn-decisionY">
                Sim [Y]
              </button>
              <button onClick={btnNo} className="btn-decisionN">
                Não [N]
              </button>
            </div>
          </div>
        )}
        {message && (
          <div
            style={{ backgroundColor: typeAlert, width: "100%" }}
            className="receiver-donations-form-message"
          >
            <p className="receiver-donations-form-message-text">
              {message}
              {typeAlert === "green" && <GiConfirmed />}
              {typeAlert === "#940000" && <GoAlertFill />}
              {typeAlert === "#F25205" && <BiSolidErrorAlt />}
            </p>
          </div>
        )}
      </div>

      <table className="receiver-donations-table">
        {tableReceipt.length > 0 && (
          <thead className="receiver-donations-table-header">
            <tr>
              <th style={{ width: "20%" }}>Recibo</th>
              <th style={{ width: "60%" }}>Nome</th>
              <th style={{ width: "20%" }}>Valor</th>
            </tr>
          </thead>
        )}

        <tbody className="receiver-donations-table-body">
          {tableReceipt.map((item) => (
            <tr key={item.search}>
              <td>{item.search}</td>
              <td>{item.name}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default ReceiverDonations;
