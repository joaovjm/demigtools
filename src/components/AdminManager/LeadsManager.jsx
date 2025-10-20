import React, { useEffect, useState } from "react";
import supabase from "../../helper/superBaseClient";
import Loader from "../Loader";

const LeadsManager = () => {
  const [searchSelected, setSearchSelected] = useState("");
  const [searchOptions, setSearchOptions] = useState();
  const [searchOptionSelected, setSearchOptionSelected] = useState();
  const [statusSelected, setStatusSelected] = useState();
  const [leadsSearched, setLeadsSearched] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchSelected = async (e) => {
    try {
      setIsLoading(true);
      setSearchSelected(e)
      const { data, error } = await supabase.from("leads").select("");
      if (error) throw error;
      if (data) {
        const result = new Set(
          data.map((item) =>
            e === "bairro"
              ? item.leads_neighborhood
              : item.leads_city
          )
        );
        setSearchOptions(Array.from(result));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    const resultOne = searchOptions?.filter((option) =>{
      if(searchSelected === "bairro"){
        return option === searchOptionSelected;
      } else {
        return option === searchOptionSelected;
      }
    });
    console.log(resultOne);
  };

  return (
    <div className="leads-manager-container">
      <div className="leads-manager-header">
        <h2>Gerenciamento de Leads</h2>
      </div>
      <div className="leads-manager-body">
        <div className="input-field">
          {/* Busca Por Bairro ou Cidade */}
          <label>Buscar por</label>
          <select
            value={searchSelected}
            onChange={(e) => handleSearchSelected(e.target.value)}
          >
            <option value="" disabled>
              Selecione...
            </option>
            <option value="bairro">Bairro</option>
            <option value="cidade">Cidade</option>
          </select>
        </div>

        {/* Busca Por Bairro ou Cidade */}
        {searchOptions && (
          <div className="input-field">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <label>{searchSelected === "bairro" ? "Bairro" : "Cidade"}</label>
                <select
                  value={searchOptionSelected}
                  onChange={(e) => setSearchOptionSelected(e.target.value)}
                >
                  {searchOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        )}
        <div className="input-field">
          <label>Status</label>
          <select
            value={statusSelected}
            onChange={(e) => setStatusSelected(e.target.value)}
          >
            <option value="agendado">Agendado</option>
            <option value="Não Atendeu">Não Atendeu</option>
            <option value="Não Pode Ajudar">Não Pode Ajudar</option>
            <option value="Nunca Ligado">Nunca Ligado</option>
            <option value="Aberto">Aberto</option>
          </select>
        </div>
        <button onClick={handleSearch}>Buscar</button>
      </div>
      <div className="page-in-devepoler">
        <p>Página em desenvolvimento</p>
      </div>
    </div>
  );
};

export default LeadsManager;
