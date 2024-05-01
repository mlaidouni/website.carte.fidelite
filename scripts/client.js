function Client(client_connected) {
  this.getId = function () {
    return client_connected.client.user_id;
  };

  // Reset les valeurs du client.
  this.reset = function () {
    client_connected.client = undefined;
    client_connected.points = undefined;
    client_connected.points_h = undefined;
    client_connected.panier = [];
    client_connected.current_stock = {};
    client_connected.panier_counter = 0;
    client_connected.panier_value = 0;
  };

  this.update = function (client, points) {
    client_connected.client = client;
    client_connected.points = points;
    client_connected.points_h =
      client_connected.points - client_connected.panier_value;
  };

  // Ajout d'un cadeau au panier
  this.add = function (cadeau) {
    client_connected.panier.push(cadeau);
    let count = 0;
    for (let i = 0; i < client_connected.panier.length; i++) {
      if (client_connected.panier[i].cadeau_id === cadeau.cadeau_id) {
        count++;
      }
    }
    if (cadeau.stock - count >= 0) {
      client_connected.current_stock[cadeau.cadeau_id] = cadeau.stock - count;
      if (client_connected.current_stock[cadeau.cadeau_id] === 0)
        client_connected.current_stock[cadeau.cadeau_id] = -1;

      // On met à jour les valeurs du clients connectés
      client_connected.panier_counter = client_connected.panier.length;
      client_connected.panier_value += cadeau.prix;
      client_connected.points_h -= cadeau.prix;
    } else {
      client_connected.panier.pop();
      client_connected.current_stock[cadeau.cadeau_id] = -1;
    }
  };

  this.valider_panier = function () {
    client_connected.points = client_connected.points_h;
    client_connected.panier = [];
    client_connected.current_stock = {};
    client_connected.panier_counter = 0;
    client_connected.panier_value = 0;
  };

  this.empty_panier = function () {
    client_connected.points_h = client_connected.points;
    client_connected.current_stock = {};
    client_connected.panier = [];
    client_connected.panier_counter = 0;
    client_connected.panier_value = 0;
  };
}

module.exports = Client;
