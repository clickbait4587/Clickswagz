const signinForm = document.querySelector(".si-form");
signinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const password = signinForm["password"].value;
  const email = signinForm["email"].value;
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    signinForm.reset();
    window.location.href = "/docs/";
  });
});
