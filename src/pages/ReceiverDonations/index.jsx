import React, { useState } from 'react'
import "./index.css"

import { FaMoneyCheckDollar } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";

const ReceiverDonations = () => {
  const [collector, setCollector] = useState('')
  const [date, setDate] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')

  const handleReceiverDonations = (e) => {
    e.preventDefault()
    setMessage('Doações recebidas com sucesso!')
    const messageTimeOut = setTimeout(() => {
      setMessage('')
    }, 1000)
    return () => clearTimeout(messageTimeOut)
  }


  return (
    <main className='receiver-donations-main'>
      <div className='receiver-donations-header'>
        <div>
          <h2 className='receiver-donations-header-title-text'><FaMoneyCheckDollar /> Receber Doações</h2>
        </div>
      </div>

      <form onSubmit={handleReceiverDonations} className='receiver-donations-form'>
        <div className='receiver-donations-form-input'>
          <label  className="label">Coletador</label>
          <select value={collector} onChange={(e) => setCollector(e.target.value)}>
            <option value="" disabled>Selecione o coletador</option>
            <option value="João Oliveira">João Oliveira</option>
            <option value="Jozinei Venancio">Jozinei Venancio</option>
            <option value="Leandro Amoedo">Leandro Amoedo</option>
          </select>
        </div>

        <div className='receiver-donations-form-input'>
          <label  className="label">Data</label>
          <input type='date' value={date} onChange={(e) => setDate(e.target.value)}/>
        </div>

        <div className='receiver-donations-form-input'>
          <label  className="label">Buscar</label>
          <input type='text' value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>
      </form>

      <div className='receiver-donations-form-message'>
        {message && (
          <div style={{backgroundColor: 'green', width: '100%'}} className='receiver-donations-form-message'>
            <p className='receiver-donations-form-message-text'>{message}<GiConfirmed /></p>
          </div>
        )}
      </div>

      <table className='receiver-donations-table'>
        <thead className='receiver-donations-table-header'>
          <tr>
            <th style={{width: '20%'}}>Recibo</th>
            <th style={{width: '60%'}}>Nome</th>
            <th style={{width: '20%'}}>Valor</th>
          </tr>
        </thead>
        <tbody className='receiver-donations-table-body'>
          <tr>
            <td>123458</td>
            <td>João Marcos Oliveira da Silva</td>
            <td>50</td>
          </tr>
        </tbody>
      </table>
    </main>
  )
}

export default ReceiverDonations