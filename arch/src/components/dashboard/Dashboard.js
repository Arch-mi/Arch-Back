import React, { useEffect, useState } from "react";
import { auth,db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
import "./dashboard.css";


function Dashboard() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [lastSeen, setLastSeen]= useState();
    const [creationTime, setCreationTime] = useState();
    const [name, setName] = useState()
    const [photo, setPhoto] = useState();    

    let hrefName = null;
    try {
        hrefName = window.location.href.split('?')[1].split('%20').join(' ');
    } catch (err) {
        console.log(err);
    }
    
    // Fetch user Questions
    const fetchUserQuestions = async () => {
        let questions = null;
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            //await sleep(1000);
            
            if (!data.questions) {
                questions = {};
            } else {
                questions = data.questions;
            }

        } catch (error) {
            console.log(error);
        }
        // console.log(questions)
        let list = document.getElementById("qs");
        for (let i = 0; i < 10; i++) {
            let ul = document.createElement("ul");
            questions[i].forEach((item)=>{
                let li = document.createElement("li");
                li.innerText = Object.values(item);
                ul.appendChild(li);
            })     
            list.appendChild(ul);
        }

    }

    // Fetch username by uid
    const fetchUserInfo = async () => {
        try {
            setName(user.displayName);
            setCreationTime(user.metadata.creationTime.split(',')[1].split('GMT'));
            setLastSeen(user.metadata.lastSignInTime.split(',')[1].split('GMT'));
            setPhoto(user.photoURL);
            // console.log(user);
        } catch (err) {
            //console.error(err);
        }
    }; 
    
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/sign");
        if (!hrefName) return navigate("/sign");

        fetchUserInfo();
        if (user.displayName != hrefName) return navigate("/sign");
            
        fetchUserQuestions();
    }, [user, loading]);
      

    return (
        <div>
            <h1>Bio</h1>
            <a href="/">Arch</a><br></br>
            <img src={photo} alt="Photo"/>
            <p>{name}</p>
            <p>Derniere connexion : {lastSeen}</p>
            <p>Inscrit le : {creationTime}</p>

            <h1>Mes Question's</h1>
            <div id="qs"></div>
        </div>
    )
}

export default Dashboard;