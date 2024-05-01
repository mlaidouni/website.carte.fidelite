function Client(client, points) {
  // Initialisation des valeurs du client.
  this.client = client;
  this.points = points;
  this.points_h = points;
  this.panier = [];
  this.panier_value = 0;
  this.panier_counter = 0;
  this.current_stock = {};

  this.getId = function () {
    return this.client.user_id;
  };

  // Reset les valeurs du client.
  this.reset = function () {
    this.client = undefined;
    this.points = undefined;
    this.points_h = undefined;
    this.panier = [];
    this.current_stock = {};
    this.panier_counter = 0;
    this.panier_value = 0;
  };

  this.update = function (client, points) {
    this.client = client;
    this.points = points;
    this.points_h = this.points - this.panier_value;
  };

  // Ajout d'un cadeau au panier
  this.add = function (cadeau) {
    this.panier.push(cadeau);
    let count = 0;
    for (let i = 0; i < this.panier.length; i++) {
      if (this.panier[i].cadeau_id === cadeau.cadeau_id) {
        count++;
      }
    }
    if (cadeau.stock - count >= 0) {
      this.current_stock[cadeau.cadeau_id] = cadeau.stock - count;
      if (this.current_stock[cadeau.cadeau_id] === 0)
        this.current_stock[cadeau.cadeau_id] = -1;

      // On met à jour les valeurs du clients connectés
      this.panier_counter = this.panier.length;
      this.panier_value += cadeau.prix;
      this.points_h -= cadeau.prix;
    } else {
      this.panier.pop();
      this.current_stock[cadeau.cadeau_id] = -1;
    }
  };

  this.valider_panier = function () {
    this.points = this.points_h;
    this.panier = [];
    this.current_stock = {};
    this.panier_counter = 0;
    this.panier_value = 0;
  };

  this.empty_panier = function () {
    this.points_h = this.points;
    this.current_stock = {};
    this.panier = [];
    this.panier_counter = 0;
    this.panier_value = 0;
  };
}

module.exports = Client;
