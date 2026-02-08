const key = "fbccd76ffb776a8858152b9473c7ce3b";
let hls = null;

function tocar(url) {
    const audio = document.getElementById('audio-player');
    
    // Destrói instância anterior do HLS se existir para não travar
    if (hls) {
        hls.destroy();
        hls = null;
    }

    // Se o link contiver 'streamtheworld' ou for .m3u8, usa HLS
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
        // Para links diretos como a Metropolitana
        audio.src = url;
        audio.load();
        audio.play();
    }
}

async function buscarCidade(cidade) {
    if(!cidade) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&appid=${key}&lang=pt_br&units=metric`;
    const res = await fetch(url).then(r => r.json());
    if(res.cod === 200) {
        document.querySelector(".nome-cidade").innerHTML = res.name;
        document.querySelector(".temperatura").innerHTML = Math.floor(res.main.temp) + "°C";
        document.querySelector(".icone-tempo").src = `https://openweathermap.org/img/wn/${res.weather[0].icon}@4x.png`;
    }
}

function cliqueNoBotao() {
    buscarCidade(document.getElementById("input-busca").value);
}