import { AcceptConnection, getMyConnectionRequest } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layouts/DashboardLayout'
import UserLayout from '@/layouts/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Styles from "./index.module.css"
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

export default function My_ConnectionsPage() {

    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMyConnectionRequest({ token: localStorage.getItem('token') }));
    }, [])

    const router = useRouter();



    useEffect(() => {

        if (authState.connectionRequest.length != 0) {
            console.log(authState.connectionRequest)
        }

    }, [authState.connectionRequest])

    return (
        <div>
            <UserLayout>

                <DashboardLayout>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}>
                        <h3 style={{ color: "blue" }}>My Connections</h3>
                        {authState.connectionRequest.length === 0 && <h1>No Connection Request Pending</h1>}

                        {authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection) => connection.status_accepted === null).map((user, index) => {
                            return (
                                <div onClick={() => {
                                    router.push(`/view_profile/${user.userId.username}`)
                                }} className={Styles.userCard} key={index}>
                                    <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
                                        <div className={Styles.profilePicture}>
                                            <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                                        </div>
                                        <div className={Styles.userInfo}>
                                            <h3>{user.userId.name}</h3>
                                            <p>{user.userId.username}</p>
                                        </div>
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(AcceptConnection({
                                                connectionId: user._id,
                                                token: localStorage.getItem("token"),
                                                action: "accept"
                                            }))
                                        }} className={Styles.connectionButton}>Accept</button>
                                    </div>
                                </div>
                            )
                        })}

                        <h3 style={{ color: "blue" }}>My Network</h3>

                        {authState.connectionRequest.filter((connection) => connection.status_accepted !== null).map((user, index) => {
                            return (
                                <div onClick={() => {
                                    router.push(`/view_profile/${user.userId.username}`)
                                }} className={Styles.userCard} key={index}>
                                    <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
                                        <div className={Styles.profilePicture}>
                                            <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                                        </div>
                                        <div className={Styles.userInfo}>
                                            <h3>{user.userId.name}</h3>
                                            <p>{user.userId.username}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </DashboardLayout>

            </UserLayout>
        </div>
    )
}
