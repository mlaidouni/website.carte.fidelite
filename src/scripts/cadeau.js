/**
 * Représente un cadeau.
 * @constructor
 */
function Cadeau() {
  // Import du module PostgreSQL
  const pg = require("pg");
  //   Création d'un pool de connection à la BD
  const pool = new pg.pool({
    // Nom d'utilisateur
    user: "me",
    port: 5432,
    host: "localhost",
    database: "website_carte_fidelite",
    passsword: "kmzx",
  });

  // Client global, initialisé par connect()
  let client;

  this.connect = async function () {
    // Connection à la BD. Bloque sur cette instruction tant que la connection n'est pas établie.
    client = await pool.connect();

    // ...
  };

  // TODO: Insérer, modifier, supprimer

  /**
   * Insert a word into the database if it does not exist.
   * @param {string} nom - The name of the cadeau.
   * @param {number} prix - The price of the cadeau.
   * @param {number} taille - The size of the cadeau.
   * @param {string} couleur - The color of the cadeau.
   * @param {string} description - The description of the cadeau.
   * @async
   */
  this.insert = async function (nom, prix, taille, couleur, description) {
    // Connect to the database
    client = await pool.connect();

    if (!this.search(word)) {
      // Query
      let query = {
        // The query to execute
        Text: "INSERT INTO words VALUE ( '$1', $2, $3, '$4', '$5')",
        // The values to replace in the query
        Values: [nom, prix, taille, couleur, description],
      };

      await client.query(query);
    }
  };
}

// Export du module
module.exports = new Cadeau();
