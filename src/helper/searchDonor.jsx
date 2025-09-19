import supabase from "./superBaseClient";

const searchDonor = async (params, donor_type) => {
  try {
    let query;

    if (params) {
      if (/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(params) || /^\d{11}$/.test(params)) {
        query = supabase
          .from("donor")
          .select(
            `donor_id, donor_name, donor_address, donor_tel_1, donor_neighborhood, donor_type, donor_cpf!inner(donor_cpf)`
          )
          .eq("donor_cpf.donor_cpf", params.replace(/\D/g, ""));
      } else if (/^\d{1,9}$/.test(params)) {
        query = supabase
          .from("donor")
          .select(
            `donor_id, donor_name, donor_address, donor_tel_1, donor_neighborhood, donor_type`
          )
          .ilike("donor_tel_1", `%${params}%`);
      } else {
        query = supabase
          .from("donor")
          .select(
            `donor_id, donor_name, donor_address, donor_tel_1, donor_neighborhood, donor_type`
          )
          .ilike("donor_name", `%${params}%`);
      }
    }

    if (query && donor_type !== "") {
      query = query.ilike("donor_type", donor_type);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Erro ao buscar doador: ", error);
    return null;
  }
};
export default searchDonor;
