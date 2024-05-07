// Import des modules express et path
const express = require("express");
const path = require("path");
// Impot du module moment pour manipuler les dates
const moment = require("moment");

/* On charge les variables d'environnement. Cela permet notamment de charger
 * les variables nécessaires à la connexion du pool, pour plus de sécurité. */
require("dotenv").config();

// Import des modules de gestion des cadeaux et des personnes
const module_cadeau = require("./scripts/gestion_cadeaux");
const module_personne = require("./scripts/gestion_personnes");
// Nouvelle instance des fonctions de gestion des cadeaux et des personnes
const gestion_cadeaux = new module_cadeau("cadeaux");
const gestion_personnes = new module_personne("personnes");

/* ********** Import et configuration de multer ********** */

const multer = require("multer");
/* Ici, cb est une fonction de callback. Elle est appelée par multer lorsqu'il
 *  a terminé de traiter le fichier. */
const storage = multer.diskStorage({
  // Configuration de la destination de stockage des fichiers uploadés.
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  // Configuration du nom des fichiers uploadés.
  filename: function (req, file, cb) {
    // On conserve le nom original, auquel on ajoute la date actuelle
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

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
  console.error(`${colors.bright}${colors.fg["red"]}${message}${colors.reset}`);
};

const printWarning = (message) => {
  printlog(`${colors.blink}${message}`, "yellow");
};

/* ********** Gestion des clients connectés ********** */

// Import des modules express-session et client
const session = require("express-session");
const Client = require("./scripts/client");

function create_client(client, points) {
  let client_connected = {};

  // Initialisation des valeurs du client.
  client_connected.client = client;
  client_connected.points = points;
  client_connected.points_h = points;
  client_connected.panier = [];
  client_connected.panier_value = 0;
  client_connected.panier_counter = 0;
  client_connected.current_stock = {};

  return client_connected;
}

server.use(
  session({
    // Une chaîne de caractères utilisée pour signer le cookie de session
    secret: "ceci-est-un-secret",
    // On se sauvegarde pas les session non modifiée
    resave: false,
    // On ne stocke pas les sessions vides
    saveUninitialized: false,
    // Les cookies sont envoyés via HTTP
    cookie: { secure: false },
  })
);

/**
 * Récupérer le client connecté de la session.
 * @param {*} req - La requête.
 * @param {*} res - La réponse.
 * @returns {string} - L'ID du client connecté, ou null sinon.
 */
function getClientConnected(req, res) {
  let client = req.session.client;

  // Si aucun client n'est connecté, on redirige vers la page de connexion
  if (!client) res.redirect("/client/connexion");

  return client;
}

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
  // Récupérer le type de connexion (client ou gerante)
  const type = req.params.type;

  try {
    // Vérifier que le type de connexion est valide
    if (type !== "client" && type !== "gerante")
      throw new Error(`Type de connexion "${type}" invalide.`);

    // Afficher la page de connexion correspondante
    res.render(connexion, { type: type, hasError: false });
  } catch (error) {
    printError("serveur: Erreur lors de l'affichage de la page de connexion:");
    printError(`-> ${error}`);
    res.status(500).send(`${error}`);
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
    // On récupère la liste des clients
    let data = await gestion_personnes.getClients();
    // On ne garde que les id des clients
    data = data.map((client) => client.user_id);

    // Vérifier qu'il existe un client avec cet id
    if (!data.includes(id)) {
      // Sinon, on affiche la page de connexion avec un message d'erreur
      res.render(connexion, {
        type: "client",
        hasError: true,
        message: "Identifiant incorrect",
      });
    } else {
      // Vérifier qu'il existe un client avec cet id et ce mdp
      let data = await gestion_personnes.search(id, mdp);

      if (data.length === 0) {
        res.render(connexion, {
          type: "client",
          hasError: true,
          message: "Mot de passe incorrect",
        });
      } else {
        /* NOTE: S'il existe un client avec ces données, il ne peut y en avoir
         *  qu'un seul, car l'id est la clé primaire, donc unique. */

        // On initialise le client connecté actuellement
        let client = create_client(data[0], data[0].points);

        // On stocke le client dans la session
        req.session.client = client;

        // On redirige vers la page du compte
        res.redirect("/client/compte");
      }
    }
  } catch (error) {
    printError("serveur: Erreur lors de la connexion du client:");
    printError(`-> ${error}`);
    res.status(500).send(`${error}`);
  }
});

