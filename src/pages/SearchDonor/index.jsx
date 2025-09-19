// React and Hooks
import React, { useState } from "react";
import { useNavigate } from "react-router";

//Components and Helpers
import fetchDonors from "../../services/searchDonorService"
import { DonorCard } from "../../components/cards/DonorCard";
import {NewDonorButton} from "../../components/buttons/NewDonorButton"

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
      <SearchForm
        searchTerm={searchTerm}
        selectedValue={selectedValue}
        loading={loading}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        setSelectedValue={setSelectValue}
        onSearchSubmit={handleSearchDonor}
      />
      <div className="Carddiv">
        {donor? (
          donor.map((donors) => (
            <DonorCard
              key={donors.donor_id}
              donor={donors}
              onClick={handleDonorClick}
            />
          ))
        ) : (
          <p>"Nenhum doador encontrado"</p>
        )}

        <NewDonorButton
        onClick={handleAddDonorClick}/>
      </div>
    </main>
  );
};

export default SearchDonor;
