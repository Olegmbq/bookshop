// ✨ Brand Sparkles Script
document.addEventListener("DOMContentLoaded", () => {
  console.log("✨ Sparkles script active");

  const container = document.body;
  const sparkleCount = 30;
  const orbitRadius = 120; // радиус орбиты вокруг логотипа (в пикселях)
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2.5;

  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");

    const angle = (i / sparkleCount) * Math.PI * 2;
    const x = Math.cos(angle) * orbitRadius + centerX;
    const y = Math.sin(angle) * orbitRadius + centerY;

    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.animationDelay = `${Math.random() * 4}s`;
    sparkle.style.animationDuration = `${3 + Math.random() * 2}s`;

    container.appendChild(sparkle);
  }
});
