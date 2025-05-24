import { toast } from "react-toastify";
import { DataNow } from "../components/DataTime";
import { insertDonation } from "./insertDonation";
import {
  insertDonor,
  insertDonor_cpf,
  insertDonor_tel_2,
  insertDonor_tel_3,
} from "./insertDonor";
import supabase from "./superBaseClient";

const newDonorAndDonation = async (
  name,
  address,
  neighborhood,
  city,
  telSuccess,
  tel2,
  tel3,
  icpf,
  valueDonation,
  date,
  campain,
  observation,
  operatorID,
  nowScheduled
) => {
  const handleDonorCreation = async () => {
    const response = await insertDonor(
      name,
      "Lista",
      address,
      city,
      neighborhood,
      telSuccess
    );
    if (response.length === 0)
      throw new Error("Erro ao criar o doador: " + response.error?.message);
    const { donor_id } = response[0];
    if (tel2) await insertDonor_tel_2(donor_id, tel2);
    if (tel3) await insertDonor_tel_3(donor_id, tel3);
    if (icpf) await insertDonor_cpf(donor_id, icpf);
    return donor_id;
  };

  const handleDonationCreation = async (donor_id) => {
    const donationResponse = await insertDonation(
      donor_id,
      operatorID,
      valueDonation,
      null,
      DataNow("noformated"),
      date,
      false,
      false,
      null,
      DataNow("mesrefnf"),
      observation,
      campain
    );
    if (donationResponse.length === 0)
      throw new Error(
        "Doador foi criado, mas houve um erro ao criar a doação: " +
          donationResponse.error?.message
      );
  };

  const handleLeadCopyAndDelete = async () => {
    const copyLeadResponse = await supabase
      .from("leads_excludes")
      .insert(
        {
          leads_address: nowScheduled.leads_address,
          leads_city: nowScheduled.leads_city,
          leads_date_accessed: nowScheduled.leads_date_accessed,
          leads_icpf: nowScheduled.leads_icpf,
          leads_id: nowScheduled.leads_id,
          leads_name: nowScheduled.leads_name,
          leads_neighborhod: nowScheduled.leads_neighborhod,
          leads_observation: nowScheduled.leads_observation,
          leads_scheduling_date: nowScheduled.leads_scheduling_date,
          leads_status: nowScheduled.leads_status,
          leads_tel_1: nowScheduled.leads_tel_1,
          leads_tel_2: nowScheduled.leads_tel_2,
          leads_tel_3: nowScheduled.leads_tel_3,
          leads_tel_4: nowScheduled.leads_tel_4,
          leads_tel_5: nowScheduled.leads_tel_5,
          leads_tel_6: nowScheduled.leads_tel_6,
          operator_code_id: nowScheduled.operator_code_id

        }
        )
      .select();
    if (copyLeadResponse.error)
      throw new Error("Erro ao copiar lead: " + copyLeadResponse.error.message);
    const deleteLeadResponse = await supabase
      .from("leads")
      .delete()
      .eq("leads_id", nowScheduled.leads_id)
      .select();
    if (deleteLeadResponse.error)
      throw new Error("Erro ao deletar lead: " + deleteLeadResponse.error.message);
  };

  const result = await toast.promise(
    new Promise(async (resolve, reject) => {
      try {
        const donor_id = await handleDonorCreation();
        await handleDonationCreation(donor_id);
        await handleLeadCopyAndDelete();
        resolve("Operação completada com sucesso!");
      } catch (err) {
        reject(err);
      }
    }),
    {
      pending: "Criando doador e sua doação...",
      success: {
        render({ data }) {
          return data;
        },
      },
      error: {
        render({ data }) {
          return `Erro: ${data.message}`;
        },
      },
    }
  );
  return result;
};

export default newDonorAndDonation;
