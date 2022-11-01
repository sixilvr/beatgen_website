const goButton = document.getElementById("goButton");
const audioWrapper = document.getElementById("audioWrapper");
const loadingSpinner = document.getElementById("loadingspinner");
const audioElement = document.getElementById("audioElement");
const downloadButton = document.getElementById("downloadButton");

const vis = document.getElementById("visualizer");
const ctx = vis.getContext("2d");
ctx.scale(1, -1);
ctx.translate(0, -vis.height);
ctx.fillStyle = "white";

const ac = new (window.AudioContext || window.webkitAudioContext)();
let aSrc = ac.createMediaElementSource(audioElement);
let as = ac.createAnalyser();
aSrc.connect(as);
as.connect(ac.destination);
as.fftSize = vis.width;
const bufferLength = as.frequencyBinCount;
const data = new Uint8Array(bufferLength);

const lowLimit = 3;
function animate() {
	ctx.clearRect(0, 0, vis.width, vis.height);
	as.getByteFrequencyData(data);
	for (let x = 0; x < bufferLength; x++) {
		let barHeight = data[x];
		if (x < lowLimit) {
			barHeight *= (x + 1) / lowLimit;
		}
		ctx.fillRect(2 * x, 0, 2, barHeight / 255 * (vis.height - 4));
	}
	requestAnimationFrame(animate);
}

goButton.onclick = () => {
	buttonCooldown();

	hide(audioElement);
	show(loadingSpinner);
	hide(vis);
	hide(downloadButton);

	fetch("/generate")
		.then(response => response.json())
		.then(data => {
			console.log(data.info);

			loadingSpinner.style.display = "none";

			const audioSource = document.getElementById("audioSource");
			audioSource.src = "/audio/" + data.fileid;
			audioElement.load();
			audioElement.play();
			audioElement.style.display = "block";
			downloadButton.href = audioSource.src;
			show(downloadButton);
			show(vis);
			animate();
		});
}

function hide(element) {
	element.style.display = "none";
}

function show(element) {
	element.style.display = "block";
}

function buttonCooldown() {
	goButton.disabled = true;
	setTimeout(() => {
		goButton.disabled = false;
	}, 10000);
}
