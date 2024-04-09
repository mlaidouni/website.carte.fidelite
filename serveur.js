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

server.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Une erreur est survenue sur le serveur.");
});

// Affiche la page d'accueil
server.get("/", (req, res) => {
  // Afficher le fichier accueil.html
  res.sendFile(path.join(__dirname, "public/pages/accueil.html"));
});

// Affiche la page de connexion (client & gérante)
server.get("/:type/connexion", (req, res) => {
  const type = req.params.type;
  res.render(connexion, { uti: type, incomplet: false });
});

/* ******************** Routes pour le client ******************** */

// Gestion de la connexion du client
server.post("/client/connexion", async (req, res) => {
  // Récupération des données de formulaire
  let id = req.body.id;
  let mdp = req.body.mdp;

  // Vérifier que les données concordent avec la BD
  let client_existant = await gestion_personnes.search(id, mdp);
  // On récupère la liste de l'ensemble des cadeaux
  let cadeaux = await gestion_cadeaux.getAll();

  let reponse = {
    data_client: client_existant,
    liste_cadeau: cadeaux,
  };

  // On teste si le client existe
  if (client_existant.length > 0) res.render(achat_cadeaux, reponse);
  else res.render(connexion, { uti: "client", incomplet: true });
});

/* ******************** Routes pour la gerante ******************** */

// Gestion de la connexion de la gerante
server.post("/gerante/connexion", async (req, res) => {
  // Récupération des données de formulaire
  let mdp = req.body.mdp;

  // Vérifier que les données concordent avec la BD
  // On cherche une personne avec l'id admin et le mdp fourni
  // FIXME: Données en dur dans le code
  let admin = await gestion_personnes.search("elyogagnshit", mdp);

  // On teste si le mdp est bon
  if (admin.length > 0) res.redirect("/gerante/compte");
  else res.render(connexion, { uti: "gerante", incomplet: true });
});

// Affiche la page de compte de la gérante
server.get("/gerante/compte", async (req, res) => {
  // On récupère le type de données demandées. (Liste des clients par défaut)
  const dataType = req.query.data === undefined ? "clients" : req.query.data;

  // On récupère la liste des cadeaux avec l'ensemble de leurs données (await pour attendre la fin de la requête)
  let cadeaux = await gestion_cadeaux.getAll();
  // On récupère la liste des clients
  let clients = await gestion_personnes.getClients();

  // On renvoie le type de la donnée demandée et les données correspondantes
  let reponse = {
    datatype: dataType,
    data: dataType === "cadeaux" ? cadeaux : clients,
  };

  // Rendu de la page avec les bonnes données
  res.render(compte_gerante, reponse);
});

// Suppression d'un cadeau
server.delete("/gerante/compte/cadeaux", async (req, res) => {
  let id = req.query.id;
  try {
    await gestion_cadeaux.delete(id);
    res.json({ success: true, message: "Cadeau supprimé avec succès!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la suppression du cadeau.",
    });
  }
});

// Suppression d'un client
server.delete("/gerante/compte/clients", async (req, res) => {
  let id = req.query.id;
  try {
    await gestion_personnes.delete(id);
    res.json({ success: true, message: "Client supprimé avec succès!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la suppression du client.",
    });
  }
});

// Update d'un client
server.put("/gerante/compte/clients", async (req, res) => {
  let id = req.query.id;
  let newValues = req.body;
  await gestion_personnes.update(id, "nom", newValues.nom);
  res.json({ success: true, message: "Client mis à jour avec succès!" });
});

/* ******************** Lancement du serveur ******************** */

// Lancer le serveur
const port = 8080;
server.listen(port, () => {
  console.log(
    `Application lancée. Veuillez vous connecter à l'adresse http://localhost:${port}/ pour commencer !`
  );
});
