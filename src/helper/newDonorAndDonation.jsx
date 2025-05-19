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
  const result = await toast.promise(
    new Promise(async (resolve, reject) => {
      const response = await insertDonor(
        name,
        "lista",
        address,
        city,
        neighborhood,
        telSuccess
      );
      if (response.length === 0) {
        reject(new Error("Erro ao criar o doador: ", response.error.message));
      }

      const { donor_id } = response[0];

      if (tel2 && tel2 !== "") {
        await insertDonor_tel_2(donor_id, tel2);
      }

      if (tel3 && tel3 !== "") {
        await insertDonor_tel_3(donor_id, tel3);
      }

      if (icpf && icpf !== "") {
        await insertDonor_cpf(donor_id, icpf);
      }

      const createDonor = "ok";
      console.log("Create donor: ok");

      const donationResponse = await insertDonation(
        donor_id,
        operatorID,
        valueDonation,
        null,
        DataNow(),
        date,
        false,
        false,
        null,
        DataNow("mesref"),
        observation,
        campain
      );

      if (donationResponse.length === 0) {
        reject(
          new Error(
            "Doador foi criado, mas houve um erro ao criar a doação: ",
            donationResponse.error.message
          )
        );
      }

      const createDonation = "ok";
      console.log("Create donation: ok");

      const copyLeadResponse = await supabase
        .from("leads_excludes")
        .insert(nowScheduled)
        .select();
      if (copyLeadResponse.error) {
        reject(
          new Error("Erro ao copiar lead: ", copyLeadResponse.error.message)
        );
      }

      const copyLead = "ok";
      console.log("Copy lead: ok");

      const deleteLeadResponse = await supabase
        .from("leads")
        .delete()
        .eq("leads_id", nowScheduled.leads_id)
        .select();

      const deleteLead = "ok";
      console.log("Delete lead: ok");

      if (
        createDonor === "ok" &&
        createDonation === "ok" &&
        copyLead === "ok" &&
        deleteLead === "ok"
      ) {
        resolve("Operação completada com sucesso!");
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
