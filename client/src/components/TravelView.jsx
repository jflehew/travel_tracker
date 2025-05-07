import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/Cliploader";
import { useParams } from "react-router-dom";
import { getTrip } from "../services/tripService";

export const TravelView = () => {
    const {tripID} = useParams()
    const [trip, setTrip] = useState({})
    const [loading, setLoading] = useState(false)
    const [departureTimeDifference, setDepartureTimeDifference] = useState({departureHours: 0, departureMinutes: 0, departureSeconds: 0})
    const [arrivalTimeDifference, setArrivalTimeDifference] = useState({arrivalHours : 0,arrivalMinutes: 0, arrivalSeconds: 0})

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
        if (!trip?.departureDate) return

        const updateDepartureCountdown = () => {
            const now = Date.now();
            const departureDate = new Date(trip.departureDate).getTime()
            const departureDifference = departureDate - now
            if (departureDifference <= 0){
                setDepartureTimeDifference({departureHours: 0, departureMinutes: 0, departureSeconds: 0})
            }
            const totalDepartureSeconds = Math.floor(departureDifference / 1000);
            const departureHours = Math.floor(totalDepartureSeconds / 3600);
            const departureMinutes = Math.floor((totalDepartureSeconds % 3600) / 60);
            const departureSeconds = totalDepartureSeconds % 60;
            setDepartureTimeDifference({departureHours, departureMinutes, departureSeconds});
            const arrivalDate = new Date(trip.arrivalDate).getTime()
            const arrivalDifference = arrivalDate - now
            if (arrivalDifference <= 0){
                console.log("i'm int arrival difference if statement")
                setArrivalTimeDifference({arrivalHours: 0, arrivalMinutes: 0, arrivalSeconds: 0})
            }
            const totalArrivalSeconds = Math.floor(arrivalDifference / 1000);
            const arrivalHours = Math.floor(totalArrivalSeconds / 3600);
            const arrivalMinutes = Math.floor((totalArrivalSeconds % 3600) / 60);
            const arrivalSeconds = totalArrivalSeconds % 60;
            setArrivalTimeDifference({arrivalHours, arrivalMinutes, arrivalSeconds})
        }
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
                <h2>Your Trip:</h2>
                <ul>
                    <li>Departure Location: {trip.departureLocation}</li>
                    <li>Arrival Location: {trip.arrivalLocation}</li>
                    <li>Departure Date: {formatDateTime(trip.departureDate)}</li>
                    <li>Arrival Date: {formatDateTime(trip.arrivalDate)}</li>
                    <li>Expected Duration: {trip.duration} Minutes</li>
                    <li>Departure Location: {trip.departureLocation}</li>
                    <li>Line: {trip.lineName}</li>
                    {trip.status === "FUTURE" && <li>{departureTimeDifference.departureHours}h {departureTimeDifference.departureMinutes}m  {departureTimeDifference.departureSeconds}s</li>}
                    {trip.status === "PRESENT" && <li>{arrivalTimeDifference.arrivalHours}h {arrivalTimeDifference.arrivalMinutes}m {arrivalTimeDifference.arrivalSeconds}s</li>}
                </ul>
            </div>
            }
        </div>
    )
}