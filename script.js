const inputField = document.querySelector(".input");
const addBtn = document.querySelector(".add");
const updateBtn = document.querySelector('.update');
const taskSection = document.querySelector(".tasks-section");
const allOptionsBtns = document.querySelectorAll(".option-btn");

const completeShow = document.querySelector(".complete-show");
const activeShow = document.querySelector(".active-show");
const allShow = document.querySelector(".all-show");
const clearCompleted = document.querySelector(".clear-completed");

const allTasksCount = document.querySelector(".all-count");
const activeTasksCount = document.querySelector(".active-count");
const completedTasksCount = document.querySelector(".completed-count");
let allOrActiveOrComplete = "All";

let isUpdating = false;

function backgroundChange(buttonName) {
    allOptionsBtns.forEach((ele) => (ele.style.backgroundColor = "#023047"));
    buttonName.style.backgroundColor = "#fca311";
}

function htmlCreation(section, timedate, task, iscomplete) {
    const taskCard = document.createElement("div");
    taskCard.setAttribute("class", "tasks p-3 my-2");
    taskCard.setAttribute("id", timedate);

    const currentTime = document.createElement("p");
    currentTime.setAttribute("class", "current-time");
    currentTime.innerText = timedate;
    const taskDescription = document.createElement("p");
    taskDescription.setAttribute(
        "class",
        "task-description text-nowrap overflow-scroll"
    );
    taskDescription.setAttribute("data-taskid", timedate);
    taskDescription.innerText = task;
    taskCard.append(currentTime, taskDescription);

    const editDeleteCompleteBtn = document.createElement("div");
    editDeleteCompleteBtn.setAttribute(
        "class",
        "d-flex align-items-center gap-4"
    );
    const deleteBtn = document.createElement("img");
    deleteBtn.setAttribute("src", "./images/delete.svg");
    deleteBtn.setAttribute("alt", "delete...");
    deleteBtn.setAttribute("class", "delete-btn mx-1 text-white");
    deleteBtn.setAttribute("data-deletetimedate", timedate);
    if (!iscomplete) {
        const editBtn = document.createElement("img");
        editBtn.setAttribute("src", "./images/edit.svg");
        editBtn.setAttribute("alt", "edit...");
        editBtn.setAttribute("class", "edit-btn mx-1 text-white");
        editBtn.setAttribute("data-edittimedate", timedate);
        editDeleteCompleteBtn.append(editBtn);
    }
    const completeBtn = document.createElement("button");
    completeBtn.setAttribute("class", "complete-btn mx-1 text-white");
    completeBtn.setAttribute("data-completetimedate", timedate);
    completeBtn.innerText = "Complete";
    if (iscomplete) {
        taskDescription.style.textDecorationLine = "line-through";
        completeBtn.innerText = "Completed";
        completeBtn.style.backgroundColor = "#8ac926";
    }
    editDeleteCompleteBtn.append(deleteBtn, completeBtn);
    taskCard.append(editDeleteCompleteBtn);
    section.prepend(taskCard);
}

function addTask(taskSection, taskObj) {
    htmlCreation(taskSection, taskObj.time, taskObj.task, taskObj.iscomplete);
}

function editTask(editTaskId) {
    isUpdating = true;
    const currentTask = document.getElementById(editTaskId);
    const taskText = currentTask.querySelector('.task-description');
    inputField.value = taskText.innerText;
    addBtn.style.display = "none";
    updateBtn.style.display = "block";
    updateBtn.setAttribute('data-updatebtn', editTaskId);
}

function deleteTask(deleteTaskId) {
    let addedTasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
    const deleteIndex = addedTasks.findIndex((ele) => ele.time === deleteTaskId);
    if (addedTasks[deleteIndex].iscomplete)
        completedTasksCount.innerText = Number(completedTasksCount.innerText) - 1;
    else activeTasksCount.innerText = Number(activeTasksCount.innerText) - 1;
    addedTasks.splice(deleteIndex, 1);
    allTasksCount.innerText = addedTasks.length;
    localStorage.setItem("todoTasks", JSON.stringify(addedTasks));
    taskSection.removeChild(document.getElementById(deleteTaskId));
}

function completeTask(completeTaskId) {
    const currentTask = document.getElementById(completeTaskId);
    const completeBtn = currentTask.querySelector(".complete-btn");
    const editBtn = currentTask.querySelector('.edit-btn');
    const taskDescription = currentTask.querySelector(".task-description");
    let addedTasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
    const completeIndex = addedTasks.findIndex(
        (ele) => ele.time === completeTaskId
    );
    if (addedTasks[completeIndex].iscomplete) {
        taskDescription.style.textDecorationLine = "none";
        completeBtn.style.backgroundColor = "#023047";
        completeBtn.innerText = "Complete";
        addedTasks[completeIndex].iscomplete = false;
        if (allOrActiveOrComplete === "All") editBtn.style.display = "block";
        if (allOrActiveOrComplete === "Complete") taskSection.removeChild(currentTask);
        if (allOrActiveOrComplete === "All" || allOrActiveOrComplete === "Complete") {
            activeTasksCount.innerText = Number(activeTasksCount.innerText) + 1;
            completedTasksCount.innerText = Number(completedTasksCount.innerText) - 1;
        }
    } else {
        taskDescription.style.textDecorationLine = "line-through";
        completeBtn.style.backgroundColor = "#8ac926";
        completeBtn.innerText = "Completed";
        addedTasks[completeIndex].iscomplete = true;
        if(allOrActiveOrComplete === "All") editBtn.style.display = "none";
        if (allOrActiveOrComplete === "Active")
            taskSection.removeChild(currentTask);
        if (allOrActiveOrComplete === "All" || allOrActiveOrComplete === "Active") {
            activeTasksCount.innerText = Number(activeTasksCount.innerText) - 1;
            completedTasksCount.innerText = Number(completedTasksCount.innerText) + 1;
        }
    }
    localStorage.setItem("todoTasks", JSON.stringify(addedTasks));
}

