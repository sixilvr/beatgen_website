const goButton = document.getElementById("goButton");

goButton.onclick = () => {
	fetch("/generate")
		.then(response => response.json())
		.then(data => {
			const audioElement = document.getElementById("audioElement");
			const audioSource = document.getElementById("audioSource");
			console.log(data.info);
			audioSource.src = "/audio/" + data.fileid;
			audioElement.load();
			audioElement.play();
		});
}
