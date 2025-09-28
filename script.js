// Intel Event Check-In System

const attendeeCountEl = document.getElementById("attendeeCount");
const progressBarEl = document.getElementById("progressBar");
const greetingEl = document.getElementById("greeting");
const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};
const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};
const goal = 50;
let attendees = [];
let attendeeCount = 0;
let celebrationShown = false;

function loadData() {
  const savedAttendees = localStorage.getItem("attendees");
  const savedTeamCounts = localStorage.getItem("teamCounts");
  attendeeCount = parseInt(localStorage.getItem("attendeeCount")) || 0;
  celebrationShown = localStorage.getItem("celebrationShown") === "true";
  if (savedAttendees) {
    attendees = JSON.parse(savedAttendees);
  }
  if (savedTeamCounts) {
    const counts = JSON.parse(savedTeamCounts);
    teamCounts.water = counts.water || 0;
    teamCounts.zero = counts.zero || 0;
    teamCounts.power = counts.power || 0;
  }
}

function saveData() {
  localStorage.setItem("attendees", JSON.stringify(attendees));
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendeeCount", attendeeCount);
  localStorage.setItem("celebrationShown", celebrationShown);
}

function updateCounts() {
  attendeeCountEl.textContent = attendeeCount;
  updateProgressBar();
  updateTeamDisplay();
}

function updateProgressBar() {
  const percent = Math.min((attendeeCount / goal) * 100, 100);
  progressBarEl.style.width = `${percent}%`;
  if (percent === 100 && !celebrationShown) {
    showCelebration();
  }
}

function showGreeting(name, team) {
  console.log("showGreeting called with:", name, team);
  greetingEl.style.display = "block";
  greetingEl.style.position = "relative";
  greetingEl.style.zIndex = "1000";
  greetingEl.style.opacity = "1";
  greetingEl.style.background = "#eaf6ff";
  greetingEl.style.border = "2px solid #00c7fd";
  greetingEl.style.borderRadius = "8px";
  greetingEl.style.padding = "16px";
  greetingEl.style.marginBottom = "16px";
  greetingEl.style.textAlign = "center";
  greetingEl.style.fontWeight = "bold";
  greetingEl.style.fontSize = "1.2em";
  greetingEl.style.transition = "opacity 1s";
  greetingEl.innerHTML = `🎉 <strong>Welcome, ${name} from ${teamNames[team]}!</strong>`;
  setTimeout(function () {
    greetingEl.style.opacity = "0";
  }, 4000);
  setTimeout(function () {
    greetingEl.innerHTML = "";
    greetingEl.style.opacity = "1";
    greetingEl.style.display = "";
    greetingEl.removeAttribute("style");
  }, 5000);
}

function showCelebration() {
  celebrationShown = true;
  let winningTeam = "water";
  if (
    teamCounts.zero > teamCounts.water &&
    teamCounts.zero > teamCounts.power
  ) {
    winningTeam = "zero";
  } else if (
    teamCounts.power > teamCounts.water &&
    teamCounts.power > teamCounts.zero
  ) {
    winningTeam = "power";
  }
  greetingEl.style.display = "block";
  greetingEl.style.position = "relative";
  greetingEl.style.zIndex = "1000";
  greetingEl.style.opacity = "1";
  greetingEl.style.background = "#eaf6ff";
  greetingEl.style.border = "2px solid #00c7fd";
  greetingEl.style.borderRadius = "8px";
  greetingEl.style.padding = "16px";
  greetingEl.style.marginBottom = "16px";
  greetingEl.style.textAlign = "center";
  greetingEl.style.fontWeight = "bold";
  greetingEl.style.fontSize = "1.2em";
  greetingEl.style.transition = "opacity 1s";
  greetingEl.innerHTML = `🎉 Attendance goal reached! <strong>${teamNames[winningTeam]}</strong> wins! 🎉`;
  // Highlight winning team
  var teamEls = document.querySelectorAll(".team-card");
  for (var i = 0; i < teamEls.length; i++) {
    if (teamEls[i].classList.contains(winningTeam)) {
      teamEls[i].style.boxShadow = "0 0 16px 4px #00c7fd";
      teamEls[i].style.border = "2px solid #00c7fd";
    } else {
      teamEls[i].style.boxShadow = "";
      teamEls[i].style.border = "";
    }
  }
  setTimeout(function () {
    greetingEl.style.opacity = "0";
  }, 6000);
  setTimeout(function () {
    greetingEl.innerHTML = "";
    greetingEl.style.opacity = "1";
    greetingEl.style.display = "";
    greetingEl.removeAttribute("style");
    // Remove highlight after celebration
    for (var i = 0; i < teamEls.length; i++) {
      teamEls[i].style.boxShadow = "";
      teamEls[i].style.border = "";
    }
  }, 7000);
  saveData();
}

