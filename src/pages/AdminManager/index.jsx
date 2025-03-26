import React from 'react'
import "./index.css"
import MonthlyfeeGeneratorComponent from '../../assets/components/MonthlyfeeGeneratorComponent'

const AdminManager = () => {
  return (
    <main className='mainAdmin_manager'>
        <div className='adminManager_menu'>
            <label className='label_menu'>Gerar Mensal</label>
            <label className='label_menu'>Gerenciar Operadores</label>
            <label className='label_menu'>Gerar Mensal</label>
        </div>
        <div className='adminManager_forms'>
            <form className='form_adminManager'><MonthlyfeeGeneratorComponent/></form>
        </div>

    </main>
  )
}

export default AdminManager