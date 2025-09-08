import React, { useEffect, useState } from "react";
import "./index.css";
import { getOperators } from "../../helper/getOperators";
import getOperatorMeta from "../../helper/getOperatorMeta";
import Meta from "../../components/AdminManager/Meta";
import WhatsappAndEmailManager from "../../components/AdminManager/WhatsappAndEmailManager";
import Campain from "../../components/AdminManager/Campain";
import ReceiptConfig from "../../components/AdminManager/ReceiptConfig";

const AdminManager = () => {
  const [active, setActive] = useState();
  const [operators, setOperators] = useState([]);
  const [inputs, setInputs] = useState({});
  const [read, setRead] = useState({});

  useEffect(() => {
    const fetchOperators = async () => {
      const operator = await getOperators({ active: true });
      setOperators(operator);

      const initialReadState = {};
      operator.forEach((op) => {
        initialReadState[op.operator_code_id] = { only: true };
      });
      setRead(initialReadState);
    };
    fetchOperators();

    const fetchMeta = async () => {
      const meta = await getOperatorMeta();
      const metaObject = meta.reduce((acc, item) => {
        acc[item.operator_code_id] = {
          value: "",
          percent: "",
          total: item.meta || "",
          date: item.start_date || "",
        };
        return acc;
      }, {});
      setInputs(metaObject);
    };
    fetchMeta();
  }, []);

  return (
    <main className="admin-manager">
      <div className="admin-manager-menu">
        <div
          className={`admin-manager-menu-item ${
            active === "meta" ? "active" : ""
          }`}
          onClick={() => setActive("meta")}
        >
          Meta
        </div>
        <div
          className={`admin-manager-menu-item ${
            active === "whatsapp" ? "active" : ""
          }`}
          onClick={() => setActive("whatsapp")}
          style={{ fontSize: 12 }}
        >
          Whatsapp & Email
        </div>
        <div
          className={`admin-manager-menu-item ${
            active === "campain" ? "active" : ""
          }`}
          onClick={() => setActive("campain")}
        >
          Campanha
        </div>
        <div
          className={`admin-manager-menu-item ${
            active === "receipt" ? "active" : ""
          }`}
          onClick={() => setActive("receipt")}
        >
          Config. Recibo
        </div>
      </div>
      <div className="admin-manager-content">
        {active === "meta" ? (
          <Meta
            operators={operators}
            inputs={inputs}
            setInputs={setInputs}
            read={read}
            setRead={setRead}
          />
        ) : active === "whatsapp" ? (
          <WhatsappAndEmailManager />
        ) : active === "campain" ? (
          <Campain />
        ) : active === "receipt" ? (
          <ReceiptConfig />
        ) : (
          <></>
        )}
      </div>
    </main>
  );
};

export default AdminManager;
