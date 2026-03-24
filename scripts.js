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