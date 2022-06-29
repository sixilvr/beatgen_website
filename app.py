#TODO: allow downloads, visualizer, cooldown, loading animation

import os
import subprocess
import threading
import uuid

import flask

import beatgen

os.chdir(os.path.dirname(__file__))

app = flask.Flask(__name__)

@app.route("/")
def index():
	return flask.render_template("index.html")

resource_folder = os.path.dirname(beatgen.__file__)
data_generators = beatgen.prep_beat(resource_folder)

@app.route("/generate")
def generate():
	fileid = uuid.uuid4().hex
	song, gen_info = beatgen.finish_beat(resource_folder, data_generators)
	song.save(f"user_audio/{fileid}.wav")
	subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error",
		"-i", f"user_audio/{fileid}.wav", "-b:a", "96k", f"user_audio/{fileid}.mp3"])
	os.remove(f"user_audio/{fileid}.wav")
	data = {
		"fileid": fileid,
		"info": gen_info
	}
	return data

def delete_later(file, seconds = 120):
	timer = threading.Timer(seconds, lambda: os.remove(file))
	timer.start()

@app.route("/audio/<fileid>")
def send_audio(fileid):
	try:
		int(fileid, 16)
	except ValueError:
		return "Invalid file ID", 400
	filename = f"user_audio/{fileid}.mp3"
	delete_later(filename)
	return flask.send_file(filename)

#app.run(port = "80", debug = True)
