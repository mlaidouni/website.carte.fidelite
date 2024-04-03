/**
 * Représente la gestion d'un cadeau.
 * @constructor
 */
function Cadeau() {
  // Import du module PostgreSQL
  const pg = require("pg");
  // Création d'un pool de connection à la BD
  const pool = new pg.Pool({
    // Nom d'utilisateur, port, hôte, nom de la BD et mot de passe
    user: "mohaldn",
    port: 5432,
    host: "localhost",
    database: "websitecartefidelite",
    password: "kmzx",
  });

  // Client global, initialisé par connect()
  let client;

  // Connexion à la BD
  this.connect = async function () {
    // Connexion à la BD. Bloque sur cette instruction tant que la connection n'est pas établie.
    client = await pool.connect();

    // Déconnexion de la BD
    client.release();
  };

  /**
   * Insert un cadeau dans la BD.
   * @param {string} nom - Le nom du cadeau.
   * @param {integer} prix - Le prix du cadeau (en points).
   * @param {string} taille - La taille du cadeau.
   * @param {string} couleur - La couleeur du cadeau.
   * @param {string} description - La description du cadeau.
   * @async
   */
  this.insert = async function (
    nom,
    prix,
    taille,
    couleur,
    description,
    image
  ) {
    // Connexion à la BD
    client = await pool.connect();

    // Query
    let query = {
      // Requête à exécuter
      text: "INSERT INTO cadeaux (NOM, PRIX, TAILLE, COULEUR, DESCRIPTION, IMAGE) VALUES ($1, $2, $3, $4, $5, $6)",
      // Les valeurs à remplacer dans la requête
      values: [nom, prix, taille, couleur, description, image],
    };

    // On attent l'exécution de la requête
    await client.query(query);

    // On libère le client.
    client.release();
  };

  /**
   * Supprime un cadeau.
   * @param {integer} id - L'id du cadeau.
   * @async
   */
  this.delete = async function (id) {
    // Connexion à la BD
    client = await pool.connect();

    // Query
    let query = {
      // Requête à exécuter
      text: "DELETE FROM cadeaux WHERE CADEAUX_ID = $1",
      // Les valeurs à remplacer dans la requête
      values: [id],
    };
    // On attent l'exécution de la requête
    await client.query(query);
  };

  /**
   * Renvoie la liste des cadeaux.
   * @async
   */
  this.getAll = async function () {
    // Connexion à la BD
    client = await pool.connect();

    // On attent l'exécution de la requête
    let data = await client.query("SELECT * FROM cadeaux");

    // On libère le client.
    client.release();

    // On stocke les données dans un tableau
    let result = [];
    for (row of data.rows) result.push(row);

    return result;
  };
}

// Export du module
module.exports = new Cadeau();
