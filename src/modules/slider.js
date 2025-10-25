export function initSlider() {
  const slides = [
    new URL("../assets/images/slides/slide1.png", import.meta.url).href,
    new URL("../assets/images/slides/slide2.png", import.meta.url).href,
    new URL("../assets/images/slides/slide3.png", import.meta.url).href,
  ];

  let currentSlide = 0;
  const sliderImg = document.getElementById("slider-img");
  const dots = document.querySelectorAll(".slider__dot");

  function showSlide(index) {
    currentSlide = index;

    sliderImg.classList.add("fade-out");
    setTimeout(() => {
      sliderImg.src = slides[index];
      sliderImg.classList.remove("fade-out");
      sliderImg.classList.add("fade-in");
    }, 400);

    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => showSlide(i));
  });

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 5000);

  showSlide(0);
}
