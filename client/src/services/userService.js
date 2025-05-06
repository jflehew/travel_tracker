import { travelTrackerDB } from "./api";

export const registerUser = async (formData) =>{
    const response = await travelTrackerDB.post('/users/register', formData)
    return response?.data
}

export const loginUser = async (formData) => {
    const response = await travelTrackerDB.post('/users/login', formData)
    return response?.data
}

export const authenticateUser = async () => {
    const response = await travelTrackerDB.get('/users/authenticate')
    return response?.data
}

export const logoutUser = async () => {
    const response = await travelTrackerDB.get('/users/logout')
    return response?.data
}