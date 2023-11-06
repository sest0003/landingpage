"use strict";
var btn = document.getElementById("btn");
var notesBtn = document.getElementById("notesBtn");
var deleteButton = document.getElementById("deletebutton");
var toggleButton = document.getElementById('toggleButton');
var todoBtn = document.getElementById('todoBtn');
var googleBtn = document.getElementById('googleBtn');
var allsvenskanFrame = document.getElementById("container-left");
var premierLeagueFrame = document.getElementById("container-right");
var body = document.body;
var googleInput = document.getElementById("googleInput");
var notes = document.getElementById("notes");
var textarea = document.getElementById("text");
var donelist = document.getElementById('donelist');
var input = document.getElementById("input");
var form = document.querySelector("form");
var list = document.getElementById("todolist");
var todoElement = document.getElementById("todosDiv");
var todos = readTodos();
var doneTodos = readDoneTodos();
// API Varibles
var apiKey = "b45ab56a7amshabd17719adb902fp1c449ajsn1dbc27caf0c6";
var allsvenskanUrl = "https://api-football-v1.p.rapidapi.com/v3/standings?season=2023&league=113";
var plUrl = "https://api-football-v1.p.rapidapi.com/v3/standings?season=2023&league=39";
var allsvenskan = document.getElementById("allsvenskan");
var premierLeague = document.getElementById("pl");
var errorMess = document.getElementById("error");
//TODOS
todos.forEach(createTodo);
doneTodos.forEach(createDoneTodo);
// Create new todo
form === null || form === void 0 ? void 0 : form.addEventListener("submit", function (e) {
    e.preventDefault();
    var newTodo = {
        text: input.value,
        completed: false,
    };
    createTodo(newTodo);
    todos.push(newTodo);
    //Store todo in local
    localStorage.setItem("todos", JSON.stringify(todos));
    saveTodos();
    input.value = "";
});
function createTodo(todo, index) {
    var newLi = document.createElement("li");
    //Checkbox 
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", function () {
        todo.completed = checkbox.checked;
        saveTodos();
        if (todo.completed) {
            newLi.style.textDecoration = "line-through";
            newLi.style.opacity = "0.4";
            createDoneTodo(todo);
            saveTodos();
            saveDoneTodos();
            todos.splice(index, 1);
            list.removeChild(newLi);
        }
        else {
            newLi.style.textDecoration = "none";
            newLi.style.opacity = "1";
        }
    });
    newLi.append(checkbox);
    newLi.append(todo.text);
    list.append(newLi);
}
//Donelist
function createDoneTodo(todo) {
    var newLi = document.createElement("li");
    newLi.style.textDecoration = "line-through";
    newLi.style.opacity = "0.4";
    newLi.textContent = todo.text;
    newLi.classList.add("padding");
    var doneList = document.getElementById("donelist");
    doneList === null || doneList === void 0 ? void 0 : doneList.appendChild(newLi);
    doneTodos.push(todo);
    saveDoneTodos();
}
//NOTES
var notesContent = localStorage.getItem('notesContent') || "";
textarea.value = notesContent;
textarea.addEventListener('input', saveNotes);
//FUNCTIONS 
function readTodos() {
    var todosJSON = localStorage.getItem("todos");
    if (todosJSON === null)
        return [];
    return JSON.parse(todosJSON);
}
function readDoneTodos() {
    var doneTodosJSON = localStorage.getItem("doneTodos");
    if (doneTodosJSON === null)
        return [];
    return JSON.parse(doneTodosJSON);
}
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}
function saveDoneTodos() {
    localStorage.setItem("doneTodos", JSON.stringify(doneTodos));
}
function saveNotes() {
    localStorage.setItem('notesContent', textarea.value);
}
// BUTTONS
// Notes btn
notesBtn.addEventListener("click", function () {
    if (notes !== activeDiv) {
        if (activeDiv) {
            activeDiv.classList.remove("visible");
            activeDiv.classList.add("hidden");
        }
        activeDiv = notes;
        notes.classList.remove("hidden");
        notes.classList.add("visible");
    }
    else {
        activeDiv.classList.remove("visible");
        activeDiv.classList.add("hidden");
        activeDiv = null;
    }
});
// Todo btn
todoBtn.addEventListener("click", function () {
    if (todoElement !== activeDiv) {
        if (activeDiv) {
            activeDiv.classList.remove("visible");
            activeDiv.classList.add("hidden");
        }
        activeDiv = todoElement;
        todoElement.classList.remove("hidden");
        todoElement.classList.add("visible");
    }
    else {
        activeDiv.classList.remove("visible");
        activeDiv.classList.add("hidden");
        activeDiv = null;
    }
});
// Google btn
googleBtn.addEventListener("click", function () {
    if (googleInput !== activeDiv) {
        if (activeDiv) {
            activeDiv.classList.remove("visible");
            activeDiv.classList.add("hidden");
        }
        activeDiv = googleInput;
        googleInput.classList.remove("hidden");
        googleInput.classList.add("visible");
    }
    else {
        activeDiv.classList.remove("visible");
        activeDiv.classList.add("hidden");
        activeDiv = null;
    }
});
//Donelist button
toggleButton.addEventListener('click', function () {
    if (donelist.style.display === 'none') {
        donelist.style.display = 'block';
    }
    else {
        donelist.style.display = 'none';
    }
});
//DeleteBtn
deleteButton.addEventListener('click', function () {
    console.log("clicked!");
    localStorage.removeItem("doneTodos");
    doneTodos = [];
    var doneList = document.getElementById("donelist");
    while (doneList === null || doneList === void 0 ? void 0 : doneList.firstChild) {
        doneList.removeChild(doneList.firstChild);
    }
});
var activeDiv = null;
// Allsvenskan btn
var allsvenskanIsHidden = true;
allsvenskanFrame.addEventListener('click', function () {
    if (allsvenskanIsHidden) {
        fetchLeagueData(allsvenskanUrl, allsvenskan);
        allsvenskanFrame.classList.toggle("con-left-open");
        allsvenskanIsHidden = !allsvenskanIsHidden;
    }
    else {
        allsvenskanFrame.classList.remove("con-left-open");
        allsvenskanIsHidden = true;
    }
});
// Premier L btn
var plIsHidden = true;
premierLeagueFrame.addEventListener('click', function () {
    console.log("pl");
    if (plIsHidden) {
        fetchLeagueData(plUrl, premierLeague);
        premierLeagueFrame.classList.toggle("con-right-open");
        plIsHidden = !plIsHidden;
    }
    else {
        premierLeagueFrame.classList.remove("con-right-open");
        plIsHidden = true;
    }
});
// Fotball functions
function fetchLeagueData(url, container) {
    fetch(url, {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com"
        }
    })
        .then(function (response) { return response.json(); })
        .then(function (data) { return populateTeams(data, container); })
        .catch(function (error) {
        console.error(error);
        errorMess.textContent = "Ett fel uppstod vid hämtning av ställning från API:et.";
    });
}
function populateTeams(data, container) {
    var standings = data.response[0].league.standings[0];
    standings.forEach(function (standing) {
        var teamData = standing.team;
        var rank = standing.rank;
        var teamName = teamData.name;
        var points = standing.points;
        var logo = teamData.logo;
        var teamElement = document.createElement("div");
        teamElement.classList.add("team");
        teamElement.dataset.teamid = teamData.id;
        teamElement.innerHTML = "\n                <div class=\"rank\">".concat(rank, "</div>\n                <img class=\"logo\"src=\"").concat(logo, "\" alt=\"#\">\n                <div class=\"name\">").concat(teamName, "</div>\n                <div class=\"points\">").concat(points, "</div>\n            ");
        container.appendChild(teamElement);
    });
}
