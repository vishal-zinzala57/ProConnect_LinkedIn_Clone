import UserLayout from '@/layouts/UserLayout'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./style.module.css"
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';

function LoginComponent() {


  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  // useEffect(() => {
  //   if (authState.loggedIn) {
  //     router.push("/dashboard")
  //   }
  // }, [authState.loggedIn]);

  useEffect(() => {
  if (authState.loggedIn) {
    const timeout = setTimeout(() => {
      router.push("/dashboard");
    }, 1000); // delay 500ms

    return () => clearTimeout(timeout);
  }
}, [authState.loggedIn]);


  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push("/dashboard")
    }
  } , [])

  useEffect(() => {
    dispatch(emptyMessage())
  }, [userLoginMethod])

  const handleRegister = () => {
    console.log("registring....");
    dispatch(registerUser({
      username,
      password,
      email,
      name
    }))
  }

  const handleLogin = () => {
    console.log("Logging....");
    dispatch(loginUser({ email, password }))
  }

  return (
    <div>
      <UserLayout>

        <div className={styles.container}>
          <div className={styles.cardContainer}>
            <div className={styles.cardContainer_left}>
              <p className={styles.cardLeft__Heading}>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
              <p style={{ color: authState.isError ? "red" : "green" }}>{authState.message.message}</p>
              <div className={styles.input_Container}>
                {!userLoginMethod && <div className={styles.input_Row}>
                  <input onChange={(e) => { setUsername(e.target.value) }} className={styles.input_Fields} type="text" placeholder='Enter Username' name="username" id="username" />
                  <input onChange={(e) => { setName(e.target.value) }} className={styles.input_Fields} type="text" placeholder='Enter Name' name="name" id="name" />
                </div>}
                <input onChange={(e) => { setEmail(e.target.value) }} className={styles.input_Fields} type="text" placeholder='Enter Email' name="email" id="email" />
                <input onChange={(e) => { setPassword(e.target.value) }} className={styles.input_Fields} type="text" placeholder='Enter password' name="password" id="password" />
                <div onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }} className={styles.buttonWithOutline}>
                  <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
                </div>
              </div>
            </div>
            <div className={styles.cardContainer_right}>

              {userLoginMethod ? <p>Don't Have an Account ?</p> : <p>Already Have an Account ?</p>}

              <div onClick={() => {
                setUserLoginMethod(!userLoginMethod)
              }} style={{ color: 'black', textAlign: 'center' }} className={styles.buttonWithOutline}>
                <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
              </div>
            </div>

          </div>
        </div>

      </UserLayout>
    </div>
  )
}

export default LoginComponent
