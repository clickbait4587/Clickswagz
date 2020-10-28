const signupForm = document.querySelector(".su-form");
$(document).ready(() => {
  document.body.addEventListener("click", () => {
    $(".text-warning").fadeOut(1000);
    $(".fa-exclamation-triangle").fadeOut(1000);
  });

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = signupForm["password"].value;
    const email = signupForm["email"].value;
    const firstname = "Junior";
    const lastname = "Khoza";
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((resp) => {
        console.log(resp);
        window.location.href = "/";
        signupForm.reset();
      })
      .catch((err) => {
        $(".error").removeClass("hidden");
        $(".text-warning").text(err.message);
        $(".text-warning").hide();
        $(".fa-exclamation-triangle").fadeIn(1000);
        $(".text-warning").fadeIn(1000);
      });
  });
});
