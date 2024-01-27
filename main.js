import carousel_data from "./carousel_data.json";

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

  setTimeout(() => {
    image.src = carousel_data[i].path;
  }, 700); // Adjust the timeout value to match the transition duration
}

// Automatically change image every 3 seconds
setInterval(() => {
  changeImage("next");
}, 5000);
