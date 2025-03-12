import React from "react";
import "./index.css";

const Dashboard = () => {  

  return (
    <main className="mainDashboard">
      <section className="sectionHeader">
        {/* Card 1 */}
        <div className="divCard">
          <div className="divHeader">
            <h3 className="h3Header">Em Confirmação</h3>
          </div>
          <div className="divBody">
            <p>50</p>
            <p>R$ 100,00</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="divCard">
          <div className="divHeader">
            <h3 className="h3Header">Recebidas</h3>
          </div>
          <div className="divBody">
            <p>50</p>
            <p>R$ 100,00</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="divCard">
          <div className="divHeader">
            <h3 className="h3Header">Em Aberto</h3>
          </div>
          <div className="divBody">
            <p>50</p>
            <p>R$ 100,00</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="divCard">
          <div className="divHeader">
            <h3 className="h3Header">Total Mês</h3>
          </div>
          <div className="divBody">
            <p>63%</p>
            <p>R$ 33.100,00</p>
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
    </main>
  );
};

export default Dashboard;
