// React and Hooks
import React, { useState } from "react";
import { useNavigate } from "react-router";

//Components and Helpers
import fetchDonors from "../../services/searchDonorService"
import { DonorCard } from "../../components/cards/DonorCard";

//Styles
import styles from "./searchdonor.module.css";
import { SearchForm } from "../../components/forms/SearchForm";

const SearchDonor = () => {
  const [selectedValue, setSelectValue] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [donor, setDonor] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearchDonor = async (e) => {
    e.preventDefault();
    await fetchDonors(searchTerm, selectedValue, setLoading, setDonor);
  };

  const handleDonorClick = (id, isLead = false) => {
    if (isLead) {
      navigate(`/leads`); // Navega para a página de leads
    } else {
      navigate(`/donor/${id}`);
    }
  };

  const handleAddDonorClick = () => {
    navigate("/newdonor");
  };

  return (
    <main className={styles.containerSearch}>
      {/* Search Section */}
      <div className={styles.searchSection}>
        <h3 className={styles.searchSectionTitle}>Buscar Doador</h3>
        <SearchForm
          searchTerm={searchTerm}
          selectedValue={selectedValue}
          loading={loading}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          setSelectedValue={setSelectValue}
          onSearchSubmit={handleSearchDonor}
          styles={styles}
        />
      </div>

      {/* Results Section */}
      <div className={styles.resultsSection}>
        <h3 className={styles.resultsSectionTitle}>
          {donor && donor.length > 0 
            ? `${donor.length} Doador${donor.length > 1 ? 'es' : ''} Encontrado${donor.length > 1 ? 's' : ''}`
            : 'Resultados da Busca'
          }
        </h3>
        
        <div className={styles.cardDiv}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div>Buscando doadores...</div>
            </div>
          ) : donor && donor.length > 0 ? (
            donor.map((donors) => (
              <div key={donors.donor_id} className={styles.fadeIn}>
                <DonorCard
                  donor={donors}
                  onClick={(id) => handleDonorClick(id, donors.isLead)}
                />
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <div>Nenhum doador encontrado</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>
                Tente ajustar os filtros de busca ou adicione um novo doador
              </div>
            </div>
          )}
        </div>

        {/* Add Donor Section */}
        <div className={styles.addDonorSection}>
          <button className={styles.addDonorButton} onClick={handleAddDonorClick}>
            <span className={styles.addDonorIcon}>➕</span>
            Adicionar Novo Doador
          </button>
        </div>
      </div>
    </main>
  );
};

export default SearchDonor;
