import DashboardLayout from '@/layouts/DashboardLayout'
import UserLayout from '@/layouts/UserLayout'
import React, { useEffect, useState } from 'react'
import Styles from './index.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser } from '@/config/redux/action/authAction'
import { BASE_URL, clientServer } from '@/config'
import { getAllPosts } from '@/config/redux/action/postAction'

export default function ProfilePage() {


    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.postReducer)

    const [userProfile, setUserProfile] = useState({})

    const [userPosts, setUserPosts] = useState([])

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [isEducationModalOpen, setIsEducationModalOpen] = useState(false)

    const [inputData, setInputData] = useState({ company: "", position: "", years: "" });

    const handleWorkInputChange = (e) => {
        const { name, value } = e.target;
        setInputData({ ...inputData, [name]: value });

    }

    const [educationInput, setEducationInput] = useState({ school: "", degree: "", fieldOfStudy: "" })

    const handleEducationInput = (e) => {
        const { name, value } = e.target;
        setEducationInput({ ...educationInput, [name]: value });
    }

    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
        dispatch(getAllPosts())
    }, [])



    useEffect(() => {


        if (authState.user != undefined) {

            setUserProfile(authState.user);

            let post = postReducer.posts.filter((post) => {
                return post.userId.username === authState.user.userId.username
            });
            setUserPosts(post);
        }


    }, [authState.user, postReducer.posts])

    const updateProfilePicture = async (file) => {
        const formData = new FormData();
        formData.append("profile_picture", file);
        formData.append("token", localStorage.getItem("token"));

        const response = await clientServer.post("/update_profile_picture", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },

        });

        dispatch(getAboutUser({ token: localStorage.getItem("token") }))

    }

    const updateProfileData = async () => {
        const request = await clientServer.post("/user_update", {
            token: localStorage.getItem("token"),
            name: userProfile.userId.name,
        });

        const response = await clientServer.post("/update_profile_data", {
            token: localStorage.getItem("token"),
            bio: userProfile.bio,
            currentPost: userProfile.currentPost,
            pastWork: userProfile.pastWork,
            education: userProfile.education
        });

        dispatch(getAboutUser({ token: localStorage.getItem("token") }))
    }

    return (
        <UserLayout>
            <DashboardLayout>
                {authState.user && userProfile.userId &&
                    <div className={Styles.container}>
                        <div className={Styles.backDrop_Container}>
                            <div className={Styles.backDrop}>
                                <label htmlFor='profilePicUpload' className={Styles.backDrop__overLay}>
                                    <p>edit</p>
                                </label>
                                <input onChange={(e) => {
                                    updateProfilePicture(e.target.files[0])
                                }} hidden type="file" name="" id="profilePicUpload" />
                                <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backdrop" />

                            </div>
                        </div>
                        <div className={Styles.profileContainer_Details}>

                            <div className={Styles.profileContainer_Details_flex}>

                                <div style={{ flex: "0.8" }}>
                                    <div style={{ display: "flex",flexWrap : "wrap", width: "fit-content", alignItems: "center", gap: "1.2rem" }}>
                                        <input className={Styles.nameEdit} value={userProfile.userId.name} onChange={(e) =>
                                            setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })
                                        } />
                                        <p style={{ color: "gray" }}>@{userProfile.userId.username}</p>
                                    </div>

                                    <div>
                                        <textarea 
                                        
                                            value={userProfile.bio}
                                            onChange={(e) => {
                                                setUserProfile({ ...userProfile, bio: e.target.value });
                                            }}
                                            rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))} // Adjust as needed
                                            style={{ width: "100%" , fontSize : "1.2rem"}}
                                        />
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
                            <div style={{ display: "flex", alignItems: "center" }} className={Styles.workHistory_Container}>
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

                                <button className={Styles.addWorkButton} onClick={() => {
                                    setIsModalOpen(true)
                                }}>Add Work</button>
                            </div>
                        </div>

                        <div className={Styles.Education}>
                            <h4 style={{ marginBottom: "1.7rem" }}>Education</h4>
                            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }} className={Styles.Education}>
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

                                <button className={Styles.addWorkButton} onClick={() => {
                                    setIsEducationModalOpen(true)
                                }}>Add Education</button>
                            </div>
                        </div>



                        {userProfile != authState.user &&
                            <div onClick={() => {
                                updateProfileData();
                            }} className={Styles.updateProfileBtn}>
                                update Profile
                            </div>}
                    </div>}


                {
                    isModalOpen &&
                    <div onClick={() => {
                        setIsModalOpen(false)
                    }} className={Styles.commentsContainer}>
                        <div onClick={(e) => {
                            e.stopPropagation();
                        }} className={Styles.allCommentsContainer}>

                            <input onChange={handleWorkInputChange} className={Styles.input_Fields} type="text" placeholder='Enter Comapny' name="company" />
                            <input onChange={handleWorkInputChange} className={Styles.input_Fields} type="text" placeholder='Enter Position' name="position" i />
                            <input onChange={handleWorkInputChange} className={Styles.input_Fields} type="number" placeholder='years' name="years" />

                            <div onClick={() => {
                                setUserProfile({ ...userProfile, pastWork: [...userProfile.pastWork, inputData] })
                                setIsModalOpen(false);
                            }} className={Styles.updateProfileBtn}>Add Work</div>
                        </div>
                    </div>
                }

                {/*  Education Modal open Logic */}

                {
                    isEducationModalOpen &&
                    <div onClick={() => {
                        setIsEducationModalOpen(false)
                    }} className={Styles.commentsContainer}>
                        <div onClick={(e) => {
                            e.stopPropagation();
                        }} className={Styles.allCommentsContainer}>

                            <input onChange={handleEducationInput} className={Styles.input_Fields} type="text" placeholder='Enter College/School' name="school" />
                            <input onChange={handleEducationInput} className={Styles.input_Fields} type="text" placeholder='Enter Degree/Result' name="degree"  />
                            <input onChange={handleEducationInput} className={Styles.input_Fields} type="text" placeholder='Enter Range Of Course' name="fieldOfStudy" />

                            <div onClick={() => {
                                setUserProfile({ ...userProfile, education: [...userProfile.education, educationInput] })
                                setIsEducationModalOpen(false);
                            }} className={Styles.updateProfileBtn}>Add Education</div>
                        </div>
                    </div>
                }
            </DashboardLayout>
        </UserLayout>
    )
}
