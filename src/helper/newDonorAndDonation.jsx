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

const newDonorAndDonation = async ({
  id,
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
  nowScheduled,
}) => {
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
      observation,
      DataNow("mesrefnf"),
      campain
    );
    if (donationResponse.length === 0)
      throw new Error(
        "Doador foi criado, mas houve um erro ao criar a doação: " +
          donationResponse.error?.message
      );

    return donationResponse;
  };

  const handleUpdateStatusLead = async () => {
    try {
      const { data: updateLead, error: errorUpdate } = await supabase
        .from("leads")
        .update({ leads_status: "Sucesso" })
        .eq("leads_id", id);

      if (errorUpdate) throw errorUpdate;
      if (!errorUpdate) return updateLead;
    } catch (error) {
      console.log("Erro: ", error);
    }
  };

  const donorExist = async () => {
    const { data, error } = await supabase
      .from("donor")
      .select()
      .eq("donor_id", id);
    if (error) throw error;
    if (data.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const result = await toast.promise(
    new Promise(async (resolve, reject) => {
      try {
        if (donorExist === true) {
          console.log("existe");
          return;
        } else {
          const donor_id = await handleDonorCreation();
          const donation = await handleDonationCreation(donor_id);
          const leadStatus = await handleUpdateStatusLead();

          resolve("Operação completada com sucesso!");
        }
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
