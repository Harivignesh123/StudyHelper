import { db, ref, set, get, child, remove, update, push, onValue, onChildAdded} from "../modules/FirebaseUtils.js";
import {notesLength,topicNameLength} from "../modules/Contract.js";

let subjectTitle=document.getElementById("subject_title");
let chapterTitle=document.getElementById("chapter_title");
let addTopicButton=document.getElementsByClassName("add_topic")[0];

let notesListContainerBox=document.getElementById("notes_list_container");
let topicsListContainerBox=document.getElementById("topics_list_container");

let subjectKey;
let chapterKey;
let user_uid;

let dbRef;

let editClickedfieldBox;


document.getElementsByTagName("ul")[0].addEventListener("mouseover",function(e){
    const target=getEventTarget(e);
    console.log(target.href);
},false);

if(document.addEventListener){
    document.addEventListener("DOMContentLoaded",function(){
        LoadExisitngNotes();
    },false);    
}
else{
    document.attachEvent("onDOMContentLoaded",function(){
        LoadExisitngNotes();
    });
}

if(addTopicButton.addEventListener){
    addTopicButton.addEventListener("click",function(){
        AddNotes();
    },false);    
}
else{
    addTopicButton.attachEvent("onclick",function(){
        AddNotes();
    });
}

if(notesListContainerBox.addEventListener){
    notesListContainerBox.addEventListener("click",function(e){
        NotesClicked(e);
    },false);
}
else{
    notesListContainerBox.attachEvent("onclick",function(e){
        NotesClicked(e);
    });
}


function LoadExisitngNotes(){
    subjectKey=localStorage.getItem("subject_key");
    chapterKey=localStorage.getItem("chapter_key");
    user_uid=localStorage.getItem("user_uid");
    const userName=localStorage.getItem("user_name");

    const heading=document.getElementById("status_bar").querySelector('#name');
    heading.innerHTML=userName;

    dbRef=user_uid+"/"+subjectKey+"/"+chapterKey+"/";
    subjectTitle.textContent=subjectKey.slice(subjectKey.indexOf('❤')+1);
    chapterTitle.textContent=chapterKey.slice(chapterKey.indexOf('❤')+1);


    get(child(ref(db),dbRef)).then((data)=>{

        data.forEach(function(child){
            addNotesToUI(child);
        });
       
    });

}


function addNotesToUI(data){
    const divBox=document.createElement('div');
    divBox.id=data.key;

    divBox.innerHTML='<fieldset><legend>'+(data.key).slice(data.key.indexOf('❤')+1)+'</legend><p>'+data.val()+'</p></fieldset>'
    divBox.className="notes_container";

    const editDivBox=document.createElement('div');
    editDivBox.innerHTML='<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
    divBox.append(editDivBox);
    
    notesListContainerBox.appendChild(divBox);


    const listItem=document.createElement('li');
    listItem.innerHTML='<a href="#'+data.key+'">'+(data.key).slice(data.key.indexOf('❤')+1)+'</a>';
    listItem.id=data.key;
    topicsListContainerBox.getElementsByTagName('ul')[0].append(listItem);
}

function addNotesToUIManually(id,notes,mode,before){
    const divBox=document.createElement('div');
    divBox.id=id;

    divBox.innerHTML='<fieldset><legend>'+(id).slice(id.indexOf('❤')+1)+'</legend><p>'+notes+'</p></fieldset>'
    divBox.className="notes_container";

    const editDivBox=document.createElement('div');
    editDivBox.innerHTML='<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
    divBox.append(editDivBox);

    const listItem=document.createElement('li');
    listItem.id=id;
    listItem.innerHTML='<a href="#'+id+'">'+id.slice(id.indexOf('❤')+1)+'</a>';
    
    
    if(mode==0){
        notesListContainerBox.appendChild(divBox);
        topicsListContainerBox.getElementsByTagName('ul')[0].append(listItem);
    }
    else{
        notesListContainerBox.insertBefore(divBox,before);
        topicsListContainerBox.getElementsByTagName('ul')[0].insertBefore(listItem,topicsListContainerBox.querySelector("#"+id));
    }
    
}

function AddNotes(){
    addTopicButton.style.visibility="hidden";
    const divTag=document.createElement('div');
   

    const formHTML='<fieldset><legend><input type="text" class="topic_edit_text" placeholder="Enter Topic name"/></legend><p><textarea class="notes_edit_text" placeholder="Enter notes here.."></textarea></p></fieldset><input class="note_add_button" type="button" value="Add"/>&nbsp;&nbsp;<input class="note_cancel_button" type="button" value="Cancel"/>';
    
    divTag.innerHTML=formHTML;
    divTag.className="note_add_container";
    notesListContainerBox.appendChild(divTag);
    divTag.scrollIntoView();
    divTag.querySelector(".topic_edit_text").focus();
}

