const inp = document.getElementById("inp");
const btn = document.getElementById("btn");
const result = document.getElementById("result");
const dll = document.getElementById("dll");

let list = JSON.parse(localStorage.getItem("list")) || [];

function save() {
  localStorage.setItem("list", JSON.stringify(list));
}

function display() {
  result.innerHTML = "";

  list.forEach((item) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("taskdiv");

    const label = document.createElement("label");
    label.classList.add("task");
    label.textContent = item.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "-";

    deleteBtn.addEventListener("click", () => {
      list = list.filter((task) => item.id !== task.id);
      save();
      display();
    });

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn"); // إضافة كلاس الـ CSS
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", () => {
      const inpe = document.createElement("input");
      inpe.type = "text";
      inpe.value = item.text;
      taskDiv.replaceChild(inpe, label);

      inpe.focus();

      inpe.addEventListener("blur", () => {
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
        }
      });
    });

    // حاوية للأزرار لضمان محاذاتها بـ CSS
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);

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
    list = [];
    save();
    display();
    resetBtn();
  }
});

display();
