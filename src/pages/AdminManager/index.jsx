import React, { useEffect, useState } from "react";
import "./index.css";
import { getOperators } from "../../helper/getOperators";

const AdminManager = () => {
  const [active, setActive] = useState();
  const [readOnly, setReadOnly] = useState(true);
  const [operators, setOperators] = useState([]);
  const [operatorMeta, setOperatorMeta] = useState({
    operatorName: "",
    value: "",
    percent: "",
    total: "",
    date: "",
  });

  useEffect(() => {
    const operators = async () => {
      const operator = await getOperators();
      setOperators(operator);
    };
    operators();
  }, []);

  const handleEdit = () => {
    if (readOnly) setReadOnly(false);

    if (!readOnly) {
      setReadOnly(true);
    }
  };

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
      </div>
      <div className="admin-manager-content">
        {active &&
          active === "meta" &&
          operators?.map((operator) => (
            (operator.operator_type === "Operador" || operator.operator_type === "Operador Casa") && (
                <div key={operator.operator_code_id} className="admin-manager-content-operator">
                  <div className="input-field">
                    <label>Operador</label>
                    <strong>{operator.operator_name}</strong>
                  </div>
                  <div className="input-field" style={{ maxWidth: 70 }}>
                    <label>Valor</label>
                    <input
                      type="text"
                      readOnly={readOnly}
                      value={operatorMeta.value}
                      onChange={(e) =>
                        setOperatorMeta({ ...e, value: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-field" style={{ maxWidth: 40 }}>
                    <label>%</label>
                    <input
                      type="text"
                      readOnly={readOnly}
                      value={operatorMeta.percent}
                      onChange={(e) =>
                        setOperatorMeta({ ...e, percent: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-field" style={{ maxWidth: 70 }}>
                    <label>Total</label>
                    <input
                      type="text"
                      readOnly={readOnly}
                      value={operatorMeta.total}
                      onChange={(e) =>
                        setOperatorMeta({ ...e, total: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-field" style={{ maxWidth: 130 }}>
                    <label>Data</label>
                    <input
                      type="date"
                      readOnly={readOnly}
                      value={operatorMeta.date}
                      onChange={(e) =>
                        setOperatorMeta({ ...e, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="admin-manager-content-operator-btns">
                    <button onClick={handleEdit}>
                      {readOnly ? "Editar" : "Salvar"}
                    </button>
                  </div>
                </div>
              )
          ))}
      </div>
    </main>
  );
};

export default AdminManager;
