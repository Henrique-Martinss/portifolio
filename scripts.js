function enviarWhats(event) {
    event.preventDefault()

    const nome = document.getElementById('nome').value;
    const mensagem = document.getElementById('mensagem').value;
    const telefone = '5554981507387'

    const texto = ` Olá! Me Chamo ${nome}, ${mensagem} `
    const msgFormatada = encodeURIComponent(texto)

    const url = `https://wa.me/${telefone}?text=${msgFormatada}`

    window.open(url, '_blank')
}

const modal = document.getElementById("modalProjetos")
const abrir = document.getElementById("abrirProjetos")
const fechar = document.getElementById("fecharModal")

if (abrir) {
    abrir.addEventListener("click", () => {
        modal.classList.add("ativo")
    })
}

fechar.addEventListener("click", () => {
    modal.classList.remove("ativo")
})

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("ativo")
    }
})

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.classList.add("hidden");
    }, 1000);
});

const mouse = {
    x: null,
    y: null,
    radius: 120
};

document.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

const canvas = document.getElementById("particulas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class particulas {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.angulo = Math.random() * Math.PI * 1;
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
    for (let i = 0; i < 120; i++) {
        particlesArray.push(new particulas());
    }
}

function conectarParticulas() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {

            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = dx * dx + dy * dy;

            if (distance < 12000) {
                let opacity = 1 - (distance / 12000);

                ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
                ctx.lineWidth = 0.3;

                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();

                let dxMouse = particlesArray[a].x - mouse.x;
                let dyMouse = particlesArray[a].y - mouse.y;
                let distMouse = dxMouse * dxMouse + dyMouse * dyMouse;

                if (distMouse < 20000) {
                    ctx.strokeStyle = "rgba(0, 229, 255, 0.2)";
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach(p => {
        p.update();
        p.draw();
    });

    conectarParticulas();



    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

init();
animate();