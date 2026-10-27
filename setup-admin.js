// Crée le PREMIER code administrateur dans la base Firestore.
// À faire une seule fois. Usage :  node setup-admin.js "Direction"
//
// Avant : Firebase > Paramètres du projet > Comptes de service > « Générer une nouvelle clé privée »,
// puis enregistrez le fichier téléchargé sous le nom  cle-service.json  dans ce dossier.
// Ne publiez JAMAIS ce fichier : il donne tous les droits sur votre base de données.
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const keyFile = path.join(__dirname, 'cle-service.json');
if (!fs.existsSync(keyFile)) {
  console.error('Fichier cle-service.json introuvable. Voir les explications en haut de ce fichier.');
  process.exit(1);
}
const admin = require('firebase-admin');
admin.initializeApp({credential: admin.credential.cert(require(keyFile))});

const nom = process.argv[2] || 'Direction';
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const code = Array.from(crypto.randomBytes(10), b => CHARS[b % 32]).join('');

admin.firestore().collection('invitations').doc(code).set({nom, admin: true})
  .then(() => {
    console.log('\nCode administrateur créé pour « ' + nom + ' » :\n');
    console.log('    ' + code.slice(0, 5) + '-' + code.slice(5) + '\n');
    console.log('Notez-le en lieu sûr. Ouvrez le site, espace Professeurs, et entrez ce code.');
    console.log('Vous pourrez ensuite créer un code personnel pour chaque professeur.\n');
    process.exit(0);
  })
  .catch(e => { console.error('Échec : ' + e.message); process.exit(1); });
