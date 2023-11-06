
interface Todo {text: string, completed: boolean;}

const btn = document.getElementById("btn")!
const notesBtn = document.getElementById("notesBtn") as HTMLElement;
const deleteButton = document.getElementById("deletebutton")!;
const toggleButton = document.getElementById('toggleButton')!;
const todoBtn = document.getElementById('todoBtn')!;
const googleBtn = document.getElementById('googleBtn')!;
const allsvenskanFrame = document.getElementById("container-left")!;
const premierLeagueFrame = document.getElementById("container-right")!;

const body = document.body;
const googleInput = document.getElementById("googleInput")!;
const notes = document.getElementById("notes")!;
const textarea = document.getElementById("text") as HTMLTextAreaElement;
const donelist = document.getElementById('donelist')!;
const input = document.getElementById("input") as HTMLInputElement;
const form = document.querySelector("form");
const list = document.getElementById("todolist")!;
const todoElement = document.getElementById("todosDiv") as HTMLElement;
let todos: Todo[] = readTodos();
let doneTodos: Todo[] = readDoneTodos();

// API Varibles
const apiKey = "b45ab56a7amshabd17719adb902fp1c449ajsn1dbc27caf0c6";
const allsvenskanUrl = "https://api-football-v1.p.rapidapi.com/v3/standings?season=2023&league=113";
const plUrl = "https://api-football-v1.p.rapidapi.com/v3/standings?season=2023&league=39";
const allsvenskan = document.getElementById("allsvenskan")!;
const premierLeague = document.getElementById("pl")!;
const errorMess = document.getElementById("error")!;




//TODOS
todos.forEach(createTodo)
doneTodos.forEach(createDoneTodo);


// Create new todo
form?.addEventListener("submit", function(e) {
    e.preventDefault()

    const newTodo: Todo = {
        text: input.value,
        completed: false, 
    }

    createTodo(newTodo);
    todos.push(newTodo);

    //Store todo in local
    localStorage.setItem("todos", JSON.stringify(todos));
    saveTodos();
    input.value = "";
})

function createTodo (todo: Todo,  index: number) {
   
    const newLi = document.createElement("li");
 
    //Checkbox 
    const checkbox = document.createElement("input");
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
    
            
        } else {
            newLi.style.textDecoration = "none"; 
            newLi.style.opacity = "1"; 
        }

    });

    newLi.append(checkbox);
    newLi.append(todo.text);
    list.append(newLi);
}

//Donelist
function createDoneTodo (todo: Todo) {
    const newLi = document.createElement("li");
    newLi.style.textDecoration = "line-through";
    newLi.style.opacity = "0.4";
    newLi.textContent = todo.text;
    newLi.classList.add("padding");

    const doneList = document.getElementById("donelist");
    doneList?.appendChild(newLi);

    doneTodos.push(todo);
    saveDoneTodos();
}



//NOTES
const notesContent = localStorage.getItem('notesContent') || "";
textarea.value = notesContent;

textarea.addEventListener('input', saveNotes);


//FUNCTIONS 
function readTodos() {
    const todosJSON = localStorage.getItem("todos");
    if (todosJSON === null) return [];
    return JSON.parse(todosJSON);
    }
    
    function readDoneTodos() {
        const doneTodosJSON = localStorage.getItem("doneTodos");
        if (doneTodosJSON === null) return [];
        return JSON.parse(doneTodosJSON);
    }
    
    function saveTodos () {
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
notesBtn.addEventListener("click", function() {

    if (notes !== activeDiv) {

    if (activeDiv) {
        activeDiv.classList.remove("visible");
        activeDiv.classList.add("hidden");  
    }
   
    activeDiv = notes;
    notes.classList.remove("hidden");
    notes.classList.add("visible");  
} else { 
    activeDiv.classList.remove("visible");
    activeDiv.classList.add("hidden");
    activeDiv = null;
}
});

// Todo btn
todoBtn.addEventListener("click", function() {
    if (todoElement !== activeDiv) {
        if (activeDiv) {
            activeDiv.classList.remove("visible");
            activeDiv.classList.add("hidden");
            
        }
        activeDiv = todoElement;
        todoElement.classList.remove("hidden");
        todoElement.classList.add("visible"); 
    } else { 
        activeDiv.classList.remove("visible");
        activeDiv.classList.add("hidden");
        activeDiv = null;
    }
});

    
  // Google btn
  googleBtn.addEventListener("click", function() {
    if (googleInput !== activeDiv) {
        if (activeDiv) {
            activeDiv.classList.remove("visible");
            activeDiv.classList.add("hidden");
      
        }
        activeDiv = googleInput;
        googleInput.classList.remove("hidden");
        googleInput.classList.add("visible");
     
    } else { 
        activeDiv.classList.remove("visible");
        activeDiv.classList.add("hidden");
        activeDiv = null;
    }
});

//Donelist button
toggleButton.addEventListener('click', function () {
    if (donelist.style.display === 'none') {
      donelist.style.display = 'block';
    } else {
      donelist.style.display = 'none';
    }
  });
  
  //DeleteBtn
      deleteButton.addEventListener('click', function () {
          console.log("clicked!")
          localStorage.removeItem("doneTodos");
          doneTodos = [];
  
          
    const doneList = document.getElementById("donelist");
    while (doneList?.firstChild) {
      doneList.removeChild(doneList.firstChild);
    }
        
      });
  
  let activeDiv: HTMLElement | null = null;


    // Allsvenskan btn
       let allsvenskanIsHidden = true;

       allsvenskanFrame.addEventListener('click', function() {

        
        if(allsvenskanIsHidden){  
           fetchLeagueData(allsvenskanUrl, allsvenskan);
           allsvenskanFrame.classList.toggle("con-left-open")
           allsvenskanIsHidden = !allsvenskanIsHidden;
       }
           else {
               allsvenskanFrame.classList.remove("con-left-open")
               allsvenskanIsHidden = true;
           }
       });

        // Premier L btn
       let plIsHidden = true;

       premierLeagueFrame.addEventListener('click', function() {
        console.log("pl")
        if(plIsHidden){  
           fetchLeagueData(plUrl, premierLeague);
           premierLeagueFrame.classList.toggle("con-right-open")
           plIsHidden = !plIsHidden;
       }
           else {
               premierLeagueFrame.classList.remove("con-right-open")
               plIsHidden = true;
           }
       });



    // Fotball functions
    function fetchLeagueData(url: string, container: HTMLElement) {
        fetch(url, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": apiKey,
                "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com"
            }
        })
        .then(response => response.json())
        .then(data => populateTeams(data, container))
        .catch(error => {
            console.error(error);
            errorMess.textContent = "Ett fel uppstod vid hämtning av ställning från API:et.";
        });
    }

  
    function populateTeams(data;, container: HTMLElement) {
        const standings = data.response[0].league.standings[0];
        standings.forEach(standing => {
            const teamData = standing.team;
            const rank = standing.rank;
            const teamName = teamData.name;
            const points = standing.points;
            const logo = teamData.logo;
        
            const teamElement = document.createElement("div");
            teamElement.classList.add("team");
            teamElement.dataset.teamid = teamData.id; 
        
            teamElement.innerHTML = `
                <div class="rank">${rank}</div>
                <img class="logo"src="${logo}" alt="#">
                <div class="name">${teamName}</div>
                <div class="points">${points}</div>
            `;
            container.appendChild(teamElement);
        });
    }



        