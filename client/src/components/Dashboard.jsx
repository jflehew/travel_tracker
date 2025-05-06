import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteTrip, getAllTrips } from "../services/tripService";
import ClipLoader from "react-spinners/Cliploader";

export const Dashboard = () => {
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchTrips = async () => {
        setLoading(true)
        try{
            const res = await getAllTrips()
            setTrips(res)
        } catch (err){
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const formatDateTime = isoString => {
        if(!isoString) return "No Date Available"
        const date = new Date(isoString)
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date)
    }

    useEffect(() => {
        fetchTrips()
    }, [])

    const handleDelete = async (id) => {
        try {
            await deleteTrip(id)
            fetchTrips()
        } catch(err){
            console.error(err)
        }
    }
    return (
        <div className="background">
        <h2 className="text-4xl text-center font-modern mb-6 underline text-metallic-silver mt-8">Your Trips!</h2>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <td>View Trip:</td>
                            <td>Departure Location:</td>
                            <td>Arrival Location:</td>
                            <td>Departure Date:</td>
                            <td>Arrival Date:</td>
                            <td>Route Name:</td>
                            <td>Status:</td>
                            <td>Update Trip:</td>
                            <td>Delete Trip:</td>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {loading
                        ?   
                        <tr>
                            <td colSpan="9">
                                <div className="flex justify-center items-center h-max">
                                    <ClipLoader color="#c0c0c0" size={100}/>
                                </div>
                            </td>
                        </tr> 
                        :
                        trips.length === 0 
                        ? 
                        <tr>
                            <td colSpan='9'>No Trips, please add a trip!</td>
                        </tr>
                        :
                        trips.map(trip => (
                            <tr key={trip.id}>
                                <td><Link className="underline m-2" to={`/trip/view/${trip.id}`}>View Trip</Link></td>
                                <td>{trip.departureLocation}</td>
                                <td>{trip.arrivalLocation}</td>
                                <td>{formatDateTime(trip.departureDate)}</td>
                                <td>{formatDateTime(trip.arrivalDate)}</td>
                                <td>{trip.routeName}</td>
                                <td>{trip.status}</td>
                                <td><Link className="underline m-2" to={`/trip/update/${trip.id}`}>Update Trip</Link></td>
                                <td><button onClick={() => handleDelete(trip.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}