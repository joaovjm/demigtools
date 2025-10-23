import supabase from "./superBaseClient";

const searchDonor = async (params, donor_type) => {
  try {
    let query;

    if (params) {
      if (
        /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(params) ||
        /^\d{11}$/.test(params)
      ) {
        query = supabase
          .from("donor")
          .select(
            `donor_id, donor_name, donor_address, donor_tel_1, donor_neighborhood, donor_type, donor_cpf!inner(donor_cpf)`
          )
          .eq("donor_cpf.donor_cpf", params.replace(/\D/g, ""));
      } else if (/^\d{1,9}$/.test(params)) {
        query = supabase.rpc("search_donor_by_phone", {
          phone_search: params,
          donor_type_filter: donor_type.trim() || "Todos",
        });
      } else if (/[Rr]/.test(params)) {
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
      } else {
        query = supabase
          .from("donor")
          .select(
            `donor_id, donor_name, donor_address, donor_tel_1, donor_neighborhood, donor_type`
          )
          .ilike("donor_name", `%${params}%`);
      }
    }

    if (query && donor_type !== "" && !/^\d{1,9}$/.test(params)) {
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

    if (data && /[Rr]/.test(params)) {
      const dataDonor = data[0].donor;
      console.log(data);
      return [dataDonor];
    } else {
      console.log("data", data);
      return data;
    }
  } catch (error) {
    console.error("Erro ao buscar doador: ", error);
    return null;
  }
};
export default searchDonor;
