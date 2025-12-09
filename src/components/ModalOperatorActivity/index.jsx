import { useState, useEffect } from "react";
import styles from "./modaloperatoractivity.module.css";
import { getOperatorActivityById, ACTIVITY_LABELS, ACTIVITY_TYPES } from "../../services/operatorActivityService";

const ModalOperatorActivity = ({ operator, dateFilter = {}, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchActivities = async () => {
      if (!operator?.operatorId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getOperatorActivityById(operator.operatorId, {
          startDate: dateFilter.startDate,
          endDate: dateFilter.endDate,
        });
        setActivities(data);
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [operator?.operatorId, dateFilter.startDate, dateFilter.endDate]);

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(a => a.activity_type === filter);

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

  const formatDate = (dateString) => {
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
              <span className={styles.icon}>👤</span>
              {operator?.operatorName || "Operadora"}
            </h2>
            <p className={styles.subtitle}>Histórico de Atividades</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>💰</span>
            <span className={styles.statValue}>
              {operator?.counts?.[ACTIVITY_TYPES.NEW_DONATION] || 0}
            </span>
            <span className={styles.statLabel}>Doações</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>📅</span>
            <span className={styles.statValue}>
              {operator?.counts?.[ACTIVITY_TYPES.SCHEDULED] || 0}
            </span>
            <span className={styles.statLabel}>Agendamentos</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>📵</span>
            <span className={styles.statValue}>
              {operator?.counts?.[ACTIVITY_TYPES.NOT_ANSWERED] || 0}
            </span>
            <span className={styles.statLabel}>Não Atendeu</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>❌</span>
            <span className={styles.statValue}>
              {operator?.counts?.[ACTIVITY_TYPES.CANNOT_HELP] || 0}
            </span>
            <span className={styles.statLabel}>Não Pode</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>💬</span>
            <span className={styles.statValue}>
              {operator?.counts?.[ACTIVITY_TYPES.WHATSAPP] || 0}
            </span>
            <span className={styles.statLabel}>Whatsapp</span>
          </div>
        </div>

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
            <span className={styles.filterIcon}>💰</span>
            <span>Doações</span>
          </button>
          <button
            className={`${styles.filterBtn} ${filter === ACTIVITY_TYPES.SCHEDULED ? styles.active : ""}`}
            onClick={() => setFilter(ACTIVITY_TYPES.SCHEDULED)}
          >
            <span className={styles.filterIcon}>📅</span>
            <span>Agendamentos</span>
          </button>
          <button
            className={`${styles.filterBtn} ${filter === ACTIVITY_TYPES.NOT_ANSWERED ? styles.active : ""}`}
            onClick={() => setFilter(ACTIVITY_TYPES.NOT_ANSWERED)}
          >
            <span className={styles.filterIcon}>📵</span>
            <span>Não Atendeu</span>
          </button>
          <button
            className={`${styles.filterBtn} ${filter === ACTIVITY_TYPES.CANNOT_HELP ? styles.active : ""}`}
            onClick={() => setFilter(ACTIVITY_TYPES.CANNOT_HELP)}
          >
            <span className={styles.filterIcon}>❌</span>
            <span>Não Pode</span>
          </button>
        </div>

        <div className={styles.body}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Carregando atividades...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>📭</span>
              <p>Nenhuma atividade encontrada</p>
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
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.totalCount}>
            Total: {filteredActivities.length} atividades
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModalOperatorActivity;