function NotesClicked(e){
    const target=getEventTarget(e);
    const className=target.className;
 
    if(className){
         if(className=="notes_container"){
            //   localStorage.setItem("chapter_key",target.id);
            //   localStorage.setItem("subject_key",subjectKey);
            //   window.open("../html/NotesPage.html","_self");
         }
         else if(className=="chapter_name"){
            //   localStorage.setItem("chapter_key",target.parentNode.id);
            //   localStorage.setItem("subject_key",subjectKey);
            //   window.open("../html/NotesPage.html","_self");
         }
         else if(className=="edit_button"){

            const parent=target.parentNode.parentNode;
            const fieldset=parent.querySelector('fieldset');
            editClickedfieldBox=fieldset;
            
            const oldTitle=fieldset.querySelector('legend').innerHTML;
            const oldNotes=fieldset.querySelector('p').innerHTML;
        
            const formHTML='<fieldset><legend><input type="text" class="topic_edit_text" value="'+oldTitle+'" placeholder="Enter Topic name"/></legend><textarea class="notes_edit_text" placeholder="Enter notes here..">'+oldNotes+'</textarea></fieldset><input class="edit_save_button" type="button" value="Save"/>&nbsp;&nbsp;<input class="edit_cancel_button" type="button" value="Cancel"/>';
            parent.innerHTML=formHTML;
            parent.querySelector('fieldset').querySelector('.topic_edit_text').focus();
        }   


        else if(className=="delete_button"){
            const parent=target.parentNode.parentNode;
            const remRef=dbRef+parent.id+"/";
            const listItem=topicsListContainerBox.getElementsByTagName('ul')[0].querySelector("#"+parent.id);
            
            remove(ref(db,remRef)).then(()=>{
                notesListContainerBox.removeChild(parent);
                topicsListContainerBox.getElementsByTagName('ul')[0].removeChild(listItem);
            })
            .catch((error)=>{
                console.log("Problem with deleting "+parent.id+" "+error.code+":"+error.message);
            });

        }
         else{
             if(className=="note_add_button"){
                const divBox=target.parentNode;
                
                const topicEditText=divBox.getElementsByClassName("topic_edit_text")[0];
                const topic=topicEditText.value.trim();

                if(topic.length<=0||topic.length>topicNameLength){
                    alert("Topic Name length should be between 1 and "+topicNameLength);
                    return;
                }

                if(topic.includes("❤")){
                    alert("Topic Name cannot contain ❤");
                    return;
                }

                 const notesEditText=divBox.getElementsByClassName("notes_edit_text")[0];
                 const notes=notesEditText.value.trim();

                if(notes.length<=0||notes.length>notesLength){
                    alert("Notes length should be between 1 and "+notesLength);
                    return;
                }
        

                
                 var key=push(ref(db,dbRef)).key+"❤"+topic;
     
                 var json={};
                 json[key]=notes;

                 addTopicButton.style.visibility="visible";
                 notesListContainerBox.removeChild(divBox);
                 update(ref(db,dbRef),json).then(()=>{
                    addNotesToUIManually(key,notes,0,null);
                 });
             }
             else if(className=="note_cancel_button"){
                 const divBox=target.parentNode;
                 const notesListContainer=divBox.parentNode;
                 notesListContainer.removeChild(divBox);
     
                 addTopicButton.style.visibility="visible";
             }
             else if(className=="edit_save_button"){
            
                const newTitle=target.parentNode.querySelector('fieldset').querySelector('legend').querySelector(".topic_edit_text").value.trim();
                const newNotes=target.parentNode.querySelector('fieldset').querySelector('.notes_edit_text').value.trim();

                if(newTitle.length<=0||newTitle.length>topicNameLength){
                    alert("Topic Name length should be between 1 and "+topicNameLength);
                    return;
                }

                if(newTitle.includes("❤")){
                    alert("Topic Name cannot contain ❤");
                    return;
                }

                if(newNotes.length<=0||newNotes.length>notesLength){
                    alert("Notes length should be between 1 and "+notesLength);
                    return;
                }


                json={};
                const newKey=target.parentNode.id.slice(0,target.parentNode.id.indexOf("❤")+1)+newTitle;
                json[newKey]=newNotes;

                const oldKey=target.parentNode.id;

                remove(ref(db,dbRef+oldKey)).then(()=>{
                    update(ref(db,dbRef),json).then(()=>{
                        const parent=target.parentNode;
                        parent.id=newKey;
                        parent.innerHTML='<fieldset><legend>'+newTitle+'</legend><p>'+newNotes+'</p></fieldset>'

                        const listItem=topicsListContainerBox.querySelector('ul').querySelector("#"+oldKey);
                        listItem.id=newKey;
                        listItem.querySelector('a').href="#"+newKey;
                        listItem.querySelector('a').innerHTML=newTitle;

                        const editDivBox=document.createElement('div');
                        editDivBox.innerHTML='<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
                        parent.appendChild(editDivBox);   

                    });
                })
                .catch((error)=>{
                    console.log("Problem with deleting "+parent.id+" "+error.code+":"+error.message);
                });

                
                
            }
            else if(className=="edit_cancel_button"){
                const parent=target.parentNode
                parent.innerHTML="";
                parent.appendChild(editClickedfieldBox);

                const editDivBox=document.createElement('div');
                editDivBox.innerHTML='<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
                parent.appendChild(editDivBox);   
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