// Crée un input
function createInput(type, className, value) {
  return $("<input>", {
    type: type,
    class: className,
    value: value,
  });
}

// Crée un span
function createSpan(className, text) {
  return $("<span>", {
    class: className,
    text: text,
  });
}

// Modifier un bouton
function switchButton(button, text, oldClass, newClass) {
  // On change le texte du bouton
  button.text(text);
  // On change le style du bouton
  button.removeClass(oldClass).addClass(newClass);
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
