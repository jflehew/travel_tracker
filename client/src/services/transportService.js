import { travelTrackerDB } from "./api";

export const getLines= async () => {
    const response = await travelTrackerDB.get('/tfl/lines')
    return response?.data
}

export const getStations = async (lineId) => {
    const response = await travelTrackerDB.get('/tfl/stations', {
        params: {lineId}
    })
    return response?.data
}

export const getJourney = async (departureId, arrivalId) => {
    const response = await travelTrackerDB.get('/tfl/journey', {
        params: {departureId, arrivalId}
    })
    return response?.data
}