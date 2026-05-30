import axios from "axios";


// Creates Axios Instance for  reusable API connection.
const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

// Request Interceptor Runs BEFORE every request.
// Used for:
// attaching JWT token
// logging requests
// REQUEST INTERCEPTOR
API.interceptors.request.use(
  (config) => {

    // GET TOKEN FROM LOCAL STORAGE
    const token = localStorage.getItem("token");

    console.log("TOKEN FROM STORAGE:", token);

    // IF TOKEN EXISTS ATTACH IT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("REQUEST:");
    console.log(config);

    return config;
  },

  (error) => {
    console.log("REQUEST ERROR:");
    console.log(error);

    return Promise.reject(error);
  }
);


// Response Interceptor Runs AFTER every response.
// Used for:
// debugging
// logging API responses
API.interceptors.response.use(
  (response) => {

    console.log("RESPONSE:");
    console.log(response);

    return response;
  },

  (error) => {

    console.log("RESPONSE ERROR:");
    console.log(error.response);

    return Promise.reject(error);
  }
);


export default API;