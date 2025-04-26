import axios from "axios";
import { configs } from "../configs";

export const fetchData = async ({ url, body, method, isFile }) => {
  try {
    const headers = {
      "Content-Type": isFile ? "multipart/form-data" : "application/json",
    };

    const token = localStorage.getItem(configs.LOCALSTORAGE_ACCESS_TOKEN);
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios({
      url: `${configs.LIVE_BASE_URL}${url}`,
      data: body,
      method: method || "GET",
      headers,
    });
    return response?.data;
  } catch (err) {
    return err?.response?.data;
  }
};
