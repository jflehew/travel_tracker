import { travelTrackerDB } from "./api";

export const createTrip = async (formData) => {
    const response = await travelTrackerDB.post("/trips/create", formData)
    return response?.data
}
export const updateTrip = async (id, formData) => {
    const response = await travelTrackerDB.put(`/trips/update/${id}`, formData)
    return response?.data
}
export const getAllTrips = async () => {
    const response = await travelTrackerDB.get(`/trips/get/all`)
    return response?.data
}
export const getTrip = async (id) => {
    const response = await travelTrackerDB.get(`/trips/get/one/${id}`)
    return response?.data
}
export const deleteTrip = async (id) => {
    const response = await travelTrackerDB.delete(`/trips/delete/${id}`)
    return response?.data
}