// On renvoie true si c'est l'anniversaire du client connecté
server.get("/client/isAnniversaire", async (req, res) => {
  try {
    // On récupère le client à partir de la session
    let client_connected = getClientConnected(req, res);

    // Si aucun client n'est connecté
    if (!client_connected) res.redirect("/client/connexion");

    // On récupère la date actuelle et la date de naissance du client
    const now = moment();
    const anniversaire = moment(client_connected.client.date_naissance);
    // On vérifie si c'est l'anniversaire du client
    let isAnniversaire =
      now.date() === anniversaire.date() &&
      now.month() === anniversaire.month();

    // On renvoie la valeur de isAnniversaire
    res.status(200).json({ isAnniversaire: isAnniversaire });
  } catch (error) {
    printError("serveur: Erreur lors de la vérification de l'anniversaire:");
    printError(`-> ${error}`);
    res.status(500).send(`${error}`);
  }
});

// Affiche la page de compte du client
server.get("/client/compte", async (req, res) => {
  try {
    // On récupère le type de données demandées. (accueil ou panier)
    const dataType = req.query.data === undefined ? "accueil" : req.query.data;

    // On récupère le client à partir de la session
    let client_connected = getClientConnected(req, res);

    // Si aucun client n'est connecté
    if (!client_connected) res.redirect("/client/connexion");

    // On récupère la date actuelle et la date de naissance du client
    const now = moment();
    const anniversaire = moment(client_connected.client.date_naissance);
    // On vérifie si c'est l'anniversaire du client
    let isAnniversaire =
      now.date() === anniversaire.date() &&
      now.month() === anniversaire.month();

    // On renvoie le type de la donnée demandée
    let reponse = {
      client: client_connected.client,
      points: client_connected.points,
      points_h: client_connected.points_h,
      panier_counter: client_connected.panier_counter,
      panier_value: client_connected.panier_value,
      datatype: dataType,
      anniversaire: isAnniversaire,
      stock: client_connected.current_stock,
    };

    if (dataType === "accueil") {
      // On récupère la liste des cadeaux du client
      let cadeaux = await gestion_cadeaux.getNormalForClient(
        client_connected.points_h
      );

      let speciaux = await gestion_cadeaux.getSpecialForClient(
        client_connected.points_h
      );

      // On renvoie les données correspondantes
      reponse["data"] = cadeaux;
      reponse["speciaux"] = speciaux;
    } else if (dataType === "panier") {
      // On renvoie les données correspondantes
      reponse["data"] = client_connected.panier;
    }

    // Rendu de la page avec les bonnes données
    res.render(compte_client, reponse);
  } catch (error) {
    printError("serveur: Erreur lors de la connexion du client:");
    printError(`-> ${error}`);
    res.status(500).send(`${error}`);
  }
});

// Gestion de la deconnexion du client
server.post("/client/deconnexion", (req, res) => {
  try {
    // On récupère le client à partir de la session
    let client_connected = getClientConnected(req, res);

    // Si un client est connecté
    if (client_connected)
      // On supprime l'ID du client de la session
      delete req.session.client;

    // Si on a pas levé d'erreur, on renvoie un statut de succès
    res.status(200);
    // On redirige l'utilisateur vers la page de connexion client
    res.redirect("/client/connexion");
  } catch (error) {
    printError("serveur: Erreur lors de la déconnexion du client:");
    printError(`-> ${error}`);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la déconnexion du client.",
    });
  }
});

// Récupération des cadeaux à afficher
server.put("/client/compte/cadeau", async (req, res) => {
  try {
    // On récupère l'identifiant du cadeau à afficher
    let cadeau_id = req.body.id;

    // On récupère le client à partir de la session
    let client_connected = getClientConnected(req, res);

    // Si aucun client n'est connecté
    if (!client_connected) res.redirect("/client/connexion");

    // On récupère le cadeau à afficher
    let cadeau = await gestion_cadeaux.getCadeau(cadeau_id);

    // On récupère la liste des autres cadeaux du même type.
    let data;
    if (cadeau.type === "normal")
      // On récupère les cadeaux que le client peut désormais acheter
      data = await gestion_cadeaux.getNormalForClient(
        client_connected.points_h
      );
    else if (cadeau.type === "special")
      data = await gestion_cadeaux.getSpecialForClient(
        client_connected.points_h
      );

    // La liste des autres cadeaux de même produit_id.
    let cadeaux = data[cadeau.produit_id];

    // On retire le cadeau à afficher de la liste des autres cadeaux
    let index = cadeaux.findIndex((c) => c.cadeau_id === cadeau_id);
    if (index !== -1) cadeaux.splice(index, 1);

    /* Si on a pas levé d'erreur, on renvoie un message de succès, accompagné
     * des valeurs qui doivent être modifiées à l'affichage. */
    res.status(200).json({
      success: true,
      message: "Cadeau récupéré avec succès!",
      cadeau: cadeau,
      cadeaux: cadeaux,
      stock: client_connected.current_stock,
    });
  } catch (error) {
    printError("serveur: Erreur lors de la récupération du cadeau:");
    printError(`-> ${error}`);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la récupération du cadeau.",
    });
  }
});

