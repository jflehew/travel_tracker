import axios from "axios"

export const travelTrackerDB = axios.create({
    baseURL : import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json',
        'Accept': 'application/json'
    }
})

travelTrackerDB.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status
        const data = error.response?.data
        if (status === 401) {
            const message = data?.errors
            return Promise.reject({message})
        }
        console.error("API Error", error)
        return Promise.reject(data || {message: "Unexpected Errror"})
    }
)