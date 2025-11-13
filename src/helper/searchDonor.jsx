import supabase from "./superBaseClient";

const searchDonor = async (params, donor_type) => {
  try {
    let query;
    // Determina se deve buscar na tabela leads ou donor
    const isLeadSearch = donor_type === "Lead" || donor_type === "Leads";
    const tableName = isLeadSearch ? "leads" : "donor";

    if (params) {
      // Remove tudo que não for número
      const cleanParam = params.replace(/\D/g, "");

      // Detecta padrões de CPF e CNPJ completos
      const isFullCpf = /^\d{11}$/.test(cleanParam);
      const isFullCnpj = /^\d{14}$/.test(cleanParam);

      // Detecta CNPJ parcial: começa com 2 dígitos e ponto (ex: "12.")
      const isCnpjStart = /^\d{2}\./.test(params);

      // Detecta padrões parciais de CPF e CNPJ
      const isCpfLike =
        /^\d{3,11}$/.test(cleanParam) ||
        /^\d{1,3}(\.\d{1,3}){0,2}(-\d{0,2})?$/.test(params);

      const isCnpjLike =
        isCnpjStart ||
        (/^\d{5,14}$/.test(cleanParam) && params.includes("/")) ||
        /^\d{2}\.?\d{3}\.?\d{3}\/?\d{0,4}-?\d{0,2}$/.test(params);

      // Detecta telefone (8–11 dígitos, sem barra e sem ponto/traço de CPF)
      const isPhoneLike =
        /^\d{8,11}$/.test(cleanParam) &&
        !params.includes("/") &&
        !params.includes("-") &&
        !params.includes(".");

      // 🧩 Ordem: telefone primeiro, depois CPF/CNPJ
      if (isPhoneLike) {
        // Busca por telefone
        if (isLeadSearch) {
          query = supabase
            .from("leads")
            .select(
              `leads_id, leads_name, leads_address, leads_tel_1, leads_neighborhood, leads_icpf, operator: operator_code_id(operator_code_id, operator_name)`
            )
            .or(`leads_tel_1.ilike.%${params}%,leads_tel_2.ilike.%${params}%`);
        } else {
          query = supabase.rpc("search_donor_by_phone", {
            phone_search: params,
            donor_type_filter: donor_type.trim() || "Todos",
          });
        }
      } else if (isFullCpf || isCpfLike || isFullCnpj || isCnpjLike) {
        // Busca por CPF ou CNPJ no mesmo campo
        if (isLeadSearch) {
          query = supabase
            .from("leads")
            .select(
              `leads_id, leads_name, leads_address, leads_tel_1, leads_neighborhood, leads_icpf, operator: operator_code_id(operator_code_id, operator_name)`
            )
            .ilike("leads_icpf", `%${cleanParam}%`);
        } else {
          query = supabase
            .from("donor")
            .select(
              `donor_id, donor_name, donor_address, donor_tel_1, donor_neighborhood, donor_type, donor_cpf!inner(donor_cpf)`
            )
            .ilike("donor_cpf.donor_cpf", `%${cleanParam}%`);
        }
      } else if (/^\d{1,9}$/.test(params)) {
        // Busca por telefone
        if (isLeadSearch) {
          // Busca na tabela leads por telefone
          query = supabase
            .from("leads")
            .select(
              `leads_id, leads_name, leads_address, leads_tel_1, leads_neighborhood, leads_icpf, operator: operator_code_id(operator_code_id, operator_name)`
            )
            .or(`leads_tel_1.ilike.%${params}%,leads_tel_2.ilike.%${params}%`);
        } else {
          console.log("caiu no Telefone");
          query = supabase.rpc("search_donor_by_phone", {
            phone_search: params,
            donor_type_filter: donor_type.trim() || "Todos",
          });
        }
      } else if (/^r\d+$/i.test(params)) {
        // Busca por recibo (apenas para donors, não para leads)
        if (!isLeadSearch) {
          query = supabase
            .from("donation")
            .select(
              `
            donor: donation_donor_id_fkey(
            donor_id,
              donor_name,
              donor_address,
              donor_tel_1,
              donor_neighborhood,
              donor_type
            )
          `
            )
            .eq("receipt_donation_id", Number(params.replace(/\D/g, "")));
        }
      } else {
        // Busca por nome
        if (isLeadSearch) {
          query = supabase
            .from("leads")
            .select(
              `leads_id, leads_name, leads_address, leads_tel_1, leads_neighborhood, leads_icpf, operator: operator_code_id(operator_code_id, operator_name)`
            )
            .ilike("leads_name", `%${params}%`);
        } else {
          query = supabase
            .from("donor")
            .select(
              `donor_id, donor_name, donor_address, donor_tel_1, donor_neighborhood, donor_type`
            )
            .ilike("donor_name", `%${params}%`);
        }
      }
    }

    // Filtros adicionais (apenas para donors)
    if (
      query &&
      donor_type !== "" &&
      !/^\d{1,9}$/.test(params) &&
      !isLeadSearch
    ) {
      if (/^r\d+$/i.test(params) && donor_type === "Todos") {
        query = query.neq("donor.donor_type", "Excluso");
      } else if (/^r\d+$/i.test(params) && donor_type !== "Todos") {
        query = query.eq("donor.donor_type", donor_type);
      } else {
        query = query.neq("donor_type", "Excluso");
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // Normaliza os dados para manter consistência na interface
    if (data) {
      if (/^r\d+$/i.test(params) && !isLeadSearch) {
        const dataDonor = data[0]?.donor;

        return dataDonor ? [dataDonor] : [];
      } else if (isLeadSearch && data.length > 0) {
        // Mapeia os campos de leads para o formato esperado pelo componente
        const normalizedData = data.map((lead) => ({
          donor_id: lead.leads_id,
          donor_name: lead.leads_name,
          donor_address: lead.leads_address,
          donor_tel_1: lead.leads_tel_1,
          donor_neighborhood: lead.leads_neighborhood,
          donor_type: "Lead",
          donor_cpf: lead.leads_icpf,
          operator_code_id: lead.operator.operator_code_id,
          operator_name: lead.operator.operator_name,
          isLead: true, // Flag para identificar que é um lead
        }));

        return normalizedData;
      } else {
        console.log("data", data);
        return data;
      }
    }

    return [];
  } catch (error) {
    console.error("Erro ao buscar doador: ", error);
    return null;
  }
};
export default searchDonor;
