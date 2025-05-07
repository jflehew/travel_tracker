import { useState } from "react";
import { useUserAuthContext } from "../context/UserAuthContext";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const { user, setUser, loading, setLoading } = useUserAuthContext()
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = await loginUser(formData);
            setUser(data)
            setLoading(false)
            navigate("/dashboard")
        } catch (err) {
            Object.entries(err.errors).forEach(([field, message]) => {
                setErrors((prev) => ({ ...prev, [field]: message }))
            })
            console.log(err)
        }
    };

    return (
        <div className="background glossy">
            <div className="form-container">
                <h2>Account Login:</h2>
                <form
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label> Email:
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            placeholder="Eamil"
                        />
                        </label>
                    </div>
                    <div>
                        <label>Password:
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                placeholder="Password"
                            />
                        </label>
                    </div>
                    <div className="error-container text-center">
                        
                        {errors.password && <p>{errors.password}</p>}
                        {errors.email && <p>{errors.email}</p>}
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};
