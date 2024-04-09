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
   * Insère un client dans la BD
   * @param {string} userid - L'id du client.
   * @param {string} password Le mdp du client.
   * @param {string} nom Le nom du client.
   * @param {string} prenom Le prenom du client.
   * @param {string} email L'email du client.
   * @param {string} num Le numéro de téléphone du client.
   * @param {string} date La date de naissance du client.
   * @param {int} points Le nombre de points du client.
   */
  this.insert = async function (
    userid,
    password,
    nom,
    prenom,
    email,
    num,
    date,
    points
  ) {
    // Connexion à la BD
    client = await pool.connect();

    // Query
    let query = {
      // Requête à exécuter
      text: "INSERT INTO personnes (USER_ID, PASSWORD, NOM, PRENOM, EMAIL, TELEPHONE, DATE_NAISSANCE,  POINTS) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      // Les valeurs à remplacer dans la requête
      values: [userid, password, nom, prenom, email, num, date, points],
    };

    // On attent l'exécution de la requête
    await client.query(query);

    // On libère le client.
    client.release();
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
   * Modifie l'un des attributs d'un client dans la BD
   * @param {string} userid - L'id du client.
   * @param {string} attr - L'attribut à modifier.
   * @param {string} value - La nouvelle valeur de l'attribut.
   * @async
   */
  this.update = async function (userid, attr, value) {
    // Connexion à la BD
    client = await pool.connect();

    // Query
    let query = {
      // Requête à exécuter
      text: "UPDATE personnes SET " + attr + " = $1 WHERE user_id = $2",
      // Les valeurs à remplacer dans la requête
      values: [value, userid],
    };

    // On attent l'exécution de la requête
    await client.query(query);

    // On libère le client.
    client.release();
  };
}

// Export du module
module.exports = new Personne();
