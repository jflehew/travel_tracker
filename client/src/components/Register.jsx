import { useState } from "react";
import { useUserAuthContext } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
//import RegistrationUser from user services

const defaultRegistrationInputUsed = {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
}
const defaultRegistrationFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
}
const defaultIsRegistrationFormValid = {
    firstName: false,
    lastName: false,
    email: false,
    password: {
        meetsCredentials: false,
        atleastEightChars: false,
        validSymbol: false,
        validNumber: false,
        validUpperCase: false,
        validLowerCase: false,
    },
    confirmPassword: false,
}
const defaultRegistrationServerErrors = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
}

export const Register = () => {
    const { user, setUser, loading, setLoading } = useUserAuthContext()
    const [submittingRegistration, setSubmittingRegistration] = useState(false)
    const navigate = useNavigate()
    const [registrationInputUsed, setRegistrationInputUsed] = useState(defaultRegistrationInputUsed);
    const [registrationFormData, setRegistrationFormData] = useState(defaultRegistrationFormData)
    const [isRegistrationFormValid, setIsRegistrationFormValid] = useState(defaultIsRegistrationFormValid)
    const [registrationServerErrors, setRegistrationServerErrors] = useState(defaultRegistrationServerErrors)

    const isUserInputValid = (
        isRegistrationFormValid.firstName &&
        isRegistrationFormValid.lastName &&
        isRegistrationFormValid.email &&
        isRegistrationFormValid.password.meetsCredentials &&
        isRegistrationFormValid.confirmPassword
    )

    const passwordMessages = {
        meetsCredentials: "Your password must contain:",
        atleastEightChars: "Eight characters",
        validSymbol: "A symbol (!, @, #, $, etc...)",
        validNumber: "A number",
        validUpperCase: "An upper case letter",
        validLowerCase: "An lower case letter"
    }
    const validateRegistrationPasswordCriteria = password => {
        return {
            atleastEightChars: /.{8,}/.test(password),
            validSymbol: /[\W_]/.test(password),
            validNumber: /\d/.test(password),
            validUpperCase: /[A-Z]/.test(password),
            validLowerCase: /[a-z]/.test(password),
        };
    };
    const validateRegistrationFormCriteria = (name, value, currentFormData) => {
        if (name === "firstName" || name == "lastName") {
            const isValidLength = value.length >= 1 && value.length <= 255;
            setIsRegistrationFormValid((prev) => ({ ...prev, [name]: isValidLength }));
        }
        if (name === "email") {
            const isValidEmail = /^[\w.-]+@[\w.-]+\.\w+$/.test(value);
            setIsRegistrationFormValid((prev) => ({ ...prev, [name]: isValidEmail }));
        }
        if (name === "confirmPassword" || name === "password") {
            const password =
                name === "password" ? value : currentFormData.password;
            const confirm =
                name === "confirmPassword"
                    ? value
                    : currentFormData.confirmPassword;
            setIsRegistrationFormValid((prev) => ({
                ...prev,
                confirmPassword: password === confirm,
            }));
        }
    };
    const handleChange = e => {
        const {name, value} = e.target
        setRegistrationFormData(prev => {
            const updatedRegistrationFormData = {
                ...prev,
                [name]: value
            }
            validateRegistrationFormCriteria(name, value, updatedRegistrationFormData)
            if (name === "password") {
                const criteria = validateRegistrationPasswordCriteria(value)
                setIsRegistrationFormValid(prev => ({
                    ...prev,
                    password: {
                        ...criteria,
                        meetsCredentials:
                            Object.values(criteria).every(Boolean)
                    }
                }))
            }
            return updatedRegistrationFormData
        })
    }
    const handleSubmit = async e => {
        e.preventDefault()
        setSubmittingRegistration(true)
        try {
            const res = await registerUser(registrationFormData)
            setUser(res)
            setLoading(false)
            navigate("/dashboard")
        } catch (err) {
            Object.entries(err).forEach(([field, message]) => {
                setServerErrors((prev) => ({ ...prev, [field]: message }))
            })
        } finally {
            setSubmittingRegistration(false)
        }
    }
    const handleBlur = e => {
        const {name} = e.target
        setRegistrationInputUsed(prev => ({
            ...prev,
            [name]: true
        }))
    }

    return (
        <div className="background glossy">
            <div className="form-container">
                <h2>Register Account:</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            First Name:
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </label>
                        <div className="error-container">
                            {registrationInputUsed.firstName && !isRegistrationFormValid.firstName && (
                                <p>
                                    Your first name must be between 1 and 255
                                    characters in length
                                </p>
                            )}
                            {registrationServerErrors.firstName && (
                                <p>{registrationServerErrors.firstName}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label>
                            last Name:
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </label>
                        <div className="error-container">
                            {registrationInputUsed.lastName && !isRegistrationFormValid.lastName && (
                                <p>
                                    Your last name must be between 1 and 255
                                    characters in length
                                </p>
                            )}
                            {registrationServerErrors.lastName && (
                                <p>{registrationServerErrors.lastName}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label>
                            email:
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </label>
                        <div className="error-container">
                            {registrationInputUsed.email && !isRegistrationFormValid.email && (
                                <p>You must enter a valid email!</p>
                            )}
                            {registrationServerErrors.email && <p>{registrationServerErrors.email}</p>}
                        </div>
                    </div>
                    <div>
                        <label>
                            Password:
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </label>
                        <div className="error-container">
                            {registrationInputUsed.password && (
                                <>
                                    {!isRegistrationFormValid.password.meetsCredentials && (
                                        <p>
                                            {passwordMessages.meetsCredentials}
                                        </p>
                                    )}
                                    {Object.entries(isRegistrationFormValid.password)
                                        .filter(
                                            ([key, value]) =>
                                                key !== "meetsCredentials" &&
                                                !value,
                                        )
                                        .map(([key]) => (
                                            <p key={key}>
                                                {passwordMessages[key]}
                                            </p>
                                        ))}
                                </>
                            )}
                            {registrationServerErrors && <p>{registrationServerErrors.password}</p>}
                        </div>
                    </div>
                    <div>
                        <label>
                            Confirm Password:
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </label>
                        <div className="error-container">
                            {registrationInputUsed.confirmPassword && !isRegistrationFormValid.confirmPassword && (
                                <p>Your passwords must match</p>
                            )}
                            {registrationServerErrors.confirmPassword && (
                                <p>{registrationServerErrors.confirmPassword}</p>
                            )}
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={!isUserInputValid || submittingRegistration}
                    >
                        {submittingRegistration ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );


}