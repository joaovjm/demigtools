import supabase from "./superBaseClient";

export const editDonor = async (
  id,
  nome,
  tipo,
  cpf,
  endereco,
  cidade,
  bairro,
  telefone1,
  telefone2,
  telefone3,
  //dia,
  //mensalidade,
  //media,
  observacao,
  referencia
) => {
  const { data, error } = await supabase
    .from("donor")
    .update([
      {
        donor_name: nome,
        donor_type: tipo,
        donor_address: endereco,
        donor_city: cidade,
        donor_neighborhood: bairro,
        donor_tel_1: telefone1,
        //dia: dia,
        //mensalidade: mensalidade,
        //media: media,
      },
    ])
    .eq("donor_id", id)
    .select();

  if (data) {
    window.alert("Doador atualizado com sucesso!");
  }
  if (error) {
    window.alert("Erro ao atualizar dados do doador: ", error.message);
  }

  try{
    await supabase.from("donor_cpf").upsert(
      [
        {
          donor_id: id,
          donor_cpf: cpf,
        },
      ],
      { onConflict: ["donor_id"] }
    );
  } catch {
    console.log("CPF não foi salvo")
  }
  

  try {
    await supabase.from("donor_tel_2").upsert(
      [
        {
          donor_id: id,
          donor_tel_2: telefone2,
        },
      ],
      { onConflict: ["donor_id"] }
    );
  } catch {
    console.log("Telefone 2 não foi salvo");
  }

  try {
    await supabase.from("donor_tel_3").upsert(
      [
        {
          donor_id: id,
          donor_tel_3: telefone3,
        },
      ],
      { onConflict: ["donor_id"] }
    );
  } catch {
    console.log("Telefone 3 não foi salvo");
  }

  try {
    await supabase.from("donor_observation").upsert(
      [
        {
          donor_id: id,
          donor_observation: observacao,
        },
      ],
      { onConflict: ["donor_id"] }
    );
  } catch {
    console.log("Observação não foi salva ");
  }

  try {
    await supabase.from("donor_reference").upsert(
      [
        {
          donor_id: id,
          donor_reference: referencia,
        },
      ],
      { onConflict: ["donor_id"] }
    );
  } catch {
    console.log("Observação não foi salva ");
  }

  return data;
};
