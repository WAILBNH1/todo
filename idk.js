const inp = document.getElementById("inp");
const btn = document.getElementById("btn");
const result = document.getElementById("result");

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

    taskDiv.appendChild(label);
    taskDiv.appendChild(deleteBtn);
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

display();
