const goButton = document.getElementById("goButton");
const audioWrapper = document.getElementById("audioWrapper");
const loadingSpinner = document.getElementById("loadingspinner");
const audioElement = document.getElementById("audioElement");
const downloadButton = document.getElementById("downloadButton");

goButton.onclick = () => {
	buttonCooldown();

	hide(audioElement);
	show(loadingSpinner);
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
