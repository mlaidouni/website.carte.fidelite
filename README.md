# website.carte.fidelite <!-- omit in toc -->

## Table des matières <!-- omit in toc -->

1. [Base de donnée](#base-de-donnée)
   1. [Étape 1: Connectez vous à PostgreSQL](#étape-1-connectez-vous-à-postgresql)
   2. [Étape 2: Créez la base de donnée](#étape-2-créez-la-base-de-donnée)

## Base de donnée

- **pré-requis**: avoir PostgreSQL installé

### Étape 1: Connectez vous à PostgreSQL

```bash
# Utilisez votre mot de passe pour vous connecter à PostgreSQL
psql -U <votre_nom_utilisateur> -W postgres
```

### Étape 2: Créez la base de donnée

Dans postrgres, exécutez les commandes suivantes:

```bash
\i create.database.sql
```

Une fois cette étape effectuée, vous pourrez vous connecter à la base de donnée `website_carte_fidelite` avec la commande suivante:

```bash
psql -U <votre_nom_utilisateur> -W website_carte_fidelite
```
