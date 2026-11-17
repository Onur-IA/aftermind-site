# aftermind.fr

Site d'une page du cercle Aftermind. Maquette du 17/11/2026.

HTML et CSS simples, sans outil de construction : `index.html`, `style.css`, `favicon.svg`.

## Voir la maquette sur ton ordinateur

```bash
node serve.mjs
```

Puis ouvre http://localhost:4321.

## Règles du contenu

- Aucun nom ni aucune photo de membre en ligne sans son accord écrit.
- `membres.js` (fiches) et `img/prive/` (photos avec visages) ne sont pas versionnés. En local, tout s'affiche. En ligne, `site.js` ne montre que les fiches avec `accord: true`, et une photo privée absente disparaît toute seule.
- Avant publication : copier dans le dépôt une version de `membres.js` qui ne garde que les membres d'accord, et seulement leurs photos.
- `img/table-shinko.jpg` et `img/salle-shinko.jpg` viennent sans doute du site du restaurant : à remplacer par une photo d'un membre avant la mise en ligne.
- Pas de pitch, pas de formulaire : l'entrée se fait sur invitation.
- La balise `noindex` reste tant que le site n'est pas validé.

## Mise en ligne (pas encore faite, accord d'Onur requis)

1. Créer le dépôt `Onur-IA/aftermind-site` sur GitHub et pousser `main`.
2. Héberger : GitHub Pages (gratuit, comme le test du site perso) ou Cloudflare Pages (gratuit, comme le site perso en production).
3. Brancher le domaine chez GoDaddy (DNS). Rien n'est touché sans accord.
