/**
 * Représente la gestion des personnes.
 * @constructor
 */
function Personne() {
  // Import du module PostgreSQL
  const pg = require("pg");
  // Création d'un pool de connection à la BD
  const pool = new pg.Pool({
    // port, hôte, nom de la BD et mot de passe (obligatoire)
    port: 5432,
    host: "localhost",
    database: "websitecartefidelite",
    password: "alo",
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
   * Renvoie la liste des personnes.
   * @async
   */
  this.getAll = async function () {
    // Connexion à la BD
    client = await pool.connect();

    // On attent l'exécution de la requête
    let data = await client.query("SELECT * FROM personnes");

    // On libère le client.
    client.release();

    // On stocke les données dans un tableau
    let result = [];
    for (row of data.rows) result.push(row);

    return result;
  };

  /**
   *
   * @param {string} userid
   * @param {string} password
   * @returns Renvoie la liste des personnes correspondant aux paramètres.
   * @async
   */
  this.search = async function (userid, password) {
    // Connexion à la BD
    client = await pool.connect();

    // La requête SQL
    let query = {
      text: "SELECT * FROM personnes WHERE user_id LIKE $1 AND password LIKE $2",
      values: [userid, password],
    };

    // On attent l'exécution de la requête
    let data = await client.query(query);

    // On libère le client.
    client.release();

    // On stocke les données dans un tableau
    let result = [];
    for (row of data.rows) result.push(row);

    return result;
  };

  // TODO: supprimer client

  // TODO: modifier client
}

// Export du module
module.exports = new Personne();