function updateTeamDisplay() {
  // Update the team numbers in the team cards (top boxes)
  var waterCountEl = document.getElementById("waterCount");
  var zeroCountEl = document.getElementById("zeroCount");
  var powerCountEl = document.getElementById("powerCount");
  if (waterCountEl) waterCountEl.textContent = teamCounts.water;
  if (zeroCountEl) zeroCountEl.textContent = teamCounts.zero;
  if (powerCountEl) powerCountEl.textContent = teamCounts.power;
  // Only update attendee list, do not show team counts below
  updateAttendeeList();
}

function updateAttendeeList() {
  // Do not show attendee list, only show single welcome message
  let attendeeList = document.getElementById("attendeeList");
  if (attendeeList) {
    attendeeList.innerHTML = "";
  }
}

// Add attendee list toggle button and container
window.addEventListener("DOMContentLoaded", function () {
  var container = document.querySelector(".container");
  var attendeeBtn = document.createElement("button");
  attendeeBtn.textContent = "Show Attendee List";
  attendeeBtn.id = "attendeeListBtn";
  attendeeBtn.style.margin = "24px auto 0";
  attendeeBtn.style.display = "block";
  attendeeBtn.style.padding = "12px 24px";
  attendeeBtn.style.fontSize = "1em";
  attendeeBtn.style.borderRadius = "8px";
  attendeeBtn.style.background = "#00c7fd";
  attendeeBtn.style.color = "#fff";
  attendeeBtn.style.border = "none";
  attendeeBtn.style.cursor = "pointer";
  container.appendChild(attendeeBtn);

  var attendeeListWrap = document.createElement("div");
  attendeeListWrap.id = "attendeeListWrap";
  attendeeListWrap.style.display = "none";
  attendeeListWrap.style.marginTop = "24px";
  container.appendChild(attendeeListWrap);

  attendeeBtn.addEventListener("click", function () {
    if (attendeeListWrap.style.display === "none") {
      attendeeListWrap.style.display = "flex";
      attendeeListWrap.style.justifyContent = "center";
      attendeeListWrap.style.gap = "32px";
      attendeeBtn.textContent = "Hide Attendee List";
      renderAttendeeList();
    } else {
      attendeeListWrap.style.display = "none";
      attendeeBtn.textContent = "Show Attendee List";
    }
  });
});

function renderAttendeeList() {
  var attendeeListWrap = document.getElementById("attendeeListWrap");
  attendeeListWrap.innerHTML = "";
  var teams = ["water", "zero", "power"];
  for (var t = 0; t < teams.length; t++) {
    var teamKey = teams[t];
    var teamCol = document.createElement("div");
    teamCol.style.flex = "1";
    teamCol.style.background =
      t === 0 ? "#eaf6ff" : t === 1 ? "#eafcef" : "#fff7ed";
    teamCol.style.borderRadius = "8px";
    teamCol.style.padding = "16px";
    teamCol.style.minWidth = "180px";
    teamCol.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
    teamCol.innerHTML = `<h4 style='text-align:center; margin-bottom:12px;'>${teamNames[teamKey]}</h4>`;
    var teamAttendees = attendees.filter(function (a) {
      return a.team === teamKey;
    });
    if (teamAttendees.length === 0) {
      teamCol.innerHTML += `<p style='text-align:center; color:#888;'>No attendees</p>`;
    } else {
      var ul = document.createElement("ul");
      ul.style.listStyle = "none";
      ul.style.padding = "0";
      ul.style.textAlign = "center";
      teamAttendees.forEach(function (a) {
        var li = document.createElement("li");
        li.textContent = a.name;
        li.style.marginBottom = "8px";
        ul.appendChild(li);
      });
      teamCol.appendChild(ul);
    }
    attendeeListWrap.appendChild(teamCol);
  }
}

checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = attendeeNameInput.value.trim();
  const team = teamSelect.value;
  if (!name || !team) {
    greetingEl.textContent = "Please enter your name and select a team.";
    return;
  }
  attendees.push({ name: name, team: team });
  attendeeCount += 1;
  teamCounts[team] += 1;
  showGreeting(name, team);
  updateCounts();
  saveData();
  attendeeNameInput.value = "";
  teamSelect.value = "";
});

loadData();
updateCounts();
