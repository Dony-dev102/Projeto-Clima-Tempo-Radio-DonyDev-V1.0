const key = "fbccd76ffb776a8858152b9473c7ce3b";
let hls = null;

// --- 1. LÓGICA DOS VÍDEOS (Com Transição Suave Corrigida) ---

function configurarVideoAleatorio() {
    const videoElement = document.getElementById('video-bg');
    if (!videoElement) return;

    // Inicia o efeito de sumir (Fade Out)
    videoElement.style.opacity = "0";

    // Aguarda o tempo da transição CSS (0.8s) para trocar o arquivo
    setTimeout(() => {
        const numeroSorteado = Math.floor(Math.random() * 10) + 1;
        const videoCaminho = `./video/video${numeroSorteado}.mp4`;

        videoElement.src = videoCaminho;
        
        videoElement.onloadeddata = () => {
            // Primeiro damos o play com o vídeo ainda invisível
            videoElement.play().then(() => {
                // Só aumentamos a opacidade depois que o play de fato começou
                videoElement.style.opacity = "1";
            }).catch(e => console.log("Erro no play:", e));
        };
    }, 800); 
}

// --- 2. LÓGICA DA RÁDIO ---

function tocar(url) {
    const audio = document.getElementById('audio-player');
    
    if (hls) {
        hls.destroy();
        hls = null;
    }

    if (url.includes('streamtheworld') || url.includes('.m3u8')) {
        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play());
        } else {
            audio.src = url;
            audio.play();
        }
    } else {
        audio.src = url;
        audio.load();
        audio.play();
    }
}

// --- 3. LÓGICA DO CLIMA ---

async function buscarCidade(cidade) {
    if(!cidade) return;
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&appid=${key}&lang=pt_br&units=metric`;
        const res = await fetch(url).then(r => r.json());
        
        if(res.cod === 200) {
            document.querySelector(".nome-cidade").innerHTML = res.name;
            document.querySelector(".temperatura").innerHTML = Math.floor(res.main.temp) + "°C";
            document.querySelector(".icone-tempo").src = `https://openweathermap.org/img/wn/${res.weather[0].icon}@4x.png`;
        }
    } catch (e) {
        console.error("Erro ao buscar cidade:", e);
    }
}

function cliqueNoBotao() {
    const input = document.getElementById("input-busca");
    buscarCidade(input.value);
}

// --- 4. INICIALIZAÇÃO ---

window.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('video-bg');

    if (videoElement) {
        // Define a transição suave no CSS via JS para garantir
        videoElement.style.transition = "opacity 0.8s ease-in-out";
        
        // Inicia o primeiro vídeo
        configurarVideoAleatorio();

        // Quando o vídeo terminar, sorteia o próximo
        videoElement.onended = () => {
            configurarVideoAleatorio();
        };
    }

    const inputBusca = document.getElementById("input-busca");
    if (inputBusca) {
        inputBusca.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                cliqueNoBotao();
            }
        });
    }
});
