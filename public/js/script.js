document.addEventListener("DOMContentLoaded", function () {
  const allButtons = document.querySelectorAll(".searchBtn");
  const searchBar = document.querySelector(".searchBar");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");

  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener("click", function () {
      searchBar.style.visibility = "visible";
      searchBar.classList.add("open");
      this.setAttribute("aria-expanded", "true");
      searchInput.focus();
    });
  }

  searchClose.addEventListener("click", function () {
    searchBar.style.visibility = "hidden";
    searchBar.classList.remove("open");
    this.setAttribute("aria-expanded", "false");
  });
});

// signUpForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   usernameError.textContent = "";
//   const res = await fetch("/register", {
//     method: "POST",
//     body: JSON.stringify({
//       username: exampleInputUsername.value,
//       password: exampleInputPassword1.value,
//     }),
//     headers: { "Content-Type": "application/json" },
//   });
//   const data = await res.json();

//   if (data.usernameExist) {
//     console.log(data.usernameExist);
//     usernameError.textContent = "Email already exists , Try Login";
//   }
//   if (data.id) {
//     console.log(data.id);
//     location.assign("/");
//   }
// });

logInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  usernameError.textContent = "";
  passwordError.textContent = "";
  const res = await fetch("/admin", {
    method: "POST",
    body: JSON.stringify({
      username: exampleInputUsername1.value,
      password: exampleInputPassword1.value,
    }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();

  if (data.usernameExist) {
    console.log(data.usernameExist);
    usernameError.textContent =
      "Username Not Found , Don't you know what your account is, admin?!😒";
  }
  if (data.wrongPass) {
    console.log(data.wrongPass);
    passwordError.textContent = data.wrongPass;
  }
  if (data.id) {
    console.log(data.id);
    location.assign("/dashboard");
  }
});

inputFile.addEventListener("change", (eo) => {
  articaleImage.src = URL.createObjectURL(eo.target.files[0]);
});
