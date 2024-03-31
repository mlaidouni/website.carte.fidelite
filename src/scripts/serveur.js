// Import des modules express et path
const express = require("express");
const path = require("path");

// Création et configuration du serveur
const server = new express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

/* Gestion des Routes */

// Notification sur le terminal pour toutes les requêtes
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// GET /
// TODO: render accueil.html
server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../pages", "accueil.html"));
});

// GET client/connexion
// TODO: redirect client/compte
server.get("/client/connexion", (req, res) => {
  res.send("Ceci est la page de connexion CLIENT !");
});

// GET client/compte
// TODO: render compte_client.ejs

// GET client/achat
// TODO: render achat_cadeaux.ejs

// GET gerante/connexion
// TODO: redirect gerante/compte
server.get("/gerante/connexion", (req, res) => {
  res.send("Ceci est la page de connexion GERANTE !");
});

// GET gerante/compte
// TODO: render compte_gerante.ejs

// TODO: ajouter les requêtes en POST

// Lancer le serveur...
// Start the server
const port = 8080;
server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}/`);
});
