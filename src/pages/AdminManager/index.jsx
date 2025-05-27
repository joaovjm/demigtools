import React, { useState } from "react";
import "./index.css";

const AdminManager = () => {
  const [active, setActive] = useState();

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
        <div className="admin-manager-content-operator">
          <div className="input-field">
            <label>Operador</label>
            <strong>João Oliveira</strong>
          </div>
          <div className="input-field">
            <label>Valor</label>
            <input type="text" />
          </div>
          <div className="input-field">
            <label>Valor</label>
            <input type="text" />
          </div>
          <div className="input-field">
            <label>Data</label>
            <input type="date" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminManager;
