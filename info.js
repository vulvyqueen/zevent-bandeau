// Contenu affiche dans le bandeau ZEvent. Pense comme filler.js du bandeau
// habituel : une simple liste d'items qui tournent en boucle. La structure
// est prete a accueillir d'autres categories plus tard (dons en direct,
// raids, objectifs de dons, etc.) sans tout reecrire : il suffira d'ajouter
// de nouveaux tableaux ici et de les entrelacer dans getInfoItems().

const { LOGOS } = require('./logos');

const ZEVENT_DATES = [
  "Le ZEVENT revient les 4, 5 et 6 septembre 2026 pour sa 10e et derniere edition !",
  "Rendez-vous des le 4 septembre 2026 pour tout un week-end de streaming caritatif.",
];

const ZEVENT_CTA = [
  "Viens participer et faire grimper la cagnotte pendant tout le week-end !",
  "Chaque don compte : merci de soutenir les associations du ZEvent !",
  "Plus d'infos et la liste des associations sur zevent.fr",
];

// Associations beneficiaires (logos + noms recuperes depuis le Drive ZEvent
// fourni par l'organisation). Les logos sont embarques en base64 dans
// logos.js -- l'overlay affiche le logo + le nom dans le bandeau.
const ASSOCIATIONS = [
  { name: 'WWF', logo: LOGOS['wwf'] },
  { name: 'Nightline France', logo: LOGOS['nightline-france'] },
  { name: 'Sea Shepherd France', logo: LOGOS['sea-shepherd-france'] },
  { name: 'The SeaCleaners', logo: LOGOS['the-seacleaners'] },
  { name: 'Sourire à la Vie', logo: LOGOS['sourire-a-la-vie'] },
  { name: 'Secours populaire français', logo: LOGOS['secours-populaire-francais'] },
  { name: 'Save the Children', logo: LOGOS['save-the-children'] },
  { name: 'Médecins Sans Frontières', logo: LOGOS['medecins-sans-frontieres'] },
  { name: 'LPO', logo: LOGOS['lpo'] },
  { name: 'Les Bureaux du Cœur', logo: LOGOS['les-bureaux-du-coeur'] },
  { name: 'Cop1', logo: LOGOS['cop1'] },
  { name: 'Sparadrap', logo: LOGOS['sparadrap'] },
  { name: "L'Envol", logo: LOGOS['lenvol'] },
  { name: 'Institut Pasteur', logo: LOGOS['institut-pasteur'] },
  { name: 'Action contre la Faim', logo: LOGOS['action-contre-la-faim'] },
  { name: 'Ligue contre le Cancer', logo: LOGOS['ligue-contre-le-cancer'] },
  { name: 'Helebor', logo: LOGOS['helebor'] },
  { name: 'Croix Rouge française', logo: LOGOS['croix-rouge-francaise'] },
  { name: 'Amnesty International', logo: LOGOS['amnesty-international'] },
  { name: 'Association Française des Aidants', logo: LOGOS['association-francaise-des-aidants'] },
  { name: 'Solidarité Paysans', logo: LOGOS['solidarite-paysans'] },
  { name: 'Le Rire Médecin', logo: LOGOS['le-rire-medecin'] },
  { name: 'Chapitre 2', logo: LOGOS['chapitre-2'] },
];

// TODO (plus tard) : dons en direct / raids / objectifs de dons.
// const ZEVENT_DONS = [];
// const ZEVENT_RAIDS = [];
// const ZEVENT_OBJECTIFS = [];

function getInfoItems() {
  const items = [];
  ZEVENT_DATES.forEach((text) => items.push({ type: 'text', text, variant: 'zevent' }));
  ZEVENT_CTA.forEach((text) => items.push({ type: 'text', text, variant: 'zevent' }));

  // On entrelace les assos avec les infos generales (une asso toutes les 2
  // infos environ) plutot que de les mettre toutes a la suite, pour que le
  // bandeau ne devienne pas un long mur de logos d'affilee.
  const withAssos = [];
  let a = 0;
  items.forEach((item, i) => {
    withAssos.push(item);
    if ((i + 1) % 2 === 0 && a < ASSOCIATIONS.length) {
      const asso = ASSOCIATIONS[a];
      withAssos.push({ type: 'asso', text: asso.name, logo: asso.logo, variant: 'zevent' });
      a += 1;
    }
  });
  // Toutes les assos restantes (il y en a plus que d'infos generales) sont
  // ajoutees a la suite, en boucle simple.
  while (a < ASSOCIATIONS.length) {
    const asso = ASSOCIATIONS[a];
    withAssos.push({ type: 'asso', text: asso.name, logo: asso.logo, variant: 'zevent' });
    a += 1;
  }

  return withAssos;
}

module.exports = { getInfoItems };
