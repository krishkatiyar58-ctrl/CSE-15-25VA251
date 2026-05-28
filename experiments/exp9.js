import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {

const [formData, setFormData] = useState({
name:'',
email:'',
password:''
});

const [errors, setErrors] = useState({});
const [success, setSuccess] = useState('');
const [apiData, setApiData] = useState(null);

useEffect(() => {

fetch('https://jsonplaceholder.typicode.com/posts/1')
.then(response => response.json())
.then(data => setApiData(data.title));

}, []);

const handleChange = (e) => {

setFormData({
...formData,
[e.target.name]: e.target.value
});

};

const validate = () => {

let tempErrors = {};

if(!formData.name){
tempErrors.name = "Name is required";
}

if(!formData.email.includes('@')){
tempErrors.email = "Invalid Email";
}

if(formData.password.length < 6){
tempErrors.password = "Password must be 6+ characters";
}

setErrors(tempErrors);

return Object.keys(tempErrors).length === 0;

};

const handleSubmit = (e) => {

e.preventDefault();

if(validate()){

setSuccess("Registration Successful!");
setErrors({});

}
else{
setSuccess("");
}

};

return (

<div className="form-container">

<h2>Registration Form</h2>

<p>
<strong>API Title:</strong>
{apiData ? apiData : "Loading..."}
</p>

<form onSubmit={handleSubmit}>

<input
type="text"
name="name"
placeholder="Name"
onChange={handleChange}
/>

{errors.name && <span className="error">{errors.name}</span>}

<input
type="email"
name="email"
placeholder="Email"
onChange={handleChange}
/>

{errors.email && <span className="error">{errors.email}</span>}

<input
type="password"
name="password"
placeholder="Password"
onChange={handleChange}
/>

{errors.password && <span className="error">{errors.password}</span>}

<button type="submit">
Register
</button>

</form>

{success && <p className="success">{success}</p>}

</div>

);

};

export default App;