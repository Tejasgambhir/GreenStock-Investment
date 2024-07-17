import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Login() {
    useEffect(() => {
        document.body.classList.add('login-page');

        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form>
                <input className="vishal" type="text" placeholder="Email" required />
                <input className="vishal" type="password" placeholder="Password" required />
                <input type="submit" value="Login" />
            </form>
            <p>
                <Link to="/forgot-password">Forgot Password?</Link>
            </p>
            <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
}

export default Login;
