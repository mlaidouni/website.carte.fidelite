$(document).ready(function () {
  /* ******************** Gestion des boutons des card - Cadeaux *********** */

  // Suppression: Sélection de tous les boutons de classe "cadeau-delete"
  $(document).on("click", ".cadeau-delete", function () {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // L'identifiant de la card, i.e du cadeau
    let id = card.attr("id");

    // Requête AJAX pour supprimer le cadeau
    $.ajax({
      // On envoie une requête de type DELETE à l'URL /gerante/compte/cadeaux
      url: `/gerante/compte/cadeaux?id=${id}`,
      type: "DELETE",
      success: function (data) {
        /* Si la suppression dans la BD a réussi, on supprime entièrement la
         * card, i.e la card elle-même et la colonne qui la contient */
        card.parent().remove();
      },
      error: function (error) {
        // En cas d'erreur, on affiche l'erreur dans la console
        console.error(error.responseJSON.message);
        // On affiche une alerte pour informer l'utilisateur
        alert("Une erreur est survenue lors de la suppression du cadeau.");
      },
    });
  });

  // Modification: Sélection de tous les boutons de classe "cadeau-update"
  $(document).on("click", ".cadeau-update", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // Si le bouton dit "Modifier", on transforme les span en input
    if ($(this).text() === "Modifier") {
      /* Pour chaque champ, on remplace le span par un input de type text, avec
       * les mêmes classes et valeurs */
      card.find("span").each(function () {
        let input = $("<input>", {
          type: "text",
          class: $(this).attr("class"),
          value: $(this).text(),
        });
        $(this).replaceWith(input);
      });

      // On change le bouton
      $(this).text("Valider");
      // On change le style du bouton
      $(this).removeClass("btn-dark").addClass("btn-success");
    }

    // Si le bouton dit "Valider", on envoie les modifications au serveur
    else {
      // L'identifiant de la card, i.e de l'élément
      let id = card.attr("id");

      // Les nouvelles valeurs pour le cadeau
      let newValues = {};
      card.find("input").each(function () {
        // On récupère l'attribut (la classe) et la valeur correspondant
        newValues[$(this).attr("class")] = $(this).val();
      });

      // Requête AJAX pour mettre à jour l'élément
      $.ajax({
        // On envoie une requête de type PUT à l'URL /gerante/compte/cadeaux
        url: `/gerante/compte/cadeaux?id=${id}`,
        type: "PUT",
        data: newValues, // Les nouvelles valeurs à envoyer
        success: function (data) {
          // Si l'update dans la BD a réussi, on transforme les input en span
          card.find("input").each(function () {
            let span = $("<span>", {
              class: $(this).attr("class"),
              text: $(this).val(),
            });
            $(this).replaceWith(span);
          });
        },
        error: function (error) {
          // En cas d'erreur, on affiche l'erreur dans la console
          console.error(error.responseJSON.message);
          // On affiche une alerte pour informer l'utilisateur
          alert("Une erreur est survenue lors de la mise à jour du cadeau.");
        },
      });

      // On change le bouton
      $(this).text("Modifier");
      // On change le style du bouton
      $(this).removeClass("btn-success").addClass("btn-dark");
    }
  });
  /* Ajout: Sélection de tous les boutons de classe "cadeau-add"
* Crée le formulaire pour l'ajout d'un cadeau. */
  $(document).on("click", ".cadeau-add", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // On vide la card et on la transforme en formulaire
    card.empty();
    let form = $("<form>", {
      // Le formulaire est le corps de la card
      class: "card-body",
      // On envoie les données du formulaire à l'URL /gerante/compte/cadeaux
      method: "post",
      action: "/gerante/compte/cadeaux",
    });

    // NOTE: Utiliser gestion_personnes.getColumns() pour obtenir les colonnes ?
    // On récupère les champs de la table nécessaire pour le formulaire
    let champs = [
      "nom",
      "prix",
      "taille",
      "couleur",
      "description",
      "image"
    ];

    // Pour chaque champ, on ajoute un input au formulaire
    champs.forEach(function (champ) {
      if (champ === "nom") {
        form.append(
          $("<input>", {
            type: "text",
            class: "form-control " + champ,
            name: champ,
            placeholder: champ,
            required: true,
          })
        );
      }
      else if (champ === "prix") {
        form.append(
          $("<input>", {
            type: "number",
            class: "form-control " + champ,
            name: champ,
            placeholder: champ,
            required: true,
          })
        );
      }
      else {
        form.append(
          $("<input>", {
            type: "text",
            class: "form-control " + champ,
            name: champ,
            placeholder: champ,
            required: false,
          })
        );
      }
    });

    // Ajouter les boutons Valider et Annuler
    form.append(
      $("<button>", {
        text: "Valider",
        class: "btn btn-success cadeau-add-valider",
        type: "submit",
      })
    );
    form.append(
      $("<button>", {
        text: "Annuler",
        class: "btn btn-warning cadeau-add-reset",
        type: "button",
      })
    );

    // On remplace le contenu actuel de la card par le formulaire
    card.html(form);
  });

  /* Ajout: Sélection de tous les boutons de classe "cadeau-add-valider"
  * Envoie les données du formulaire au serveur pour ajouter un cadeau. */
  $(document).on("submit", ".cadeau-add-valider", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // Les données pour le nouveau cadeau
    let data = {};
    card.find("input").each(function () {
      // On récupère l'attribut (la classe) et la valeur correspondant
      data[$(this).attr("name")] = $(this).val();
    });

    // Requête AJAX pour mettre à jour l'élément
    $.ajax({
      // On envoie une requête de type POST à l'URL /gerante/compte/cadeaux
      url: "/gerante/compte/cadeaux",
      type: "POST",
      data: data, // Les données à envoyer
      success: function (data) {
        console.log("succes");
        // Si l'ajout dans la BD a réussi, le serveur à rechargé la page
        window.location.href = "/gerante/compte?data=cadeau";
      },
      error: function (error) {
        // En cas d'erreur, on affiche l'erreur dans la console
        console.error(error.responseJSON.message);
        // On affiche une alerte pour informer l'utilisateur
        alert("Une erreur est survenue lors de l'ajout du cadeau.");
      },
    });
  });

  // Si l'ajout de cadeau est annulé
  $(document).on("click", ".cadeau-add-reset", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // On efface le contenu actuel de la card, i.e le formulaire
    card.empty();
    // On remplace ce contenu par la card d'ajout de cadeau initiale
    let cardBody = $("<div>", {
      class: "card-body d-flex justify-content-center align-items-center",
    });

    // On ajoute le bouton "Ajouter cadeau"
    cardBody.append(
      '<button id="add_cadeau" class="btn btn-success cadeau-add" type="button">Ajouter cadeau</button>'
    );

    // On remplace le contenu actuel de la card par cardBody
    card.html(cardBody);
  });

  /* ******************** Gestion des boutons des card - Clients *********** */

  // TODO: Ajouter le bouton "Annuler", pour annuler les modifications
  // Suppression: Sélection de tous les boutons de classe "client-delete"
  $(".client-delete").click(function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // L'identifiant de la card, i.e du client
    let id = card.attr("id");

    // Requête AJAX pour supprimer le client
    $.ajax({
      // On envoie une requête de type DELETE à l'URL /gerante/compte/clients
      url: `/gerante/compte/clients?id=${id}`,
      type: "DELETE",
      success: function (data) {
        /* Si la suppression dans la BD a réussi, on supprime entièrement la
         * card, i.e la card elle-même et la colonne qui la contient */
        card.parent().remove();
      },
      // En cas d'erreur, on affiche l'erreur dans la console
      error: function (error) {
        // En cas d'erreur, on affiche l'erreur dans la console
        console.error(error.responseJSON.message);
        // On affiche une alerte pour informer l'utilisateur
        alert("Une erreur est survenue lors de la suppression du client.");
      },
    });
  });

  // Modification: Sélection de tous les boutons de classe "client-update"
  $(document).on("click", ".client-update", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // Si le bouton dit "Modifier", on transforme les span en input
    if ($(this).text() === "Modifier") {
      /* Pour chaque champ, on remplace le span par un input de type text, avec
       * les mêmes classes et valeurs */
      card.find("span").each(function () {
        let input = $("<input>", {
          type: "text",
          class: $(this).attr("class"),
          value: $(this).text(),
        });
        $(this).replaceWith(input);
      });

      // On change le bouton
      $(this).text("Valider");
      // On change le style du bouton
      $(this).removeClass("btn-dark").addClass("btn-success");
    }

    // Si le bouton dit "Valider", on envoie les modifications au serveur
    else {
      // L'identifiant de la card, i.e de l'élément
      let id = card.attr("id");

      // Les nouvelles valeurs pour le client
      let newValues = {};
      card.find("input").each(function () {
        // On récupère l'attribut (la classe) et la valeur correspondant
        newValues[$(this).attr("class")] = $(this).val();
      });

      // Requête AJAX pour mettre à jour l'élément
      $.ajax({
        // On envoie une requête de type PUT à l'URL /gerante/compte/clients
        url: `/gerante/compte/clients?id=${id}`,
        type: "PUT",
        data: newValues, // Les nouvelles valeurs à envoyer
        success: function (data) {
          // Si l'update dans la BD a réussi, on transforme les input en span
          card.find("input").each(function () {
            let span = $("<span>", {
              class: $(this).attr("class"),
              text: $(this).val(),
            });
            $(this).replaceWith(span);
          });
        },
        error: function (error) {
          // En cas d'erreur, on affiche l'erreur dans la console
          console.error(error.responseJSON.message);
          // On affiche une alerte pour informer l'utilisateur
          alert("Une erreur est survenue lors de la mise à jour du client.");
        },
      });

      // On change le bouton
      $(this).text("Modifier");
      // On change le style du bouton
      $(this).removeClass("btn-success").addClass("btn-dark");
    }
  });

  /* Ajout: Sélection de tous les boutons de classe "client-add"
   * Crée le formulaire pour l'ajout d'un client. */
  $(document).on("click", ".client-add", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // On vide la card et on la transforme en formulaire
    card.empty();
    let form = $("<form>", {
      // Le formulaire est le corps de la card
      class: "card-body",
      // On envoie les données du formulaire à l'URL /gerante/compte/clients
      method: "post",
      action: "/gerante/compte/clients",
    });

    // NOTE: Utiliser gestion_personnes.getColumns() pour obtenir les colonnes ?
    // On récupère les champs de la table nécessaire pour le formulaire
    let champs = [
      "userID",
      "password",
      "nom",
      "prenom",
      "email",
      "telephone",
      "dateNaissance",
      "points",
    ];

    // Pour chaque champ, on ajoute un input au formulaire
    champs.forEach(function (champ) {
      form.append(
        $("<input>", {
          type: "text",
          class: "form-control " + champ,
          name: champ,
          placeholder: champ,
          required: true,
        })
      );
    });

    // Ajouter les boutons Valider et Annuler
    form.append(
      $("<button>", {
        text: "Valider",
        class: "btn btn-success client-add-valider",
        type: "submit",
      })
    );
    form.append(
      $("<button>", {
        text: "Annuler",
        class: "btn btn-warning client-add-reset",
        type: "button",
      })
    );

    // On remplace le contenu actuel de la card par le formulaire
    card.html(form);
  });

  /* Ajout: Sélection de tous les boutons de classe "client-add-valider"
   * Envoie les données du formulaire au serveur pour ajouter un client. */
  $(document).on("submit", ".client-add-valider", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // Les données pour le nouveau client
    let data = {};
    card.find("input").each(function () {
      // On récupère l'attribut (la classe) et la valeur correspondant
      data[$(this).attr("name")] = $(this).val();
    });

    // Requête AJAX pour mettre à jour l'élément
    $.ajax({
      // On envoie une requête de type POST à l'URL /gerante/compte/clients
      url: "/gerante/compte/clients",
      type: "POST",
      data: data, // Les données à envoyer
      success: function (data) {
        // Si l'ajout dans la BD a réussi, le serveur à rechargé la page
        window.location.href = "/gerante/compte?data=client";
      },
      error: function (error) {
        // En cas d'erreur, on affiche l'erreur dans la console
        console.error(error.responseJSON.message);
        // On affiche une alerte pour informer l'utilisateur
        alert("Une erreur est survenue lors de l'ajout du client.");
      },
    });
  });

  // Si l'ajout de client est annulé
  $(document).on("click", ".client-add-reset", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // On efface le contenu actuel de la card, i.e le formulaire
    card.empty();
    // On remplace ce contenu par la card d'ajout de client initiale
    let cardBody = $("<div>", {
      class: "card-body d-flex justify-content-center align-items-center",
    });

    // On ajoute le bouton "Ajouter Client"
    cardBody.append(
      '<button id="add_cadeau" class="btn btn-success client-add" type="button">Ajouter Client</button>'
    );

    // On remplace le contenu actuel de la card par cardBody
    card.html(cardBody);
  });
});
