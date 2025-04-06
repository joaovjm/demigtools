import React, { useState } from "react";
import "./index.css";
import xlsxFileUpload from "../../components/xlsxFileUpload";
import { ToastContainer } from "react-toastify";
import insertNewLeads from "../../components/insertNewLeads";

const LoadLeads = () => {
  const [fileName, setFileName] = useState("Nenhum arquivo selecionado");
  const [excelData, setExcelData] = useState([]);
  const [headers, setHeaders] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    await xlsxFileUpload(file, setExcelData, setHeaders);
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("Nenhum arquivo selecionado");
    }
  };

  const handleInsertNewLead = async (e) => {
    e.preventDefault();
    const response = await insertNewLeads(excelData)
    console.log(response)
    if (response){
      setFileName("Nenum arquivo selecionado")
      setExcelData([])
    }
    

  }

  return (
    <main className="main-leads">
      <div className="lead-panel">
        <div className="lead-header">
          <h2>Inserir Leads</h2>
        </div>
        <div className="lead-input">
          <div className="file-upload-container">
            <div className="file-upload-wrapper">
              <label htmlFor="file-upload" className="file-upload-label">
                <span className="upload-icon">📁</span>
                <span>Escolher arquivo</span>
              </label>
              <input
                type="file"
                id="file-upload"
                accept=".xlsx, .xls"
                className="input-file"
                onChange={handleFileChange}
              />
              
            </div>
            <div className="lead-info-btn">
              <div className="file-name">{fileName}</div>
              {excelData.length > 0 && (
                <button onClick={handleInsertNewLead} className="save-lead-btn">Salvar novo lead</button>
              )}
              
            </div>
            
            
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          closeOnClick="true"
          pauseOnFocusLoss="false"
          pauseOnHover="false"
        />
      </div>
    </main>
  );
};

export default LoadLeads;
