import { db, ref, set, get, update, push, onValue, child, onChildAdded, onChildChanged, onChildRemoved, remove} from "../modules/FirebaseUtils.js";
import {chapterNameLength} from "../modules/Contract.js";

let dbRef; 
let user_uid;

const addChapterButton=document.getElementById("add_chapter_button");
const chapterListContainerBox=document.getElementById("chapter_list_container");

let subjectKey;

const subjectTitle=document.getElementsByClassName("subject_title")[0];


if(document.addEventListener){
    document.addEventListener("DOMContentLoaded",function(){
        LoadExisitngChapters();
    },false);    
}
else{
    document.attachEvent("onDOMContentLoaded",function(){
        LoadExisitngChapters();
    });
}

if(addChapterButton.addEventListener){
    addChapterButton.addEventListener("click",function(){
        AddChapter();
    },false);
}
else{
    addChapterButton.attachEvent("onclick",function(){
        AddChapter();
    });
}


if(chapterListContainerBox.addEventListener){
    chapterListContainerBox.addEventListener("click",function(e){
        ChapterClicked(e);
    },false);
}
else{
    chapterListContainerBox.attachEvent("onclick",function(e){
        ChapterClicked(e);
    });
}

function LoadExisitngChapters(){
    subjectKey=localStorage.getItem("subject_key");
    user_uid=localStorage.getItem("user_uid");
    const userName=localStorage.getItem("user_name");

    const heading=document.getElementById("status_bar").querySelector('#name');
    heading.innerHTML=userName;

    dbRef=user_uid+"/"+subjectKey+"/";
    subjectTitle.textContent=subjectKey.slice(subjectKey.indexOf('❤')+1);


    get(child(ref(db),dbRef)).then((data)=>{

        data.forEach(function(child){
            addChapterToUI(child);
        });
       
    });
}    

function addChapterToUI(data){
    const divBox=document.createElement('div');
    divBox.id=data.key;

    divBox.innerHTML='<p class="chapter_name">'+(data.key).slice(data.key.indexOf('❤')+1)+'</p>';
    divBox.className="chapter_container";

    const editDivBox=document.createElement('div');
    editDivBox.innerHTML='<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
    divBox.append(editDivBox);
    
    chapterListContainerBox.appendChild(divBox);
}


function AddChapter(){

    addChapterButton.style.visibility="hidden";
    const divTag=document.createElement('div');
   

    const formHTML='<input class="chapter_name_edit_text" type="text" placeholder="Enter chapter name" autofocus/>&nbsp;&nbsp;<input class="chapter_add_button" type="button" value="Add"/>&nbsp;&nbsp;<input class="chapter_cancel_button" type="button" value="Cancel"/>';
    const div2Tag=document.createElement('div');
    div2Tag.className="chapter_add_container2";
    div2Tag.innerHTML=formHTML;

    divTag.append(div2Tag);
    divTag.className="chapter_add_container";
    chapterListContainerBox.appendChild(divTag);
    divTag.querySelector(".chapter_name_edit_text").focus();
}

