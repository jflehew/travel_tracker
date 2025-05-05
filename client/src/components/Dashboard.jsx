import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteTrip, getAllTrips } from "../services/tripService";
import ClipLoader from "react-spinners/Cliploader";

export const Dashboard = () => {
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = false

    const fetchTrips = async () => {
        setLoading(true)
        try{
            const res = await getAllTrips()
            setTrips(prev => ([...prev, ...res]))
        } catch (err){
            console.error(err)
        } finally {
            setLoading(false)
        }
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
        <div>

        
            <h1>Your Trips!</h1>
            <table>
                <thead>
                    <tr>
                        <td>View Trip:</td>
                        <td>Departure Location:</td>
                        <td>Arrival Location:</td>
                        <td>Arrival Location:</td>
                        <td>Arrival Location:</td>
                        <td>Arrival Location:</td>
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
                    trips.map(trip => {
                        <tr key={trip.id}>
                            <td><Link className="underline m-2" to={`/trip/view/${trip.id}`}>View Trip</Link></td>
                            <td>{trip.departureLocation}</td>
                            <td>{trip.arrivalLocation}</td>
                            <td>{trip.departureDate}</td>
                            <td>{trip.arrivalDate}</td>
                            <td>{trip.routeName}</td>
                            <td>{trip.status}</td>
                            <td><Link className="underline m-2" to={`/trip/update/${trip.id}`}>Update Trip</Link></td>
                            <td><button onClick={() => handleDelete(trip.id)}>Delete</button></td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}