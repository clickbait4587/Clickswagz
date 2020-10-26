const signupForm = document.querySelector(".su-form");
$(document).ready(() => {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = signupForm["password"].value;
    const email = signupForm["email"].value;
    auth.createUserWithEmailAndPassword(email, password).then((resp) => {
      window.location.href = "/";
      console.log(resp);
      signupForm.reset();
    });
  });
});
