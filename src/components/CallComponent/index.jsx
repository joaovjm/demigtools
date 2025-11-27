import { Device } from "@twilio/voice-sdk";
import { useState } from "react";
import voipConfig from "../../../database/voipConfig.json";

const voipActive = voipConfig.voipActive;

export function CallComponent({ phoneNumber }) {
  const [device, setDevice] = useState(null);

  const initDevice = async () => {
    const res = await fetch("/api/token");
    const { token } = await res.json();

    const dev = new Device(token, {
      codecPreferences: ["opus", "pcmu"],
      fakeMicInput: false,
    });

    dev.on("ready", () => console.log("Device online"));
    dev.on("error", (e) => console.error("Twilio Error:", e));

    setDevice(dev);
  };

  const call = (number) => {
    if (!device) return;
    device.connect({ params: { To: number } });
  };

  return (
    <div>
      {voipActive && (
        <>
          <button type="button" onClick={initDevice}>Ativar Voz</button>
          <button disabled type="button" onClick={() => call("+5521983046033")}>Ligar para doador</button>
        </>
      )}
    </div>
  );
}
