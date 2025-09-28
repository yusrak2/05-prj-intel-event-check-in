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
  // Show a styled welcome message for a short time
  greetingEl.innerHTML = `🎉 <strong>Welcome, ${name} from ${teamNames[team]}!</strong>`;
  greetingEl.style.background = "#eaf6ff";
  greetingEl.style.borderRadius = "8px";
  greetingEl.style.padding = "16px";
  greetingEl.style.marginBottom = "16px";
  greetingEl.style.textAlign = "center";
  greetingEl.style.fontWeight = "bold";
  greetingEl.style.fontSize = "1.2em";
  greetingEl.style.opacity = "1";
  greetingEl.style.transition = "opacity 1s";
  setTimeout(function () {
    greetingEl.style.opacity = "0";
  }, 4000);
  setTimeout(function () {
    greetingEl.innerHTML = "";
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
  greetingEl.innerHTML = `🎉 Attendance goal reached! <strong>${teamNames[winningTeam]}</strong> wins! 🎉`;
  const teamEls = document.querySelectorAll(".team-count");
  for (let i = 0; i < teamEls.length; i++) {
    if (teamEls[i].dataset.team === winningTeam) {
      teamEls[i].classList.add("winner");
    } else {
      teamEls[i].classList.remove("winner");
    }
  }
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
  let attendeeHtml = '<ul style="margin-top:10px;">';
  for (let i = 0; i < attendees.length; i++) {
    attendeeHtml += `<li>Welcome, ${
      attendees[i].name
    }! You are checked in for ${teamNames[attendees[i].team]}.`;
  }
  attendeeHtml += "</ul>";
  let attendeeList = document.getElementById("attendeeList");
  if (!attendeeList) {
    attendeeList = document.createElement("div");
    attendeeList.id = "attendeeList";
    attendeeList.style.marginTop = "10px";
    // Place attendeeList right above the check-in form
    var container = document.querySelector(".container");
    var form = document.getElementById("checkInForm");
    container.insertBefore(attendeeList, form);
  }
  attendeeList.innerHTML = attendeeHtml;
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
