document.addEventListener("DOMContentLoaded", () => {
  const backLayer = document.querySelector(".back-layer");
  const middleLayer = document.querySelector(".middle-layer");
  const frontLayer = document.querySelector(".front-layer");
  const logoContainer = document.querySelector(".logo-container");

  let parallaxOffsetX = 0;
  let parallaxOffsetY = 0;

  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    parallaxOffsetX = (mouseX - 0.5) * 150;
    parallaxOffsetY = (mouseY - 0.5) * 150;

    const backX = (mouseX - 0.5) * 30;
    const backY = (mouseY - 0.5) * 30;

    const middleX = (mouseX - 0.5) * 60;
    const middleY = (mouseY - 0.5) * 60;

    const frontX = (mouseX - 0.5) * 90;
    const frontY = (mouseY - 0.5) * 90;

    backLayer.style.transform = `translate(${backX}px, ${backY}px)`;
    middleLayer.style.transform = `translate(${middleX}px, ${middleY}px)`;
    frontLayer.style.transform = `translate(${frontX}px, ${frontY}px)`;
  });

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;

    if (backLayer) {
      backLayer.style.transform = `translateY(${
        scrolled * parallaxSpeed * 0.3
      }px)`;
    }

    if (middleLayer) {
      middleLayer.style.transform = `translateY(${
        scrolled * parallaxSpeed * 0.5
      }px)`;
    }

    if (frontLayer) {
      frontLayer.style.transform = `translateY(${
        scrolled * parallaxSpeed * 0.7
      }px)`;
    }
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  const sectionTitles = document.querySelectorAll(".section-title");
  sectionTitles.forEach((title) => {
    title.style.opacity = "0";
    title.style.transform = "translateY(30px)";
    title.style.transition = "all 1s ease";
    observer.observe(title);
  });

  const sectionDescriptions = document.querySelectorAll(".section-description");
  sectionDescriptions.forEach((desc) => {
    desc.style.opacity = "0";
    desc.style.transform = "translateY(30px)";
    desc.style.transition = "all 1s ease 0.2s";
    observer.observe(desc);
  });

  const scheduleItems = document.querySelectorAll(".schedule-item");
  scheduleItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(30px)";
    item.style.transition = `all 0.8s ease ${index * 0.2}s`;
    observer.observe(item);
  });

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(30px)";
    item.style.transition = `all 0.8s ease ${index * 0.2}s`;
    observer.observe(item);
  });

  const sponsorLogos = document.querySelectorAll(".sponsor-logos-wrapper img");
  sponsorLogos.forEach((logo, index) => {
    logo.style.opacity = "0";
    logo.style.transform = "scale(0.8)";
    logo.style.transition = `all 0.5s ease ${index * 0.15}s`;
    observer.observe(logo);
  });

  const createGlowEffect = (e) => {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.style.left = e.pageX + "px";
    glow.style.top = e.pageY + "px";
    document.body.appendChild(glow);

    setTimeout(() => {
      glow.remove();
    }, 1000);
  };

  document.addEventListener("click", createGlowEffect);
  const canvas = document.getElementById("snow-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = canvas.clientWidth);
    let height = (canvas.height = canvas.clientHeight);

    const resize = () => {
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", resize);
    resize();

    const maxFlakes = Math.max(60, Math.floor(width / 8));
    const flakes = [];

    const rand = (a, b) => Math.random() * (b - a) + a;

    for (let i = 0; i < maxFlakes; i++) {
      const size = Math.floor(rand(2, 16));
      const baseOpacity = 0.3 + ((size - 2) / 14) * 0.7;
      const parallaxFactor = (size - 2) / 14;
      const speed = 0.1 + parallaxFactor * 1.4;
      flakes.push({
        x: rand(0, width),
        y: rand(-height, height),
        size: size,
        speed: speed,
        drift: rand(-0.4, 0.8),
        opacity: Math.random() < 0.3 ? 1.0 : baseOpacity,
        parallaxFactor: parallaxFactor,
      });
    }

    let last = performance.now();

    const draw = (now) => {
      const dt = (now - last) / 16.67; // 6767676767
      last = now;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.y += f.speed * dt;
        f.x += f.drift * dt;

        if (f.y > height + 10 || f.x < -20 || f.x > width + 20) {
          f.x = rand(0, width);
          f.y = rand(-50, -10);
          f.size = Math.floor(rand(2, 16));
          const baseOpacity = 0.3 + ((f.size - 2) / 14) * 0.7;
          f.opacity = Math.random() < 0.3 ? 1.0 : baseOpacity;
          f.parallaxFactor = (f.size - 2) / 14;
          f.speed = 0.1 + f.parallaxFactor * 1.4;
          f.drift = rand(-0.4, 0.8);
        }

        const parallaxX = parallaxOffsetX * f.parallaxFactor;
        const parallaxY = parallaxOffsetY * f.parallaxFactor;

        ctx.fillStyle = `rgba(230, 245, 255, ${f.opacity})`;
        const s = f.size;
        ctx.fillRect(
          Math.round(f.x + parallaxX),
          Math.round(f.y + parallaxY),
          s,
          s
        );
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }

  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const faqItem = question.parentElement;
      const wasActive = faqItem.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active");
      });

      if (!wasActive) {
        faqItem.classList.add("active");
      }
    });
  });
});

window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const triggerBottom = (window.innerHeight / 5) * 4;

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;

    if (sectionTop < triggerBottom) {
      section.style.opacity = "1";
      section.style.transform = "translateY(0)";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section:not(.hero)");
  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(50px)";
    section.style.transition = "all 0.8s ease";
  });
});
