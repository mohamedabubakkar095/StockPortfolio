import axios from "axios";

const API = axios.create({
 baseURL: "https://stockportfolio-gm75.onrender.com/api/",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("TOKEN FROM LOCALSTORAGE:", token);

    if (token) {
      // Axios-ல் ஹெடர்களைச் சேர்க்க இந்த செட் (set) முறையைப் பயன்படுத்துவதுதான் பாதுகாப்பானது
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      // டோக்கன் இல்லை என்றால் பழைய ஹெடரை நீக்கிவிடும் (பாதுகாப்பிற்கு)
      config.headers.delete("Authorization"); 
    }

    console.log("FINAL HEADERS sent to server:", config.headers.toJSON ? config.headers.toJSON() : config.headers);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;