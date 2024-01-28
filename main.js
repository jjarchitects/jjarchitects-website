import carousel_data from "./carousel_data.js";

const left_btn = document.querySelector(".left-btn");
const right_btn = document.querySelector(".right-btn");

const image = document.querySelector(".home-page-img");

let i = 0;
let intervalId;

right_btn.addEventListener("click", () => {
  changeImage("next");
  resetInterval();
});

left_btn.addEventListener("click", () => {
  changeImage("prev");
  resetInterval();
});

function resetInterval() {
  // Clear the existing interval timer (if any)
  clearInterval(intervalId);

  // Set a new interval timer
  intervalId = setInterval(() => {
    changeImage("next");
  }, 6000);
}

function changeImage(direction) {
  if (direction === "next") {
    i = i === carousel_data.length - 1 ? 0 : i + 1;
  } else if (direction === "prev") {
    i = i === 0 ? carousel_data.length - 1 : i - 1;
  }

  image.src = carousel_data[i].path;
}

// Initially, start the interval
resetInterval();
