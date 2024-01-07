import config from "../config";
import { IMakeRequest } from "./types";

export default {
  makeRequest: async (props: IMakeRequest) => {
    try {
      let {
        url,
        method = "GET",
        contentType = "application/json",
        headers,
        body,
        query,
      } = props;

      if (query) {
        const queryString = new URLSearchParams(query).toString();
        url = `${url}?${queryString}`;
      }

      const response = await fetch(`${config.BACKEND_URL}/api/v1${url}`, {
        method,
        headers: {
          "Content-Type": contentType,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      switch (contentType) {
        case "application/json": {
          return response.json();
        }
        case "audio/mpeg": {
          return response.blob();
        }
        default: {
          return response.text();
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  secondsToMinutes(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds}`;
  },

  debounce(callBack: () => void, delay: number) {
    let timeoutId: number | undefined = undefined;
    return function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callBack, delay);
    };
  },
};
