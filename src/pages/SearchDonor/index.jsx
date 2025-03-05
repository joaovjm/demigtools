import "./index.css";
import React, { useState } from "react";
import { useNavigate } from "react-router";

import { PiMagnifyingGlassBold } from "react-icons/pi";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoMdAddCircleOutline } from "react-icons/io";
import { searchDonor } from "../../helper/supabase";

const SearchDonor = () => {
  const [selectedValue, setSelectValue] = useState("todos");
  const [buscardoador, setBuscardoador] = useState("");
  const [donor, setDonor] = useState([]);

  const navigate = useNavigate();
  let tipo = "";
  
  const handleChange = (event) => {
    setSelectValue(event.target.value);
  };  

  const onClickSearch = async (event) => {
    event.preventDefault();
    try {
      selectedValue !== "todos" ? (tipo = selectedValue) : (tipo = "");
      const data = await searchDonor(buscardoador, tipo);
      setDonor(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickDonor = (id) => {
    navigate(`/donor/${id}`);
  };

  return (
    <main className="containersearch">
      <form onSubmit={onClickSearch} className="formsearch">
        <div className="search">
          <label className="label">Buscar Doador</label>
          <input
            type="text"
            name="buscardoador"
            value={buscardoador}
            onChange={(e) => setBuscardoador(e.target.value)}
          />
        </div>
        <div className="type">
          <label htmlFor="dropdown" className="label">
            Tipo
          </label>
          <select id="dropdown" value={selectedValue} onChange={handleChange}>
            <option value="todos">Todos</option>
            <option value="avulso">Avulso</option>
            <option value="lista">Lista</option>
            <option value="mensal">Mensal</option>
          </select>
        </div>

        <button className="btnsearch" type="submit">
          <PiMagnifyingGlassBold /> buscar
        </button>
      </form>

      <div className="Carddiv">
        {donor
          ? donor.map((donors) => (
              <form
                key={donors.id_doador}
                className="Cardform"
                onClick={() => onClickDonor(donors.id_doador)}
              >
                <header>
                  <h3>
                    <FaMoneyCheckDollar /> {donors.nome_doador}
                  </h3>
                </header>
                <div className="Cardinfo">
                  <p>End.: {donors.endereco}</p>
                  <p>Tel.: {donors.telefone1}</p>
                  <p>Bairro: {donors.bairro}</p>
                  <p>Tipo: {donors.tipo_doador_descricao}</p>
                </div>
              </form>
            ))
          : "Nenhum"}

        <div className="iconadd" onClick={() => navigate("/newdonor")}>
          <IoMdAddCircleOutline />
        </div>
      </div>
    </main>
  );
};

export default SearchDonor;
