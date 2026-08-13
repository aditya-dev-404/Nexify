import React from 'react'
import { ImCross } from "react-icons/im";
import { useUser } from '../context/userContext';
import dp from '../assets/profile.png'
import { IoMdAdd } from "react-icons/io";
import { FaCamera } from "react-icons/fa";
import { useState } from 'react';
import { IoReturnDownBackOutline } from "react-icons/io5";
import { useRef } from 'react';
import { asyncHandler } from '../utils/async.handler';
import { useAuth } from '../context/userAuth';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function EditProfile() {

    

    const { baseUrl } = useAuth();
    const { edit, setEdit, user, setUser, refetchUser } = useUser();
    const [skills, setSkills] = useState(user.skills);
    const [skill, setSkill] = useState("");
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [headings, setHeading] = useState(user.headings);
    const [gender, setGender] = useState(user.gender || "");
    const [location, setLocation] = useState(user.location);
    const [education, setEducation] = useState(user.education);
    const [college, setCollege] = useState("");
    const [degree, setDegree] = useState("");
    const [fos, setFos] = useState("");
    const [exprience, setExprience] = useState(user.exprience);
    const [newExprience, setNewExprience] = useState({
        title: "",
        company: "",
        description: ""
    })

    const [coverImageFile, setCoverImageFile] = useState("");
    const [profileImageFile, setProfileImageFile] = useState("");
    const [coverPreview, setCoverPreview] = useState(user.coverImage.url);
    const [profilePreview, setProfilePreview] = useState(user.profileImage.url);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();




    const coverInputRef = useRef(null);
    const profileInputRef = useRef(null);

    const handleAddExprience = () => {
        const title = newExprience.title.trim();
        const company = newExprience.company.trim();
        const description = newExprience.description.trim();
        if(title && company && description){
            const isDuplicate = exprience.some(
                (item) =>
                    item.title.toLowerCase() === title.toLowerCase() &&
                    item.company.toLowerCase() === company.toLowerCase() &&
                    item.description.toLowerCase() === description.fieldOfStudy.toLowerCase()
            );

            if (!isDuplicate) {
                setExprience((prev) => [...prev, newExprience]);
            }
        }
        setNewExprience({
        title: "",
        company: "",
        description: ""
    })
    }

    const handleRemoveExprience = (indexToDelete) => {
        setExprience((prev) =>
            prev.filter((_, index) => index !== indexToDelete)
        )
    }

    const handleAddEducation = () => {

        const collegeTrimmed = college.trim();
        const degreeTrimmed = degree.trim();
        const fosTrimmed = fos.trim();

        if (collegeTrimmed && degreeTrimmed && fosTrimmed) {

            const newItem = {
                college: collegeTrimmed,
                degree: degreeTrimmed,
                fieldOfStudy: fosTrimmed
            };

            const isDuplicate = education.some(
                (item) =>
                    item.college.toLowerCase() === newItem.college.toLowerCase() &&
                    item.degree.toLowerCase() === newItem.degree.toLowerCase() &&
                    item.fieldOfStudy.toLowerCase() === newItem.fieldOfStudy.toLowerCase()
            );

            if (!isDuplicate) {
                setEducation((prev) => [...prev, newItem]);
            }

            setCollege('');
            setDegree('');
            setFos('');
        }
    };
    const handleDeleteEducation = (indexToDelete) => {
        setEducation((prevEducation) =>
            prevEducation.filter((_, index) => index !== indexToDelete)
        );
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImageFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    }
    const handleProfileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImageFile(file);
            console.log(file);
            setProfilePreview(URL.createObjectURL(file));
        }
    }
    const handleAddSkill = () => {
        if (skill.length !== 0 && (!skills.includes(skill))) {
            setSkills([...skills, skill]);
        }
        setSkill("");
    }
    const handleDeleteSkill = (indexToDelete) => {
        setSkills((prevSkills) => prevSkills.filter((_, index) => index !== indexToDelete));
    };

    const handleSubmit = asyncHandler(async (e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("headings", headings);
        formData.append("location", location);
        formData.append("gender", gender);
        formData.append("skills", JSON.stringify(skills));
        formData.append("education", JSON.stringify(education));
        formData.append("exprience", JSON.stringify(exprience));

        if(profileImageFile){
            formData.append("profileImage", profileImageFile);
        }
        if(coverImageFile){
            formData.append("coverImage", coverImageFile);
        }
        const result = await axios.put(baseUrl+'/api/user/updateUserProfile', formData, {withCredentials: true});
        setUser(result.data.data);
        setEdit(false);
        navigate('/');
    }, setIsLoading);




    return (

        <>
            <div className="w-full h-[100vh] fixed top-0 z-[100] flex justify-center items-center  no-scrollbar">

                <div className="w-full h-full bg-[var(--text)] opacity-[0.6] absolute"></div>

                <div className="neo w-[90%] max-w-[500px] h-[600px] bg-[var(--surface)] absolute z-[200] p-[40px] overflow-auto no-scrollbar">

                    <div
                        onClick={() => { setEdit(!edit) }}
                        className="w-8 h-8 flex items-center justify-center bg-[var(--surface)] rounded-full shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] text-[var(--text-muted)] hover:text-[var(--primary)] sticky top-1 left-[95%] cursor-pointer transition z-[201]"
                    >
                        <ImCross size={14} />
                    </div>

                    {/* Cover Photo */}
                    <div className="w-full h-[150px] rounded-2xl mt-[40px] relative bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] overflow-hidden">
                        <img src={coverPreview} alt="" className="w-full h-full object-cover" />
                        <div
                            onClick={() => coverInputRef.current.click()}
                            className="w-9 h-9 flex items-center justify-center bg-[var(--surface)] rounded-full shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] text-[var(--text-muted)] hover:text-[var(--primary)] absolute bottom-3 right-3 cursor-pointer transition"
                        >
                            <FaCamera size={16} />
                        </div>
                    </div>

                    {/* Profile Photo */}
                    <div className="rounded-full w-[90px] h-[90px] overflow-hidden absolute top-[200px] left-[200px] shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)]">
                        <img src={profilePreview} alt="" className="w-full h-full object-cover" />
                        <div
                            onClick={() => profileInputRef.current.click()}
                            className="w-7 h-7 flex items-center justify-center bg-[var(--surface)] rounded-full shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] text-[var(--text-muted)] hover:text-[var(--primary)] absolute bottom-[6px] right-[4px] cursor-pointer transition"
                        >
                            <IoMdAdd size={16} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-[60px]">

                        <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                        <input ref={profileInputRef} type="file" accept="image/*" onChange={handleProfileChange} className="hidden" />

                        <input onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="First Name" value={firstName} name="firstName"
                            className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />
                        <input onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Last Name" value={lastName} name="lastName"
                            className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />
                        <input onChange={(e) => setHeading(e.target.value)} type="text" placeholder="Headings" name="headings" value={headings}
                            className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="gender" className="text-[var(--text-muted)] text-xs px-1">Gender</label>
                                    <select
                                        onChange={(e) => setGender(e.target.value)}
                                        name="gender"
                                        id="gender"
                                        defaultValue={user.gender || ""}
                                        className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]"
                                    >
                                        <option value="" disabled>Please select your gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="others">Ayush Ranjan</option>
                                    </select>
                                </div>

                        <input onChange={(e) => setLocation(e.target.value)} type="text" placeholder="Location" name="location" value={location}
                            className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />

                        <div className="skills flex flex-col gap-2">
                            <ul className="flex flex-wrap gap-3">
                                {skills.map((val, index) => (
                                    <li
                                        key={index}
                                        className="group neo px-3 pl-5 py-2 rounded-md text-xs text-[var(--text-muted)] flex items-center gap-2 transition-all"
                                    >
                                        <span>{val}</span>
                                        <button type="button" onClick={() => handleDeleteSkill(index)} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity focus:outline-none font-bold cursor-pointer" aria-label={`Remove ${val}`} >✕</button>
                                    </li>
                                ))}
                            </ul>
                            <div className="skill-input flex items-center gap-2">
                                <input onChange={(e) => setSkill(e.target.value)} value={skill} type="text" placeholder="Enter Skills One By One"
                                    className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />
                                <div
                                    onClick={handleAddSkill}
                                    className="w-9 h-9 flex items-center justify-center flex-shrink-0 bg-[var(--surface)] rounded-full shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] text-[var(--text-muted)] hover:text-[var(--primary)] cursor-pointer transition" >
                                    <IoReturnDownBackOutline size={16} />
                                </div>
                            </div>
                        </div>
                        {/* ==================================== */}
                        <div className="education flex flex-col gap-2">
                            {education.length !== 0 && (
                                <div className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] text-sm w-full space-y-2">
                                    {education.map((val, index) => (
                                        <div
                                            key={index}
                                            className="group flex items-center justify-between p-2 rounded-sm bg-[var(--surface)] text-sm w-full transition-all border-b border-[var(--border)] w-full"
                                        >
                                            <span>
                                                {val.college} | {val.degree} | {val.fieldOfStudy}
                                            </span>

                                            {/* Delete Button */}
                                            <button type="button" onClick={() => handleDeleteEducation(index)} className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-500 transition-opacity focus:outline-none font-bold cursor-pointer px-2" >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex flex-col items-center gap-2 neo-inset border-none outline-none px-4 py-3 text-[var(--text)] w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)] ">
                                <input onChange={(e) => setCollege(e.target.value)} value={college} type="text" placeholder="Enter College Name"
                                    className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />
                                <input onChange={(e) => setDegree(e.target.value)} value={degree} type="text" placeholder="Enter Degree Name"
                                    className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />
                                <input onChange={(e) => setFos(e.target.value)} value={fos} type="text" placeholder="What was the Field of Study"
                                    className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />
                                <div
                                    onClick={handleAddEducation}
                                    className="w-1/2 h-10 flex items-center justify-center flex-shrink-0 bg-[var(--surface)] rounded-full shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] text-[var(--text-muted)] hover:text-[var(--primary)] cursor-pointer transition active:scale-95" >
                                    <p className='text-[var(--text-muted)] text-sm hover:text-[var(--primary)] cursor-pointer transition active:scale-95'>Add Education</p>
                                    <IoReturnDownBackOutline size={16} />
                                </div>
                            </div>
                        </div>

                        {/* ============================ */}
                        <div className="exprience flex flex-col gap-2">
                            {exprience.length !== 0 && (
                                <div className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] text-sm w-full space-y-2">
                                    {exprience.map((val, index) => (
                                        <div
                                            key={index}
                                            className="group flex items-center justify-between p-2 rounded-sm bg-[var(--surface)] text-sm w-full transition-all border-b border-[var(--border)] w-full"
                                        >
                                            <span>
                                                {val.title} | {val.company} | {val.description}
                                            </span>

                                            {/* Delete Button */}
                                            <button type="button" onClick={() => handleRemoveExprience(index)} className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-500 transition-opacity focus:outline-none font-bold cursor-pointer px-2" >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex flex-col items-center gap-2 neo-inset border-none outline-none px-4 py-3 text-[var(--text)] w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)] ">
                                <input onChange={(e) => setNewExprience({ ...newExprience, title: e.target.value })} value={newExprience.title} type="text" placeholder="Job Role"
                                    className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />
                                <input onChange={(e) => setNewExprience({...newExprience,company : e.target.value})} value={newExprience.company} type="text" placeholder="Company Name"
                                    className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />
                                <input onChange={(e) => setNewExprience({...newExprience, description: e.target.value})} value={newExprience.description} type="text" placeholder="Explain Your Work in Short"
                                    className="neo-inset border-none outline-none px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm w-full focus:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light),0_0_0_2px_var(--primary)]" />
                                <div
                                    onClick={handleAddExprience}
                                    className="w-1/2 h-10 flex items-center justify-center flex-shrink-0 bg-[var(--surface)] rounded-full shadow-[3px_3px_6px_var(--shadow-dark),-3px_-3px_6px_var(--shadow-light)] text-[var(--text-muted)] hover:text-[var(--primary)] cursor-pointer transition active:scale-95" >
                                    <p className='text-[var(--text-muted)] text-sm hover:text-[var(--primary)] cursor-pointer transition active:scale-95'>Add Exprience</p>
                                    <IoReturnDownBackOutline size={16} />
                                </div>
                            </div>
                        </div>

                        {/* ============================== */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="gradient-btn text-white rounded-full py-3 px-4 hover:opacity-90 active:scale-[0.98] transition mt-2"
                        >
                            {isLoading?"Saving Changes...":"Save Changes"}
                        </button>

                    </form>

                </div>
            </div>
        </>

    )
}

export default EditProfile