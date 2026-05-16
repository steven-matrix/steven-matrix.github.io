const cards = Array.from(document.querySelectorAll(".portal-card"));
const buttons = Array.from(document.querySelectorAll(".filter-button"));
const search = document.querySelector("#portalSearch");

let activeFilter = "all";

function normalize(value) {
  return value.toLowerCase().trim();
}

function applyFilters() {
  const query = normalize(search?.value || "");

  cards.forEach((card) => {
    const tags = card.dataset.tags || "";
    const text = normalize(card.textContent || "");
    const matchesFilter = activeFilter === "all" || tags.includes(activeFilter);
    const matchesSearch = !query || text.includes(query) || tags.includes(query);
    card.classList.toggle("is-hidden", !(matchesFilter && matchesSearch));
  });
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";
    buttons.forEach((item) => item.classList.toggle("is-active", item === button));
    applyFilters();
  });
});

search?.addEventListener("input", applyFilters);

const canvas = document.querySelector("#signalCanvas");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas) {
  const ctx = canvas.getContext("2d");
  const nodes = [
    { label: "Steven", x: 0.5, y: 0.48, r: 31, color: "#101211" },
    { label: "MilanBusiness", x: 0.23, y: 0.32, r: 22, color: "#b9ff59" },
    { label: "LearnByDoing", x: 0.77, y: 0.34, r: 21, color: "#31c7ff" },
    { label: "Design Studio", x: 0.31, y: 0.68, r: 20, color: "#ffc83d" },
    { label: "On The Road", x: 0.7, y: 0.67, r: 20, color: "#ff5d4d" },
    { label: "Social Portals", x: 0.5, y: 0.65, r: 18, color: "#7a62ff" }
  ];

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw(time = 0) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const pulse = prefersReducedMotion ? 0 : Math.sin(time / 850) * 5;

    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = "rgba(16, 18, 17, 0.28)";

    const center = nodes[0];
    nodes.slice(1).forEach((node, index) => {
      const sx = center.x * width;
      const sy = center.y * height;
      const tx = node.x * width;
      const ty = node.y * height;

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(
        sx + (tx - sx) * 0.32,
        sy - 42 + index * 7,
        sx + (tx - sx) * 0.72,
        ty + 32 - index * 5,
        tx,
        ty
      );
      ctx.stroke();
    });

    nodes.forEach((node, index) => {
      const x = node.x * width;
      const y = node.y * height;
      const radius = node.r + (index === 0 ? pulse : pulse * 0.35);

      ctx.beginPath();
      ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#101211";
      ctx.stroke();

      ctx.fillStyle = index === 0 ? "#fbfcf8" : "#101211";
      ctx.font = "800 12px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(index === 0 ? "SM" : String(index), x, y);

      ctx.fillStyle = "#101211";
      ctx.font = "800 13px system-ui, sans-serif";
      ctx.fillText(node.label, x, y + radius + 20);
    });

    if (!prefersReducedMotion) {
      requestAnimationFrame(draw);
    }
  }

  resizeCanvas();
  draw();
  window.addEventListener("resize", () => {
    resizeCanvas();
    draw();
  });
}
