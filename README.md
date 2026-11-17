# aftermind.fr

Site d'une page du cercle Aftermind. Maquette du 17/11/2026.

HTML et CSS simples, sans outil de construction : `index.html`, `style.css`, `favicon.svg`.

## Voir la maquette sur ton ordinateur

```bash
node serve.mjs
```

Puis ouvre http://localhost:4321.

## Règles du contenu

- Publication des noms, photos et citations des membres validée par Onur le 17/11/2026. Pour retirer quelqu'un : `accord: false` dans `membres.js`, et retirer sa photo de `img/membres/`.
- Photos de profil : avatars WhatsApp du groupe (cache Beeper). Photos des soirées : groupe WhatsApp.
- Couvertures de livres : chargées depuis les sites des éditeurs et libraires (pas de copie locale).
- Pas de pitch, pas de formulaire : l'entrée se fait sur invitation.
- La balise `noindex` reste tant que le site n'est pas validé.

## Mise en ligne (pas encore faite, accord d'Onur requis)

1. Créer le dépôt `Onur-IA/aftermind-site` sur GitHub et pousser `main`.
2. Héberger : GitHub Pages (gratuit, comme le test du site perso) ou Cloudflare Pages (gratuit, comme le site perso en production).
3. Brancher le domaine chez GoDaddy (DNS). Rien n'est touché sans accord.
