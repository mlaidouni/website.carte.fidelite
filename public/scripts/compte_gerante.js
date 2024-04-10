/* NOTE: Explication des requêtes PUT et PATCH
 * PUT: mise à jour de toutes les informations d'une source
 * PATCH: Mise à jour de certaines informations */

$(document).ready(function () {
  // Par défaut, les boutons "Annuler" sont cachés
  $(".client-annule").hide();
  $(".cadeau-annule").hide();

  /* ******************** Gestion des boutons des card - Cadeaux *********** */

  // Suppression: Sélection de tous les boutons de classe "cadeau-delete"
  $(".cadeau-delete").click(function (e) {
    // La carte représentant l'élément
    let card = $(this).closest(".card");

    // L'identifiant de la carte, i.e du cadeau
    let id = card.attr("id");

    // Requête AJAX pour supprimer le cadeau
    $.ajax({
      // On envoie une requête de type DELETE à l'URL /gerante/compte/cadeaux
      url: `/gerante/compte/cadeaux?id=${id}`,
      type: "DELETE",
      // Lorsqu'on a reçu une réponse du serveur, on exécute cette fonction
      success: function (data) {
        // Si la suppression dans la BD a réussi, on supprime entièrement la carte,
        // i.e la carte elle-même et la colonne qui la contient
        if (data.success) card.parent().remove();
        // Sinon, on affiche une erreur dans la console
        else console.log("compte_gerante.js: cadeau-delete.click(): Erreur !");
      },
      // En cas d'erreur, on affiche l'erreur dans la console
      error: function (error) {
        console.error("Erreur:", error);
      },
    });
  });

  // Modification: Sélection de tous les boutons de classe "cadeau-update"
  $(".cadeau-update").click(function (e) {
    // La carte représentant l'élément
    let card = $(this).closest(".card");

    // Si le bouton dit "Modifier", on transforme les span en input
    if ($(this).text() === "Modifier") {
      // Pour chaque champ, on remplace le span par un input de type text, avec
      // avec les mêmes classes et valeurs
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
      // L'identifiant de la carte, i.e de l'élément
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
        // Voir le commentaire en ligne 1
        type: "PUT",
        // Les nouvelles valeurs à envoyer
        data: newValues,
        success: function (data) {
          // Si l'update dans la BD a réussi, on transforme les input en span
          if (data.success) {
            card.find("input").each(function () {
              let span = $("<span>", {
                class: $(this).attr("class"),
                text: $(this).val(),
              });
              $(this).replaceWith(span);
            });
          } else {
            console.log("compte_gerante.js: cadeau-update.click(): Erreur !");
          }
        },
        error: function (error) {
          console.error("Erreur:", error);
        },
      });

      // On change le bouton
      $(this).text("Modifier");
      // On change le style du bouton
      $(this).removeClass("btn-success").addClass("btn-dark");
    }
  });

  /* ******************** Gestion des boutons des card - Clients *********** */

  // Suppression: Sélection de tous les boutons de classe "client-delete"
  $(".client-delete").click(function (e) {
    // La carte représentant l'élément
    let card = $(this).closest(".card");

    // L'identifiant de la carte, i.e du client
    let id = card.attr("id");

    // Requête AJAX pour supprimer le client
    $.ajax({
      // On envoie une requête de type DELETE à l'URL /gerante/compte/clients
      url: `/gerante/compte/clients?id=${id}`,
      type: "DELETE",
      // Lorsqu'on a reçu une réponse du serveur, on exécute cette fonction
      success: function (data) {
        // Si la suppression dans la BD a réussi, on supprime entièrement la carte,
        // i.e la carte elle-même et la colonne qui la contient
        if (data.success) card.parent().remove();
        // Sinon, on affiche une erreur dans la console
        else console.log("compte_gerante.js: client-delete.click(): Erreur !");
      },
      // En cas d'erreur, on affiche l'erreur dans la console
      error: function (error) {
        console.error("Erreur:", error);
      },
    });
  });

  // TODO: Ajouter le bouton "Annuler", pour annuler les modifications
  // Modification: Sélection de tous les boutons de classe "client-update"
  $(".client-update").click(function (e) {
    // La carte représentant l'élément
    let card = $(this).closest(".card");

    // Si le bouton dit "Modifier", on transforme les span en input
    if ($(this).text() === "Modifier") {
      // Pour chaque champ, on remplace le span par un input de type text, avec
      // avec les mêmes classes et valeurs
      card.find("span").each(function () {
        let input = $("<input>", {
          type: "text",
          class: $(this).attr("class"),
          value: $(this).text(),
        });
        $(this).replaceWith(input);
      });

      // On affiche le bouton "Annuler" de la card
      card.find(".client-annule").show();
      // On change le bouton
      $(this).text("Valider");
      // On change le style du bouton
      $(this).removeClass("btn-dark").addClass("btn-success");
    }

    // Si le bouton dit "Valider", on envoie les modifications au serveur
    else {
      // L'identifiant de la carte, i.e de l'élément
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
        // Voir le commentaire en ligne 1
        type: "PUT",
        // Les nouvelles valeurs à envoyer
        data: newValues,
        success: function (data) {
          // Si l'update dans la BD a réussi, on transforme les input en span
          if (data.success) {
            card.find("input").each(function () {
              let span = $("<span>", {
                class: $(this).attr("class"),
                text: $(this).val(),
              });
              $(this).replaceWith(span);
            });
          } else {
            console.log("compte_gerante.js: client-update.click(): Erreur !");
          }
        },
        error: function (error) {
          console.error("Erreur:", error);
        },
      });

      // On affiche le bouton "Annuler" et on cache le bouton "Supprimer"
      card.find(".client-annule").hide();
      // On change le bouton
      $(this).text("Modifier");
      // On change le style du bouton
      $(this).removeClass("btn-success").addClass("btn-dark");
    }
  });

  // FIXME: Retirer et ça, et effectuer plutôt un remplacement du bouton "supprimer"
  // Annulation: Sélection de tous les boutons de classe "client-annule"
  $(".client-annule").click(function (e) {
    // La carte représentant le client
    let card = $(this).closest(".card");

    // L'id du client
    let id = card.attr("id");

    $.get(`/gerante/compte/clients/?id=${id}`, (data) => {
      // La liste des input
      let input = card.find("input");

      // Pour chaque attribut à modifier
      for (let attr in data) {
        // On cherche dans la liste, l'input qui le représente
        input.each(function () {
          if ($(this).attr("class") === attr) {
            let span = $("<span>", {
              class: $(this).attr("class"),
              text: data[attr],
            });
            // Puis on remplace l'input par le span
            $(this).replaceWith(span);
          }
        });
      }
    });
  });
  /* ********************  ******************** */
});
