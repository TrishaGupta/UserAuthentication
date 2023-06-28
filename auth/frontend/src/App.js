import React, { useState} from 'react';
import axios from 'axios';


const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [newEmail , setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');



  const handleLogin = () => {
    
    axios
      .post('http://localhost:8080/auth/signin', { email, password})
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSignUp = () =>{
    axios
    .post('http://localhost:8080/auth/signup', { newEmail, newPassword})
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  };

 

  return (
    <div>
      <div>
        <h1>Login</h1>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </label>
        <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </label>
        <button onClick={handleLogin}>Login</button>
      </div>

      <div>
        <h1>Sign up</h1>
        <label>
          Email:
          <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/>
        </label>
        <label>
        Password:
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
        </label>
        <button onClick={handleSignUp}>Sign Up</button>
      </div>
    </div>
  );
};

export default App;

