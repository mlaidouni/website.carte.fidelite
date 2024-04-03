// Import des modules express et path
const express = require("express");
const path = require("path");
const gestion_cadeaux = require("./gestion_cadeaux");

/* ********** Création et configuration du serveur ********** */

// Création du serveur
const server = new express();
// Configuration du dossier contenant les vues (fichiers .ejs)
server.set("views", path.join(__dirname, "../pages"));
// Configuration du dossier contenant les fichiers statiques
server.use(express.static("public"));
// Comprendre les données et les convertir en JavaScript
server.use(express.urlencoded({ extended: true }));
// Comprendre les données reçues au format JSON
server.use(express.json());

/* ******************** Gestion des routes ******************** */

// Notification sur le terminal pour toutes les requêtes
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// GET / : affiche la page d'accueil
server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../pages", "accueil.html"));
});

// GET /client/connexion: affiche la page de connexion
server.get("/client/connexion", (req, res) => {
  res.render("connexion.ejs");
});

// POST /client/connexion
server.post("/client/connexion", (req, res) => {
  // TODO: Récupérer les données du formulaire
  // ...

  // TODO: Vérifier que les données concordent avec la base de donnée
  // ...

  // TODO: Redirect vers /client/compte
  res.redirect("/client/compte");
});

// GET /client/compte: affiche la page de compte du client
server.get("/client/compte", (req, res) => {
  res.render("compte_client.ejs");
});

// NOTE: Requêtes en POST sur /client/compte ??

// GET /client/achat
// TODO: render achat_cadeaux.ejs
// NOTE: Est-ce nécessaire ? Ou est-ce que les pages compte et achat sont identiques ?
// (Penser à l'utilisation des paramètres dans les routes, comme pour /gerante/compte)

// GET /gerante/connexion: affiche la page de connexion
server.get("/gerante/connexion", (req, res) => {
  res.render("connexion.ejs");
});

// POST /gerante/connexion
server.post("/gerante/connexion", (req, res) => {
  // TODO: Récupérer les données du formulaire
  // ...

  // TODO: Vérifier que les données concordent avec la base de donnée
  // ...

  // TODO: Redirect vers /gerante/compte
  res.redirect("/gerante/compte");
});

// GET /gerante/compte: affiche la page de compte de la gérante
server.get("/gerante/compte", async (req, res) => {
  // On récupère le type de données demandées. (Liste des clients par défaut)
  const dataType = req.query.data === undefined ? "clients" : req.query.data;
  // Fichier de vue
  const renderFile = "compte_gerante.ejs";

  // On récupère la liste des cadeaux avec l'ensemble de leurs données (await pour attendre la fin de la requête)
  let cadeaux = await gestion_cadeaux.getAll();
  // On récupère la liste des clients avec l'ensemble de leurs données (await pour attendre la fin de la requête)
  let clients = [
    { nom: "alo 1", age: 30 },
    { nom: "laure 2", age: 25 },
    { nom: "nav 3", age: 40 },
  ];
  /* FIXME: Remplacer les données fictives par les données de la base de données, 
   (en attente de la fonction getAll() de gestion_client.js):
   let clients = await gestion_clients.getAll(); */

  let reponse = {
    datatype: dataType,
    data: dataType === "cadeaux" ? cadeaux : clients,
  };

  /* CACA: Test de l'affichage des données : voir fichier toDo.md */

  // Rendu de la page avec les bonnes données
  res.render(renderFile, reponse);
});

// TODO: ajouter les autres requêtes en POST

// Lancer le serveur
const port = 8080;
server.listen(port, () => {
  console.log(
    `Application lancée. Veuillez vous connecter à l'adresse http://localhost:${port}/ pour commencer !`
  );
});
