import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/Cliploader";
import { useParams } from "react-router-dom";
import { getTrip } from "../services/tripService";

export const TravelView = () => {
    const {tripID} = useParams()
    const [trip, setTrip] = useState({})
    const [loading, setLoading] = useState(false)

    const formatDateTime = isoString => {
        if(!isoString) return "No Date Available"
        const date = new Date(isoString)
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date)
    }

    useEffect(() => {
        const fetchTrip = async () => {
            setLoading(true)
            try {
                const res = await getTrip(tripID)
                setTrip(res)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchTrip()
    }, [])

    return (
        <div className="background">
            {loading
            ?
            <div className="flex justify-center items-center h-max">
                <ClipLoader color="#c0c0c0" size={100}/>
            </div>
            :
            <div className="view-container">
                <ul>
                    <li>Departure Location: {trip.departureLocation}</li>
                    <li>Arrival Location: {trip.arrivalLocation}</li>
                    <li>Departure Date: {formatDateTime(trip.departureDate)}</li>
                    <li>Arrival Date: {formatDateTime(trip.arrivalDate)}</li>
                    <li>Departure Location: {trip.departureLocation}</li>
                    <li>Route Name: {trip.routeName}</li>
                    <li>Trip Status: {trip.status}</li>
                </ul>
            </div>
            }
        </div>
    )
}