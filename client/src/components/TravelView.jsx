import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/Cliploader";
import { useParams } from "react-router-dom";
import { getTrip } from "../services/tripService";

export const TravelView = () => {
    const {tripID} = useParams()
    const [trip, setTrip] = useState({})
    const [loading, setLoading] = useState(false)
    const [timeDifference, setTimeDifference] = useState({minutes: 0, seconds: 0})

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

    useEffect(() => {
        if (!trip?.departureDate) return;
    
        const updateDepartureCountdown = () => {
            const now = Date.now();
            const departureDate = new Date(trip.departureDate).getTime()
            const departureDifference = departureDate - now
            if (departureDifference <= 0){
                setTimeDifference({hours: 0, minutes: 0, seconds: 0})
                return
            }
            const totalSeconds = Math.floor(departureDifference / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            setTimeDifference({hours, minutes, seconds});
        };
        updateDepartureCountdown(); 
        const interval = setInterval(updateDepartureCountdown, 1000); 
        return () => clearInterval(interval); 
    }, [trip]);

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
                    <li>Expected Duration: {trip.duration} Minutes</li>
                    <li>Departure Location: {trip.departureLocation}</li>
                    <li>Line: {trip.lineName}</li>
                    {trip.status === "FUTURE" && <li>{timeDifference.hours}h {timeDifference.minutes}m  {timeDifference.seconds}s</li>}
                </ul>
            </div>
            }
        </div>
    )
}