// React and Hooks
import React, { useState } from "react";
import { useNavigate } from "react-router";

//Components and Helpers
import fetchDonors from "../../services/searchDonorService"
import { DonorCard } from "../../components/cards/DonorCard";

//Styles
import "./index.css";
import { SearchForm } from "../../components/forms/SearchForm";

const SearchDonor = () => {
  const [selectedValue, setSelectValue] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [donor, setDonor] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearchDonor = async (e) => {
    e.preventDefault();
    await fetchDonors(searchTerm, selectedValue, setLoading, setDonor);
  };

  const handleDonorClick = (id) => {
    navigate(`/donor/${id}`);
  };

  const handleAddDonorClick = () => {
    navigate("/newdonor");
  };

  return (
    <main className="containersearch">
      {/* Search Section */}
      <div className="search-section">
        <SearchForm
          searchTerm={searchTerm}
          selectedValue={selectedValue}
          loading={loading}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          setSelectedValue={setSelectValue}
          onSearchSubmit={handleSearchDonor}
        />
      </div>

      {/* Results Section */}
      <div className="results-section">
        <h3 className="results-section-title">
          {donor && donor.length > 0 
            ? `${donor.length} Doador${donor.length > 1 ? 'es' : ''} Encontrado${donor.length > 1 ? 's' : ''}`
            : 'Resultados da Busca'
          }
        </h3>
        
        <div className="Carddiv">
          {loading ? (
            <div className="loading-container">
              <div>Buscando doadores...</div>
            </div>
          ) : donor && donor.length > 0 ? (
            donor.map((donors) => (
              <div key={donors.donor_id} className="donor-card-container fade-in">
                <DonorCard
                  donor={donors}
                  onClick={handleDonorClick}
                />
              </div>
            ))
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <div>Nenhum doador encontrado</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>
                Tente ajustar os filtros de busca ou adicione um novo doador
              </div>
            </div>
          )}
        </div>

        {/* Add Donor Section */}
        <div className="add-donor-section">
          <button className="add-donor-button" onClick={handleAddDonorClick}>
            <span className="add-donor-icon">➕</span>
            Adicionar Novo Doador
          </button>
        </div>
      </div>
    </main>
  );
};

export default SearchDonor;