addBtn.addEventListener("click", () => {
    let taskText = inputField.value.trim();
    if (taskText === "") {
        alert("Add Something!");
        return;
    }
    let addedTasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
    let timedate = new Date().toString();
    timedate = timedate.substring(0, timedate.length - 31);
    let index = addedTasks.findIndex((ele) => ele.task === taskText);
    if (index >= 0) {
        alert("Task is already added in your todo list.");
        inputField.value = "";
        return;
    } else {
        const obj = {
            time: timedate,
            task: taskText,
            iscomplete: false,
        };
        addedTasks.push(obj);
        allTasksCount.innerText = addedTasks.length;
        activeTasksCount.innerText = Number(activeTasksCount.innerText) + 1;
        addTask(taskSection, obj);
        localStorage.setItem("todoTasks", JSON.stringify(addedTasks));
    }
    inputField.value = "";
});

taskSection.addEventListener("click", (e) => {
    if (e.target.className.includes("delete-btn")) {
        const deleteBtnId = e.target.dataset.deletetimedate;
        const deleteTaskId = deleteBtnId;
        deleteTask(deleteTaskId);
    }
    if (e.target.className.includes("complete-btn")) {
        const completeBtnId = e.target.dataset.completetimedate;
        const completeTaskId = completeBtnId;
        completeTask(completeTaskId);
    }
    if (e.target.className.includes("edit-btn")) {
        const editBtnId = e.target.dataset.edittimedate;
        const editTaskId = editBtnId;
        editTask(editTaskId);
    }
});

window.addEventListener("load", () => {
    const addedTasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
    let completeCnt = 0;
    addedTasks.forEach((ele) => {
        if (ele.iscomplete) completeCnt++;
        addTask(taskSection, ele);
    });
    allTasksCount.innerText = addedTasks.length;
    completedTasksCount.innerText = completeCnt;
    activeTasksCount.innerText = addedTasks.length - completeCnt;
});

window.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        if(!isUpdating) addBtn.click();
        if(isUpdating) updateBtn.click();

        isUpdating = false;
    }
});

completeShow.addEventListener("click", () => {
    backgroundChange(completeShow);
    allOrActiveOrComplete = "Complete";
    taskSection.innerHTML = "";
    let completeCnt = 0;
    const addedTasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
    addedTasks.forEach((ele) => {
        if (ele.iscomplete) {
            htmlCreation(taskSection, ele.time, ele.task, ele.iscomplete);
            completeCnt++;
        }
    });
    completedTasksCount.innerText = completeCnt;
});

activeShow.addEventListener("click", () => {
    backgroundChange(activeShow);
    allOrActiveOrComplete = "Active";
    taskSection.innerHTML = "";
    let activeCnt = 0;
    const addedTasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
    addedTasks.forEach((ele) => {
        if (!ele.iscomplete) {
            htmlCreation(taskSection, ele.time, ele.task, false);
            activeCnt++;
        }
    });
    activeTasksCount.innerText = activeCnt;
});

allShow.addEventListener("click", () => {
    backgroundChange(allShow);
    allOrActiveOrComplete = "All";
    taskSection.innerHTML = "";
    const addedTasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
    addedTasks.forEach((ele) =>
        htmlCreation(taskSection, ele.time, ele.task, ele.iscomplete)
    );
    allTasksCount.innerText = addedTasks.length;
});

clearCompleted.addEventListener("click", () => {
    backgroundChange(clearCompleted);
    taskSection.innerHTML = "";
    let addedTasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
    addedTasks = addedTasks.filter((ele) => ele.iscomplete === false);
    allTasksCount.innerText = addedTasks.length;
    completedTasksCount.innerText = 0;
    localStorage.setItem("todoTasks", JSON.stringify(addedTasks));
});

updateBtn.addEventListener('click', (e) => {
    isUpdating = false;
    const updateTaskId = e.target.dataset.updatebtn;
    const updateTask = document.getElementById(updateTaskId);
    const updateText = updateTask.querySelector('.task-description');
    let addedTasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');
    addedTasks.forEach(ele => {
        if (ele.time === updateTaskId) ele.task = inputField.value;
    });
    localStorage.setItem('todoTasks', JSON.stringify(addedTasks));
    updateText.innerText = inputField.value;
    updateBtn.style.display = "none";
    addBtn.style.display = "block";
    inputField.value = "";
})