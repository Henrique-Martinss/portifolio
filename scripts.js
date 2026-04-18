// ===============================
// 1. LOADER (TELA DE CARREGAMENTO)
// ===============================
// Esta função garante que o loader suma, não importa o que aconteça
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.classList.add("hidden");
    }
});

// Segurança extra: se o loader não sumir em 3 segundos, forçamos a saída
setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader && !loader.classList.contains("hidden")) {
        loader.classList.add("hidden");
    }
}, 3000);

// ===============================
// 2. MODAL DE PROJETOS
// ===============================
const modal = document.getElementById("modalProjetos");
const abrir = document.getElementById("abrirProjetos");
const fechar = document.getElementById("fecharModal");

if (abrir && modal) {
    abrir.addEventListener("click", () => modal.classList.add("ativo"));
}
if (fechar && modal) {
    fechar.addEventListener("click", () => modal.classList.remove("ativo"));
}
if (modal) {
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("ativo");
    });
}

// ===============================
// 3. DOT GRID INTERATIVO (CANVAS)
// ===============================
const canvas = document.getElementById("particulas");
if (canvas) {
    const ctx = canvas.getContext("2d");

    // --- Configurações ---
    const DOT_SPACING  = 30;    // distância entre pontos (px)
    const DOT_RADIUS   = 1.6;   // tamanho base do ponto
    const MOUSE_RADIUS = 100;   // raio de influência do mouse
    const REPULSION    = 0.05;   // força de repulsão (suave)
    const STIFFNESS    = 0.04;  // rigidez da mola (volta ao lugar)
    const DAMPING      = 0.88;  // amortecimento (mais suave, menos oscilação)

    let dots = [];
    let mouse = { x: -9999, y: -9999 };

    // --- Constrói a grade de pontos ---
    function buildGrid() {
        dots = [];
        const cols = Math.ceil(canvas.width  / DOT_SPACING) + 1;
        const rows = Math.ceil(canvas.height / DOT_SPACING) + 1;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const hx = c * DOT_SPACING;
                const hy = r * DOT_SPACING;
                dots.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0 });
            }
        }
    }

    // --- Redimensiona e reconstrói ---
    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        buildGrid();
    }

    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    // --- Loop de animação ---
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const dot of dots) {
            // Repulsão do mouse
            const dxM = dot.x - mouse.x;
            const dyM = dot.y - mouse.y;
            const distM = Math.sqrt(dxM * dxM + dyM * dyM);

            if (distM < MOUSE_RADIUS && distM > 0) {
                const force = (MOUSE_RADIUS - distM) / MOUSE_RADIUS;
                const angle = Math.atan2(dyM, dxM);
                dot.vx += Math.cos(angle) * force * REPULSION;
                dot.vy += Math.sin(angle) * force * REPULSION;
            }

            // Mola de retorno à posição original
            dot.vx += (dot.hx - dot.x) * STIFFNESS;
            dot.vy += (dot.hy - dot.y) * STIFFNESS;

            // Amortecimento
            dot.vx *= DAMPING;
            dot.vy *= DAMPING;

            // Posição
            dot.x += dot.vx;
            dot.y += dot.vy;

            // Visual: tamanho e opacidade baseados na proximidade do mouse
            const dxV    = dot.x - mouse.x;
            const dyV    = dot.y - mouse.y;
            const distV  = Math.sqrt(dxV * dxV + dyV * dyV);
            const prox   = Math.max(0, 1 - distV / MOUSE_RADIUS);

            const radius = DOT_RADIUS + prox * 1.5;
            const alpha  = 0.15 + prox * 0.50;

            ctx.beginPath();
            ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    resize();
    animate();
}

// ===============================
// 4. CARROSSEL DE CERTIFICADOS
// ===============================
(function () {
    const track   = document.getElementById("certTrack");
    const btnPrev = document.getElementById("certPrev");
    const btnNext = document.getElementById("certNext");
    const dotsEl  = document.getElementById("certDots");

    if (!track || !btnPrev || !btnNext || !dotsEl) return;

    const cards = track.querySelectorAll(".cert-card");
    const total = cards.length;
    let current = 0;
    let timer;

    // Gera os dots dinamicamente
    cards.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "carrossel-dot" + (i === 0 ? " ativo" : "");
        dot.setAttribute("aria-label", `Certificado ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        dotsEl.appendChild(dot);
    });

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dotsEl.querySelectorAll(".carrossel-dot").forEach((d, i) => {
            d.classList.toggle("ativo", i === current);
        });
        resetTimer();
    }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(() => goTo(current + 1), 5000);
    }

    btnPrev.addEventListener("click", () => goTo(current - 1));
    btnNext.addEventListener("click", () => goTo(current + 1));

    // Pausa o auto-play ao passar o mouse no carrossel
    const container = document.querySelector(".carrossel-container");
    if (container) {
        container.addEventListener("mouseenter", () => clearInterval(timer));
        container.addEventListener("mouseleave", resetTimer);
    }

    resetTimer();
})();


