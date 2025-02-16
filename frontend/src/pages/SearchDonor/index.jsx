import "./index.css";
import React, { useState } from "react";
import { useNavigate } from "react-router";

import axios from "axios";

import { PiMagnifyingGlassBold } from "react-icons/pi";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoMdAddCircleOutline } from "react-icons/io";



const SearchDonor = () => {
  const [selectedValue, setSelectValue] = useState("todos");
  const [buscardoador, setBuscardoador] = useState("");
  const [donor, setDonor] = useState([]);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setSelectValue(event.target.value);
  };

  const onClickSearch = (event) => {
    event.preventDefault();

    const params = {};
    if (buscardoador) params.query = buscardoador;
    if (selectedValue && selectedValue !== "todos") params.tipo = selectedValue;

    axios.get("http://localhost:3001/donor", {params})
      .then((response) => {
        setDonor(response.data);
    })
    .catch((error) => {
      console.error("Erro ao buscar doadores: ", error);
    })
  }

  const onClickDonor = (id) => {    
    navigate(`/donor/${id}`);
  }
    

  return (
    
    <main className="containersearch">
      <form className="formsearch">
        <div className="search">
          <label className="label">Buscar Doador</label>
          <input 
            type="text"
            name="buscardoador"
            value={buscardoador}
            onChange={(e) => setBuscardoador(e.target.value)} />
        </div>
        <div className="type">
          <label htmlFor="dropdown" className="label">Tipo</label>
          <select id="dropdown" value={selectedValue} onChange={handleChange}>
            <option value="todos">Todos</option>
            <option value="avulso">Avulso</option>
            <option value="lista">Lista</option>
            <option value="mensal">Mensal</option>
          </select>
        </div>

        <button className="btnsearch" onClick={onClickSearch}><PiMagnifyingGlassBold /> buscar</button>
      </form>
      
      <div className='Carddiv'>
        {donor.map((donors) => (
            <form key={donors.telefone1} className='Cardform' onClick={() => onClickDonor(donors.telefone1)}>
                <header>
                    <h3><FaMoneyCheckDollar /> {donors.nome}</h3>
                </header>
                <div className='Cardinfo'>
                    <p>End.: {donors.endereco}</p>
                    <p>Tel.: {donors.telefone1}</p>
                    <p>Bairro: {donors.bairro}</p>
                    <p>Tipo: {donors.tipo}</p>
                </div>
            </form>
        ))}
        <div className="iconadd" onClick={() => navigate("/newdonor")}>
          <IoMdAddCircleOutline/>
        </div>
        
      </div>
    </main>
  );
};

export default SearchDonor;
