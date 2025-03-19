import supabase from "./superBaseClient";

export const getInfoDonor = async (id) => {
    const { data, error } = await supabase
      .from("donor")
      .select(`
        donor_name,
        donor_type,
        donor_address,
        donor_city,
        donor_neighborhood,
        donor_tel_1,
        donor_cpf (donor_cpf),
        donor_tel_2 (donor_tel_2),
        donor_tel_3 (donor_tel_3),
        donor_observation (donor_observation)`)
      .eq("donor_id", id);
    return data;
   
};
  
export const getDonations = async (idDonor) => {
    const {data, error} = await supabase
    .from("doação")
    .select()
    .eq("id_doacao_doador", idDonor)
    return data
}
  