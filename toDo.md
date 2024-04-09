# To do

## Architecture

- 1 page `accueil.html`:

```html
<a href="https://localhost:8080/client/connexion">
  <img src="...img_client..." />
</a>
<a href="https://localhost:8080/gerante/connexion">
  <img src="...img_gerante..." />
</a>
```

- 1 page `connexion.ejs` (même page pour connexion client et gerante)  
  un formulaire avec `utilisateur` et `motdepasse`. Le nom d'utilisateur des clients est utilisé comme id dans la table `personnes`.
- 1 page `compte_client.ejs`:
  - affichage du nombre de points
  - affichage des cadeaux actuellements dans le panier (comment est stocké le panier ??)
  - bouton pour switcher entre la page de compte et la page d'achat des cadeaux
  - boutons pour supprimer / vider / valider le panier (comment faire pour mettre à jour les points lorsque le bouton est cliqué ??)
- 1 page `achat_cadeaux.ejs`:
  - bouton pour switcher entre la page de compte et la page d'achat des cadeaux
  - affichage de la liste des cadeaux disponibles pour elle
  - bouton pour ajouter un cadeau dans le panier
  - pseudo mise à jour des points à chaque ajout dans le panier
  - chaque cadeau est représenté par une image, un nom, un prix en points
  - menu déroulant pour spécifier les caractéristiques du cadeau
- 1 page `compte_gerante.ejs`:
  - menu de navigation, pour gérer soit les clients, soit les cadeaux
  - voir la liste des clients
  - boutons sur chaque client pour modifier / supprimer
  - bouton pour ajouter client -> redirection vers un formulaire ???
  - boutons pour ajouter (par caracteristiques) / supprimer (par cadeaux_id) un cadeau
- module `gestion_personnes`:  
  voir liste / ajouter / supprimer / modifier client. Utilisé pour trouver les personnes (clients / gérante) lors de la connexion.
- module `gestion_cadeaux`: ajouter / supprimer cadeaux
- script `serveur.js`:
  - route `client/connexion` -> redirection vers la route `client/compte`
  - route `client/compte` -> render la page `compte_client.ejs`
  - route `client/achat` -> render la page `achat_cadeaux.ejs`
  - route `gerante/connexion` -> redirection vers la route `gerante/compte`
  - route `gerante/compte` -> render la page `compte_gerante.ejs`

## Page d'accueil

- [x] Affichage d'une image pour la connection de la gérante
  - [x] cliquer sur l'image $\to$ redirection vers la page de connection de la gérante
- [x] Affichage d'une image pour la connection du client
  - [x] cliquer sur l'image $\to$ redirection vers la page de connection du client

## Côté client

> [!NOTE]  
> Toutes les URI sont en `/client/...`

### Page de connection

- [x] formulaire: un **identifiant unique** avec un **mot de passe**
- [x] si l'identifiant existe et que le mot de passe est correct, on **redirige vers la page de compte**

<!-- Alignement -->

### Page de compte

- [x] affichage du **nombre de points**
- [ ] affichage des cadeaux actuellements dans le panier
  - [ ] **bouton** pour **supprimer** un cadeau du panier
  - [ ] **bouton** pour **vider** le panier
- [ ] **bouton** pour valider le panier
  - [ ] **mise à jour** du nombre de points
  - [ ] **vider le panier**

### Page d'achat des cadeaux

- [ ] au début de la connection, vérifier si la date = DATE_NAISSANCE du client
  - [ ] si oui, on **ajoute** des cadeaux spéciaux au client
    - _FIXME: Comment ajouter des cadeaux, alors que l'on affiche toujours tous les cadeaux dont les points est $\le$ points du client et que ces cadeaux spéciaux ne sont pas dans la BD, ou du moins, pas partagés._
- [x] affichage de la **liste des cadeaux disponibles** pour elle
  - [x] CADEAUX.prix $\le$ CLIENT.points
- [x] **bouton** pour **ajouter** un cadeau dans le panier
- [ ] **pseudo mise à jour** des points à chaque ajout dans le panier: c'est à dire qu'on affiche le nombre de points, et le nombre de points hypothétique à côté, à chaque ajout dans le panier.
  - [ ] **affichage** du nombre de points dans le panier
- [ ] chaque cadeau est représenté par une **image, un nom, un prix en points**
  - [x] **menu déroulant** pour spécifier les caractéristiques du cadeau

> [!IMPORTANT]  
> La page d'achat des cadeaux et la page de compte ne sont peut être pas séparées (cf. section 1.1)

## Côté gérante

> [!NOTE]  
> Toutes les URI sont en `/gerante/...`

### Page de connection

- [x] formulaire: un **identifiant unique** avec un **mot de passe**
- [x] si l'identifiant existe et que le mot de passe est correct, on **redirige vers la page de compte**

### Page de compte

- [x] voir la liste des clients
- [ ] ajouter un client
- [x] supprimer un client
- [ ] modifier un client (points, ...)
- [ ] ajouter un cadeau
- [x] supprimer cadeau
- [x] voir la liste des cadeaux

---

> [!WARNING]  
> Faire attention à ce que, dans la page html, l'id de l'objet html représentant le cadeau soit le même que l'id du cadeau, pour pouvoir le supprimer de la BD

---

```javascript
for (let i = 0; i < cadeaux.length; i++) {
  console.log(
    cadeaux[i].nom +
      "・" +
      cadeaux[i].prix +
      "€・" +
      cadeaux[i].taille +
      "・" +
      cadeaux[i].couleur +
      "・" +
      cadeaux[i].description +
      "・" +
      cadeaux[i].image
  );
}
```
