import { useState, useEffect } from "react";
import styles from "./modaloperatoractivity.module.css";
import { getOperatorActivityById, ACTIVITY_LABELS, ACTIVITY_TYPES } from "../../services/operatorActivityService";
import { getLeadsByOperatorId, LEADS_STATUS_TYPES, LEADS_STATUS_LABELS } from "../../helper/getLeadsHistory";

const ModalOperatorActivity = ({ operator, dateFilter = {}, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("requisicao");

  useEffect(() => {
    const fetchData = async () => {
      if (!operator?.operatorId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [activitiesData, leadsData] = await Promise.all([
          getOperatorActivityById(operator.operatorId, {
            startDate: dateFilter.startDate,
            endDate: dateFilter.endDate,
          }),
          getLeadsByOperatorId(operator.operatorId, {
            startDate: dateFilter.startDate,
            endDate: dateFilter.endDate,
          }),
        ]);
        setActivities(activitiesData);
        setLeads(leadsData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [operator?.operatorId, dateFilter.startDate, dateFilter.endDate]);

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(a => a.activity_type === filter);

  const filteredLeads = filter === "all"
    ? leads
    : leads.filter(l => l.leads_status === filter);

  const getActivityIcon = (type) => {
    const icons = {
      [ACTIVITY_TYPES.WORKLIST_CLICK]: "📋",
      [ACTIVITY_TYPES.NEW_DONATION]: "💰",
      [ACTIVITY_TYPES.SCHEDULED]: "📅",
      [ACTIVITY_TYPES.NOT_ANSWERED]: "📵",
      [ACTIVITY_TYPES.CANNOT_HELP]: "❌",
      [ACTIVITY_TYPES.WHATSAPP]: "💬",
    };
    return icons[type] || "📌";
  };

  const getLeadIcon = (status) => {
    const icons = {
      [LEADS_STATUS_TYPES.SCHEDULED]: "📅",
      [LEADS_STATUS_TYPES.NOT_ANSWERED]: "📵",
      [LEADS_STATUS_TYPES.CANNOT_HELP]: "❌",
      [LEADS_STATUS_TYPES.SUCCESS]: "✅",
    };
    return icons[status] || "👤";
  };

  const getActivityClass = (type) => {
    const classes = {
      [ACTIVITY_TYPES.NEW_DONATION]: styles.success,
      [ACTIVITY_TYPES.SCHEDULED]: styles.info,
      [ACTIVITY_TYPES.NOT_ANSWERED]: styles.warning,
      [ACTIVITY_TYPES.CANNOT_HELP]: styles.danger,
      [ACTIVITY_TYPES.WHATSAPP]: styles.whatsapp,
      [ACTIVITY_TYPES.WORKLIST_CLICK]: styles.neutral,
    };
    return classes[type] || "";
  };

  const getLeadClass = (status) => {
    const classes = {
      [LEADS_STATUS_TYPES.SUCCESS]: styles.successAlt,
      [LEADS_STATUS_TYPES.SCHEDULED]: styles.info,
      [LEADS_STATUS_TYPES.NOT_ANSWERED]: styles.warning,
      [LEADS_STATUS_TYPES.CANNOT_HELP]: styles.danger,
    };
    return classes[status] || "";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>
              {operator?.operatorName || "Operadora"}
            </h2>
            <p className={styles.subtitle}>Histórico de Atividades</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "requisicao" ? styles.activeTab : ""}`}
            onClick={() => { setActiveTab("requisicao"); setFilter("all"); }}
          >
            <span className={styles.tabIcon}>📋</span>
            Requisição
            <span className={styles.tabBadge}>{operator?.totalRequisicao || 0}</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === "leads" ? styles.activeTab : ""}`}
            onClick={() => { setActiveTab("leads"); setFilter("all"); }}
          >
            <span className={styles.tabIcon}>👤</span>
            Leads
            <span className={styles.tabBadge}>{operator?.totalLeads || 0}</span>
          </button>
        </div>

        {/* Stats Bar - Requisição */}
        {activeTab === "requisicao" && (
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {operator?.activityCounts?.[ACTIVITY_TYPES.NEW_DONATION] || 0}
              </span>
              <span className={styles.statLabel}>Doações</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {operator?.activityCounts?.[ACTIVITY_TYPES.SCHEDULED] || 0}
              </span>
              <span className={styles.statLabel}>Agendamentos</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {operator?.activityCounts?.[ACTIVITY_TYPES.NOT_ANSWERED] || 0}
              </span>
              <span className={styles.statLabel}>Não Atendeu</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {operator?.activityCounts?.[ACTIVITY_TYPES.CANNOT_HELP] || 0}
              </span>
              <span className={styles.statLabel}>Não Pode</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {operator?.activityCounts?.[ACTIVITY_TYPES.WHATSAPP] || 0}
              </span>
              <span className={styles.statLabel}>Whatsapp</span>
            </div>
          </div>
        )}

        {/* Stats Bar - Leads */}
        {activeTab === "leads" && (
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {operator?.leadsCounts?.[LEADS_STATUS_TYPES.SUCCESS] || 0}
              </span>
              <span className={styles.statLabel}>Sucesso</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {operator?.leadsCounts?.[LEADS_STATUS_TYPES.SCHEDULED] || 0}
              </span>
              <span className={styles.statLabel}>Agendados</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {operator?.leadsCounts?.[LEADS_STATUS_TYPES.NOT_ANSWERED] || 0}
              </span>
              <span className={styles.statLabel}>Não Atendeu</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {operator?.leadsCounts?.[LEADS_STATUS_TYPES.CANNOT_HELP] || 0}
              </span>
              <span className={styles.statLabel}>Não Pode</span>
            </div>
          </div>
        )}

        {/* Filtros - Requisição */}
        {activeTab === "requisicao" && (
          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
              onClick={() => setFilter("all")}
            >
              Todos
            </button>
            <button
              className={`${styles.filterBtn} ${filter === ACTIVITY_TYPES.NEW_DONATION ? styles.active : ""}`}
              onClick={() => setFilter(ACTIVITY_TYPES.NEW_DONATION)}
            >
              Doações
            </button>
            <button
              className={`${styles.filterBtn} ${filter === ACTIVITY_TYPES.SCHEDULED ? styles.active : ""}`}
              onClick={() => setFilter(ACTIVITY_TYPES.SCHEDULED)}
            >
              Agendamentos
            </button>
            <button
              className={`${styles.filterBtn} ${filter === ACTIVITY_TYPES.NOT_ANSWERED ? styles.active : ""}`}
              onClick={() => setFilter(ACTIVITY_TYPES.NOT_ANSWERED)}
            >
              Não Atendeu
            </button>
            <button
              className={`${styles.filterBtn} ${filter === ACTIVITY_TYPES.CANNOT_HELP ? styles.active : ""}`}
              onClick={() => setFilter(ACTIVITY_TYPES.CANNOT_HELP)}
            >
              Não Pode
            </button>
          </div>
        )}

        {/* Filtros - Leads */}
        {activeTab === "leads" && (
          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
              onClick={() => setFilter("all")}
            >
              Todos
            </button>
            <button
              className={`${styles.filterBtn} ${filter === LEADS_STATUS_TYPES.SUCCESS ? styles.active : ""}`}
              onClick={() => setFilter(LEADS_STATUS_TYPES.SUCCESS)}
            >
              Sucesso
            </button>
            <button
              className={`${styles.filterBtn} ${filter === LEADS_STATUS_TYPES.SCHEDULED ? styles.active : ""}`}
              onClick={() => setFilter(LEADS_STATUS_TYPES.SCHEDULED)}
            >
              Agendados
            </button>
            <button
              className={`${styles.filterBtn} ${filter === LEADS_STATUS_TYPES.NOT_ANSWERED ? styles.active : ""}`}
              onClick={() => setFilter(LEADS_STATUS_TYPES.NOT_ANSWERED)}
            >
              Não Atendeu
            </button>
            <button
              className={`${styles.filterBtn} ${filter === LEADS_STATUS_TYPES.CANNOT_HELP ? styles.active : ""}`}
              onClick={() => setFilter(LEADS_STATUS_TYPES.CANNOT_HELP)}
            >
              Não Pode
            </button>
          </div>
        )}

        <div className={styles.body}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Carregando dados...</p>
            </div>
          ) : activeTab === "requisicao" ? (
            // Lista de Atividades de Requisição
            filteredActivities.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>📭</span>
                <p>Nenhuma atividade de requisição encontrada</p>
              </div>
            ) : (
              <div className={styles.activityList}>
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`${styles.activityItem} ${getActivityClass(activity.activity_type)}`}
                  >
                    <div className={styles.activityIcon}>
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityHeader}>
                        <span className={styles.activityType}>
                          {ACTIVITY_LABELS[activity.activity_type]}
                        </span>
                        <span className={styles.activityTime}>
                          {formatDate(activity.created_at)}
                        </span>
                      </div>
                      {activity.donor_name && (
                        <p className={styles.activityDonor}>
                          <strong>Doador:</strong> {activity.donor_name}
                        </p>
                      )}
                      {activity.request_name && (
                        <p className={styles.activityRequest}>
                          <strong>Pacote:</strong> {activity.request_name}
                        </p>
                      )}
                      {activity.metadata && (
                        <div className={styles.activityMeta}>
                          {activity.metadata.value && (
                            <span>
                              <strong>Valor:</strong> R$ {activity.metadata.value}
                            </span>
                          )}
                          {activity.metadata.date && (
                            <span>
                              <strong>Data:</strong> {activity.metadata.date}
                            </span>
                          )}
                          {activity.metadata.observation && (
                            <span>
                              <strong>Obs:</strong> {activity.metadata.observation}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // Lista de Leads
            filteredLeads.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>👤</span>
                <p>Nenhum lead encontrado</p>
              </div>
            ) : (
              <div className={styles.activityList}>
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`${styles.activityItem} ${getLeadClass(lead.leads_status)}`}
                  >
                    <div className={styles.activityIcon}>
                      {getLeadIcon(lead.leads_status)}
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityHeader}>
                        <span className={styles.activityType}>
                          {LEADS_STATUS_LABELS[lead.leads_status] || lead.leads_status}
                        </span>
                        <span className={styles.activityTime}>
                          {formatDate(lead.leads_date_accessed)}
                        </span>
                      </div>
                      {lead.leads_name && (
                        <p className={styles.activityDonor}>
                          <strong>Nome:</strong> {lead.leads_name}
                        </p>
                      )}
                      {lead.leads_phone && (
                        <p className={styles.activityRequest}>
                          <strong>Telefone:</strong> {lead.leads_phone}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.totalCount}>
            Total: {activeTab === "requisicao" ? filteredActivities.length : filteredLeads.length} {activeTab === "requisicao" ? "atividades" : "leads"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModalOperatorActivity;

