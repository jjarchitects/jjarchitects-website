import carousel_data from "./carousel_data.js";

console.log("Entered The main.js");

const left_btn = document.querySelector(".left-btn");
const right_btn = document.querySelector(".right-btn");

const image = document.querySelector(".home-page-img");

let i = 0;

right_btn.addEventListener("click", () => {
  changeImage("next");
});

left_btn.addEventListener("click", () => {
  changeImage("prev");
});

function changeImage(direction) {
  if (direction === "next") {
    i = i === carousel_data.length - 1 ? 0 : i + 1;
  } else if (direction === "prev") {
    i = i === 0 ? carousel_data.length - 1 : i - 1;
  }

  image.src = carousel_data[i].path;
}

// Automatically change image every 5 seconds
setInterval(() => {
  changeImage("next");
}, 5000);
