import { travelTrackerDB } from "./api";

export const registerUser = async (formData) =>{
    console.log(formData)
    const response = await travelTrackerDB.post('/users/register', formData)
    return response?.data
}