const signupForm = document.querySelector(".su-form");
$(document).ready(() => {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = signupForm["password"].value;
    const email = signupForm["email"].value;
    auth.createUserWithEmailAndPassword(email, password).then((resp) => {
     window.location.href =
      "https://clickbait-4587.github.io/ShoppingCart/store"
      signupForm.reset();
    });
  });
});
