/**
 * Représente la gestion des cadeaux.
 * @constructor
 * @param {string} tableName - Le nom de la table.
 */
function Cadeau(tableName) {
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

  // Client global pour les requêtes
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
        text: "SELECT column_name FROM information_schema.columns WHERE table_name = $1 ORDERY BY ordinal_position",
        // Les valeurs à remplacer dans la requête
        values: [tableName],
      };

      // On attent l'exécution de la requête
      data = await client.query(query);
    } catch (err) {
      console.error("Erreur lors de la récupération des colonnes.", err.stack);
      throw err;
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

    // Récupérer les colonnes de la table
    let columns = await this.getColumns();
    // On transforme le tableau en une string séparée par des virgules
    let column = columns.join(", ");

    try {
      // Requête à exécuter
      let query = {
        text: `INSERT INTO ${tableName} (${column}) VALUES ($1, $2, $3, $4, $5, $6)`,
        // Les valeurs à remplacer dans la requête
        values: [nom, prix, taille, couleur, description, image],
      };

      // On attent l'exécution de la requête
      await client.query(query);
    } catch (err) {
      console.error("Erreur lors de l'insertion du cadeau.", err.stack);
      // On relance l'erreur pour qu'elle puisse être gérée par le serveur
      throw err;
    } finally {
      // On libère le client, que la requête ait réussi ou non.
      client.release();
    }
  };

  /**
   * Supprime un cadeau dans la BD.
   * @param {integer} id - L'id du cadeau.
   * @async
   */
  this.delete = async function (id) {
    // Connexion à la BD
    client = await pool.connect();

    try {
      // Requête à exécuter
      let query = {
        text: `DELETE FROM ${tableName} WHERE CADEAUX_ID = $1`,
        // Les valeurs à remplacer dans la requête
        values: [id],
      };

      // On attent l'exécution de la requête
      await client.query(query);
    } catch (err) {
      console.error("Erreur lors de la suppression du cadeau.", err.stack);
      // On relance l'erreur pour qu'elle puisse être gérée par le serveur
      throw err;
    } finally {
      // On libère le client, que la requête ait réussi ou non.
      client.release();
    }
  };

  /**
   * @returns Renvoie la liste des cadeaux.
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
    } catch (err) {
      console.error("Erreur lors de la récupération des cadeaux.", err.stack);
      // On relance l'erreur pour qu'elle puisse être gérée par le serveur
      throw err;
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
   * @returns Renvoie la liste des cadeaux inférieurs à un montant n.
   * @param {integer} n - Le montant maximal.
   * @async
   */
  this.getClient = async function (n) {
    // Connexion à la BD
    client = await pool.connect();
    // Les données récupérées dans la BD
    let data;

    try {
      // Requête à exécuter
      let query = {
        text: `SELECT * FROM ${tableName} WHERE prix <= $1`,
        // Les valeurs à remplacer dans la requête
        values: [n],
      };

      // On attent l'exécution de la requête
      data = await client.query(query);
    } catch (err) {
      console.error("Erreur lors de la récupération des cadeaux.", err.stack);
      // On relance l'erreur pour qu'elle puisse être gérée par le serveur
      throw err;
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
   * Modifie l'un des attributs d'un cadeau dans la BD.
   * @param {string} cadeauxid - L'id du cadeau.
   * @param {string} attr - L'attribut à modifier.
   * @param {string} value - La nouvelle valeur de l'attribut.
   * @async
   */
  this.update = async function (cadeauxid, attr, value) {
    // Récupérer les colonnes de la table
    let columns = await this.getColumns();
    // On vérifie si l'attribut existe
    if (!columns.includes(attr)) throw new Error("L'attribut n'existe pas.");

    // Connexion à la BD
    client = await pool.connect();

    try {
      // Requête à exécuter
      let query = {
        text: `UPDATE ${tableName} SET ${attr} = $1 WHERE cadeaux_id = $2`,
        // Les valeurs à remplacer dans la requête
        values: [value, cadeauxid],
      };

      // On attent l'exécution de la requête
      await client.query(query);
    } catch (err) {
      console.error("Erreur lors de la récupération des cadeaux.", err.stack);
      // On relance l'erreur pour qu'elle puisse être gérée par le serveur
      throw err;
    } finally {
      // On libère le client, que la requête ait réussi ou non.
      client.release();
    }
  };
}

// Export du module
module.exports = Cadeau;
