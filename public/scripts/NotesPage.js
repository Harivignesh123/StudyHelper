import { db, ref, set, update, push, onValue, onChildAdded} from "../modules/FirebaseUtils.js";

let subjectTitle=document.getElementsByClassName("subject_title")[0];
let chapterTitle=document.getElementsByClassName("chapter_title")[0];
let addTopicButton=document.getElementsByClassName("add_topic")[0];

let notesListContainerBox=document.getElementById("notes_list_container");
let topicsListContainerBox=document.getElementById("topics_list_container");

let subjectKey;
let chapterKey;

let dbRef;

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
    dbRef=subjectKey+"/"+chapterKey+"/";

    subjectTitle.textContent=subjectKey.slice(subjectKey.indexOf('❤')+1);
    chapterTitle.textContent=chapterKey.slice(chapterKey.indexOf('❤')+1);

    onChildAdded(ref(db,dbRef),(data)=>{
        addNotesToUI(data);
    });
}

function addNotesToUI(data){
    const divBox=document.createElement('div');
    divBox.id=data.key;
    divBox.innerHTML='<fieldset><legend id="top1">'+(data.key).slice(data.key.indexOf('❤')+1)+'</legend><p>'+data.val()+'</p></fieldset>'
    divBox.className="notes_container";

    notesListContainerBox.appendChild(divBox);

    const listItem=document.createElement('li');
    listItem.innerHTML='<a id="'+data.key+'" href="'+data.key+'">'+(data.key).slice(data.key.indexOf('❤')+1)+'</a>';

    topicsListContainerBox.getElementsByTagName('ul')[0].append(listItem);
}

function AddNotes(){
    addTopicButton.style.visibility="hidden";
    const divTag=document.createElement('div');
   

    const formHTML='<fieldset><legend><input type="text" class="topic_edit_text" placeholder="Enter Topic name"/></legend><p><textarea class="notes_edit_text" placeholder="Enter notes here.."></textarea></p></fieldset><input class="note_add_button" type="button" value="Add"/>&nbsp;&nbsp;<input class="note_cancel_button" type="button" value="Cancel"/>';
    
    divTag.innerHTML=formHTML;
    divTag.className="note_add_container";
    notesListContainerBox.appendChild(divTag);
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
         else{
             if(className=="note_add_button"){
                 const divBox=target.parentNode;
                
                 const topicEditText=divBox.getElementsByClassName("topic_edit_text")[0];
                 const topic=topicEditText.value;

                 const notesEditText=divBox.getElementsByClassName("notes_edit_text")[0];
                 const notes=notesEditText.value;

                
                 var key=push(ref(db,dbRef)).key+"❤"+topic;
     
                 var json={};
                 json[key]=notes;

                 addTopicButton.style.visibility="visible";
                 notesListContainerBox.removeChild(divBox);
                 update(ref(db,dbRef),json);

                //  const divBox1=document.createElement('div');
                // divBox1.id=key;
                // divBox1.innerHTML='<fieldset><legend id="top1">'+topic+'</legend><p>'+notes+'</p></fieldset>'
                // divBox1.className="notes_container";

                // notesListContainerBox.appendChild(divBox1);

                // const listItem=document.createElement('li');
                // listItem.innerHTML='<a id="'+key+'" href="'+key+'">'+topic+'</a>';
                // topicsListContainerBox.getElementsByTagName('ul')[0].append(listItem);
             }
             else if(className=="note_cancel_button"){
                 const divBox=target.parentNode;
                 const notesListContainer=divBox.parentNode;
                 notesListContainer.removeChild(divBox);
     
                 addTopicButton.style.visibility="visible";
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