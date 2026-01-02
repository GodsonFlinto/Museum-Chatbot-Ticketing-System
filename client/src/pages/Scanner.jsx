import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import api from "../services/api";

const Scanner = () => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        try {
          const res = await api.post("/tickets/scan", {
            ticketId: decodedText
          });

          alert("✅ " + res.data.message);
        } catch (err) {
          alert("❌ " + err.response.data.message);
        }
      },
      (error) => {
        console.log(error);
      }
    );

    return () => scanner.clear();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h2>🎫 Museum Entry Scanner</h2>
      <div id="reader" style={{ width: 300, margin: "auto" }} />
    </div>
  );
};

export default Scanner;
