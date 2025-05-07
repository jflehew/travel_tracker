import { useEffect, useState } from "react";
import { useUserAuthContext } from "../context/UserAuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { createTrip, getTrip, updateTrip } from "../services/tripService";
import { getJourney, getLines, getStations } from "../services/transportService";
import ClipLoader from "react-spinners/Cliploader";


const defaultTrip = {
    departureLocation: "",
    departureLocationId: "",
    arrivalLocation: "",
    arrivalLocationId: "",
    duration: 0,
    departureDate: "",
    arrivalDate: "",
    line: "",
    lineName: "",
    userId: null
}
const defaultServerErrors = {
    departureLocation: "",
    departureLocationId: "",
    arrivalLocation: "",
    arrivalLocationId: "",
    duration: "",
    departureDate: "",
    arrivalDate: "",
    line: "",
    lineName: ""
}
const defaultTripIsValid = {
    departureLocation: false,
    departureLocationId: false,
    arrivalLocation: false,
    arrivalLocationId: false,
    duration: false,
    lineName: false,
    departureDate: false,
    arrivalDate: false,
}
const defaultTripInputUsed = {
    departureLocation: false,
    departureLocationId: false,
    arrivalLocation: false,
    arrivalLocationId: false,
    duration: false,
    lineName: false,
    departureDate: false,
    arrivalDate: false,
}

