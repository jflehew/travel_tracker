import { travelTrackerDB } from "./api";

export const createTrip = async (formData) => {
    const response = await travelTrackerDB.post("/trip/create", formData)
    return response?.data
}
export const updateTrip = async (formData) => {
    const response = await travelTrackerDB.post("/trip/update", formData)
    return response?.data
}
export const getAllTrips = async () => {
    const response = await travelTrackerDB.post("/trip/get/all")
    return response?.data
}
export const getTrip = async (id) => {
    const response = await travelTrackerDB.post("/trip/get/one", id)
    return response?.data
}
export const deleteTrip = async (id) => {
    const response = await travelTrackerDB.post("/trip/delete", id)
    return response?.data
}