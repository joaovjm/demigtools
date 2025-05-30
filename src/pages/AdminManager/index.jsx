import React, { useEffect, useState } from "react";
import "./index.css";
import { getOperators } from "../../helper/getOperators";
import getOperatorMeta from "../../helper/getOperatorMeta";
import supabase from "../../helper/superBaseClient";

const AdminManager = () => {
  const [active, setActive] = useState("meta");
  const [operators, setOperators] = useState([]);
  const [inputs, setInputs] = useState({});
  const [read, setRead] = useState({});

  useEffect(() => {
    const fetchOperators = async () => {
      const operator = await getOperators();
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

  const handleInputChange = (id, field, value) => {
    setInputs((prev) => {
      const updated = { ...prev[id], [field]: value };
      if (field === "value" || field === "percent") {
        const val = parseInt(updated.value) || 0;
        const perc = parseInt(updated.percent) || 0;
        updated.total = ((val * perc) / 100) + val;
      }
      return { ...prev, [id]: updated };
    });
  };

  const handleEdit = (id) => {
    setRead((prev) => ({
      ...prev,
      [id]: { only: !prev?.[id]?.only },
    }));
  };

  const handleUpdateMeta = async (id) => {
    const { total, date } = inputs[id];
    const { data, error } = await supabase
      .from("operator_meta")
      .upsert(
        {
          operator_code_id: id,
          meta: total,
          start_date: date,
        },
        { onConflict: "operator_code_id" }
      )
      .select();

    if (error) {
      console.log("error: ", error.message);
    } else {
      console.log("updated: ", data);
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
        {active === "meta" &&
          operators
            .filter(
              (op) =>
                op.operator_type === "Operador" ||
                op.operator_type === "Operador Casa"
            )
            .map((operator) => (
              <div
                key={operator.operator_code_id}
                className="admin-manager-content-operator"
              >
                <div className="input-field">
                  <label>Operador</label>
                  <strong>{operator.operator_name}</strong>
                </div>
                <div className="input-field" style={{ maxWidth: 70 }}>
                  <label>Valor</label>
                  <input
                    type="text"
                    readOnly={read?.[operator.operator_code_id]?.only}
                    value={inputs?.[operator.operator_code_id]?.value || ""}
                    onChange={(e) =>
                      handleInputChange(
                        operator.operator_code_id,
                        "value",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="input-field" style={{ maxWidth: 40 }}>
                  <label>%</label>
                  <input
                    type="text"
                    value={inputs?.[operator.operator_code_id]?.percent || ""}
                    onChange={(e) =>
                      handleInputChange(
                        operator.operator_code_id,
                        "percent",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="input-field" style={{ maxWidth: 70 }}>
                  <label>Total</label>
                  <input
                    type="text"
                    value={inputs?.[operator.operator_code_id]?.total || ""}
                    readOnly
                  />
                </div>
                <div className="input-field" style={{ maxWidth: 130 }}>
                  <label>Data</label>
                  <input
                    type="date"
                    value={inputs?.[operator.operator_code_id]?.date || ""}
                    onChange={(e) =>
                      handleInputChange(
                        operator.operator_code_id,
                        "date",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="admin-manager-content-operator-btns">
                  <button
                    onClick={() => {
                      if (read?.[operator.operator_code_id]?.only === false) {
                        handleUpdateMeta(operator.operator_code_id);
                      }
                      handleEdit(operator.operator_code_id);
                    }}
                  >
                    {read?.[operator.operator_code_id]?.only === false
                      ? "Salvar"
                      : "Editar"}
                  </button>
                </div>
              </div>
            ))}
      </div>
    </main>
  );
};

export default AdminManager;
