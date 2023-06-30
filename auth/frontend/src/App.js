import React, { useState} from 'react';
import axios from 'axios';


const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [newEmail , setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  

  const [loginWarning, setLoginWarning] = useState('');
  const [signUpWarning, setSignUpWarning] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [singUpSuccess, setSignUpSuccess] = useState('');



  const handleLogin = () => {
    
    axios
      .post('http://localhost:8080/auth/signin', { email, password})
      .then((response) => {
        console.log(response.data);
        
        if(response.data.type === "success"){
          setLoginWarning("");
          setSignUpWarning("");
         // setLoginSuccess(response.data.message);
         setLoginSuccess(response.data.message);
        
          
        }
      })
      .catch((error) => {
        console.error(error);
        //console.log(error.response.data.message);
        console.log(error.response.data);
        if(error.response.data.type === 'warning' || error.response.data.type === 'error'){
          console.log(error.response.data.message);
          setLoginWarning(error.response.data.message);
        }
      });
  };

  const handleSignUp = () =>{
    axios
    .post('http://localhost:8080/auth/signup', { newEmail, newPassword})
    .then((response) => {
      
      console.log(response.data);

      if(response.data.type === "success"){
        setLoginWarning("");
        setSignUpWarning("");
       // setLoginSuccess(response.data.message);
       setSignUpSuccess(response.data.message +"Check your email to confirm before logging in!");
        
      }
    })
    .catch((error) => {
      console.log(error);
      if(error.response.data.type === "warning"){
        setSignUpWarning(error.response.data.message);
      }

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
        {loginSuccess? <div>{loginSuccess}</div> : <div>{loginWarning}</div>}
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
        {singUpSuccess? <div>{singUpSuccess}</div> : <div>{signUpWarning}</div>}
      </div>
    </div>
  );
};

export default App;

