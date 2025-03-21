import { useEffect } from "react";

const HubSpotChatbot = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//js.hs-scripts.com/47296717.js";
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script); // Clean up on component unmount
    };
  }, []);

  return null; // No UI needed for this component
};

export default HubSpotChatbot;
