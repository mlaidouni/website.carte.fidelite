DROP CASCADE DATABASE WEBSITE_CARTE_FIDELITE;

-- Création de la base de données website_carte_fidelite
CREATE DATABASE WEBSITE_CARTE_FIDELITE;

-- Connection à la base de données website_carte_fidelite
\c WEBSITE_CARTE_FIDELITE;

-- Création de la table cadeaux
CREATE TABLE CADEAUX (
    CADEAUX_ID INTEGER SERIAL PRIMARY KEY, -- Identifiant du cadeau
    NOM VARCHAR(255) NOT NULL, -- Nom du cadeau
    PRIX INTEGER NOT NULL, -- Prix du cadeau en points
    TAILLE VARCHAR(255), -- Taille du cadeau (not required)
    COULEUR VARCHAR(255), -- Couleur du cadeau (not required)
    DESCRIPTION TEXT, -- Description du cadeau (not required)
    IMAGE VARCHAR(255) -- URL de l'image du cadeau (not required)
);

-- Création de la table clients
CREATE TABLE PERSONNE (
    USER_ID VARCHAR(255) PRIMARY KEY, -- Identifiant de connexion de la personne
    PASSWORD VARCHAR(255) NOT NULL, -- Mot de passe de la personne
    NOM VARCHAR(255) NOT NULL, -- Nom de la personne
    PRENOM VARCHAR(255) NOT NULL, -- Prénom de la personne
    EMAIL VARCHAR(255) , -- Adresse email de la personne
    TELEPHONE VARCHAR(10) NOT NULL, -- Numéro de téléphone de la personne
    DATE_NAISSANCE DATE NOT NULL, -- Date de naissance de la personne
    POINTS INTEGER NOT NULL -- Nombre de points de la personne
);

-- Remplissage de la table cadeaux
INSERT INTO CADEAUX (
    NOM,
    PRIX,
    TAILLE,
    COULEUR,
    DESCRIPTION,
    IMAGE
) VALUES (
    'T-shirt',
    100,
    'M',
    'Blanc',
    'T-shirt blanc en coton',
    'https://www.example.com/tshirt.jpg'
);

-- Quitter PostgreSQL
\q