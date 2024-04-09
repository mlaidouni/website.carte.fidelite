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

  this.getClients = async function () {
    // Connexion à la BD
    client = await pool.connect();

    // On attent l'exécution de la requête
    // FIXME:  Données en dur dans le code
    let data = await client.query(
      "SELECT * FROM personnes WHERE user_id <> 'elyogagnshit'"
    );

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

  /**
   *
   * @param {int} id L'id du client. On part du principe que ça ne peut être l'id du
   * @async
   */
  this.delete = async function (id) {
    // Connexion à la BD
    client = await pool.connect();

    // Requête SQL
    let query = {
      // La requête à exécuter
      text: "DELETE FROM personnes WHERE user_id = $1",
      // Les valeurs à remplacer dans la requête
      values: [id],
    };

    // On attent l'exécution de la requête
    await client.query(query);
  };

  // TODO: modifier client
}

// Export du module
module.exports = new Personne();
