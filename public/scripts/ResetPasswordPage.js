import {auth, sendPasswordResetEmail} from "../modules/FirebaseUtils.js";

const resetPasswordButton=document.getElementById("reset_password_button");

if(resetPasswordButton.addEventListener){
    resetPasswordButton.addEventListener("click",function(){
        ForgotPassword();
    },false);
}
else{
    resetPasswordButton.attachEvent("onclick",function(){
        ForgotPassword();
    });
}


function ForgotPassword(){

    const resetEmailInput=document.getElementById("reset_email_input").value.trim();
    if(resetEmailInput.length==0){
        alert("Fill all the fields");
        return;
    }

    sendPasswordResetEmail(auth,resetEmailInput)
        .then(() => {
            alert("Password Reset Email sent");
            history.back();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            if(errorCode=="auth/user-not-found"){
                alert("Account does not exist");
            }
            else if(errorCode=="auth/invalid-email"){
                alert("Invalid Email Address");
            }
            else{
                console.log(errorCode+":"+errorMessage);
            }
        });


}
