// Import des modules express et path
const express = require("express");
const path = require("path");
const gestion_cadeaux = require("./public/scripts/gestion_cadeaux");
const gestion_personnes = require("./public/scripts/gestion_personnes");

/* ********** Création et configuration du serveur ********** */

// Création du serveur
const server = new express();
// Configuration du moteur de rendu sur EJS
server.set("view engine", "ejs");
// Configuration du dossier contenant les vues (fichiers .ejs)
server.set("views", path.join(__dirname, "views"));
// Configuration du dossier contenant les fichiers statiques
server.use(express.static(path.join(__dirname, "public")));
// server.use(express.static("public/styles"));
// Comprendre les données et les convertir en JavaScript
server.use(express.urlencoded({ extended: true }));
// Comprendre les données reçues au format JSON
server.use(express.json());

/* ********** Fichiers de vue ********** */
const connexion = "connexion.ejs";
const achat_cadeaux = "achat_cadeaux.ejs";
const compte_gerante = "compte_gerante.ejs";

/* ******************** Gestion des routes ******************** */

// Notification sur le terminal pour toutes les requêtes
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// GET / : affiche la page d'accueil
server.get("/", (req, res) => {
  // Afficher le fichier accueil.html
  res.sendFile(path.join(__dirname, "public/pages/accueil.html"));
});

// GET /client/connexion: affiche la page de connexion
server.get("/client/connexion", (req, res) => {
  res.render(connexion, { uti: "client", incomplet: false });
});

// POST /client/connexion
server.post("/client/connexion", async (req, res) => {
  // TODO: Récupérer les données du formulaire
  // Récupération des données de formulaire
  const id = req.body.id; // L'identifiant ('id') du formulaire EJS
  const mdp = req.body.mdp; // Le mot de passe ('mdp') du formulaire EJS
  // Utilisez idClient et motDePasse comme nécessaire, par exemple pour la validation d'authentification

  // TODO: Vérifier que les données concordent avec la BD
  // NOTE: Pour l'instant, on simule une recherche dans BD avec des données en dur
  let client_existant = await gestion_personnes.search(id, mdp)
  let cadeaux = await gestion_cadeaux.getAll();

  let reponse = {
    data_client: client_existant,
    liste_cadeau: cadeaux
  }
  if (client_existant.length > 0) {
    res.render(achat_cadeaux, reponse);
  }
  else {
    res.render(connexion, { uti: "client", incomplet: true })
  }
});



// NOTE: Requêtes en POST sur /client/compte ??

// GET /client/achat
// TODO: render achat_cadeaux
// NOTE: Est-ce nécessaire ? Ou est-ce que les pages compte et achat sont identiques ?
// (Penser à l'utilisation des paramètres dans les routes, comme pour /gerante/compte)

// GET /gerante/connexion: affiche la page de connexion
server.get("/gerante/connexion", (req, res) => {
  res.render(connexion, { uti: "gerante", incomplet: false });
});

// POST /gerante/connexion
server.post("/gerante/connexion", async (req, res) => {
  const mdp = req.body.mdp;
  // TODO: Vérifier que les données concordent avec la BD
  // FIXME: Test hardcoded
  let mdp_gerante = await gestion_personnes.search('elyogagnshit', mdp);
  if (mdp_gerante.length > 0) {
    res.redirect("/gerante/compte");
  }
  else {
    res.render(connexion, { uti: "gerante", incomplet: true })
  }

  // TODO: Redirect vers /gerante/compte

});

// GET /gerante/compte: affiche la page de compte de la gérante
server.get("/gerante/compte", async (req, res) => {
  console.log(" loooooooooo");
  // On récupère le type de données demandées. (Liste des clients par défaut)
  const dataType = req.query.data === undefined ? "clients" : req.query.data;

  // On récupère la liste des cadeaux avec l'ensemble de leurs données (await pour attendre la fin de la requête)
  let cadeaux = await gestion_cadeaux.getAll();
  // On récupère la liste des clients avec l'ensemble de leurs données (await pour attendre la fin de la requête)
  let clients = await gestion_personnes.getAll();

  // On renvoie le type de la donnée demandée et les données correspondantes
  let reponse = {
    datatype: dataType,
    data: dataType === "cadeaux" ? cadeaux : clients,
  };

  // Rendu de la page avec les bonnes données
  res.render(compte_gerante, reponse);
});

// TODO: ajouter les autres requêtes en POST

// Lancer le serveur
const port = 8080;
server.listen(port, () => {
  console.log(
    `Application lancée. Veuillez vous connecter à l'adresse http://localhost:${port}/ pour commencer !`
  );
});
