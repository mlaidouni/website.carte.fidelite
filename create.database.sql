-- -- Si la base de données existe, la supprimer
-- DROP DATABASE IF EXISTS WEBSITECARTEFIDELITE;

-- -- Création de la base de données website_carte_fidelite
-- CREATE DATABASE WEBSITECARTEFIDELITE;

-- -- Connection à la base de données website_carte_fidelite
-- \c WEBSITECARTEFIDELITE;

-- Suppression des tables si elles existent
DROP TABLE IF EXISTS CADEAUX;

DROP TABLE IF EXISTS PERSONNES;

-- Création de la table cadeaux
CREATE TABLE CADEAUX (
    CADEAUX_ID SERIAL PRIMARY KEY, -- Identifiant du cadeau
    NOM VARCHAR(255) NOT NULL, -- Nom du cadeau
    PRIX INTEGER NOT NULL, -- Prix du cadeau en points
    TAILLE VARCHAR(255), -- Taille du cadeau (not required)
    COULEUR VARCHAR(255), -- Couleur du cadeau (not required)
    DESCRIPTION TEXT, -- Description du cadeau (not required)
    IMAGE VARCHAR(255) -- URL de l'image du cadeau (not required)
);

-- Création de la table personnes
CREATE TABLE PERSONNES (
    USER_ID VARCHAR(255) PRIMARY KEY, -- Identifiant de connexion de la personne
    PASSWORD VARCHAR(255) NOT NULL, -- Mot de passe de la personne
    ROLE VARCHAR(1) DEFAULT 'U', -- Role de la personne (A OU U, U par défaut)
    NOM VARCHAR(255) NOT NULL, -- Nom de la personne
    PRENOM VARCHAR(255) NOT NULL, -- Prénom de la personne
    EMAIL VARCHAR(255) NOT NULL, -- Adresse email de la personne
    TELEPHONE VARCHAR(10) NOT NULL, -- Numéro de téléphone de la personne
    DATE_NAISSANCE VARCHAR(10) NOT NULL, -- Date de naissance de la personne
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
    'Sac à dos',
    150,
    NULL,
    'Bleu',
    'Sac à dos en nylon imperméable',
    'images/kungfupanda.png'
),
(
    'Mug',
    50,
    NULL,
    NULL,
    'Mug en céramique avec motif personnalisé',
    'images/shrek_swamp.png'
),
(
    'Clé USB',
    30,
    NULL,
    'Argent',
    'Clé USB 32 Go avec connecteur rétractable',
    'images/kenganashura.png'
),
(
    'Parapluie',
    70,
    NULL,
    'Rouge',
    'Parapluie pliable avec motif floral',
    'images/kungfupanda.png'
),
(
    'Gourde',
    40,
    NULL,
    'Vert',
    'Gourde en acier inoxydable 500 ml',
    'images/kungfupanda.png'
),
(
    'Stylo',
    20,
    NULL,
    NULL,
    'Stylo à bille rétractable',
    'images/shrek_swamp.png'
),
(
    'Carnet de notes',
    60,
    NULL,
    'Rose',
    'Carnet de notes ligné avec couverture en cuir synthétique',
    'images/kenganashura.png'
),
(
    'Porte-clés',
    25,
    NULL,
    'Jaune',
    'Porte-clés en métal avec pendentif en forme de cœur',
    'images/kungfupanda.png'
),
(
    'Tapis de souris',
    35,
    NULL,
    'Gris',
    'Tapis de souris avec surface lisse',
    'images/kungfupanda.png'
),
(
    'Lampe de poche',
    45,
    NULL,
    'Noir',
    'Lampe de poche LED compacte avec dragonne',
    'images/shrek_swamp.png'
);

-- Insertion des données dans la table personnes
INSERT INTO PERSONNES (
    USER_ID,
    PASSWORD,
    ROLE,
    NOM,
    PRENOM,
    EMAIL,
    TELEPHONE,
    DATE_NAISSANCE,
    POINTS
) VALUES (
    'Akashi7',
    'password',
    'U',
    'KHEMAKHEM',
    'Ayman',
    'ayman@grimpette.fr',
    '0600000000',
    '01/11/2003',
    25000
),
(
    'janad',
    'password',
    'U',
    'AYADI',
    'Jana',
    'jana@grimpette.fr',
    '0600000000',
    '23/10/2003',
    95
),
(
    'elyogangshit',
    'password',
    'A',
    'FRIEDMANN',
    'Elyo',
    'elyo@grimpette.fr',
    '0600000000',
    '11/02/2003',
    6
),
(
    'man',
    'password',
    'U',
    'BAHA',
    'Manon',
    'man@grimpette.fr',
    '0600000000',
    '19/01/2003',
    300
),
(
    'iliou',
    'password',
    'U',
    'CRAGUE',
    'Ilian',
    'iliou@grimpette.fr',
    '0600000000',
    '14/12/2004',
    10
),
(
    'nav',
    'password',
    'U',
    'SINGH',
    'Navdeep',
    'nav@grimpette.fr',
    '0600000000',
    '01/01/2003',
    300
),
(
    'villomega',
    'password',
    'U',
    'MOREL',
    'Victor',
    'morel@grimpette.fr',
    '0600000000',
    '08/07/2003',
    24
),
(
    'ralizz',
    'password',
    'U',
    'RANJALAHY',
    'Elisa',
    'elisa@grimpette.fr',
    '0600000000',
    '10/06/2003',
    500
),
(
    'kmzx',
    'password',
    'A',
    'LAIDOUNI',
    'Mohamed',
    'mohaldn@grimpette.fr',
    '0600000000',
    '30/06/2003',
    1
),
(
    'laure',
    'password',
    'U',
    'HAMME',
    'Laure',
    'lh@grimpette.fr',
    '0600000000',
    '01/01/2003',
    4532546
),
(
    'john.doe',
    'password',
    'U',
    'DOE',
    'John',
    'john@gmail.com',
    '0123456789',
    '01/01/1990',
    100
);