import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';


function Signup() {
    useEffect(() => {
        document.body.classList.add('signup-page');

        return () => {
            document.body.classList.remove('signup-page');
        };
    }, []);

    return (
        <div className="signup-container">
            <h1>Sign Up</h1>
            <form>
                <input className="vishal" type="text" placeholder="First Name" required />
                <input className="vishal" type="text" placeholder="Last Name" required />
                <input className="vishal" type="email" placeholder="Email" required />
                <input className="vishal" type="password" placeholder="Password" required />
                <input className="vishal" type="password" placeholder="Confirm Password" required />
                <label id='bla'>
                    <input  type="checkbox" required /> I agree to the terms and conditions
                </label>
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
            <p>
                Already have an account? <Link to="/login" className="login-link">Login</Link>
            </p>
        </div>
    );
}

export default Signup;
