const MUSICAS_PLAYLIST = [
    { src: 'creature.mp3', titulo: 'creature', autor: 'half·alive' },
    { src: 'intro.mp3', titulo: 'INTRO', autor: 'pumapjl' },
	{ src: 'AchillesComeDOwn.mp3', titulo: 'Achilles Come Down', autor: 'Gang of Youths'}
];
let MUSICA_ATUAL = 0;
let MUSICA_ESTADO_PAUSADA = true

function proximaMusica() {
    try {
        const audio = document.getElementById('musica-audio');
        const tituloElement = document.getElementById('musica-titulo');
        const autorElement = document.getElementById('musica-autor');
		
        MUSICA_ATUAL = (MUSICA_ATUAL + 1) % MUSICAS_PLAYLIST.length;

        audio.src = `database/soundtrack/${MUSICAS_PLAYLIST[MUSICA_ATUAL].src}`;
        
        tituloElement.textContent = MUSICAS_PLAYLIST[MUSICA_ATUAL].titulo;
        autorElement.textContent = MUSICAS_PLAYLIST[MUSICA_ATUAL].autor;
        
		if (!MUSICA_ESTADO_PAUSADA) {
			audio.play()
		}
		
        return 1; 
    } catch (error) {
        console.log('erro na função proximaMusica(): ', error);
        return 0;
    }
}

function anteriorMusica() {
	try {
        const audio = document.getElementById('musica-audio');
        const tituloElement = document.getElementById('musica-titulo');
        const autorElement = document.getElementById('musica-autor');

        MUSICA_ATUAL = (MUSICA_ATUAL - 1 + MUSICAS_PLAYLIST.length) % MUSICAS_PLAYLIST.length;
		
        audio.src = `database/soundtrack/${MUSICAS_PLAYLIST[MUSICA_ATUAL].src}`;
        
        tituloElement.textContent = MUSICAS_PLAYLIST[MUSICA_ATUAL].titulo;
        autorElement.textContent = MUSICAS_PLAYLIST[MUSICA_ATUAL].autor;
        
		if (!MUSICA_ESTADO_PAUSADA) {
			audio.play()
		}
		
		return 1;
	} catch (error) {
		console.log('erro na função anteriorMusica(): ', error);
		return 0;
		
	}
}

function pausarMusica() {
	const audio = document.getElementById('musica-audio');
	const botao = document.getElementById('botao-musica-pausar');
	
	MUSICA_ESTADO_PAUSADA = !MUSICA_ESTADO_PAUSADA;

    if (MUSICA_ESTADO_PAUSADA) {
        botao.style.backgroundImage = 'url("database/assets/music/buttonMusicPaused.png")';
        audio.pause();
    } else {
        botao.style.backgroundImage = 'url("database/assets/music/buttonMusicUnpaused.png")';
        audio.play();
    }	
}

function atualizarVolumeImagem(botao, valor) {
	if (valor > 0.5) {
		botao.style.backgroundImage = 'url("database/assets/music/buttonMusicVolume2.png")'
	} else if (valor > 0) {
		botao.style.backgroundImage = 'url("database/assets/music/buttonMusicVolume1.png")'
	} else {
		botao.style.backgroundImage = 'url("database/assets/music/buttonMusicVolume0.png")'
	}
}

document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('musica-audio');
    const seekSlider = document.getElementById('musica-seek');
	
    audio.addEventListener('loadedmetadata', () => {
        seekSlider.max = audio.duration;
    });

    audio.addEventListener('timeupdate', () => {
        seekSlider.value = audio.currentTime;
		if (audio.currentTime == audio.duration) {
			proximaMusica()
		}
    });

    seekSlider.addEventListener('input', () => {
        audio.currentTime = seekSlider.value;
    });
	
	/* --------------- 
		MOVENDO OS ARRASTAVEIS!
	   ---------------
	*/
	
    const arrastavel = document.getElementById('arrastavel');
	const seekers = document.querySelectorAll('.seeker');

    if (!arrastavel) {
        console.error('Elemento com ID "arrastavel" não encontrado.');
        return;
    }

    let isDragging = false;
    let offsetX, offsetY;
	let isOverSeeker = false;
	
	seekers.forEach(seeker => {
		seeker.addEventListener('mouseenter', () => isOverSeeker = true);
        seeker.addEventListener('mouseleave', () => isOverSeeker = false);
	});
	
    arrastavel.addEventListener('mousedown', (e) => {
		if (!isOverSeeker) {
			isDragging = true;
			offsetX = e.clientX - arrastavel.getBoundingClientRect().left;
			offsetY = e.clientY - arrastavel.getBoundingClientRect().top;
			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
		}
    });

    function onMouseMove(e) {
        if (isDragging) {
            arrastavel.style.left = `${e.clientX - offsetX}px`;
            arrastavel.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
	
	/* --------------- 
		VOLUME DO ÁUDIO!
	   ---------------
	*/
	
	// audio já foi declarado
	const volumeSeeker = document.getElementById('volume-seek');
	const botaoVolume = document.getElementById('botao-musica-volume');
	
	volumeSeeker.addEventListener('input', () => {
        audio.volume = volumeSeeker.value;
		atualizarVolumeImagem(botaoVolume, volumeSeeker.value);
    });

});
