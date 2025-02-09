import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './index.css'
import { FaMoneyCheckDollar } from "react-icons/fa6";


const Cards = ({idDonor}) => {
    const [donor, setDonor] = useState([]);
    const [nome, setNome] = useState('');
    const [telefone1, setTelefone1] = useState("");
    const [endereco, setEdereco] = useState("")

    useEffect(() =>{
        axios.get("http://localhost:3001/donor").then((response) => {
            setDonor(response.data);
        });
    }, [setDonor]); 

    console.log(idDonor);

    

  return (
    <div className='Carddiv'>
        {donor.map((donors, id) => (
            <form key={id} className='Cardform'>
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
  )
}

export default Cards