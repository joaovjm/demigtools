import "./index.css";
import React, { useEffect, useState } from "react";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import axios from "axios";
import { FaMoneyCheckDollar } from "react-icons/fa6";


const SearchDonor = () => {
  const [selectedValue, setSelectValue] = useState("todos");
  const [buscardoador, setBuscardoador] = useState("");
  const [searchDonor, setSearchDonor] = useState("")
  const [donor, setDonor] = useState([]);


  useEffect(() =>{
    axios.get("http://localhost:3001/donor").then((response) => {
        setDonor(response.data);
    });
  }, []);

  const handleChange = (event) => {
    setSelectValue(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchDonor(buscardoador);
  }

  return (
    <main className="containersearch">
      <form onSubmit={handleSearch} className="formsearch">
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

        <button className="btnsearch" type="submit"><PiMagnifyingGlassBold /> buscar</button>
      </form>

      <div className='Carddiv'>
        {donor.map((donors) => (
            <form key={donors.id} className='Cardform'>
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
      </div>
    </main>
  );
};

export default SearchDonor;
