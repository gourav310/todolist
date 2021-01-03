import '../styles/App.css';
import { useState } from "react";
import { ButtonToggle, FormGroup, Label, Input, Button } from 'reactstrap';


export default function LoginForm(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const login = () => {
        const url = "https://todo--backend.herokuapp.com/login"
        console.log('aaaaaa');
        fetch(url, {
            method: "POST",
            body: JSON.stringify({ userName: username, password }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        })
            .then((r) => {
                if (r.ok) {
                    return { success: true };
                } else {
                    return r.json()
                }
            })
            .then((r) => {
                if (r.success === true) {
                    return props.getUserName();
                } else {
                    setError(r.err);
                }
            });
    }

    const signUp = () => {
        const url = "https://todo--backend.herokuapp.com/signUp"
        console.log('aaaaaa');
        fetch(url, {
            method: "POST",
            body: JSON.stringify({ userName: username, password }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        })
            .then((r) => {
                if (r.ok) {
                    return { success: true };
                } else {
                    return r.json()
                }
            })
            .then((r) => {
                if (r.success === true) {
                    return props.getUserName();
                } else {
                    setError(r.err);
                }
            });
    }
    return (

        <div className="logForm">

            <FormGroup style={{ padding: "10px" }}>
                <Label for="exampleEmail" >Email:</Label>

                <Input type="email" name="email" id="exampleEmail" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your Email" required />

            </FormGroup>
            <FormGroup style={{ padding: "10px" }}>
                <Label for="examplePassword" >Password:</Label>

                <Input type="password" name="password" id="examplePassword" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />

            </FormGroup>
            <div className="centre"> {(error) ? <div className="error-msg" >
                <img alt="error" height="30px" width="30px" src="https://img.icons8.com/cute-clipart/64/000000/error.png" />{error}
            </div> : null}</div>
            <div> <ButtonToggle type="submit" outline color="primary" onClick={login}>Login</ButtonToggle>
                <ButtonToggle onClick={signUp}>Sign Up</ButtonToggle></div>
        </div>)
}








