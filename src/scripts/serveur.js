// Import des modules express et path
const express = require("express");
const path = require("path");
const gestionCadeaux = require("./gestion_cadeaux");

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

server.get("/gerante/compte", (req, res, next) => {
  // TODO: render compte_gerante.ejs
  //   res.render("compte_gerante.ejs");
  next();
});

// Liste des clients (simulée pour cet exemple)

// GET /gerante/compte: affiche la page de compte de la gérante
server.get("/gerante/compte", (req, res) => {
  // On récupère le type de données demandées. Liste des clients par défaut
  const dataType = req.query.data === undefined ? "clients" : req.query.data;

  let data = gestionCadeaux
    .getAll()
    .then((result) => {
      // Afficher les données
      console.log("result: " + result);
    })
    .catch((error) => {
      console.error(error);
    });

  // FIXME: Trouver le moyen d'afficher la liste des kados
  let kado = data;
  console.log("len : " + kado.length);
  for (let i = 0; i < kado.length; i++) {
    console.log(kado[i].nom + "-" + kado[i].prix + " €");
  }

  // Récupérer les données de ma table cadeaux:
  // cadeaux_id, nom, prix, taille, couleur, description, image

  if (dataType === "clients")
    res.render("compte_gerante.ejs", {
      data: dataType,
      clients: [
        { nom: "alo 1", age: 30 },
        { nom: "laure 2", age: 25 },
        { nom: "nav 3", age: 40 },
      ],
    });
  else
    res.render("compte_gerante.ejs", {
      data: dataType,
      kado: data,
    });
});

// TODO: ajouter les autres requêtes en POST

// Lancer le serveur
const port = 8080;
server.listen(port, () => {
  console.log(
    `Application lancée. Veuillez vous connecter à l'adresse http://localhost:${port}/ pour commencer !`
  );
});
