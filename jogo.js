const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

// =========================
// CONFIGURAÇÕES DO JOGO
// =========================

const chao = 250;

// Velocidade inicial dos cactos
const velocidadeInicial = 5;

// Velocidade atual dos cactos
let velocidadeCacto = velocidadeInicial;

// Pontuação atual
let pontuacao = 0;

// Recorde salvo no navegador
let recorde = Number(localStorage.getItem("recordeDinossauro")) || 0;

// Contador para aumentar a pontuação
let contadorPontuacao = 0;

// Indica se o jogo está rodando
let jogoAtivo = true;

// Lista de cactos
const cactos = [];

// Tempo até aparecer um novo cacto
let tempoParaNovoCacto = 60;


// =========================
// DINOSSAURO
// =========================

const dinossauro = {
    x: 80,
    y: chao - 50,

    largura: 45,
    altura: 50,

    velocidadeY: 0,
    gravidade: 0.8,
    forcaDoPulo: -15,

    noChao: true
};


// =========================
// DESENHAR O CHÃO
// =========================

function desenharChao() {

    ctx.fillStyle = "#555";

    ctx.fillRect(
        0,
        chao,
        canvas.width,
        3
    );
}


// =========================
// DESENHAR O DINOSSAURO
// =========================

function desenharDinossauro() {

    ctx.fillStyle = "#333";

    // Corpo
    ctx.fillRect(
        dinossauro.x + 10,
        dinossauro.y + 15,
        28,
        30
    );

    // Cabeça
    ctx.fillRect(
        dinossauro.x + 25,
        dinossauro.y,
        25,
        25
    );

    // Pescoço
    ctx.fillRect(
        dinossauro.x + 25,
        dinossauro.y + 10,
        12,
        20
    );

    // Cauda
    ctx.fillRect(
        dinossauro.x,
        dinossauro.y + 25,
        15,
        8
    );

    // Perna esquerda
    ctx.fillRect(
        dinossauro.x + 14,
        dinossauro.y + 40,
        8,
        15
    );

    // Perna direita
    ctx.fillRect(
        dinossauro.x + 30,
        dinossauro.y + 40,
        8,
        15
    );

    // Braço
    ctx.fillRect(
        dinossauro.x + 34,
        dinossauro.y + 25,
        15,
        6
    );

    // Olho
    ctx.fillStyle = "white";

    ctx.fillRect(
        dinossauro.x + 42,
        dinossauro.y + 6,
        4,
        4
    );
}


// =========================
// PULO
// =========================

function pular() {

    if (dinossauro.noChao && jogoAtivo) {

        dinossauro.velocidadeY = dinossauro.forcaDoPulo;

        dinossauro.noChao = false;
    }
}


// =========================
// ATUALIZAR DINOSSAURO
// =========================

function atualizarDinossauro() {

    if (!jogoAtivo) {
        return;
    }

    // Gravidade
    dinossauro.velocidadeY += dinossauro.gravidade;

    // Movimento vertical
    dinossauro.y += dinossauro.velocidadeY;

    // Impede que atravesse o chão
    if (dinossauro.y + dinossauro.altura >= chao) {

        dinossauro.y = chao - dinossauro.altura;

        dinossauro.velocidadeY = 0;

        dinossauro.noChao = true;
    }
}


// =========================
// CRIAR CACTO
// =========================

function criarCacto() {

    // Altura aleatória
    const altura = Math.floor(Math.random() * 41) + 35;

    const cacto = {
        x: canvas.width,
        y: chao - altura,
        largura: 25,
        altura: altura
    };

    cactos.push(cacto);
}


// =========================
// DESENHAR CACTOS
// =========================

function desenharCactos() {

    for (let cacto of cactos) {

        ctx.fillStyle = "#16852b";

        // Tronco
        ctx.fillRect(
            cacto.x + 8,
            cacto.y,
            10,
            cacto.altura
        );

        // Braço esquerdo
        if (cacto.altura > 45) {

            ctx.fillRect(
                cacto.x,
                cacto.y + 18,
                10,
                8
            );

            ctx.fillRect(
                cacto.x,
                cacto.y + 10,
                8,
                16
            );
        }

        // Braço direito
        if (cacto.altura > 55) {

            ctx.fillRect(
                cacto.x + 18,
                cacto.y + 28,
                10,
                8
            );

            ctx.fillRect(
                cacto.x + 20,
                cacto.y + 18,
                8,
                18
            );
        }
    }
}


// =========================
// ATUALIZAR CACTOS
// =========================

