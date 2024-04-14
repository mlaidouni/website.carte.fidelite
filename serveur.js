// Import des modules express et path
const express = require("express");
const path = require("path");

// Import des modules de gestion des cadeaux et des personnes
const module_cadeau = require("./public/scripts/gestion_cadeaux");
const module_personne = require("./public/scripts/gestion_personnes");
// Nouvelle instance des fonctions de gestion des cadeaux et des personnes
const gestion_cadeaux = new module_cadeau("cadeaux");
const gestion_personnes = new module_personne("personnes");

/* ********** Création et configuration du serveur ********** */

// Création du serveur
const server = new express();
// Configuration du moteur de rendu sur EJS
server.set("view engine", "ejs");
// Configuration du dossier contenant les vues (fichiers .ejs)
server.set("views", path.join(__dirname, "views"));
// Configuration du dossier contenant les fichiers statiques
server.use(express.static(path.join(__dirname, "public")));
// Comprendre les données et les convertir en JavaScript
server.use(express.urlencoded({ extended: true }));
// Comprendre les données reçues au format JSON
server.use(express.json());

/* ********** Fichiers de vue ********** */

const connexion = "connexion.ejs";
const compte_client = "compte_client.ejs";
const compte_gerante = "compte_gerante.ejs";

/* ********** Fonctions utilitaires ********** */

// Configuration des couleurs pour les logs
const colors = {
  reset: "\x1b[0m", // Couleur par défaut
  bright: "\x1b[1m", // Gras
  dim: "\x1b[2m", // Faible intensité
  underscore: "\x1b[4m", // Souligné
  blink: "\x1b[5m", // Clignotant
  reverse: "\x1b[7m", // Inverser les couleurs
  hidden: "\x1b[8m", // Cacher le texte
  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
  },
};

// Fonction pour afficher les logs en couleur
const printlog = (message, color) => {
  console.log(`${colors.fg[color]}${message}${colors.reset}`);
};

const printError = (message) => {
  printlog(`${colors.bright}${message}`, "red");
};

const printWarning = (message) => {
  printlog(`${colors.dim}${message}`, "yellow");
};

/* ******************** Gestion des routes ******************** */

// Notification sur le terminal pour toutes les requêtes
server.use((req, res, next) => {
  // Afficher la méthode en bleu et l'URL en vert, sur la même ligne
  printlog(`${colors.dim}Le serveur a reçu la requête suivante:`, "magenta");
  printlog(`${colors.dim}-> ${req.method} ${req.url}`, "magenta");
  // Passer à la prochaine route
  next();
});

// Affiche la page d'accueil
server.get("/", (req, res) => {
  // Afficher le fichier accueil.html
  res.sendFile(path.join(__dirname, "public/pages/accueil.html"));
});

// Affiche la page de connexion (client & gerante)
server.get("/:type/connexion", (req, res) => {
  try {
    // Récupérer le type de connexion (client ou gerante)
    const type = req.params.type;

    // Vérifier que le type de connexion est valide
    if (type !== "client" && type !== "gerante")
      throw new Error(`Type de connexion "${type}" invalide.`);

    // Afficher la page de connexion correspondante
    res.render(connexion, { uti: type, incomplet: false });
  } catch (err) {
    printError("serveur: Erreur lors de l'affichage de la page de connexion:");
    printError(`-> ${err}`);
    res.status(500).send(`${err}`);
  }
});

/* ******************** Routes pour le client ******************** */

