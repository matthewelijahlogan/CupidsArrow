window.addEventListener("DOMContentLoaded", () => {
  const splashScreen = document.getElementById("splashScreen");
  const logoScreen = document.getElementById("logoScreen");
  const cupidLogo = document.getElementById("cupidLogo");
  const menuScreen = document.getElementById("menuScreen");

  // Step 1: Show splash
  splashScreen.classList.remove("hidden");

  setTimeout(() => {
    // Step 2: Hide splash, show logo
    splashScreen.classList.add("hidden");
    logoScreen.classList.remove("hidden");
    logoScreen.classList.add("show");

    // Restart cupid logo animation
    cupidLogo.style.animation = "none";
    void cupidLogo.offsetWidth; // Force reflow
    cupidLogo.style.animation = "popReveal 2.5s ease-in-out forwards";

    // Step 3: After logo animation, fade into menu
    setTimeout(() => {
      logoScreen.classList.remove("show");
      logoScreen.classList.add("hidden");
      menuScreen.classList.remove("hidden");
    }, 3000); // slightly longer than logo animation (2.5s)
  }, 4000); // match splash fadeInOut
});
