import axios from "axios";

export async function connectAxios() {
  try {
    const axiosInstance = axios.create({
      baseURL: "http://10.10.102.32:3001",
    });

    console.log("Connect to database");

    return axiosInstance;
  } catch (error) {
    console.error("Failed to connect");
  }
}
