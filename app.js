const fs = require("fs");
const fileName = "canciones.json";
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/canciones", (req, res) => {
  const canciones = JSON.parse(fs.readFileSync("canciones.json"));
  res.status(200).json(canciones);
});

app.post("/canciones", (req, res) => {
  const { artista, id, titulo, tono } = req.body;

  const canciones = JSON.parse(fs.readFileSync("canciones.json"));
  const searchSong = canciones.find((c) => c.titulo == titulo);

  if (searchSong) {
    return res.status(200).json({ message: "Esta canción ya existe." });
  }

  const data = {
    artista,
    id,
    titulo,
    tono,
  };

  canciones.push(data);
  fs.writeFileSync(fileName, JSON.stringify(canciones), "utf-8");
  return res.status(201).json({
    resultado: true,
    canciones: data,
  });
  return;
});

app.delete("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const canciones = JSON.parse(fs.readFileSync("canciones.json"));
  const newSongs = canciones.filter((cancion) => cancion.id != id);
  fs.writeFileSync("canciones.json", JSON.stringify(newSongs), "utf-8");
  return res.status(204).json();
});

app.put("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const canciones = req.body;
  const songMod = JSON.parse(fs.readFileSync("canciones.json"));
  const index = songMod.findIndex((cancion) => cancion.id == id);
  songMod[index] = canciones;
  fs.writeFileSync("canciones.json", JSON.stringify(songMod), "utf8");
  res.send("La canción ha sido modificada exitosamente.");
});

app.listen(5500, () => {
  console.log("servidor corriendo en el puerto 5500");
});
