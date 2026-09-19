const inp = document.getElementById("inp");
const btn = document.getElementById("btn");
const result = document.getElementById("result");
const dll = document.getElementById("dll");
const filter = document.getElementById("filter");
const search = document.getElementById("search");

// القائمة تبدأ فارغة أو تأخذ البيانات المحفوظة سابقاً
let list = JSON.parse(localStorage.getItem("list")) || [];

function save() {
  localStorage.setItem("list", JSON.stringify(list));
}

let flstat = "All";
filter.classList.add("filter-btn");

filter.addEventListener("click", () => {
  if (flstat === "All") {
    flstat = "Completed";
    filter.textContent = "Completed";
  } else if (flstat === "Completed") {
    flstat = "NCompleted";
    filter.textContent = "Not Completed";
  } else {
    flstat = "All";
    filter.textContent = "All";
  }
  display();
});

let srstat = false;
search.addEventListener("click", () => {
  srstat = !srstat;

  if (srstat) {
    search.classList.add("active-search");
    inp.placeholder = "Search tasks";
    inp.focus();
  } else {
    search.classList.remove("active-search");
    inp.placeholder = "Add a new task";
    inp.value = "";
  }
  display();
});

// البحث الفوري أثناء الكتابة
inp.addEventListener("input", () => {
  display();
});

// دالة العرض الرئيسية
function display() {
  result.innerHTML = "";
  const query = inp.value.trim().toLowerCase();

  const filteredlist = list.filter((item) => {
    // تصفية الحالة (All / Completed / Not Completed)
    let statusMatch = true;
    if (flstat === "Completed") statusMatch = item.completed;
    if (flstat === "NCompleted") statusMatch = !item.completed;

    // تصفية البحث (تنفيذ البحث فقط إذا كان زر البحث مفعلاً)
    let searchMatch = true;
    if (srstat && query !== "") {
      searchMatch = item.text.toLowerCase().includes(query);
    }

    return statusMatch && searchMatch;
  });

  if (filteredlist.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent =
      list.length === 0 ? "No tasks yet!" : "No tasks found!";
    emptyMsg.style.color = "rgba(255, 255, 255, 0.5)";
    emptyMsg.style.fontSize = "20px";
    emptyMsg.style.marginTop = "20px";
    emptyMsg.style.fontWeight = "bold";
    result.appendChild(emptyMsg);
    return;
  }

  filteredlist.forEach((item) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("taskdiv");

    // إنشاء زر الـ Checkmark
    const checkBtn = document.createElement("button");
    checkBtn.classList.add("check-btn");
    checkBtn.textContent = item.completed ? "✓" : "";
    if (item.completed) {
      checkBtn.classList.add("completed-btn");
    }

    checkBtn.addEventListener("click", () => {
      item.completed = !item.completed;
      save();
      display();
    });

    // إنشاء عنصر الـ Label
    const label = document.createElement("label");
    label.classList.add("task");
    label.textContent = item.text;
    label.addEventListener("click", () => {
      item.completed = !item.completed;
      save();
      display();
    });

    // تطبيق التنسيق إذا كانت المهمة مكتملة
    if (item.completed) {
      label.style.textDecoration = "line-through";
      label.style.opacity = "0.6";
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "-";

    deleteBtn.addEventListener("click", () => {
      list = list.filter((task) => item.id !== task.id);
      save();
      display();
    });

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", () => {
      const inpe = document.createElement("input");
      inpe.type = "text";
      inpe.value = item.text;
      taskDiv.replaceChild(inpe, label);

      inpe.focus();

      let isCancelled = false;

      inpe.addEventListener("blur", () => {
        if (isCancelled) return;

        const newText = inpe.value.trim();
        if (newText !== "") {
          item.text = newText;
          save();
        }
        display();
      });

      inpe.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          inpe.blur();
        } else if (e.key === "Escape") {
          isCancelled = true;
          display();
        }
      });
    });

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);

    taskDiv.appendChild(checkBtn);
    taskDiv.appendChild(label);
    taskDiv.appendChild(btnContainer);
    result.appendChild(taskDiv);
  });
}

btn.addEventListener("click", () => {
  const value = inp.value.trim();
  if (value) {
    const task = {
      id: Date.now(),
      text: value,
      completed: false,
    };
    list.push(task);
    save();
    inp.value = "";
    display();
    inp.focus();
  }
});

inp.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    btn.click();
  }
});

let isConfirming = false;
let intervalId = null;

function resetBtn() {
  clearInterval(intervalId);
  isConfirming = false;
  dll.textContent = "Delete All";
}

dll.addEventListener("click", () => {
  if (!isConfirming) {
    isConfirming = true;
    let seconds = 3;
    dll.textContent = `Are you sure? (${seconds}s)`;

    intervalId = setInterval(() => {
      seconds--;
      if (seconds > 0) {
        dll.textContent = `Are you sure? (${seconds}s)`;
      } else {
        resetBtn();
      }
    }, 1000);
  } else {
    if (flstat === "Completed") {
      list = list.filter((item) => !item.completed);
    } else if (flstat === "NCompleted") {
      list = list.filter((item) => item.completed);
    } else {
      list = [];
    }

    resetBtn();
    save();
    display();
  }
});

display();