// Gestion de la connexion du client
server.post("/client/connexion", async (req, res) => {
  try {
    // Récupération des données de formulaire
    let id = req.body.id;
    let mdp = req.body.mdp;

    /* Vérifier que les données concordent avec la BD en cherchant les clients
    avec l'id et le mdp fournis */
    let clients = await gestion_personnes.search(id, mdp);

    /* NOTE: S'il existe un client avec ces données, il ne peut y en avoir qu'un 
    seul, car l'id est la clé primaire, donc unique. */

    // S'il y a un client avec ces données, on affiche son compte
    if (clients.length > 0) {
      // On récupère la liste des cadeaux du clients
      let cadeaux = await gestion_cadeaux.getClient(clients[0].points);
      res.render(compte_client, { client: clients[0], cadeaux });
    } else {
      // Sinon, on affiche la page de connexion avec un message d'erreur
      res.render(connexion, { uti: "client", incomplet: true });
    }
  } catch (error) {
    printError("serveur: Erreur lors de la connexion du client:");
    printError(`-> ${error}`);
    res.status(500).send(`${error}`);
  }
});

/* ******************** Routes pour la gerante ******************** */

// TODO: Fusionner les routes de connexion de la gérante et du client
// Gestion de la connexion de la gerante
server.post("/gerante/connexion", async (req, res) => {
  try {
    // Récupération des données de formulaire
    let mdp = req.body.mdp;

    // Vérifier que les données concordent avec la BD
    // On cherche une personne avec l'id admin et le mdp fourni
    // FIXME: Données en dur dans le code
    let admin = await gestion_personnes.search("elyogagnshit", mdp);

    // S'il y a un admin avec ces données, on affiche le compte admin
    if (admin.length > 0) res.redirect("/gerante/compte");
    else {
      // Sinon, on affiche la page de connexion avec un message d'erreur
      res.render(connexion, { uti: "gerante", incomplet: true });
    }
  } catch (error) {
    printError("serveur: Erreur lors de la connexion de la gérante:");
    printError(`-> ${error}`);
    res.status(500).send(`${error}`);
  }
});

// Affiche la page de compte de la gérante
server.get("/gerante/compte", async (req, res) => {
  try {
    // On récupère le type de données demandées. (Liste des clients par défaut)
    const dataType = req.query.data === undefined ? "clients" : req.query.data;

    // On renvoie le type de la donnée demandée et les données correspondantes
    let reponse = { datatype: dataType };

    if (dataType === "clients") {
      // On récupère la liste des clients
      let clients = await gestion_personnes.getClients();
      // On renvoie le type de la donnée demandée et les données correspondantes
      reponse["data"] = clients;
    } else if (dataType === "cadeaux") {
      // On récupère la liste des cadeaux
      let cadeaux = await gestion_cadeaux.getAll();
      // On renvoie le type de la donnée demandée et les données correspondantes
      reponse["data"] = cadeaux;
    }

    // Rendu de la page avec les bonnes données
    res.render(compte_gerante, reponse);
  } catch (error) {
    // prettier-ignore
    printError("serveur: Erreur lors de l'affichage de la page de compte de la gérante:");
    printError(`-> ${error}`);
    res.status(500).send(`${error}`);
  }
});

// Suppression d'un cadeau
server.delete("/gerante/compte/cadeaux", async (req, res) => {
  // Récupérer l'id du cadeau à supprimer
  let id = req.query.id;

  try {
    // Supprimer le cadeau de la base de données
    await gestion_cadeaux.delete(id);
    // Si on a pas levé d'erreur, on renvoie un message de succès
    res.json({ success: true, message: "Cadeau supprimé avec succès!" });
  } catch (error) {
    printError("serveur: Erreur lors de la suppression du cadeau:");
    printError(`-> ${error}`);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la suppression du cadeau.",
    });
  }
});

// Suppression d'un client
server.delete("/gerante/compte/clients", async (req, res) => {
  // Récupérer l'id du client à supprimer
  let id = req.query.id;

  try {
    // Supprimer le client de la base de données
    await gestion_personnes.delete(id);
    // Si on a pas levé d'erreur, on renvoie un message de succès
    res.json({ success: true, message: "Client supprimé avec succès!" });
  } catch (error) {
    printError("serveur: Erreur lors de la suppression du client:");
    printError(`-> ${error}`);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la suppression du client.",
    });
  }
});