function atualizarCactos() {

    if (!jogoAtivo) {
        return;
    }

    // Move os cactos para a esquerda
    for (let cacto of cactos) {

        cacto.x -= velocidadeCacto;
    }

    // Remove cactos que saíram da tela
    for (let i = cactos.length - 1; i >= 0; i--) {

        if (cactos[i].x + cactos[i].largura < 0) {

            cactos.splice(i, 1);
        }
    }

    // Conta o tempo para criar outro cacto
    tempoParaNovoCacto--;

    if (tempoParaNovoCacto <= 0) {

        criarCacto();

        // Intervalo aleatório
        tempoParaNovoCacto =
            Math.floor(Math.random() * 90) + 60;
    }
}


// =========================
// ATUALIZAR PONTUAÇÃO
// =========================

function atualizarPontuacao() {

    if (!jogoAtivo) {
        return;
    }

    contadorPontuacao++;

    // Aproximadamente 1 ponto por segundo
    if (contadorPontuacao >= 60) {

        pontuacao++;

        contadorPontuacao = 0;
    }

    // Aumenta a velocidade a cada 100 pontos
    const nivel = Math.floor(pontuacao / 100);

    velocidadeCacto = Math.min(
        velocidadeInicial + nivel * 0.5,
        8
    );

    // Verifica se a pontuação virou um novo recorde
    if (pontuacao > recorde) {

        recorde = pontuacao;

        // Salva o novo recorde no navegador
        localStorage.setItem(
            "recordeDinossauro",
            recorde
        );
    }
}


// =========================
// DESENHAR PONTUAÇÃO E RECORDE
// =========================

function desenharPontuacao() {

    // Pontuação atual com 5 dígitos
    const textoPontuacao =
        String(pontuacao).padStart(5, "0");

    // Recorde com 6 dígitos
    const textoRecorde =
        String(recorde).padStart(6, "0");

    ctx.fillStyle = "#333";

    ctx.font = "20px Arial";

    ctx.textAlign = "right";

    // Pontuação
    ctx.fillText(
        textoPontuacao,
        canvas.width - 20,
        30
    );

    // Recorde ao lado da pontuação
    ctx.fillText(
        "HI " + textoRecorde,
        canvas.width - 120,
        30
    );

    ctx.textAlign = "center";
}


// =========================
// VERIFICAR COLISÃO
// =========================

function verificarColisao() {

    for (let cacto of cactos) {

        if (
            dinossauro.x < cacto.x + cacto.largura &&
            dinossauro.x + dinossauro.largura > cacto.x &&
            dinossauro.y < cacto.y + cacto.altura &&
            dinossauro.y + dinossauro.altura > cacto.y
        ) {

            jogoAtivo = false;

            break;
        }
    }
}


// =========================
// GAME OVER
// =========================

function desenharGameOver() {

    if (!jogoAtivo) {

        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle = "#222";

        ctx.font = "bold 48px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "GAME OVER",
            canvas.width / 2,
            135
        );

        ctx.font = "20px Arial";

        ctx.fillText(
            "Aperte espaço para jogar de novo",
            canvas.width / 2,
            175
        );
    }
}


// =========================
// DESENHAR TUDO
// =========================

function desenhar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    desenharChao();
    desenharDinossauro();
    desenharCactos();
    desenharPontuacao();
    desenharGameOver();
}


// =========================
// REINICIAR JOGO
// =========================

function reiniciarJogo() {

    // Reativa o jogo
    jogoAtivo = true;

    // Zera a pontuação atual
    pontuacao = 0;

    // Zera o contador da pontuação
    contadorPontuacao = 0;

    // Volta para a velocidade inicial
    velocidadeCacto = velocidadeInicial;

    // Coloca o dinossauro no início
    dinossauro.x = 80;
    dinossauro.y = chao - dinossauro.altura;

    dinossauro.velocidadeY = 0;
    dinossauro.noChao = true;

    // Remove todos os cactos
    cactos.length = 0;

    // Reinicia o tempo do próximo cacto
    tempoParaNovoCacto = 60;

    // IMPORTANTE:
    // O recorde NÃO é zerado.
    // Ele continua salvo no localStorage.
}


// =========================
// LOOP PRINCIPAL
// =========================

function jogo() {

    atualizarDinossauro();

    atualizarCactos();

    atualizarPontuacao();

    verificarColisao();

    desenhar();

    requestAnimationFrame(jogo);
}


// =========================
// CONTROLES
// =========================

document.addEventListener("keydown", function(event) {

    // Depois do Game Over, espaço reinicia
    if (event.code === "Space" && !jogoAtivo) {

        event.preventDefault();

        reiniciarJogo();

        return;
    }

    // Espaço ou seta para cima fazem pular
    if (
        event.code === "Space" ||
        event.code === "ArrowUp"
    ) {

        event.preventDefault();

        pular();
    }
});


// =========================
// INICIAR
// =========================

jogo();