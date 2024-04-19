$(document).ready(function () {
  /* ******************** Fonction utilitaire *********** */

  // Crée une card représentant un cadeau
  function createCard(cadeau, btntext, btntype, stock) {
    let card = `
<div class="col mb-4">
  <div id="${cadeau.cadeau_id}" class="card">
    <img
      class="card-img-top"
      src="/images/${cadeau.image}"
      alt="/images/${cadeau.image}"
    />
    <div class="card-body">
      <h5 class="card-title">${cadeau.nom}</h5>
      <p class="card-text">${cadeau.prix} €</p>
      <p class="card-text">Stock : ${stock}</p>
      <details>
        <summary>Plus d'informations</summary>
        ${cadeau.taille
        ? `<p class="card-text">Taille : ${cadeau.taille}</p>`
        : ""
      }
        ${cadeau.couleur
        ? `<hr /><p class="card-text">Couleur : ${cadeau.couleur}</p>`
        : ""
      }
        ${cadeau.description
        ? `<hr /><p class="card-text">${cadeau.description}</p>`
        : ""
      }
      </details>
      <button
        id="${cadeau.cadeau_id}"
        class="btn btn-success ${btntype}"
        type="button"
        >${btntext}</button
      >
    </div>
  </div>
</div>
`;
    return card;
  }

  // Envoie une requête AJAX
  function sendAJAX(url, type, data, successCb, errorTxt) {
    $.ajax({
      url: url,
      type: type,
      data: data,
      success: successCb,
      error: function (error) {
        // En cas d'erreur, on affiche l'erreur dans la console
        console.error(error.responseJSON.message);
        // On affiche une alerte pour informer l'utilisateur
        alert(`Une erreur est survenue lors de ${errorTxt}.`);
      },
    });
  }

  // Envoie d'une requête AJAX pour supprimer des données
  function delAJAX(url, successCb, errorTxt) {
    sendAJAX(url, "DELETE", null, successCb, `la suppression ${errorTxt}`);
  }

  // Envoie d'une requête AJAX pour mettre à jour des données
  function putAJAX(url, data, successCb, errorTxt) {
    sendAJAX(url, "PUT", data, successCb, `la mise à jour ${errorTxt}`);
  }

  // Envoie d'une requête AJAX pour ajouter des données
  function postAJAX(url, data, successCb, errorTxt) {
    sendAJAX(url, "POST", data, successCb, `l'ajout ${errorTxt}`);
  }

  // Envoie d'une requête AJAX pour récupérer des données
  function getAJAX(url, successCb, errorTxt) {
    sendAJAX(url, "GET", null, successCb, `la récupération ${errorTxt}`);
  }

  /* ******************** Gestion de l'anniversaire *********** */

  // Animation de l'aniversaire
  function annivAnimation() {
    // Le texte à animer
    let annivText = $(".anniv-text");
    // On récupère la largeur du texte et du div contenant le texte
    let textWidth = annivText.width();
    let divWidth = $(".anniv-div").width();
    // On place le texte à droite du div
    annivText.css({ left: divWidth });
    // On anime le texte pour le faire défiler
    annivText.animate({ left: -textWidth }, 20000, "linear", function () {
      // On replace le texte à droite du div
      annivText.css({ left: divWidth });
      // On relance l'animation
      annivAnimation();
    });
  }

  // Animation des confettis pour l'anniversaire
  function confettiAnimation() {
    // On lance des confetti
    confetti({
      // Nombre de confettis
      particleCount: 2000,
      // Vitesse des confettis
      startVelocity: 70,
      // Angle de dispersion
      spread: 360,
      // Les confettis chutent progressivement
      gravity: 1,
      // Durée de vie des confettis
      ticks: 300,
      // Position de départ
      origin: { y: 0.5 },
    });
  }

  /* Au chargement de la page, récupération de la date d'anniversaire du client
   * pour savoir s'il faut afficher l'animation d'anniversaire. */
  sendAJAX(
    "/client/isAnniversaire",
    "GET",
    null,
    function (data) {
      if (data.isAnniversaire) {
        annivAnimation();
        confettiAnimation();
      }
    },
    "la récupération de la date d'anniversaire."
  );

  /* ******************** Gestion des boutons - Déconnexion *********** */

  // Déconnexion du client (bouton de class client-deconnexion)
  $(document).on("click", ".client-deconnexion", function () {
    /* On envoie une requête en POST pour indiquer au serveur de déconnecter
     * le client. */
    postAJAX(
      "/client/deconnexion",
      null,
      (data) => {
        // Si la déconnexion a réussi, on redirigie la page
        window.location.href = "/client/connexion";
      },
      "la déconnexion du client."
    );
  });

  /* ******************** Gestion des boutons - Accueil *********** */

  /**
   * Met à jour l'affichage du nombre de points et de cadeaux dans le panier.
   * @param {*} panier_counter - Le nombre de cadeaux dans le panier.
   * @param {*} points - Le nombre de points du client.
   * @param {*} points_h - Le nombre de points hypothétiques du client.
   */
  function updateCounters(panier_counter, points, points_h) {
    // On met à jour l'affichage du nombre de cadeaux dans le panier
    $(".nav-panier-counter").text(panier_counter);

    // On met à jour l'affichage du nombre de points
    $(".nav-points-counter").html(`<del>${points}</del> ${points_h}`);
  }

  /**
   * Met à jour la liste des cadeaux achetables.
   * @param {*} list - Le conteneur de la liste.
   * @param {*} data - Les données à afficher.
   */
  function updateCadeaux(className, cadeaux, stock) {
    // On vide la ligne contenant la liste des cadeaux
    $(className).empty();

    // Puis on la rempli avec les cadeaux achetables
    for (let i = 0; i < cadeaux.length; i++) {
      let cadeau = cadeaux[i];
      let card;
      // On crée une card pour chaque cadeau
      if(stock[cadeau.cadeau_id]){
        card = createCard(cadeau, "Ajouter au panier", "add-to-panier",stock[cadeau.cadeau_id]);
        console.log("ezeese");
      }
      else{
        card = createCard(cadeau, "Ajouter au panier", "add-to-panier",cadeau.stock);
      }

      // Une fois entièrement créée, on ajoute la card
      $(className).append(card);
    }
  }

  // Ajout d'un cadeau au panier (bouton de class add-to-panier)
  $(document).on("click", ".add-to-panier", function () {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // L'identifiant de la card, i.e du cadeau
    let id = card.attr("id");

    // On envoie une requête en POST pour ajouter le cadeau au panier
    postAJAX(
      "/client/compte/cadeau?data=accueil",
      { id: id },
      function (data) {
        // TODO: Gérer le nombre de cadeaux d'un même type pour pouvoir faire les TODO suivants
        // TODO: Supprimer la card de l'affichage si la quantité est à 0
        // TODO: Add la possibilité de sélectionner la quantité à ajouter au panier

        // On met à jour les compteurs de points et de cadeaux
        updateCounters(data.panier_counter, data.points, data.points_h);

        // On met à jour l'affichage des cadeaux encore achetables
        updateCadeaux(".cadeaux-normaux", data.normaux, data.stock);
        updateCadeaux(".cadeaux-speciaux", data.speciaux, data.stock);
        console.log(data.stock);
      },
      "l'ajout du cadeau au panier."
    );
  });

  /* ******************** Gestion des boutons - Panier *********** */

  // Validation du panier (bouton de class valide-panier)
  $(document).on("click", ".valide-panier", function () {
    let card = $(this).closest(".container");

    // On commence par vider l'affichage du panier
    card.empty();

    // Requête pour valider le panier
    postAJAX(
      "/client/compte/panier",
      null,
      (data) => {
        window.location.href = "/client/compte?data=panier";
      },
      "des modifications au serveur après la validation du panier."
    );
  });

  // Vider le panier (bouton de class empty-panier)
  $(document).on("click", ".empty-panier", function () {
    // Requête pour vider le panier
    delAJAX(
      "/client/compte/panier",
      (data) => {
        window.location.href = "/client/compte?data=panier";
      },
      "de tous les cadeaux du panier."
    );
  });

  // Supprimer un cadeau du panier (bouton de class del-from-panier)
  $(document).on("click", ".del-from-panier", function () {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // L'identifiant de la card, i.e du cadeau
    let id = card.attr("id");

    // Requête pour valider le panier
    putAJAX(
      "/client/compte/panier",
      { id: id },
      (data) => {
        window.location.href = "/client/compte?data=panier";
      },
      "des modifications au serveur après la validation du panier."
    );
  });
});
