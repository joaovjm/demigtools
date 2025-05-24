import React, { useState } from 'react'
import "./index.css"
import { operatorWorkService } from '../../services/operatorWorkService'
import TableOperatorWork from '../../components/TableOperatorWork'

const OperatorWork = () => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [filter, setFilter] = useState("Todos")
  const [relatory, setRelatory] = useState()

  const handleGenerate = async () => {
    const response = await operatorWorkService(startDate, endDate, filter);
    setRelatory(response)
  }
  
  return (
    <div className="operator-work">
      <div className='operator-work-header'>
        <div className='input-field'>
          <label>Inicio</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
        </div>
        <div className='input-field'>
          <label>Fim</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
        </div>
        <div className='input-field'>
          <label>Filtro</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Recebida">Recebida</option>
          </select>
        </div>
        <div className='operator-work-geral-button'>
          <button onClick={handleGenerate} className='btn-gerar'>Gerar</button>
        </div>
      </div>
      {relatory && (
        <TableOperatorWork relatory={relatory}/>
      )}
      
    </div>
  )
}

export default OperatorWork