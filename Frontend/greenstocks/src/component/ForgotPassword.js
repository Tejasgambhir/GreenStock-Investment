import React, { useEffect, useState } from 'react';

function ForgotPassword() {
    const [email, setEmail] = useState('');

    useEffect(() => {
        document.body.classList.add('login-page');

        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add forgot password logic here
        console.log('Forgot Password email:', email);
    };

    return (
        <div className="login-container">
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default ForgotPassword;