// Update d'un cadeau
server.put("/gerante/compte/cadeaux", async (req, res) => {
  // Récupérer l'id du cadeau à mettre à jour
  let id = req.query.id;

  try {
    // Récupérer les nouvelles valeurs du cadeau
    let newValues = req.body;

    /* Pour chaque attribut du cadeau, on met à jour la valeur,
     * même si elle n'a pas changée */
    for (let attr in newValues)
      await gestion_cadeaux.update(id, attr, newValues[attr]);

    // Si on a pas levé d'erreur, on renvoie un message de succès
    res.json({ success: true, message: "Cadeau mis à jour avec succès!" });
  } catch (error) {
    printError("serveur: Erreur lors de la mise à jour du cadeau:");
    printError(`-> ${error}`);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la mise à jour du cadeau.",
    });
  }
});

// Update d'un client
server.put("/gerante/compte/clients", async (req, res) => {
  // Récupérer l'id du client à mettre à jour
  let id = req.query.id;

  try {
    // Récupérer les nouvelles valeurs du client
    let newValues = req.body;

    /* Pour chaque attribut du client, on met à jour la valeur,
     * même si elle n'a pas changée */
    for (let attr in newValues)
      await gestion_personnes.update(id, attr, newValues[attr]);

    // Si on a pas levé d'erreur, on renvoie un message de succès
    res.json({ success: true, message: "Client mis à jour avec succès!" });
  } catch (error) {
    printError("serveur: Erreur lors de la mise à jour du client:");
    printError(`-> ${error}`);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la mise à jour du client.",
    });
  }
});

// Ajout d'un cadeau
server.post("/gerante/compte/cadeaux", async (req, res) => {
  try {
    // Récupérer les données du formulaire dans un tableau
    let data = [];
    for (let attr in req.body) data.push(req.body[attr]);

    // On ajoute les valeurs dans la BD
    await gestion_cadeaux.insert(
      data[0],
      data[1],
      data[2],
      data[3],
      data[4],
      data[5]
    );

    // Si on a pas levé d'erreur, on renvoie un statut de succès
    res.status(200);

    // On recharge la page (on envoie pas de message de succès car on redirige)
    res.redirect("/gerante/compte?data=cadeaux");
  } catch (error) {
    printError("serveur: Erreur lors de l'ajout du client:");
    printError(`-> ${error}`);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de l'ajout du client.",
    });
  }
});

// Ajout d'un client
server.post("/gerante/compte/clients", async (req, res) => {
  try {
    // Récupérer les données du formulaire dans un tableau
    let data = [];
    for (let attr in req.body) data.push(req.body[attr]);

    // On ajoute les valeurs dans la BD
    await gestion_personnes.insert(
      data[0],
      data[1],
      data[2],
      data[3],
      data[4],
      data[5],
      data[6],
      data[7]
    );

    // Si on a pas levé d'erreur, on renvoie un statut de succès
    res.status(200);

    // On recharge la page (on envoie pas de message de succès car on redirige)
    res.redirect("/gerante/compte?data=clients");
  } catch (error) {
    printError("serveur: Erreur lors de l'ajout du client:");
    printError(`-> ${error}`);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de l'ajout du client.",
    });
  }
});

// CACA: A quoi sert cette route ? (créée par moha)
server.get("/gerante/compte/clients", async (req, res) => {
  let id = req.query.id;
  console.log("aLO");

  // FIXME: Données en dur dans le code => Créer une vraie fonction search par id
  let client = gestion_personnes.search(id, "password")[0];

  res.send(client);
});

/* ******************** Lancement du serveur ******************** */

// Lancer le serveur
const port = 8080;
server.listen(port, () => {
  console.log(
    `${colors.fg["green"]}Application lancée. Veuillez vous connecter à l'adresse ${colors.bright}${colors.underscore}http://localhost:${port}/${colors.reset}${colors.fg["green"]} pour commencer !${colors.reset}`
  );
});
