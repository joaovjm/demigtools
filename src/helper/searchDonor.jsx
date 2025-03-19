import supabase from "./superBaseClient";

export const searchDonor = async (params, donor_type) => {
  try {
    let column = "";
    if (params) {
      if (/^\d{11}$/.test(params)) {
        column = "donor_cpf";
      } else if (/^\d{1,9}$/.test(params)) {
        column = "donor_tel_1";
      } else {
        column = "donor_name";
      }
    }
    const { data, error } = await supabase
      .from("donor")
      .select()
      .ilike(column, `${params}`)
      .ilike("donor_type", `%${donor_type}%`);
      
      
    return data;
  } catch (error) {
    console.error("Erro ao buscar doador: ", error);
    return null;
  }
};