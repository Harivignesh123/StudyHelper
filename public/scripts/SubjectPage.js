//changes made see by Arin.B
import { db, ref, set, get, child, remove, update, push, onValue, onChildAdded } from "../modules/FirebaseUtils.js";
import { subjectNameLength } from "../modules/Contract.js";

const addSubjectButton = document.getElementById("add_subject_button");
const subjectListContainerBox = document.getElementById("subject_list_container");
const streak = document.getElementById("streak");


let user_uid;
let dbRef;

if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {
        LoadExisitngSubjects();
    }, false);
} else {
    document.attachEvent("onDOMContentLoaded", function() {
        LoadExisitngSubjects();
    });
}

function LoadExisitngSubjects() {
    user_uid = localStorage.getItem("user_uid");
    const heading = document.getElementById("status_bar").querySelector('#name');
    const userName = localStorage.getItem("user_name");
    streak.innerHTML = 'Streak ' + localStorage.getItem("streakValue") + '&#128293';
    heading.innerHTML = userName;
    dbRef = user_uid + "/";

    get(child(ref(db), dbRef)).then((data) => {
        data.forEach(function(child) {
            addSubjectToUI(child);
        });
    });
}


if (addSubjectButton.addEventListener) {
    addSubjectButton.addEventListener("click", function() {
        AddSubject();
    }, false);
} else {
    addSubjectButton.attachEvent("onclick", function() {
        AddSubject();
    });
}


if (subjectListContainerBox.addEventListener) {
    subjectListContainerBox.addEventListener("click", function(e) {
        SubjectClicked(e);
    }, false);
} else {
    subjectListContainerBox.attachEvent("onclick", function(e) {
        SubjectClicked(e);
    });
}

function AddSubject() {

    addSubjectButton.style.visibility = "hidden";
    const divTag = document.createElement('div');


    const formHTML = '<input class="subject_name_edit_text" type="text" placeholder="Enter subject name" autofocus/>&nbsp;&nbsp;<input class="subject_add_button" type="button" value="Add"/>&nbsp;&nbsp;<input class="subject_cancel_button" type="button" value="Cancel"/>';
    const div2Tag = document.createElement('div');
    div2Tag.className = "subject_add_container2";
    div2Tag.innerHTML = formHTML;

    divTag.setAttribute("class", "subject_div_container");
    divTag.append(div2Tag);
    divTag.className = "subject_add_container";
    subjectListContainerBox.appendChild(divTag);
    divTag.querySelector(".subject_name_edit_text").focus();
}

