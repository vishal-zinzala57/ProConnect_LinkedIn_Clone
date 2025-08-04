import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layouts/DashboardLayout';
import UserLayout from '@/layouts/UserLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Styles from "./index.module.css"
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionRequest, getMyConnectionRequest, sendConnectionRequest } from '@/config/redux/action/authAction';


export default function ViewProfilePage({ userProfile }) {




  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);

  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);

  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUsersPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionRequest({ token: localStorage.getItem("token") }));
    await dispatch(getMyConnectionRequest({ token: localStorage.getItem("token") }));

  }


  useEffect(() => {

    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username
    });

    setUserPosts(post);


  }, [postReducer.posts]);


  useEffect(() => {
    if (!authState.connections || !Array.isArray(authState.connections)) return;
    if (!userProfile?.userId?._id) return;

    // First type: connectionId
    if (
      authState.connections.some(
        (user) => user?.connectionId?._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);
    }

    const connection1 = authState.connections.find(
      (user) => user?.connectionId?._id === userProfile.userId._id
    );

    if (connection1) {
      setIsCurrentUserInConnection(true);

      if (connection1.status_accepted === true) {
        setIsConnectionNull(false);
      }
    }

    // Second type: userId
    if (
      authState.connections.some(
        (user) => user?.userId?._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);
    }

    const connection = authState.connections.find(
      (user) => user?.userId?._id === userProfile.userId._id
    );

    if (connection) {
      setIsCurrentUserInConnection(true);

      if (connection.status_accepted === true) {
        setIsConnectionNull(false);
      }
    }
  }, [authState.connections, userProfile?.userId?._id, authState.connectionRequest]);



  useEffect(() => {
    getUsersPost();


  }, [])











  const searchParamers = useSearchParams();


  useEffect(() => {
    console.log("from view :view profile")
  })

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={Styles.container}>
          <div className={Styles.backDrop_Container}>
            <img className={Styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backdrop" />
          </div>
          <div className={Styles.profileContainer_Details}>

            <div className={Styles.profileContainer__flex}>

              <div style={{ flex: "0.8" }}>
                <div style={{ display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem" }}>
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "gray" }}>@{userProfile.userId.username}</p>
                </div>


                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                  {isCurrentUserInConnection ?
                    <button className={Styles.connectionButton}>{isConnectionNull ? "Pending" : "Connected"}</button>
                    :
                    <button onClick={() => {
                      dispatch(sendConnectionRequest({ token: localStorage.getItem("token"), user_id: userProfile.userId._id }))
                    }} className={Styles.connectBtn}>Connect</button>}
                  <div onClick={async () => {
                    const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                    window.open(`${BASE_URL}/${response.data.message}`, "_blank")
                  }} style={{ cursor: "pointer" }}>
                    <svg style={{ width: "1.2em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>

                  </div>
                </div>

                <div>
                  <p>{userProfile.bio}</p>
                </div>



              </div>

              <div style={{ flex: "0.2" }}>
                <h3>Recent Activity</h3>
                {userPosts.map((post) => {
                  return (
                    <div key={post._id} className={Styles.postCard}>
                      <div className={Styles.card}>
                        <div className={Styles.card__ProfileContainer}>
                          {post.media !== "" ? <img className={Styles.backDrop} src={`${BASE_URL}/${post.media}`} alt="" /> : <div style={{ width: "3.4rem", height: "3.4rem" }}></div>}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>

          </div>
          <div className={Styles.workHistory}>
            <h4>Work history</h4>
            <div className={Styles.workHistory_Container}>
              {
                userProfile.pastWork.map((work, index) => {
                  return (
                    <div key={index} className={Styles.workHistoryCard}>
                      <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>{work.company} - {work.position}</p>
                      <p>{work.years}</p>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className={Styles.Education}>
            <h4>Education</h4>
            <div className={Styles.Education_Container}>
              {
                userProfile.education.map((edu, index) => {
                  return (
                    <div key={index} className={Styles.educationCard}>
                      <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>College : {edu.school}</p>
                      <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>Course : {edu.degree}</p>
                      <p><b>Years :</b> {edu.fieldOfStudy}</p>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}

export async function getServerSideProps(context) {
  console.log("from view")
  console.log(context.query.username)

  const request = await clientServer.get("/user/get_profile_based_on_username?username", {
    params: {
      username: context.query.username
    }
  });

  const response = await request.data;

  console.log(response);
  return { props: { userProfile: request.data.profile } }
}
