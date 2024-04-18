/**
 * Représente la gestion des personnes.
 * @constructor
 */
function Personne(tableName) {
  // Import du module PostgreSQL
  const pg = require("pg");
  // Création d'un pool de connection à la BD
  const pool = new pg.Pool({
    // port, hôte, nom de la BD et mot de passe (obligatoire)
    port: process.env.PG_PORT,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
  });

  // Client global, initialisé par connect()
  let client;

  /**
   * Récupère les colonnes d'une table.
   * @returns {Array} Les colonnes de la table.
   * @async
   * @throws {Error} Si une erreur survient lors de la récupération des colonnes
   */
  this.getColumns = async function () {
    // Connexion à la BD
    const client = await pool.connect();
    let data;

    try {
      // Requête à exécuter
      let query = {
        // On conserve l'ordre des colonnes
        text: "SELECT column_name FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position",
        // Les valeurs à remplacer dans la requête
        values: [tableName],
      };

      // On attent l'exécution de la requête
      data = await client.query(query);
    } catch (error) {
      // On relance l'erreur pour qu'elle puisse être gérée par le serveur
      throw error;
    } finally {
      // On libère le client, que la requête ait réussi ou non.
      client.release();
    }

    // On stocke les noms des colonnes dans un tableau
    let result = [];
    for (let row of data.rows) result.push(row.column_name);
    return result;
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

    // Récupérer les colonnes de la table
    let columns = await this.getColumns();
    // On transforme le tableau en une string séparée par des virgules
    let col = columns.join(", ");
    let values = "($1, $2, 'U', $3, $4, $5, $6, $7, $8)";

    try {
      // Requête à exécuter
      let query = {
        text: `INSERT INTO ${tableName} (${col}) VALUES ${values}`,
        // Les valeurs à remplacer dans la requête
        values: [userid, password, nom, prenom, email, num, date, points],
      };

      // On attent l'exécution de la requête
      await client.query(query);
    } catch (error) {
      // On relance l'erreur pour qu'elle puisse être gérée par le serveur
      throw error;
    } finally {
      // On libère le client, que la requête ait réussi ou non.
      client.release();
    }
  };

  /**
   * Supprime un client dans la BD.
   * @param {integer} id - L'id du client.
   * @async
   */
  this.delete = async function (id) {
    // Connexion à la BD
    client = await pool.connect();

    try {
      // Requête à exécuter
      let query = {
        text: `DELETE FROM ${tableName} WHERE user_id = $1`,
        // Les valeurs à remplacer dans la requête
        values: [id],
      };

      // On attent l'exécution de la requête
      await client.query(query);
    } catch (error) {
      // On relance l'erreur pour qu'elle puisse être gérée par le serveur
      throw error;
    } finally {
      // On libère le client, que la requête ait réussi ou non.
      client.release();
    }
  };

  /**
   * Renvoie la liste des personnes.
   * @async
   */
  this.getAll = async function () {
    // Connexion à la BD
    const client = await pool.connect();
    // Les données récupérées dans la BD
    let data;

    try {
      // On attent l'exécution de la requête
      data = await client.query(`SELECT * FROM ${tableName}`);
    } catch (error) {
      // On relance l'erreur pour qu'elle puisse être gérée par le serveur
      throw error;
    } finally {
      // On libère le client, que la requête ait réussi ou non.
      client.release();
    }

    // On stocke les données dans un tableau
    let result = [];
    for (let row of data.rows) result.push(row);
    return result;
  };

  /**
   * @returns Renvoie la liste des clients.
   * @async
   */
  this.getClients = async function () {
    // Connexion à la BD
    const client = await pool.connect();
    // Les données récupérées dans la BD
    let data;

    try {
      // Requête à exécuter
      let query = {
        text: `SELECT * FROM ${tableName} WHERE ROLE = 'U'`,
      };
      // On attent l'exécution de la requête
      data = await client.query(query);
    } catch (error) {
      // On relance l'erreur pour qu'elle puisse être gérée par le serveur
      throw error;
    } finally {
      // On libère le client, que la requête ait réussi ou non.
      client.release();
    }

    // On stocke les données dans un tableau
    let result = [];
    for (let row of data.rows) result.push(row);
    return result;
  };

  /**
   * @param {string} userid
   * @param {string} password
   * @returns Renvoie la liste des personnes correspondant aux paramètres.
   * @async
   */
  this.search = async function (userid, password) {
    // Connexion à la BD
    const client = await pool.connect();
    // Les données récupérées dans la BD
    let data;

    try {
      // Requête à exécuter
      let query = {
        text: `SELECT * FROM ${tableName} WHERE user_id LIKE $1 AND password LIKE $2`,
        values: [userid, password],
      };

      // On attent l'exécution de la requête
      data = await client.query(query);
    } catch (error) {
      // On relance l'erreur pour qu'elle puisse être gérée par le serveur
      throw error;
    } finally {
      // On libère le client, que la requête ait réussi ou non.
      client.release();
    }

    // On stocke les données dans un tableau
    let result = [];
    for (let row of data.rows) result.push(row);
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

    try {
      // Requête à exécuter
      let query = {
        text: `UPDATE ${tableName} SET ${attr} = $1 WHERE user_id = $2`,
        // Les valeurs à remplacer dans la requête
        values: [value, userid],
      };

      // On attent l'exécution de la requête
      await client.query(query);
    } catch (error) {
      // On relance l'erreur pour qu'elle puisse être gérée par le serveur
      throw error;
    } finally {
      // On libère le client, que la requête ait réussi ou non.
      client.release();
    }
  };

  this.getGerantes = async function () {
    // Connexion à la BD
    const client = await pool.connect();

    // Les données récupérées dans la BD
    let data;

    try {
      // Requête à exécuter
      let query = {
        text: `SELECT * FROM ${tableName} WHERE ROLE = 'A'`,
      };

      // On attent l'exécution de la requête
      data = await client.query(query);
    } catch (error) {
      // On relance l'erreur pour qu'elle puisse être gérée par le serveur
      throw error;
    } finally {
      // On libère le client, que la requête ait réussi ou non.
      client.release();
    }

    // On stocke les données dans un tableau
    let result = [];
    for (let row of data.rows) result.push(row);
    return result;
  };
}

// Export du module
module.exports = Personne;