function SubjectClicked(e) {
    const target = getEventTarget(e);
    const className = target.className;

    if (className) {
        if (className == "subject_container") {
            localStorage.setItem("subject_key", target.id);
            //window.open("../html/ChapterPage.html","_self");
            location.assign('/ChapterPage');
        } else if (className == "subject_name") {
            localStorage.setItem("subject_key", target.parentNode.id);
            // window.open("../html/ChapterPage.html", "_self");
            location.assign('/ChapterPage');
        } else if (className == "edit_button") {

            const divTag = target.parentNode.parentNode;
            divTag.className = "subject_add_container";

            const formHTML = '<input class="subject_name_edit_text" type="text" placeholder="Enter subject name" value="' + divTag.querySelector('p').innerHTML + '" autofocus/>&nbsp;&nbsp;<input class="edit_save_button" type="button" value="Save"/>&nbsp;&nbsp;<input class="edit_cancel_button" type="button" value="Cancel"/>';
            const div2Tag = document.createElement('div');
            div2Tag.className = "subject_add_container2";
            div2Tag.innerHTML = formHTML;

            divTag.innerHTML = "";
            divTag.append(div2Tag);

            divTag.querySelector(".subject_name_edit_text").focus();

        } else if (className == "delete_button") {
            const parent = target.parentNode.parentNode;
            const remRef = dbRef + parent.id + "/";

            remove(ref(db, remRef)).then(() => {
                    subjectListContainerBox.removeChild(parent);
                })
                .catch((error) => {
                    console.log("Problem with deleting " + parent.id + " " + error.code + ":" + error.message);
                });

        } else {
            if (className == "subject_add_button") {
                const divBox = target.parentNode.parentNode;
                const subjectNameEditText = divBox.getElementsByClassName("subject_name_edit_text")[0];
                const subjectName = subjectNameEditText.value.trim();

                if (subjectName.length <= 0 || subjectName.length > subjectNameLength) {
                    alert("Subject Name length should be between 1 and " + subjectNameLength);
                    return;
                }

                if (subjectName.includes("❤")) {
                    alert("Subject Name cannot contain ❤");
                    return;
                }


                var key = push(ref(db, dbRef)).key + "❤" + subjectName;

                var json = {};
                json[key] = 0;

                addSubjectButton.style.visibility = "visible";
                update(ref(db, dbRef), json).then(() => {
                    divBox.id = key;
                    divBox.className = "subject_container";
                    divBox.innerHTML = '<p class="subject_name">' + subjectName + '</p>';

                    const editDivBox = document.createElement('div');
                    editDivBox.innerHTML = '<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
                    divBox.append(editDivBox);

                });

            } else if (className == "subject_cancel_button") {
                const divBox = target.parentNode.parentNode;
                const subjectListContainer = divBox.parentNode;
                subjectListContainer.removeChild(divBox);

                addSubjectButton.style.visibility = "visible";
            } else if (className == "edit_save_button") {
                const divTag = target.parentNode.parentNode;
                const newName = divTag.querySelector('.subject_name_edit_text').value.trim();
                const newKey = divTag.id.slice(0, divTag.id.indexOf('❤') + 1) + newName;


                if (newName.length <= 0 || newName.length > subjectNameLength) {
                    alert("Subject Name length should be between 1 and " + subjectNameLength);
                    return;
                }

                if (newName.includes("❤")) {
                    alert("Subject Name cannot contain ❤");
                    return;
                }

                if (newKey == divTag.id) {
                    divTag.innerHTML = '<p class="subject_name">' + newName + '</p>';
                    divTag.className = "subject_container";

                    const editDivBox = document.createElement('div');
                    editDivBox.innerHTML = '<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
                    divTag.append(editDivBox);
                    return;
                }


                get(child(ref(db), dbRef + divTag.id + "/")).then((data) => {
                    const content = data.val();
                    var json = {};
                    json[newKey] = content;

                    update(ref(db, dbRef), json)
                        .then(() => {
                            remove(ref(db, dbRef + divTag.id)).then(() => {
                                    console.log(divTag.id + " Deleted");

                                    divTag.id = newKey;
                                    divTag.innerHTML = '<p class="subject_name">' + newName + '</p>';
                                    divTag.className = "subject_container";

                                    const editDivBox = document.createElement('div');
                                    editDivBox.innerHTML = '<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
                                    divTag.append(editDivBox);

                                })
                                .catch((error) => {
                                    console.log("Problem with deleting " + divTag.id + " " + error.code + ":" + error.message);
                                });

                        }).catch((error) => {
                            console.log("Problem with updating " + newKey + " " + error.code + " " + error.message);
                        });

                });


            } else if (className == "edit_cancel_button") {
                const divTag = target.parentNode.parentNode;

                divTag.innerHTML = '<p class="subject_name">' + (divTag.id).slice(divTag.id.indexOf('❤') + 1) + '</p>';
                divTag.className = "subject_container";

                const editDivBox = document.createElement('div');
                editDivBox.innerHTML = '<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
                divTag.append(editDivBox);
            }
        }
    }
}

function addSubjectToUI(data) {

    const divBox = document.createElement('div');
    divBox.id = data.key;
    divBox.innerHTML = '<p class="subject_name">' + (data.key).slice(data.key.indexOf('❤') + 1) + '</p>';
    divBox.className = "subject_container";

    const editDivBox = document.createElement('div');
    editDivBox.innerHTML = '<input class="edit_button" type="button" value="Edit"/><br><input class="delete_button" type="button" value="Delete"/>';
    divBox.append(editDivBox);

    subjectListContainerBox.appendChild(divBox);
}

function getEventTarget(e) {
    if (!e) {
        e = window.event;
    }
    return e.target || e.srcElement;
}