function ChapterClicked(e){
    const target=getEventTarget(e);
    const className=target.className;
 
    if(className){
        if(className=="chapter_container"){
            localStorage.setItem("chapter_key",target.id);
            window.open("../html/NotesPage.html","_self");
        }
        else if(className=="chapter_name"){
            localStorage.setItem("chapter_key",target.parentNode.id);
            window.open("../html/NotesPage.html","_self");
        }
        else if(className=="edit_button"){
            const divTag=target.parentNode.parentNode;   
            divTag.className="chapter_add_container";
            
            const formHTML='<input class="chapter_name_edit_text" type="text" placeholder="Enter chapter name" value="'+divTag.querySelector('p').innerHTML+'" autofocus/>&nbsp;&nbsp;<input class="edit_save_button" type="button" value="Save"/>&nbsp;&nbsp;<input class="edit_cancel_button" type="button" value="Cancel"/>';
            const div2Tag=document.createElement('div');
            div2Tag.className="chapter_add_container2";
            div2Tag.innerHTML=formHTML;

            divTag.innerHTML="";
            divTag.append(div2Tag);
            
            divTag.querySelector(".chapter_name_edit_text").focus();
            
        }
        else if(className=="delete_button"){
            const parent=target.parentNode.parentNode;
            const remRef=dbRef+parent.id+"/";

            remove(ref(db,remRef)).then(()=>{
                chapterListContainerBox.removeChild(parent);
            })
            .catch((error)=>{
                console.log("Problem with deleting "+parent.id+" "+error.code+":"+error.message);
            });

        }
        else{
            if(className=="chapter_add_button"){
                const divBox=target.parentNode.parentNode;
                const chapterNameEditText=divBox.getElementsByClassName("chapter_name_edit_text")[0];
                const chapterName=chapterNameEditText.value.trim();

                if(chapterName.length<=0||chapterName.length>chapterNameLength){
                    alert("Chapter Name length should be between 1 and "+chapterNameLength);
                    return;
                }

                if(chapterName.includes("❤")){
                    alert("Chapter Name cannot contain ❤");
                    return;
                }
                
                var key=push(ref(db,dbRef)).key+"❤"+chapterName;
    
                var json={};
                json[key]=0;
                
                addChapterButton.style.visibility="visible";
                update(ref(db,dbRef),json).then(()=>{

                    divBox.id=key;
                    divBox.innerHTML='<p class="chapter_name">'+chapterName+'</p>';
                    divBox.className="chapter_container";

                    const editDivBox=document.createElement('div');
                    editDivBox.innerHTML='<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
                    divBox.append(editDivBox);
                });

                
                
            }
            else if(className=="chapter_cancel_button"){
                const divBox=target.parentNode.parentNode;
                const chapterListContainer=divBox.parentNode;
                chapterListContainer.removeChild(divBox);
    
                addChapterButton.style.visibility="visible";
            }
            else if(className=="edit_save_button"){
                const divTag=target.parentNode.parentNode;
                const newName=divTag.querySelector('.chapter_name_edit_text').value.trim();
                const newKey=divTag.id.slice(0,divTag.id.indexOf('❤')+1)+newName;

                if(newName.length<=0||newName.length>chapterNameLength){
                    alert("Chapter Name length should be between 1 and "+chapterNameLength);
                    return;
                }

                if(newName.includes("❤")){
                    alert("Chapter Name cannot contain ❤");
                    return;
                }

                if(newKey==divTag.id){
                    divTag.innerHTML='<p class="chapter_name">'+newName+'</p>';
                    divTag.className="chapter_container";

                    const editDivBox=document.createElement('div');
                    editDivBox.innerHTML='<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
                    divTag.append(editDivBox);
                    return;
                }
                
            
                get(child(ref(db),dbRef+divTag.id+"/")).then((data)=>{
                    const content=data.val();
                    var json={};
                    json[newKey]=content;
            
                    update(ref(db,dbRef),json)
                        .then(()=>{
                            remove(ref(db,dbRef+divTag.id)).then(()=>{
                                console.log(divTag.id+" Deleted");
                                
                                divTag.id=newKey;
                                divTag.innerHTML='<p class="chapter_name">'+newName+'</p>';
                                divTag.className="chapter_container";

                                const editDivBox=document.createElement('div');
                                editDivBox.innerHTML='<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
                                divTag.append(editDivBox);
                            })
                            .catch((error)=>{
                                console.log("Problem with deleting "+parent.id+" "+error.code+":"+error.message);
                            });
                        });
                });
                
                
            }
            else if(className=="edit_cancel_button"){
                const divTag=target.parentNode.parentNode;
                
                divTag.innerHTML='<p class="chapter_name">'+(divTag.id).slice(divTag.id.indexOf('❤')+1)+'</p>';
                divTag.className="chapter_container";

                const editDivBox=document.createElement('div');
                editDivBox.innerHTML='<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
                divTag.append(editDivBox);

            }
         }
    }
 }




function getEventTarget(e){
    if(!e){
        e=window.event;
    }
    return e.target||e.srcElement;
}