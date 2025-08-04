import React from 'react'
import styles from './style.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';

function NavbarComponent() {

  const router = useRouter();

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth)

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>

        <h1 style={{ cursor: "pointer" }} onClick={() => {
          router.push("/")
        }}>pro connect</h1>

        <div className="navbarOptionContainer">

          {authState.profileFetched && <div>
            <div style={{ display: 'flex', gap: '1.2rem' }}>
              {/* <p>Hey, {authState.user.userId.name}</p> */}
              <p onClick={()=>{
                router.push("/profile");
              }} style={{ fontWeight: 'bold', cursor: 'pointer' }}>Profile</p>

              <p onClick={() => {
                localStorage.removeItem("token");
                dispatch(reset());
                setTimeout(() => router.push("/login"), 100); // slight delay ensures UI update
              }} style={{ fontWeight: 'bold', cursor: 'pointer' }}>logOut</p>
            </div>
          </div>}

          {!authState.profileFetched && <div onClick={() => {
            router.push("/login")
            dispatch(reset())
          }} className={styles.buttonJoin}>

            <p>Be a part</p>

          </div>}


        </div>

      </nav>
    </div>
  )
}

export default NavbarComponent
