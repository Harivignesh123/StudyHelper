import { db, ref, set, update, push, onValue, onChildAdded} from "../modules/FirebaseUtils.js";

let dbRef; 

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
    dbRef=subjectKey+"/";
    subjectTitle.textContent=subjectKey.slice(subjectKey.indexOf('❤')+1);


    onChildAdded(ref(db,dbRef),(data)=>{
        addChapterToUI(data);
    });
}

function addChapterToUI(data){
    const divBox=document.createElement('div');
    divBox.id=data.key;
    divBox.innerHTML='<p class="chapter_name">'+(data.key).slice(data.key.indexOf('❤')+1)+'</p>';
    divBox.className="chapter_container";
    
    chapterListContainerBox.appendChild(divBox);
}

function AddChapter(){

    addChapterButton.style.visibility="hidden";
    const divTag=document.createElement('div');
   

    const formHTML='<input class="chapter_name_edit_text" type="text" placeholder="Enter chapter name" autofocus/>&nbsp;&nbsp;<input class="chapter_add_button" type="button" value="Add"/>&nbsp;&nbsp;<input class="chapter_cancel_button" type="button" value="Cancel"/>';
    
    divTag.setAttribute("class","chapter_div_container");
    divTag.innerHTML=formHTML;
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
              localStorage.setItem("subject_key",subjectKey);
              window.open("../html/NotesPage.html","_self");
         }
         else if(className=="chapter_name"){
              localStorage.setItem("chapter_key",target.parentNode.id);
              localStorage.setItem("subject_key",subjectKey);
              window.open("../html/NotesPage.html","_self");
         }
         else{
             if(className=="chapter_add_button"){
                 const divBox=target.parentNode;
                 const chapterNameEditText=divBox.getElementsByClassName("chapter_name_edit_text")[0];
                 const chapterName=chapterNameEditText.value;
                 
                 var key=push(ref(db,dbRef)).key+"❤"+chapterName;
     
                 var json={};
                 json[key]=0;
                 
                 addChapterButton.style.visibility="visible";
                 chapterListContainerBox.removeChild(divBox);
                 update(ref(db,dbRef),json);
                 
             }
             else if(className=="chapter_cancel_button"){
                 const divBox=target.parentNode;
                 const chapterListContainer=divBox.parentNode;
                 chapterListContainer.removeChild(divBox);
     
                 addChapterButton.style.visibility="visible";
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