import React, { useState, useEffect } from "react";
import "./../styles/App.css";
// import onchange from React;
import List from "./mainlist"
import LoginForm from "./LoginForm"

function App() {
	const [logged, setLogged] = useState(false);
	const [error, setError] = useState(undefined);
	const [userName, setUserName] = useState(undefined);

	const getUserName = () => {
		return fetch('https://todo--backend.herokuapp.com/userinfo', { credentials: "include" })
			.then(r => {
				if (r.ok) {
					return r.json();
				} else {
					setLogged(false);
					setUserName(undefined);
					return { success: false };
				}
			}).then(r => {
				if (r.success !== false) {
					setLogged(true);
					setUserName(r.userName);
				}
			});
	}

	useEffect(() => {
		getUserName();
	}, []);


	const logoutFunc = () => {
		fetch('https://todo--backend.herokuapp.com/logout', { credentials: 'include' })
			.then(r => {
				if (r.ok) {
					setLogged(false);
					setUserName(undefined);
				}
			})
	}
	return (<div>
		<div id="main">
			{logged === true ? <List username={userName} logout={logoutFunc} /> : <LoginForm getUserName={getUserName} />}
		</div>
		</div>
	);
}


export default App;
