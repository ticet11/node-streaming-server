const express = require("express");
const fs = require("fs");
const app = express();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/video", (req, res) => {
	const range = req.headers.range;
	if (!range) {
		res.status(404).send("Missing Range Header!");
	}

	const videoPath = "D:\\TV\\To Catch A Predator\\To Catch a Predator In The Beginning.mp4"; // Replace with your own video path or make it dynamic
	const videoSize = fs.statSync(videoPath).size;

	const CHUNK_SIZE = 5 * 10 ** 6;
	const start = Number(range.replace(/\D/g, ""));
	const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

	const contentLength = end - start + 1;
	const headers = {
		"Content-Range": `bytes ${start}-${end}/${videoSize}`,
		"Accept-Ranges": "bytes",
		"Content-Length": contentLength,
		"Content-Type": "video/mp4",
	};

	res.writeHead(206, headers);

	const videoStream = fs.createReadStream(videoPath, { start, end });

	videoStream.pipe(res);
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
