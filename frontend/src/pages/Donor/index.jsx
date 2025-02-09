import "./index.css";
import React from 'react'
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { useState } from "react";
import TableDonor from '../../assets/components/TableDonor';


const Donor = () => {
  const [selectedValue, setSelectedValue] = useState("Avulso");

    const handleChange = (event) => {
      setSelectedValue(event.target.value);
    };
  
    return (
      <main className="containerDonor">
  
        {/* Cabeçalho com botões */}
        <header className="header">
          <h2><FaMoneyCheckDollar />  Doador</h2>
          <div className="btns">
            <button type="submit" className="btn-edit">Editar</button>
            <button type="submit" className="btn-add">Criar Movimento</button>
          </div>
        </header>
  
        {/* Formulario com informações do doador */}
        <form className="formDonor">
          <div className="div-inputs">
            <label className="label">Nome</label>
            <input type="text"  />
          </div>
  
          <div className="div-inputs">
            <label htmlFor="dropdown" className="label">Tipo</label>
            <select id="dropdown" value={selectedValue} onChange={handleChange}>
              <option value="avulso">Avulso</option>
              <option value="mensal">Mensal</option>
            </select>
          </div>
          
          <div className="div-inputs">
            <label className="label">CPF</label>
            <input type="text"  />
          </div>
  
          <div className="div-inputs">
            <label className="label">Endereço</label>
            <input type="text"  />
          </div>
  
          <div className="div-inputs">
            <label className="label">Cidade</label>
            <input type="text"  />
          </div>
  
          <div className="div-inputs">
            <label className="label">bairro</label>
            <input type="text"  />
          </div>

          <div className="div-inputs">
            <label className="label">Telefone 1</label>
            <input type="text"  />
          </div>

          <div className="div-inputs">
            <label className="label">Telefone 2</label>
            <input type="text"  />
          </div>

          <div className="div-inputs">
            <label className="label">Telefone 3</label>
            <input type="text"  />
          </div>
  
          <div className="div-inputs" style={{width:180}}>
            <label className="label">dia</label>
            <input type="text"  />
          </div> 
  
          <div className="div-inputs" style={{width:180}}>
            <label className="label" style={{width:100}}>Mensalidade</label>
            <input type="text"  />
          </div> 
  
          <div className="div-inputs" style={{width:180}}>
            <label className="label">Media</label>
            <input type="text"  />
          </div>
  
          <div className="div-inputs" id="observation">
            <label className="label" style={{width:"100px"}}>Observação</label>
            {/* <input className="inputObservation" type="text"/> */}
            <textarea name="" id=""/>
          </div>
        </form>
        <TableDonor/>
      </main>
    );
};

export default Donor;
