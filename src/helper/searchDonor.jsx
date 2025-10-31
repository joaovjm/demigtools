import supabase from "./superBaseClient";

const searchDonor = async (params, donor_type) => {
  try {
    let query;
    // Determina se deve buscar na tabela leads ou donor
    const isLeadSearch = donor_type === "Lead" || donor_type === "Leads";
    const tableName = isLeadSearch ? "leads" : "donor";

    if (params) {
      if (
        /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(params) ||
        /^\d{11}$/.test(params)
      ) {
        // Busca por CPF
        if (isLeadSearch) {
          // Busca na tabela leads por CPF
          query = supabase
            .from("leads")
            .select(
              `leads_id, leads_name, leads_address, leads_tel_1, leads_neighborhood, leads_icpf`
            )
            .eq("leads_cpf", params.replace(/\D/g, ""));
        } else {
          // Busca na tabela donor por CPF
          query = supabase
            .from("donor")
            .select(
              `donor_id, donor_name, donor_address, donor_tel_1, donor_neighborhood, donor_type, donor_cpf!inner(donor_cpf)`
            )
            .eq("donor_cpf.donor_cpf", params.replace(/\D/g, ""));
        }
      } else if (/^\d{1,9}$/.test(params)) {
        // Busca por telefone
        if (isLeadSearch) {
          // Busca na tabela leads por telefone
          query = supabase
            .from("leads")
            .select(
              `leads_id, leads_name, leads_address, leads_tel_1, leads_neighborhood, leads_icpf`
            )
            .or(`leads_tel_1.ilike.%${params}%,leads_tel_2.ilike.%${params}%`);
        } else {
          query = supabase.rpc("search_donor_by_phone", {
            phone_search: params,
            donor_type_filter: donor_type.trim() || "Todos",
          });
        }
      } else if (/[Rr]/.test(params)) {
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
              `leads_id, leads_name, leads_address, leads_tel_1, leads_neighborhood, leads_icpf`
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
    if (query && donor_type !== "" && !/^\d{1,9}$/.test(params) && !isLeadSearch) {
      if (/[Rr]/.test(params) && donor_type === "Todos") {
        query = query.neq("donor.donor_type", "Excluso");
      } else if (/[Rr]/.test(params) && donor_type !== "Todos") {
        query = query.eq("donor.donor_type", donor_type);
      } else {
        query = query.neq("donor_type", "Excluso");
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // Normaliza os dados para manter consistência na interface
    if (data) {
      if (/[Rr]/.test(params) && !isLeadSearch) {
        const dataDonor = data[0]?.donor;
        console.log(data);
        return dataDonor ? [dataDonor] : [];
      } else if (isLeadSearch && data.length > 0) {
        // Mapeia os campos de leads para o formato esperado pelo componente
        const normalizedData = data.map(lead => ({
          donor_id: lead.leads_id,
          donor_name: lead.leads_name,
          donor_address: lead.leads_address,
          donor_tel_1: lead.leads_tel_1,
          donor_neighborhood: lead.leads_neighborhood,
          donor_type: "Lead",
          donor_cpf: lead.leads_icpf,
          isLead: true // Flag para identificar que é um lead
        }));
        console.log("Leads encontrados:", normalizedData);
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
