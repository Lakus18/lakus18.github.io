const locationButton = document.querySelector("#get_location");

locationButton.addEventListener("click", function() {
  if (navigator.geolocation) {
    console.log("Pobieranie zgody...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log(`Obecna lokalizacja: ${lat}, ${lon}`);

        loadMap(lat, lon);
      },
      (error) => {
        console.error("Błąd przy pobieraniu lokalizacji: ", error.message);
      }
    );

  } else {
    alert("Przeglądarka nie obsługuje lokalizacji");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  prepareBoard();

  if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("Powiadomienia włączone");
      } else {
        console.log("Powiadomienia odrzucone");
      }
    });
  } else {
  console.log("Super masz przeglądarkę")
    }
});


console.log("Leaflet: ", typeof L);
let map;

function loadMap(lat, lon) {
  map = L.map(document.querySelector(".map-container")).setView([lat, lon], 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([lat, lon]).addTo(map)
}


const saveButton = document.querySelector("#save_map")

saveButton.addEventListener("click", () => {
  console.log("Zapisywanie mapy...");

  const mapContainer = document.querySelector(".map-container");
  console.log("Map container: ", mapContainer);

  if (!map) {
    alert("Pobierz lokalizację");
    return;
  }

  console.log("Mapa znaleziona");

  setTimeout(() => {
    const mapElement = document.querySelector(".map-container");

    html2canvas(mapElement, {
      backgroundColor: "#fff",
      scale: 1,
      useCORS: true,
      allowTaint: true,
      logging: false
    }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      console.log("Obraz gotowy");
      createPuzzles(imgData);
    }).catch(error => {
      console.error("Błąd:", error);
    });
  }, 2000);
});


function prepareBoard() {
  const puzzleBoard = document.querySelector(".puzzle-board");
  puzzleBoard.innerHTML = "";

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const slot = document.createElement("div");
      slot.classList.add("slot");
      slot.dataset.targetRow = String(row);
      slot.dataset.targetCol = String(col);
      puzzleBoard.appendChild(slot);
    }
  }
}


let correctCount = 0;

function createPuzzles(imgData) {
  const puzzleContainer = document.querySelector(".puzzle-container");
  puzzleContainer.innerHTML = "";
  correctCount = 0;

  const pieces = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const piece = document.createElement("div");

      piece.classList.add("puzzle-piece");
      piece.style.backgroundImage = `url(${imgData})`;
      piece.style.backgroundPosition = `${-col * 150}px ${-row * 150}px`;
      piece.dataset.row = String(row);
      piece.dataset.col = String(col);
      piece.draggable = true;

      piece.addEventListener("dragstart", dragging => {
        dragging.dataTransfer.effectAllowed = "move";
        dragging.dataTransfer.setData("text/plain", `${row}-${col}`);

        const parentSlot = piece.parentElement;
        if (parentSlot && parentSlot.dataset.isCorrect === "true") {
          dragging.dataTransfer.setData("wasCorrect", "true");
        }
      });
    pieces.push(piece);
    }
  }

  pieces.sort(() => Math.random() - 0.5);
  pieces.forEach(piece => puzzleContainer.appendChild(piece));

  const puzzleBoard = document.querySelector(".puzzle-board");
  puzzleBoard.addEventListener("dragover", (dragged) => dragged.preventDefault());
  puzzleBoard.addEventListener("drop", (dropped) => {
    dropped.preventDefault();

    const data = dropped.dataTransfer.getData("text/plain");
    const [row, col] = data.split("-").map(Number);
    const piece = document.querySelector(`.puzzle-piece[data-row="${row}"][data-col="${col}"]`);
    const wasCorrect = dropped.dataTransfer.getData("wasCorrect") === "true";


    if (piece) {
      const targetSlot = document.elementFromPoint(dropped.clientX, dropped.clientY);
      if (targetSlot && targetSlot.classList.contains("slot")) {
        const isCorrect =
          piece.dataset.row === targetSlot.dataset.targetRow &&
          piece.dataset.col === targetSlot.dataset.targetCol;

        if (wasCorrect) {
          correctCount--;
          console.log("-1")
        }


        targetSlot.innerHTML = "";
        targetSlot.appendChild(piece);

        if (isCorrect) {
          console.log("+1");
          console.log("Dobrze")
          correctCount++;
          targetSlot.dataset.isCorrect = "true";
        } else {
          console.log("Źle");
          targetSlot.dataset.isCorrect = "false";
        }

        if (puzzleContainer.children.length === 0) {
          console.log("Koniec");
          console.log(`Wynik: ${correctCount}/16`);
          showNotification();
        }

      }
    }

  });
}


function dragHandler(piece, row, col) {
  piece.addEventListener("dragstart", dragging => {
    dragging.dataTransfer.effectAllowed = "move";
    dragging.dataTransfer.setData("text/plain", `${row}-${col}`);
  });
}


function showNotification() {
  setTimeout(() => {
    alert(`Koniec!\n\nWynik: ${correctCount}/16`);
  }, 500);
}
