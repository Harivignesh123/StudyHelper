//changes made see by Arin.B
import { db, ref, set, update, push, onValue, onChildAdded} from "../modules/FirebaseUtils.js";

const addSubjectButton=document.getElementById("add_subject_button");
const subjectListContainerBox=document.getElementById("subject_list_container");

if(document.addEventListener){
    document.addEventListener("DOMContentLoaded",function(){
        LoadExisitngSubjects();
    },false);    
}
else{
    document.attachEvent("onDOMContentLoaded",function(){
        LoadExisitngSubjects();
    });
}

function LoadExisitngSubjects(){
    onChildAdded(ref(db),(data)=>{
        addSubjectToUI(data);
    });
}


if(addSubjectButton.addEventListener){
    addSubjectButton.addEventListener("click",function(){
        AddSubject();
    },false);
}
else{
    addSubjectButton.attachEvent("onclick",function(){
        AddSubject();
    });
}


if(subjectListContainerBox.addEventListener){
    subjectListContainerBox.addEventListener("click",function(e){
        SubjectClicked(e);
    },false);
}
else{
    subjectListContainerBox.attachEvent("onclick",function(e){
        SubjectClicked(e);
    });
}

function AddSubject(){

    addSubjectButton.style.visibility="hidden";
    const divTag=document.createElement('div');
   

    const formHTML='<input class="subject_name_edit_text" type="text" placeholder="Enter subject name" autofocus/>&nbsp;&nbsp;<input class="subject_add_button" type="button" value="Add"/>&nbsp;&nbsp;<input class="subject_cancel_button" type="button" value="Cancel"/>';
    
    divTag.setAttribute("class","subject_div_container");
    divTag.innerHTML=formHTML;
    divTag.className="subject_add_container";
    subjectListContainerBox.appendChild(divTag);
    divTag.querySelector(".subject_name_edit_text").focus();
}

function SubjectClicked(e){
   const target=getEventTarget(e);
   const className=target.className;

   if(className){
        if(className=="subject_container"){
             localStorage.setItem("subject_key",target.id);
             window.open("../html/ChapterPage.html","_self");
        }
        else if(className=="subject_name"){
             localStorage.setItem("subject_key",target.parentNode.id);
             window.open("../html/ChapterPage.html","_self");
        }
        else{
            if(className=="subject_add_button"){
                const divBox=target.parentNode;
                const subjectNameEditText=divBox.getElementsByClassName("subject_name_edit_text")[0];
                const subjectName=subjectNameEditText.value;
                
                divBox.innerHTML='<p class="subject_name">'+subjectName+'</p>';
                divBox.className="subject_container";
                var key=push(ref(db)).key+"❤"+subjectName;
    
                var json={};
                json[key]=0;
                
                addSubjectButton.style.visibility="visible";
                subjectListContainerBox.removeChild(divBox);
                update(ref(db),json);
                
            }
            else if(className=="subject_cancel_button"){
                const divBox=target.parentNode;
                const subjectListContainer=divBox.parentNode;
                subjectListContainer.removeChild(divBox);
    
                addSubjectButton.style.visibility="visible";
            }
        }
   }
}

function addSubjectToUI(data){

    // alert(Object.keys(data.val()).length);


    const divBox=document.createElement('div');
    divBox.id=data.key;
    divBox.innerHTML='<p class="subject_name">'+(data.key).slice(data.key.indexOf('❤')+1)+'</p>';
    divBox.className="subject_container";
    
    subjectListContainerBox.appendChild(divBox);
}

function getEventTarget(e){
    if(!e){
        e=window.event;
    }
    return e.target||e.srcElement;
}