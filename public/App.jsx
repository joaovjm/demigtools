import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import xlsxFileUpload from "./components/xlsxFileUpload";
import insertNewLeads from "./components/insertNewLeads";

function App() {
  const [excelData, setExcelData] = useState(null);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    xlsxFileUpload(file, setExcelData, setHeaders);
  };

  const handleUpdateLeads = async (e) => {
    e.preventDefault();
    await insertNewLeads(excelData)
  };

  return (
    <div className="App">
      <h1>Leitor de Excel</h1>

      <div className="upload-container">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="file-input"
          id="excel-file"
        />
        <label htmlFor="excel-file" className="file-label">
          Escolher arquivo Excel
        </label>
      </div>

      {excelData && (
        <div className="upload-container">
          <button onClick={handleUpdateLeads} className="file-label">
            Update New Leads
          </button>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick="true"
        pauseOnFocusLoss="false"
        pauseOnHover="false"
      />
    </div>
  );
}

export default App;
