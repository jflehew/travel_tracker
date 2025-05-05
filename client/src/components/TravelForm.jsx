import { useEffect, useState } from "react";
import { useUserAuthContext } from "../context/UserAuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { createTrip, getTrip, updateTrip } from "../services/tripService";

const defaultTrip = {
    departureLocation: "",
    arrivalLocation: "",
    apiID: "",
    departureDate: "",
    arrivalDate: "",
    routeName: "",
    status: ""
}
const defaultServerErrors = {
    departureLocation: "",
    arrivalLocation: "",
    apiID: "",
    departureDate: "",
    arrivalDate: "",
    routeName: "",
    status: ""
}
const defaultTripIsValid = {
    departureLocation: false,
    arrivalLocation: false,
    apiID: false,
    departureDate: false,
    arrivalDate: false,
    routeName: false,
    status: false
}
const defaultTripInputUsed = {
    departureLocation: false,
    arrivalLocation: false,
    apiID: false,
    departureDate: false,
    arrivalDate: false,
    routeName: false,
    status: false
}

export const TravelForm = () => {
    const navigate = useNavigate()
    const { tripID } = useParams() 
    const { user } = useUserAuthContext()
    const [tripInfo, setTripInfo] = useState(defaultTrip)
    const [serverErrors, setServerErrors] = useState(defaultServerErrors)
    const [submitting, setSubmitting] = useState(false)
    const [tripInputUsed, setTripInputUsed] = useState(defaultTripInputUsed)
    const [tripInputIsValid, setTripInputIsValid] = useState(defaultTripIsValid)
    const [isUpdate, setIsUpdate] =useState(false)
    const tripIsValid = (
        tripInputIsValid.departureLocation &&
        tripInputIsValid.arrivalLocation &&
        tripInputIsValid.apiID &&
        tripInputIsValid.departureDate &&
        tripInputIsValid.arrivalDate &&
        tripInputIsValid.routeName &&
        tripInputIsValid.status
    )

    useEffect(() => {
    const fetchTrip = async () =>{
        if (tripID){
            setIsUpdate(true)
            try {
                const res = await getTrip(tripID)
                setTripInfo(prev => ({...prev, ...res}))
                Object.entries(res).forEach(([name, value]) => {
                    handleTripValidation(name, value)
                })
            } catch (err) {
                console.error(err)
            }
        }
    }
    fetchTrip()
    }, [])


    const handleTripValidation = (name, value) => {
        if(
            name === "departureLocation" ||
            name === "arrivalLocation" ||
            name === "apiID" ||
            name === "routeName" ||
            name === "status"
        ){
            const valid = value.length >= 1
            setTripInputIsValid(prev => ({...prev, [name]: valid})) 
        }
        if(
            name === "departureDate" ||
            name === "arrivalDate"
        ){
            const valid = value !== null && value !== ""
            setTripInputIsValid(prev => ({...prev, [name]: valid}))
        }
    }

    const handleBlur = e => {
        const {name} = e.target
        setTripInputUsed(prev => ({...prev, [name]: true}))
    }

    const handleChange = e => {
        const {name, value} = e.target
        let updatedValue = value
        if(
            name === "departureDate" ||
            name === "arrivalDate"
        ){
            const utcDateTime = new Date(value).toISOString()
            updatedValue = utcDateTime
        }
        handleTripValidation(name, value)
        setTripInfo(prev => ({...prev, [name]: updatedValue}))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setSubmitting(true)
        try {
            !tripID
            ? await createTrip(tripInfo)
            : await updateTrip(tripInfo)
            navigate('/dashboard')
        } catch (err){
            Object.entries(err).forEach(([field, message]) => {
                setServerErrors(prev => ({...prev, [field]: message}))
            })
        } finally {
            setSubmitting(false)
        }
    }

    return(
        <div className="background">
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
                        <label>Trip Id:
                            <input 
                                type="text"
                                onChange={handleChange}
                                value={tripInfo.apiID}
                                name="apiID"
                                onBlur={handleBlur}
                            />
                        </label>
                        <div className="error-container">
                            {
                                tripInputUsed.apiID &&
                                !tripInputIsValid.apiID &&
                                <p>You must enter a valid api ID</p>
                            }
                            {
                                serverErrors.apiID &&
                                <p>{serverErrors.apiID}</p>
                            }
                        </div>
                    </div>
                    <div>
                        <label>Departure Date:
                            <input 
                                type="datetime-local"
                                onChange={handleChange}
                                value={tripInfo.departureDate}
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
                                value={tripInfo.arrivalDate}
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
                        <label>Route Name:
                            <input 
                                type="text"
                                onChange={handleChange}
                                value={tripInfo.routeName}
                                name="routeName"
                                onBlur={handleBlur}
                            />
                        </label>
                        <div className="error-container">
                            {
                                tripInputUsed.routeName &&
                                !tripInputIsValid.routeName &&
                                <p>You must enter a valid route name</p>
                            }
                            {
                                serverErrors.routeName &&
                                <p>{serverErrors.routeName}</p>
                            }
                        </div>
                    </div>
                    <div>
                        <label>Status:
                            <input 
                                type="text"
                                onChange={handleChange}
                                value={tripInfo.status}
                                name="status"
                                onBlur={handleBlur}
                            />
                        </label>
                        <div className="error-container">
                            {
                                tripInputUsed.status &&
                                !tripInputIsValid.status &&
                                <p>You must enter a valid trip status</p>
                            }
                            {
                                serverErrors.status &&
                                <p>{serverErrors.status}</p>
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