// Ajout d'un cadeau au panier
server.post("/client/compte/cadeau", async (req, res) => {
  try {
    // Récupérer l'identifiant du cadeau à ajouté
    let cadeau_id = req.body.id;

    // On récupère le client à partir de la session
    let client_connected = getClientConnected(req, res);

    // Si aucun client n'est connecté
    if (!client_connected) res.redirect("/client/connexion");

    // On cherche le cadeau dans la BD
    let cadeau = await gestion_cadeaux.getCadeau(cadeau_id);
    // On crée une nouvelle instance de client pour utiliser ses méthodes
    let client = new Client(client_connected);
    // On ajoute le cadeau au panier
    client.add(cadeau);

    // On récupère les cadeaux que le client peut désormais acheter
    let cadeaux_normaux = await gestion_cadeaux.getNormalForClient(
      client_connected.points_h
    );
    let cadeaux_speciaux = await gestion_cadeaux.getSpecialForClient(
      client_connected.points_h
    );

    /* Si on a pas levé d'erreur, on renvoie un message de succès, accompagné
     * des valeurs qui doivent être modifiées à l'affichage. */
    res.status(200).json({
      success: true,
      message: "Cadeau ajouté au panier avec succès!",
      points: client_connected.points,
      points_h: client_connected.points_h,
      panier_counter: client_connected.panier_counter,
      normaux: cadeaux_normaux,
      speciaux: cadeaux_speciaux,
      stock: client_connected.current_stock,
    });
  } catch (error) {
    printError("serveur: Erreur lors de l'ajout du cadeau au panier:");
    printError(`-> ${error}`);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de l'ajout du cadeau au panier.",
    });
  }
});

// En cas de validation du panier
server.post("/client/compte/panier", async (req, res) => {
  try {
    // On récupère le client à partir de la session
    let client_connected = getClientConnected(req, res);

    // Si aucun client n'est connecté
    if (!client_connected) res.redirect("/client/connexion");

    // On décrémente le stock de chaque cadeau dans le panier
    for (let i = 0; i < client_connected.panier.length; i++)
      await gestion_cadeaux.destock(client_connected.panier[i].cadeau_id);

    // On met a jour les points du clients
    await gestion_personnes.update(
      client_connected.client.user_id,
      "points",
      client_connected.points_h
    );

    // On crée une nouvelle instance de client pour utiliser ses méthodes
    let client = new Client(client_connected);
    // On valide le panier
    client.valider_panier();

    res.status(200).json({
      success: true,
      message: "Panier validé!",
    });
  } catch (error) {
    printError("serveur: Erreur lors de la validation du panier:");
    printError(`-> ${error}`);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la validation du panier.",
    });
  }
});

// On vide le panier
server.delete("/client/compte/panier", (req, res) => {
  try {
    // On récupère le client à partir de la session
    let client_connected = getClientConnected(req, res);

    // Si aucun client n'est connecté
    if (!client_connected) res.redirect("/client/connexion");

    // On crée une nouvelle instance de client pour utiliser ses méthodes
    let client = new Client(client_connected);
    // On vide le panier
    client.empty_panier();

    res.status(200).json({
      success: true,
      message: "Panier vidé!",
    });
  } catch (error) {
    printError("serveur: Erreur lors du vidage du panier:");
    printError(`-> ${error}`);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors du vidage du panier.",
    });
  }
});

// Gestion de la suppression d'un cadeau dans le panier
server.put("/client/compte/panier", async (req, res) => {
  try {
    // On récupère le client à partir de la session
    let client_connected = getClientConnected(req, res);

    // Si aucun client n'est connecté
    if (!client_connected) res.redirect("/client/connexion");

    // Récupérer l'identifiant du cadeau à supprimer
    let cadeau_id = Number(req.body.id);

    // On cherche le cadeau dans le panier
    let index = client_connected.panier.findIndex(
      (cadeau) => cadeau.cadeau_id === cadeau_id
    );

    // Si le cadeau est dans le panier, on le supprime
    if (index !== -1) {
      // On récupère le cadeau à supprimer
      let cadeau = client_connected.panier[index];
      // On retire le cadeau du panier
      client_connected.panier.splice(index, 1);

      // On met à jour les valeurs du client
      client_connected.panier_counter = client_connected.panier.length;
      client_connected.panier_value -= cadeau.prix;
      client_connected.points_h += cadeau.prix;

      if (client_connected.current_stock[cadeau_id] < 0)
        client_connected.current_stock[cadeau_id] = 1;
      else client_connected.current_stock[cadeau_id] += 1;

      // On renvoie un message de succès
      res.status(200).json({
        success: true,
        message: "Cadeau supprimé du panier avec succès!",
        points: client_connected.points,
        points_h: client_connected.points_h,
        panier_counter: client_connected.panier_counter,
      });
    } else throw new Error("Cadeau non trouvé dans le panier.");
  } catch (error) {
    printError("serveur: Erreur lors de la suppression du cadeau du panier:");
    printError(`-> ${error}`);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la suppression du cadeau.",
    });
  }
});

