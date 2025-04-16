import React, { useEffect, useState } from "react";
import "./index.css";
//import getDonationReceived from "../../helper/getDonationReceived";
import getDonationNotReceived from "../../helper/getDonationNotReceived";
import getDonationPerMonthReceived from "../../helper/getDonationPerMonthReceived";
import { DataNow } from "../../components/DataTime";

const Dashboard = () => {
  const caracterOperator = JSON.parse(localStorage.getItem("operatorData"));
  //const [qReceived, setQReceived] = useState(null); //Quantidade de fichas recebidas
  //const [valueReceived, setValueReceived] = useState(null); //Total de valor recebido
  const [confirmations, setConfirmations] = useState(null) //Quantidade de fichas na confirmação
  const [valueConfirmations, setValueConfirmations] = useState(null) //Total valor na confirmação
  const [openDonations, setOpenDonations] = useState(null) //Quantidades de fichas em aberto
  const [valueOpenDonations, setValueOpenDonations] = useState(null) //Total valor de fichas em aberto
  const [monthReceived, setMonthReceived] = useState(null) //Total de fichas recebidas em determinado mês
  const [valueMonthReceived, setValueMonthReceived] = useState(null) //Total valor dos recebidos do atual Mês
  const [receivedPercent, setReceivedPercent] = useState(null)

  const monthref = DataNow("mesref")

  useEffect(() => {
    getDonationNotReceived(setConfirmations, setValueConfirmations, setOpenDonations, setValueOpenDonations)
    getDonationPerMonthReceived(monthref, setMonthReceived, setValueMonthReceived, setReceivedPercent)
  },[])

  return (
    <main className="mainDashboard">
      {caracterOperator.operator_type === "Admin" && (
        <>
          <section className="sectionHeader">
            {/* Card 1 */}
            <div className="divCard">
              <div className="divHeader">
                <h3 className="h3Header">Em Confirmação</h3>
              </div>
              <div className="divBody">
                <p>{confirmations}</p>
                <p>R$ {valueConfirmations}</p>
              </div>
            </div>

            {/* Card 2 */}
            {/*<div className="divCard">
              <div className="divHeader">
                <h3 className="h3Header">Recebidas</h3>
              </div>
              <div className="divBody">
                <p>{qReceived}</p>
                <p>R$ {valueReceived}</p>
              </div>
            </div>*/}

            {/* Card 3 */}
            <div className="divCard">
              <div className="divHeader">
                <h3 className="h3Header">Em Aberto</h3>
              </div>
              <div className="divBody">
                <p>{openDonations}</p>
                <p>R$ {valueOpenDonations}</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="divCard">
              <div className="divHeader">
                <h3 className="h3Header">Recebida Mês Atual</h3>
              </div>
              <div className="divBody">
                <p>{receivedPercent}%</p>
                <p>R$ {valueMonthReceived}</p>
              </div>
            </div>
          </section>

          <section className="sectionGrafico">
            {/* ChartCard 1 */}
            <div className="cardGrafico">
              <div className="divHeaderGrafico">
                <h3 className="h3HeaderGrafico">Resultados da Equipe (DIA)</h3>
              </div>
              <div className="divGrafico">
                <p>Grafico</p>
              </div>
            </div>

            {/* ChartCard 2 */}
            <div className="cardGrafico">
              <div className="divHeaderGrafico">
                <h3 className="h3HeaderGrafico">Histórico Mensal</h3>
              </div>
              <div className="divGrafico">
                <p>Grafico</p>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Dashboard;
