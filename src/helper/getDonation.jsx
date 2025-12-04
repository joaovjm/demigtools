import supabase from "./superBaseClient"

export const getDonation = async (donor_id) => {
    try{
        const {data, error} = await supabase.from("donation").select(`
            receipt_donation_id,
            donation_value,
            donation_extra,
            donation_day_contact,
            donation_day_to_receive,
            donation_day_received,
            donation_print,
            donation_received,
            donation_monthref,
            donation_description,
            donation_campain,
            donation_worklist,
            collector_code_id,
            operator_code_id,
            ult_collector,
            collector_ult: ult_collector(collector_name),
            collector:collector_code_id (collector_name),
            operator:operator_code_id (operator_name)
            donor: donor_id (donor_type)
            donor_cpf: donor_id (donor_cpf)
        `).eq("donor_id", donor_id)
        .order("donation_day_to_receive", {ascending: false})
        .order("receipt_donation_id", {ascending: false})

        if (error) throw error
        return data
    } catch (error) {
        console.error("Erro ao buscar os dados: ", error.message)
    }
        
    

    
}