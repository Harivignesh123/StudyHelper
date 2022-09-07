//changes made see by Arin.B
import { db, ref, set, get, child, remove, update, push, onValue, onChildAdded} from "../modules/FirebaseUtils.js";
import {subjectNameLength} from "../modules/Contract.js";

const addSubjectButton=document.getElementById("add_subject_button");
const subjectListContainerBox=document.getElementById("subject_list_container");

let user_uid;
let dbRef;
let editClickedDivBox;

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
    user_uid=localStorage.getItem("user_uid");
    const heading=document.getElementById("status_bar").querySelector('#name');
    const userName=localStorage.getItem("user_name");
    heading.innerHTML=userName;
    dbRef=user_uid+"/";

    get(child(ref(db),dbRef)).then((data)=>{
        data.forEach(function(child){
            addSubjectToUI(child);
        });
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
    const div2Tag=document.createElement('div');
    div2Tag.className="subject_add_container2";
    div2Tag.innerHTML=formHTML;

    divTag.setAttribute("class","subject_div_container");
    divTag.append(div2Tag);
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
        else if(className=="edit_button"){
            const parent=target.parentNode.parentNode;
            editClickedDivBox=parent;
        
            
            const formHTML='<input class="subject_name_edit_text" type="text" placeholder="Enter subject name" value="'+parent.querySelector('p').innerHTML+'" autofocus/>&nbsp;&nbsp;<input class="edit_save_button" type="button" value="Save"/>&nbsp;&nbsp;<input class="edit_cancel_button" type="button" value="Cancel"/>';
            const div2Tag=document.createElement('div');
            div2Tag.className="subject_add_container2";
            div2Tag.innerHTML=formHTML;

            const divTag=document.createElement('div');
            divTag.append(div2Tag);
            divTag.className="subject_add_container";
            subjectListContainerBox.insertBefore(divTag,parent);
            subjectListContainerBox.removeChild(parent);
            divTag.querySelector(".subject_name_edit_text").focus();
            
        }
        else if(className=="delete_button"){
            const parent=target.parentNode.parentNode;
            const remRef=dbRef+parent.id+"/";

            remove(ref(db,remRef)).then(()=>{
                subjectListContainerBox.removeChild(parent);
            })
            .catch((error)=>{
                console.log("Problem with deleting "+parent.id+" "+error.code+":"+error.message);
            });

        }
        else{
            if(className=="subject_add_button"){
                const divBox=target.parentNode.parentNode;
                const subjectNameEditText=divBox.getElementsByClassName("subject_name_edit_text")[0];
                const subjectName=subjectNameEditText.value.trim();

                if(subjectName.length<=0||subjectName.length>subjectNameLength){
                    alert("Subject Name length should be between 1 and "+subjectNameLength);
                    return;
                }
        
                
                divBox.innerHTML='<p class="subject_name">'+subjectName+'</p>';
                divBox.className="subject_container";
                var key=push(ref(db,dbRef)).key+"❤"+subjectName;
    
                var json={};
                json[key]=0;
                
                addSubjectButton.style.visibility="visible";
                subjectListContainerBox.removeChild(divBox);
                update(ref(db,dbRef),json).then(()=>{
                    addSubjectToUIManually(key,0,null);
                });
                
            }
            else if(className=="subject_cancel_button"){
                const divBox=target.parentNode.parentNode;
                const subjectListContainer=divBox.parentNode;
                subjectListContainer.removeChild(divBox);
    
                addSubjectButton.style.visibility="visible";
            }
            else if(className=="edit_save_button"){
                const newName=target.parentNode.parentNode.querySelector('.subject_name_edit_text').value.trim();
                const newKey=editClickedDivBox.id.slice(0,editClickedDivBox.id.indexOf('❤')+1)+newName;

                
                if(newName.length<=0||newName.length>subjectNameLength){
                    alert("Subject Name length should be between 1 and "+subjectNameLength);
                    return;
                }
                
            
                get(child(ref(db),dbRef+editClickedDivBox.id+"/")).then((data)=>{
                    const content=data.val();
                    var json={};
                    json[newKey]=content;
            
                    update(ref(db,dbRef),json)
                        .then(()=>{
                            remove(ref(db,dbRef+editClickedDivBox.id)).then(()=>{
                                console.log(editClickedDivBox.id+" Deleted");
                                const parent=target.parentNode.parentNode;
                                addSubjectToUIManually(newKey,1,parent);
                                subjectListContainerBox.removeChild(parent);
                            })
                            .catch((error)=>{
                                console.log("Problem with deleting "+parent.id+" "+error.code+":"+error.message);
                            });
                        });
                });
                
                
            }
            else if(className=="edit_cancel_button"){
                const parent=target.parentNode.parentNode;
                subjectListContainerBox.insertBefore(editClickedDivBox,parent);
                subjectListContainerBox.removeChild(parent);
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

    const editDivBox=document.createElement('div');
    editDivBox.innerHTML='<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
    divBox.append(editDivBox);
    
    subjectListContainerBox.appendChild(divBox);
}

function addSubjectToUIManually(id,mode,before){
    const divBox=document.createElement('div');
    divBox.id=id;

    divBox.innerHTML='<p class="subject_name">'+id.slice(id.indexOf('❤')+1)+'</p>';
    divBox.className="subject_container";

    const editDivBox=document.createElement('div');
    editDivBox.innerHTML='<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
    divBox.append(editDivBox);
    
    if(mode==0){
        subjectListContainerBox.appendChild(divBox);
    }
    else{
        subjectListContainerBox.insertBefore(divBox,before);
    }
    
}

function getEventTarget(e){
    if(!e){
        e=window.event;
    }
    return e.target||e.srcElement;
}