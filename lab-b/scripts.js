class Todo {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("todo_tasks")) || [
      { id: 1, text: "Mleko", date: "" },
      { id: 2, text: "Płatki", date: "" },
      { id: 3, text: "Banany", date: "" }
    ];
    this.term = "";
    this.draw();
  }

  get filteredTasks() {
    const searchText = this.term.toLowerCase();
    if (searchText.length < 2) return this.tasks;

    return this.tasks.filter(task =>
      task.text.toLowerCase().includes(searchText)
    );
  }

  save() {
    localStorage.setItem("todo_tasks", JSON.stringify(this.tasks));
  }

  add(text, date) {
    const cleanText = text.trim();
    if (cleanText.length < 3 || cleanText.length > 255) {
      alert("Zadanie musi mieć od 3 do 255 znaków");
      return;
    }
    if (date) {
      const d = new Date(date);
      if (isNaN(d.getTime()) || d < new Date() || d.getFullYear() > 3000) {
        alert("Podaj poprawną datę z przyszłości (max rok 3000)");
        return;
      }
    }
    this.tasks.push({ id: Date.now(), text: cleanText, date: date });
    this.save();
    this.draw();
  }

  remove(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.save();
    this.draw();
  }

  update(id, newText, newDate) {
    const task = this.tasks.find(t => t.id === id);
    if (task && newText.trim().length >= 3) {
      task.text = newText.trim();
      task.date = newDate;
      this.save();
    }
    this.draw();
  }

  search(query) {
    this.term = query.trim();
    this.draw();
  }

  draw() {
    const listElement = document.getElementById("groceryList");
    listElement.innerHTML = "";

    this.filteredTasks.forEach(task => {
      const li = document.createElement("li");

      let displayText = task.text;
      const searchText = this.term.toLowerCase();

      if (searchText.length >= 2) {
        const reg = new RegExp(`(${searchText})`, "gi");
        displayText = displayText.replace(reg, '<span class="highlight">$1</span>');
      }

      const d = task.date ? new Date(task.date) : null;
      const dateStr = (d && !isNaN(d.getTime())) ? ` | Termin: ${d.toLocaleString()}` : "";

      li.innerHTML = `
        <span class="item-text" onclick="document.todo.enterEditMode(event, ${task.id})">
          <span class="task-name">${displayText}</span><span class="task-date">${dateStr}</span>
        </span>
        <button class="delete_button" onclick="document.todo.remove(${task.id})">🗑</button>
      `;
      listElement.appendChild(li);
    });
  }

  enterEditMode(event, id) {
    const itemSpan = event.target.closest(".item-text");
    if (!itemSpan || itemSpan.querySelector("input")) return;

    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    itemSpan.style.display = "flex";
    itemSpan.style.gap = "10px";
    itemSpan.style.width = "100%";

    itemSpan.innerHTML = `
      <input type="text" class="edit-input" value="${task.text}" style="flex: 2; min-width: 0;">
      <input type="datetime-local" class="edit-date" value="${task.date}" style="flex: 3; min-width: 0;">
    `;

    const iName = itemSpan.querySelector(".edit-input");
    const iDate = itemSpan.querySelector(".edit-date");
    iName.focus();

    const save = (e) => {
      if (e && e.relatedTarget && (e.relatedTarget === iName || e.relatedTarget === iDate)) return;
      this.update(id, iName.value, iDate.value);
    };

    iName.onblur = save; iDate.onblur = save;
    iName.onkeydown = (e) => { if(e.key === "Enter") save(); };
    iDate.onkeydown = (e) => { if(e.key === "Enter") save(); };
  }
}

document.todo = new Todo();

document.getElementById("listAdd").onclick = () => {
  const t = document.getElementById("listText"), d = document.getElementById("listDate");
  document.todo.add(t.value, d.value);
  t.value = ""; d.value = "";
};

document.getElementById("searchInput").oninput = (e) => {
  document.todo.search(e.target.value);
};
