import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import api from '../api';

function Login() {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (inputs.username && inputs.password) {
            let user = {
                username: inputs.username,
                password: inputs.password
            };
            const res = await api.login(user);

            if (res.status > 300) {
                alert('Fel användarnamn eller lösenord!');
            } else {
                const data = await res.json();
                //console.log(data.data.token);
                const token = data.data.token;
                navigate('/Delayed', { state: { token } });
            }
        } else {
            alert('Fyll i användarnamn och lösenord för att logga in!');
        }
        setInputs({});
    };

    const handleRegister = async (username, pass) => {
        if (username && pass) {
            let newUser = {
                username: username,
                password: pass
            };
            const res = await api.register(newUser);
            if (res.status > 300) {
                alert('Användaren finns redan!');
            } else if (res.status == 201) {
                alert('Användare skapad!');
            }
        } else {
            alert('Fyll i användarnamn och lösenord för att registrera!');
        }
        setInputs({});
    };

    return (
        <div>
            <form onSubmit={handleLogin} className="login-form">
                <label className="input-label">
                    Username
                    <input
                        type="text"
                        name="username"
                        value={inputs.username || ''}
                        onChange={handleChange}
                    />
                </label>
                <label className="input-label">
                    Password
                    <input
                        type="password"
                        name="password"
                        value={inputs.password || ''}
                        onChange={handleChange}
                    />
                </label>
                <button className="login-btn">Logga in</button>
            </form>
            <div>
                <button
                    className="reg-btn"
                    onClick={() => handleRegister(inputs.username, inputs.password)}>
                    Registrera
                </button>
            </div>
        </div>
    );
}

export default Login;
