import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/Cliploader";
import { useParams } from "react-router-dom";
import { getTrip } from "../services/tripService";

export const TravelView = () => {
    const {tripID} = useParams()
    const [trip, setTrip] = useState({})
    const [loading, setLoading] = useState(false)

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
        <div>
            {loading
            ?
            <div className="flex justify-center items-center h-max">
                <ClipLoader color="#c0c0c0" size={100}/>
            </div>
            :
            <ul>
                <li>Departure Location: {trip.departureLocation}</li>
                <li>Arrival Location: {trip.arrivalLocation}</li>
                <li>Departure Date: {trip.departureDate}</li>
                <li>Arrival Date: {trip.arrivalDate}</li>
                <li>Departure Location: {trip.departureLocation}</li>
                <li>Trip Status: {trip.status}</li>
            </ul>
            }
        </div>
    )
}