-- Création de la base de données website_carte_fidelite
CREATE DATABASE website_carte_fidelite;

-- Connection à la base de données website_carte_fidelite
\c dictionary;

-- Création de la table cadeaux
CREATE TABLE cadeaux (
    cadeaux_id SERIAL PRIMARY KEY,
    nom VARCHAR(255) not null,
    prix integer not null,
    
    description text,
    -- Autres attributs
);

-- Quitter PostgreSQL
\q
