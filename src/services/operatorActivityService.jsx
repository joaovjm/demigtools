import supabase from "../helper/superBaseClient";

/**
 * Tipos de atividades que podem ser registradas
 */
export const ACTIVITY_TYPES = {
  WORKLIST_CLICK: "worklist_click",
  NEW_DONATION: "new_donation",
  SCHEDULED: "scheduled",
  NOT_ANSWERED: "not_answered",
  CANNOT_HELP: "cannot_help",
  WHATSAPP: "whatsapp",
};

/**
 * Labels amigáveis para os tipos de atividades
 */
export const ACTIVITY_LABELS = {
  [ACTIVITY_TYPES.WORKLIST_CLICK]: "Acessou Lead",
  [ACTIVITY_TYPES.NEW_DONATION]: "Nova Doação",
  [ACTIVITY_TYPES.SCHEDULED]: "Agendamento",
  [ACTIVITY_TYPES.NOT_ANSWERED]: "Não Atendeu",
  [ACTIVITY_TYPES.CANNOT_HELP]: "Não Pode Ajudar",
  [ACTIVITY_TYPES.WHATSAPP]: "Whatsapp",
};

/**
 * Registra uma atividade da operadora
 * @param {Object} params - Parâmetros da atividade
 * @param {number} params.operatorId - ID da operadora
 * @param {string} params.operatorName - Nome da operadora
 * @param {string} params.activityType - Tipo da atividade (usar ACTIVITY_TYPES)
 * @param {number} params.donorId - ID do doador (opcional)
 * @param {string} params.donorName - Nome do doador (opcional)
 * @param {string} params.requestName - Nome do pacote/request (opcional)
 * @param {Object} params.metadata - Dados adicionais (opcional)
 * @returns {Promise<Object|null>} Dados da atividade inserida ou null em caso de erro
 */
export const registerOperatorActivity = async ({
  operatorId,
  operatorName,
  activityType,
  donorId = null,
  donorName = null,
  requestName = null,
  metadata = null,
}) => {
  try {
    const { data, error } = await supabase
      .from("operator_activity")
      .insert({
        operator_code_id: operatorId,
        operator_name: operatorName,
        activity_type: activityType,
        donor_id: donorId,
        donor_name: donorName,
        request_name: requestName,
        metadata: metadata,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao registrar atividade:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erro ao registrar atividade:", error);
    return null;
  }
};

/**
 * Busca todas as atividades das operadoras agrupadas
 * @param {Object} options - Opções de filtro
 * @param {Date} options.startDate - Data inicial (opcional)
 * @param {Date} options.endDate - Data final (opcional)
 * @returns {Promise<Object>} Dados das atividades agrupadas por operadora
 */
export const getOperatorActivities = async ({ startDate, endDate } = {}) => {
  try {
    let query = supabase
      .from("operator_activity")
      .select("*")
      .order("created_at", { ascending: false });

    if (startDate) {
      query = query.gte("created_at", startDate.toISOString());
    }

    if (endDate) {
      query = query.lte("created_at", endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar atividades:", error);
      return { activities: [], grouped: {} };
    }

    // Agrupar atividades por operadora
    const grouped = data.reduce((acc, activity) => {
      const operatorName = activity.operator_name;
      
      if (!acc[operatorName]) {
        acc[operatorName] = {
          operatorId: activity.operator_code_id,
          operatorName: operatorName,
          activities: [],
          counts: {
            [ACTIVITY_TYPES.WORKLIST_CLICK]: 0,
            [ACTIVITY_TYPES.NEW_DONATION]: 0,
            [ACTIVITY_TYPES.SCHEDULED]: 0,
            [ACTIVITY_TYPES.NOT_ANSWERED]: 0,
            [ACTIVITY_TYPES.CANNOT_HELP]: 0,
            [ACTIVITY_TYPES.WHATSAPP]: 0,
          },
          total: 0,
        };
      }

      acc[operatorName].activities.push(activity);
      acc[operatorName].counts[activity.activity_type] = 
        (acc[operatorName].counts[activity.activity_type] || 0) + 1;
      acc[operatorName].total += 1;

      return acc;
    }, {});

    return { activities: data, grouped };
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return { activities: [], grouped: {} };
  }
};

/**
 * Busca atividades de uma operadora específica
 * @param {number} operatorId - ID da operadora
 * @param {Object} options - Opções de filtro
 * @returns {Promise<Array>} Lista de atividades da operadora
 */
export const getOperatorActivityById = async (operatorId, { startDate, endDate } = {}) => {
  try {
    let query = supabase
      .from("operator_activity")
      .select("*")
      .eq("operator_code_id", operatorId)
      .order("created_at", { ascending: false });

    if (startDate) {
      query = query.gte("created_at", startDate.toISOString());
    }

    if (endDate) {
      query = query.lte("created_at", endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar atividades da operadora:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar atividades da operadora:", error);
    return [];
  }
};

/**
 * Busca resumo das atividades de hoje
 * @returns {Promise<Object>} Resumo das atividades do dia
 */
export const getTodayActivitySummary = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getOperatorActivities({ startDate: today, endDate: tomorrow });
};