/* ******************** Routes pour la gerante ******************** */

// Gestion de la connexion de la gerante
server.post("/gerante/connexion", async (req, res) => {
  try {
    // Récupération des données de formulaire
    let id = req.body.id;
    let mdp = req.body.mdp;

    /* Vérifier que les données concordent avec la BD en cherchant les gerantes
    avec l'id et le mdp fournis */

    // On récupère la liste des gerantes
    let data = await gestion_personnes.getGerantes();
    // On ne garde que les id des gerantes
    data = data.map((gerante) => gerante.user_id);

    // Vérifier qu'il existe une gerante avec cet id
    if (!data.includes(id)) {
      // Sinon, on affiche la page de connexion avec un message d'erreur
      res.render(connexion, {
        type: "gerante",
        hasError: true,
        message: "Identifiant incorrect",
      });
    } else {
      // Vérifier qu'il existe une gerante avec cet id et ce mdp
      let data = await gestion_personnes.search(id, mdp);

      if (data.length === 0) {
        res.render(connexion, {
          type: "gerante",
          hasError: true,
          message: "Mot de passe incorrect",
        });
      } else {
        // S'il y a une gerante avec ces données, on affiche le compte gerante
        res.redirect("/gerante/compte");
      }
    }
  } catch (error) {
    printError("serveur: Erreur lors de la connexion de la gerante:");
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
    printError(
      "serveur: Erreur lors de l'affichage de la page de compte de la gérante:"
    );
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
    res
      .status(200)
      .json({ success: true, message: "Cadeau supprimé avec succès!" });
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
    res
      .status(200)
      .json({ success: true, message: "Client supprimé avec succès!" });
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
    res
      .status(200)
      .json({ success: true, message: "Cadeau mis à jour avec succès!" });
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

    // On récupère le client potentiellement connecté à partir de la session
    let client_connected = getClientConnected(req, res);

    // Si un client est connecté
    if (client_connected) {
      // On crée une nouvelle instance de client pour utiliser ses méthodes
      let client = new Client(client_connected);

      // On récupère les données (à jour) du client
      let data = await gestion_personnes.search(
        id,
        client_connected.client.password
      );

      // On met à jour les points du client
      client.update(data[0], newValues["points"]);
    }

    // Si on a pas levé d'erreur, on renvoie un message de succès
    res
      .status(200)
      .json({ success: true, message: "Client mis à jour avec succès!" });
  } catch (error) {
    printError("serveur: Erreur lors de la mise à jour du client:");
    printError(`-> ${error}`);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la mise à jour du client.",
    });
  }
});

// Gérer l'ajout d'un cadeau avec l'updload d'une image
server.post(
  "/gerante/compte/cadeaux",
  upload.single("uploaded-image"),
  async (req, res) => {
    try {
      // Récupérer les données du formulaire dans un tableau
      let data = [];
      for (let attr in req.body) data.push(req.body[attr]);

      // Ajouter le chemin du fichier téléchargé à data
      data.push(req.file.filename);

      // On ajoute les valeurs dans la BD
      await gestion_cadeaux.insert(
        data[0],
        data[1],
        data[2],
        data[3],
        data[4],
        data[5],
        data[6],
        data[7],
        data[8]
      );

      // Si on a pas levé d'erreur, on renvoie un message de succès
      res.status(200);
      res.redirect("/gerante/compte?data=cadeaux");
    } catch (error) {
      printError("serveur: Erreur lors de l'ajout du cadeau:");
      printError(`-> ${error}`);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de l'ajout du cadeau.",
      });
    }
  }
);

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

    // Si on a pas levé d'erreur, on renvoie un message de succès
    res.status(200);
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

/* ******************** Lancement du serveur ******************** */

// Lancer le serveur
const port = 8080;
server.listen(port, () => {
  console.log(
    `Application lancée. Connectez-vous à l'adresse http://localhost:${port}/`
  );
});
