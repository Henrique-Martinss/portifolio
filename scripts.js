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
// 3. SISTEMA DE PARTÍCULAS (CANVAS)
// ===============================
const canvas = document.getElementById("particulas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    const mouse = { x: null, y: null, radius: 120 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.angulo = Math.random() * Math.PI;
            this.velRotacao = (Math.random() - 0.5) * 0.01;
        }
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                if (distance > 10) {
                    this.x += dx * 0.03;
                    this.y += dy * 0.03;
                }
                this.angulo += this.velRotacao;
                this.x += Math.cos(this.angulo) * 1.5;
                this.y += Math.sin(this.angulo) * 1.5;
            }
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = "rgba(0, 229, 255, 0.3)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particlesArray = [];
        for (let i = 0; i < 120; i++) particlesArray.push(new Particle());
    }

    function conectar() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let dist = dx * dx + dy * dy;
                if (dist < 12000) {
                    ctx.strokeStyle = `rgba(0, 229, 255, ${1 - dist / 12000})`;
                    ctx.lineWidth = 0.3;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(p => { p.update(); p.draw(); });
        conectar();
        requestAnimationFrame(animate);
    }

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    init();
    animate();
}
