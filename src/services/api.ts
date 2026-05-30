import axios from "axios";


// Creates Axios Instance for  reusable API connection.
const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

// Request Interceptor Runs BEFORE every request.
// Used for:
// attaching JWT token
// logging requests
API.interceptors.request.use((request) => {

    console.log("REQUEST:");
    console.log(request);

    const token = localStorage.getItem("token");

    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
});

// Response Interceptor Runs AFTER every response.
// Used for:
// debugging
// logging API responses
API.interceptors.response.use((response) => {

    console.log("RESPONSE:");
    console.log(response);

    return response;
});

export default API;