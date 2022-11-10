import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, update, ref, db } from "../modules/FirebaseUtils.js";
import { profileNameLength } from "../modules/Contract.js";

const loginAccountButton = document.getElementById("login_account_button");
const createAccountButton = document.getElementById("create_account_button");


if (loginAccountButton.addEventListener) {
    loginAccountButton.addEventListener("click", function() {
        LoginAccount();
    }, false);
} else {
    loginAccountButton.attachEvent("onclick", function() {
        LoginAccount();
    });
}

if (createAccountButton.addEventListener) {
    createAccountButton.addEventListener("click", function() {
        CreateAccount();
    }, false);
} else {
    createAccountButton.attachEvent("onclick", function() {
        CreateAccount();
    });
}


function LoginAccount() {
    const loginEmailInput = document.getElementById("login_email_input").value.trim();
    const loginPasswordInput = document.getElementById("login_password_input").value.trim();

    if (loginEmailInput.length == 0 || loginPasswordInput == 0) {
        alert("Fill all the fields");
        return;
    }

    signInWithEmailAndPassword(auth, loginEmailInput, loginPasswordInput)
        .then((userCredential) => {
            const user = userCredential.user;
            const uid = user.uid;
            localStorage.setItem("user_name", user.displayName);
            localStorage.setItem("user_uid", uid);
            localStorage.setItem("email",loginEmailInput);
            console.log(user.displayName);
            CheckAndUpdateStreak(loginEmailInput);
            // window.open("../html/SubjectPage.html","_self");
            
            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode == "auth/wrong-password") {
                alert("Wrong email id or passsword");
            } else if (errorCode == "auth/user-not-found") {
                alert("User not found");
            } else if (errorCode == "auth/invalid-email") {
                alert("Invalid Email Address");
            } else {
                console.log(errorCode + ":" + errorMessage);
                alert("Problem with signing in");
            }

        });
}

function CreateAccount() {
    const createNameInput = document.getElementById("create_name_input").value.trim();
    const createEmailInput = document.getElementById("create_email_input").value.trim();
    const createPasswordInput = document.getElementById("create_password_input").value.trim();
    const createConfirmPasswordInput = document.getElementById("create_confirm_password_input").value.trim();


    if (createNameInput.length == 0 || createEmailInput.length == 0 || createPasswordInput.length == 0 || createConfirmPasswordInput.length == 0) {
        alert("Fill all the fields");
        return;
    }

    if (createNameInput.length < 3 || createNameInput.length > profileNameLength) {
        alert("Name length should be between 3 and " + profileNameLength);
        return;
    }

    if (createPasswordInput != createConfirmPasswordInput) {
        alert("Passwords did not match");
        return;
    }
    
    createUserWithEmailAndPassword(auth, createEmailInput, createPasswordInput)
        .then((userCredential) => {
            const user = userCredential.user;
            updateProfile(user, {
                displayName: createNameInput
            }).then(function() {
                let json = {};
                json[user.uid] = 0;
                update(ref(db), json).then(function() {
                    localStorage.setItem("user_name", user.displayName);
                    localStorage.setItem("user_uid", user.uid);
                    localStorage.setItem("email",createEmailInput);
                    //window.open("../html/SubjectPage.html", "_self");
                    createStreakForUser(createEmailInput);
                    
                });
            }, function(error) {
                console.log(error.code + ":" + error.message);
            });;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode == "auth/email-already-in-use") {
                alert("Account with the entered email id already exists");
            } else if (errorCode == "auth/invalid-email") {
                alert("Invalid Email Address");
            } else if (errorCode == "auth/weak-password") {
                alert("Create a strong password with minimum 6 characters");
            } else {
                console.log(errorCode + ":" + errorMessage);
            }

        });
}

async function createStreakForUser(mailID) {
    try {
        const res=await fetch('/InitializeStreak', {
            method: 'POST',
            body: JSON.stringify({
                "mailID":mailID
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            return (response.json());
        });
        console.log(res.newStreak);
        localStorage.setItem("streakValue",res.newStreak);
        location.assign("/SubjectPage");


    } catch (e) {
        console.log(e);
    }
}

async function CheckAndUpdateStreak(mailID) {
    try {

        const res=await fetch('/CheckStreak', {
            method: 'POST',
            body: JSON.stringify({
                "mailID":mailID
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            return (response.json());
        });

        console.log(res.newStreak);
        localStorage.setItem("streakValue",res.newStreak);
        location.assign("/SubjectPage");
    

    } catch (e) {
        console.log(e);
    }
}