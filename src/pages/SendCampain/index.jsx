import React, { useEffect, useState } from "react";
import "./index.css";
import { getCampains } from "../../helper/getCampains";
import fetchDonors from "../../services/searchDonorService";
import Loader from "../../components/Loader";

const SendCampain = () => {
  const [campains, setCampains] = useState([]);
  const [searchDonor, setSearchDonor] = useState([]);
  const [donor, setDonor] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCampains = async () => {
    const response = await getCampains();
    setCampains(response);
  };
  useEffect(() => {
    fetchCampains();
  }, []);

  const handleSearchDonor = async (e) => {
    e.preventDefault();
    await fetchDonors(searchDonor, "", setLoading, setDonor);
  };

  return (
    <div className="send-campain">
      <div className="send-campain-form">
        <div className="send-campain-form-header">
          <div className="input-field">
            <label>Buscar Doador</label>
            <input
              type="text"
              onChange={(e) => setSearchDonor(e.target.value)}
            />
          </div>
          <button style={{ width: "160px" }} onClick={handleSearchDonor}>
            {loading ? <Loader /> : "Buscar Doador"}
          </button>
        </div>
        <div className="send-campain-form-body"></div>
      </div>

    </div>
  );
};

export default SendCampain;
