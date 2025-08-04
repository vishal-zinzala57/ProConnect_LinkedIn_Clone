const { default: axios } = require("axios");

export const BASE_URL = "https://proconnect-linkedin-clone-61mb.onrender.com"

export const clientServer = axios.create({
    baseURL : BASE_URL,
});