export const TravelForm = () => {
    const { user } = useUserAuthContext()
    const navigate = useNavigate()
    const { tripID } = useParams() 
    const [tripInfo, setTripInfo] = useState(defaultTrip)
    const [serverErrors, setServerErrors] = useState(defaultServerErrors)
    const [submitting, setSubmitting] = useState(false)
    const [tripInputUsed, setTripInputUsed] = useState(defaultTripInputUsed)
    const [tripInputIsValid, setTripInputIsValid] = useState(defaultTripIsValid)
    const [isUpdate, setIsUpdate] =useState(false)
    const [lines, setLines] = useState([])
    const [loadingLines, setLoadingLines] = useState(false)
    const [line, setLine] = useState("")
    const [stations, setStations] = useState([])
    const [destination, setDestination] = useState("")
    const [departureLocation, setDepartureLocation] = useState("")
    const [journeys, setJourneys] = useState([])
    const [tripsLoading, setTripsLoading] = useState(false)
    const tripIsValid = (
        tripInputIsValid.departureLocation &&
        tripInputIsValid.arrivalLocation &&
        tripInputIsValid.duration &&
        tripInputIsValid.departureDate &&
        tripInputIsValid.arrivalDate &&
        tripInputIsValid.lineName
    )

    useEffect(() => {
    const fetchTrip = async () =>{
        if (tripID){
            setIsUpdate(true)
            setTripInputUsed(prev => ({
                ...prev,
                departureLocation: true,
                departureLocationId: true,
                arrivalLocation: true,
                arrivalLocationId: true,
                duration: true,
                lineName: true,
                departureDate: true,
                arrivalDate: true,
            }))
            try {
                const res = await getTrip(tripID)
                setTripInfo(prev => ({...prev, ...res}))
                Object.entries(res).forEach(([name, value]) => {
                    handleTripValidation(name, value, res.departureDate)
                })
            } catch (err) {
                console.error(err)
            }
        }
    }
    const pullApiLines  = async () => {
        setLoadingLines(true)
        try {
            const response =  await getLines()
            setLines(response)
        } catch(err) {
            console.error(err)
        } finally {
            setLoadingLines(false)
        }
    }
    pullApiLines()
    fetchTrip()
    }, [])


    const handleTripValidation = (name, value, refernceDepartureDate = null) => {
        if(
            name === "departureLocation" ||
            name === "arrivalLocation" ||
            name === "lineName"
        ){
            const valid = value.length >= 1
            setTripInputIsValid(prev => ({...prev, [name]: valid})) 
        }
        if (name === "duration"){
            const valid = value > 0
            setTripInputIsValid(prev => ({...prev, [name]: valid}))
        }
        if(
            name === "departureDate" ||
            name === "arrivalDate"
        ){
            const valid = value !== null && value !== ""
            setTripInputIsValid(prev => ({...prev, [name]: valid}))
        }
        if (name === "departureDate"){
            const departure = new Date(value)
            const valid = departure > new Date()
            setTripInputIsValid(prev => ({...prev, [name]: valid}))
        }
        if (name === "arrivalDate"){
            const departure = new Date( refernceDepartureDate || tripInfo.departureDate)
            const arrival = new Date(value)
            const valid = arrival > departure
            setTripInputIsValid(prev => ({...prev, [name]: valid}))
        }
    }

    const handleBlur = e => {
        const {name} = e.target
        setTripInputUsed(prev => ({...prev, [name]: true}))
    }

    const handleChange = e => {
        const {name, value} = e.target
        handleTripValidation(name, value)
        setTripInfo(prev => ({...prev, [name]: value}))
    }

    const formatForDateTimeLocal = isoString => {
        if(!isoString) return ""
        const date = new Date(isoString)
        const offset = date.getTimezoneOffset() * 60000
        const localISO = new Date(date.getTime() - offset).toISOString()
        return localISO.slice(0, 16)
    }

    const prepareTripForSubmit = () => {
        const dataToSubmit = { ...tripInfo };
        ["departureDate", "arrivalDate"].forEach((field) => {
            if (tripInfo[field]) {
                dataToSubmit[field] = new Date(tripInfo[field]).toISOString();
            }
        });
        return dataToSubmit;
    };

    const handleSubmit = async e => {
        e.preventDefault()
        setSubmitting(true)
        const formData = prepareTripForSubmit()
        formData.userId = user.id
        try {
            !tripID
            ? await createTrip(formData)
            : await updateTrip(formData.id, formData)
            navigate('/dashboard')
        } catch (err){
            Object.entries(err).forEach(([field, message]) => {
                setServerErrors(prev => ({...prev, [field]: message}))
            })
        } finally {
            setSubmitting(false)
        }
    }
    const handleLineSelect = async e => {
        const {value} = e.target
        const {line, lineName} = JSON.parse(value)
        setTripInfo(prev => ({
            ...prev,
            line: line,
            lineName: lineName
        }))
        try {
            const response = await getStations(line)
            setStations(response)
        } catch(err){
            console.error(err)
        }
    }
    const handleDepartureLocationSelect = e => {
        const {name, value} = e.target
        const {departureLocationId, departureLocation} = JSON.parse(value)
        setTripInfo(prev => ({
            ...prev, 
            departureLocation : departureLocation,
            departureLocationId: departureLocationId
        }))
    }

    const handleArrivalLocationSelect = e => {
        const {name, value} = e.target
        const {arrivalLocationId, arrivalLocation} = JSON.parse(value)
        setTripInfo(prev => ({
            ...prev, 
            arrivalLocation : arrivalLocation,
            arrivalLocationId: arrivalLocationId
        }))
    }

    const handleTravel = async () =>{
            setTripsLoading(true)
        try {
            const response = await getJourney(tripInfo.departureLocationId, tripInfo.arrivalLocationId)
            setJourneys(response.journeys)
        } catch (err) {
            console.error(err)
        } finally {
            setTripsLoading(false)
        }
    }

    const handleJourney = async (journey) => {
        setTripInfo(prev => ({
            ...prev,
            departureDate: journey.startDateTime,
            arrivalDate: journey.arrivalDateTime,
            duration: journey.duration
        }))
        setTripInputUsed(prev => ({
            ...prev,
            departureLocation: true,
            departureLocationId: true,
            arrivalLocation: true,
            arrivalLocationId: true,
            duration: true,
            lineName: true,
            departureDate: true,
            arrivalDate: true,
        }))
        setTripInputIsValid(prev => ({
            ...prev,
            departureLocation: true,
            departureLocationId: true,
            arrivalLocation: true,
            arrivalLocationId: true,
            duration: true,
            lineName: true,
            departureDate: true,
            arrivalDate: true,
        }))
    }

    return(
        <div className="background">
            <div className="table-container">
                <div className="table-controls">
                    <select onChange={handleLineSelect} name="line">
                        <option value="">{!loadingLines ? "select your prefered line!" : "Lines Loading"}</option>
                        {Array.isArray(lines) && lines.length > 0 &&
                        lines.map(line => (
                            <option key={line.id} value={
                                JSON.stringify({
                                    line: line.id,
                                    lineName: line.name
                                })
                            }>{line.name}</option>
                        ))}
                    </select>
                    <select onChange={handleDepartureLocationSelect} name="departureLocation">
                        <option value="">Select Departure Location</option>
                        {stations.map(station => (
                            <option 
                                key={station.id} 
                                value={JSON.stringify({
                                departureLocationId : station.naptanId, 
                                departureLocation : station.commonName
                            })}>
                                {station.commonName}
                            </option>
                        ))}
                    </select>
                    <select onChange={handleArrivalLocationSelect} name="arrivalLocation">
                        <option value="">Select Arrival Location</option>
                        {stations.map(station => (
                            <option key={station.id} value={JSON.stringify({arrivalLocationId :station.naptanId , arrivalLocation: station.commonName})}>{station.commonName}</option>
                        ))}
                    </select>
                    <button className="search-button" onClick={handleTravel}>Search for travel</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <td>Departure Time:</td>
                            <td>Arrival Time:</td>
                            <td>Travel Time:</td>
                            <td>Select:</td>
                        </tr>
                    </thead>
                    <tbody>
                        {tripsLoading && 
                            <tr>
                                <td colSpan="4">
                                    <div className="flex justify-center items-center h-max">
                                        <ClipLoader color="#c0c0c0" size={100}/>
                                    </div>
                                </td>
                            </tr>
                        }
                        {journeys.map((journey, index) => (
                            <tr key={index}>
                                <td>{new Date(journey.startDateTime).toLocaleTimeString()}</td>
                                <td>{new Date(journey.arrivalDateTime).toLocaleTimeString()}</td>
                                <td>{journey.duration} minutes</td>
                                <td><button onClick={() => handleJourney(journey)}>Select Trip!</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="form-container">
                
                <h2>Input Trip Details</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Departure Location:
                            <input 
                                type="text"
                                onChange={handleChange}
                                value={tripInfo.departureLocation}
                                name="departureLocation"
                                onBlur={handleBlur}
                            />
                        </label>
                        <div className="error-container">
                            {
                                tripInputUsed.departureLocation &&
                                !tripInputIsValid.departureLocation &&
                                <p>You must enter a valid departure location</p>
                            }
                            {
                                serverErrors.departureLocation &&
                                <p>{serverErrors.departureLocation}</p>
                            }
                        </div>
                    </div>
                    <div>
                        <label>Arrival Location:
                            <input 
                                type="text"
                                onChange={handleChange}
                                value={tripInfo.arrivalLocation}
                                name="arrivalLocation"
                                onBlur={handleBlur}
                            />
                        </label>
                        <div className="error-container">
                            {
                                tripInputUsed.arrivalLocation &&
                                !tripInputIsValid.arrivalLocation &&
                                <p>You must enter a valid arrival location</p>
                            }
                            {
                                serverErrors.arrivalLocation &&
                                <p>{serverErrors.arrivalLocation}</p>
                            }
                        </div>
                    </div>
                    <div>
                        <label>Trip duration:
                            <input 
                                type="number"
                                onChange={handleChange}
                                value={tripInfo.duration}
                                name="duration"
                                onBlur={handleBlur}
                            />
                        </label>
                        <div className="error-container">
                            {
                                tripInputUsed.duration &&
                                !tripInputIsValid.duration &&
                                <p>You must enter a valid duration</p>
                            }
                            {
                                serverErrors.duration &&
                                <p>{serverErrors.duration}</p>
                            }
                        </div>
                    </div>
                    <div>
                        <label>Departure Date:
                            <input 
                                type="datetime-local"
                                onChange={handleChange}
                                value={formatForDateTimeLocal(tripInfo.departureDate)}
                                name="departureDate"
                                onBlur={handleBlur}
                            />
                        </label>
                        <div className="error-container">
                            {
                                tripInputUsed.departureDate &&
                                !tripInputIsValid.departureDate &&
                                <p>You must enter a valid departure date</p>
                            }
                            {
                                serverErrors.departureDate &&
                                <p>{serverErrors.departureDate}</p>
                            }
                        </div>
                    </div>
                    <div>
                        <label>Arrival Date:
                            <input 
                                type="datetime-local"
                                onChange={handleChange}
                                value={formatForDateTimeLocal(tripInfo.arrivalDate)}
                                name="arrivalDate"
                                onBlur={handleBlur}
                            />
                        </label>
                        <div className="error-container">
                            {
                                tripInputUsed.arrivalDate &&
                                !tripInputIsValid.arrivalDate &&
                                <p>You must enter a valid arrival date</p>
                            }
                            {
                                serverErrors.arrivalDate &&
                                <p>{serverErrors.arrivalDate}</p>
                            }
                        </div>
                    </div>
                    <div>
                        <label>Line Name:
                            <input 
                                type="text"
                                onChange={handleChange}
                                value={tripInfo.lineName}
                                name="lineName"
                                onBlur={handleBlur}
                            />
                        </label>
                        <div className="error-container">
                            {
                                tripInputUsed.lineName &&
                                !tripInputIsValid.lineName &&
                                <p>You must enter a valid route name</p>
                            }
                            {
                                serverErrors.lineName &&
                                <p>{serverErrors.lineName}</p>
                            }
                        </div>
                    </div>
                    <div>
                        <label>{tripInfo.line !== "" && `Line ID: ${tripInfo.line}`}
                            <input 
                                type="hidden"
                                onChange={handleChange}
                                value={tripInfo.line}
                                name="line"
                            />
                        </label>
                        <div className="error-container">
                            {
                                serverErrors.line &&
                                <p>{serverErrors.line}</p>
                            }
                        </div>
                    </div>
                    <div>
                        <label>{tripInfo.departureLocationId !== "" && `Departure Location ID: ${tripInfo.departureLocationId}`}
                            <input 
                                type="hidden"
                                onChange={handleChange}
                                value={tripInfo.departureLocationId}
                                name="departureLocationId"
                            />
                        </label>
                        <div className="error-container">
                            {
                                serverErrors.departureLocationId &&
                                <p>{serverErrors.departureLocationId}</p>
                            }
                        </div>
                    </div>
                    <div>
                        <label>{tripInfo.arrivalLocationId !== "" && `Arrival Location ID: ${tripInfo.arrivalLocationId}`}
                            <input 
                                type="hidden"
                                onChange={handleChange}
                                value={tripInfo.arrivalLocationId}
                                name="arrivalLocationId"
                            />
                        </label>
                        <div className="error-container">
                            {
                                serverErrors.arrivalLocationId &&
                                <p>{serverErrors.arrivalLocationId}</p>
                            }
                        </div>
                    </div>
                    <button type="submit" disabled={!tripIsValid || submitting}>
                        {
                        !isUpdate
                        ? !submitting ? "Add Trip" : "Adding Trip, Please Wait..."
                        : !submitting ? "Update Trip" : "Updating Trip, Please Wait..."
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}