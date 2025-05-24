import React, { useEffect, useState } from "react";
import supabase from "../helper/superBaseClient";
import { DataNow } from "./DataTime";

const MotivationalPhrases = () => {
  const [phrase, setPhrase] = useState("")

  const motivationalPhases = async () => {
    const today = DataNow("noformated");
    try {
      const { data: existingPhrase, error: fetchError } = await supabase
        .from("demigtool_motivational_phrases")
        .select()
        .eq("date_phrase", today)
        .limit(1);

      if (fetchError) throw fetchError;

      if (existingPhrase.length > 0) {
        setPhrase(existingPhrase[0].motivational_phrases);
        
      } else {
        const { data: totalPhrases, error: allError } = await supabase
          .from("demigtool_motivational_phrases")
          .select("*")
          .is("date_phrase", null)

        if (allError) throw allError;
        if (totalPhrases.length > 0) {
          const random = Math.floor(Math.random() * totalPhrases.length);
          const randomPhrase = totalPhrases[random];
         
          const { data: updatePhrase, error: updateError } = await supabase
          .from("demigtool_motivational_phrases")
          .update({ date_phrase: today })
          .eq("id", randomPhrase.id);
          
          if (updateError) throw updateError
          setPhrase(randomPhrase.motivational_phrases)
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  };

  useEffect(() => {
    motivationalPhases();
  }, []);
  return <div className="phrase">
    <h1>{phrase ? phrase : "Carregando..."}</h1>
    
    </div>;
};

export default MotivationalPhrases;
