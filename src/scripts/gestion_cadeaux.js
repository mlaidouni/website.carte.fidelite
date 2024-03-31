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
    database: "website_carte_fidelite",
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
  this.insert = async function (nom, prix, taille, couleur, description) {
    // Connexion à la BD
    client = await pool.connect();

    if (!this.search(word)) {
      // Query
      let query = {
        // Requête à exécuter
        Text: "INSERT INTO words VALUE ( '$1', $2, '$3', '$4', '$5')",
        // Les valeurs à remplacer dans la requête
        Values: [nom, prix, taille, couleur, description],
      };

      // On attent l'exécution de la requête
      await client.query(query);

      // On libère le client.
      client.release();
    }
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
      Text: "DELETE FROM words WHERE CADEAUX_ID = $1",
      // Les valeurs à remplacer dans la requête
      Values: [id],
    };
    // On attent l'exécution de la requête
    await client.query(query);
  };
}

// Export du module
module.exports = new Cadeau();
