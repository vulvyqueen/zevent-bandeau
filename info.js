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
  "Fais un don sur ma cagnotte ZEvent : zevent.fr/don/vulvyqueen",
  "Chaque don compte, merci de soutenir la cagnotte : zevent.fr/don/vulvyqueen",
];

// Associations beneficiaires (logos + noms recuperes depuis le Drive ZEvent
// fourni par l'organisation). Les logos sont embarques en base64 dans
// logos.js -- l'overlay affiche le logo + le nom dans le bandeau.
const ASSOCIATIONS = [
  { name: 'WWF', logo: LOGOS['wwf'], facts: ["WWF : protege la biodiversite et agit sur le terrain dans plus de 100 pays a travers le monde.", "En 2024, le WWF France a mene 74 missions nature qui ont touche plus d'un million de personnes."] },
  { name: 'Nightline France', logo: LOGOS['nightline-france'], facts: ["Nightline France : des etudiants benevoles ecoutent d'autres etudiants la nuit, en toute confidentialite.", "En 2023-2024, les Nightlines francaises ont recu plus de 18 000 sollicitations d'etudiants."] },
  { name: 'Sea Shepherd France', logo: LOGOS['sea-shepherd-france'], facts: ["Sea Shepherd France : des equipages interviennent en mer pour proteger la faune marine.", "En 2024, Sea Shepherd a mene l'operation Nyamba a Mayotte pour proteger les tortues marines des braconniers."] },
  { name: 'Sourire à la Vie', logo: LOGOS['sourire-a-la-vie'], facts: ["Sourire a la Vie : accompagne les enfants et ados atteints de cancer, de l'annonce jusqu'apres la guerison.", "Chaque annee, l'association emmene des enfants malades en expedition, comme en Laponie en traineau a chiens."] },
  { name: 'Secours populaire français', logo: LOGOS['secours-populaire-francais'], facts: ["Secours populaire : lutte contre la pauvrete et l'exclusion en France et dans le monde depuis 1945.", "En 2024, environ 98 000 benevoles du Secours populaire ont aide des millions de personnes en difficulte."] },
  { name: 'Save the Children', logo: LOGOS['save-the-children'], facts: ["Save the Children : protege les droits des enfants dans le monde, en particulier en zones de crise.", "L'association agit pour que chaque enfant grandisse en bonne sante, aille a l'ecole et vive a l'abri de la violence."] },
  { name: 'Médecins Sans Frontières', logo: LOGOS['medecins-sans-frontieres'], facts: ["Medecins Sans Frontieres : apporte des soins medicaux d'urgence dans plus de 75 pays.", "En 2024, environ 67 000 membres de MSF ont porte secours aux populations touchees par les crises et conflits."] },
  { name: 'LPO', logo: LOGOS['lpo'], facts: ["LPO : agit pour proteger les oiseaux et la biodiversite partout en France depuis plus d'un siecle.", "En 2024, la LPO a ete confirmee gestionnaire de la reserve des Sept-Iles, agrandie sept fois en 2023."] },
  { name: 'Les Bureaux du Cœur', logo: LOGOS['les-bureaux-du-coeur'], facts: ["Les Bureaux du Coeur : offre un hebergement temporaire la nuit a des personnes en grande precarite.", "L'association loge des personnes dans des bureaux d'entreprises inoccupes le soir et le week-end, dans 44 villes."] },
  { name: 'Cop1', logo: LOGOS['cop1'], facts: ["Cop1 - Solidarites Etudiantes : lutte contre la precarite etudiante, par et pour les etudiants.", "L'association distribue chaque semaine des paniers de nourriture et de produits d'hygiene aux etudiants en difficulte."] },
  { name: 'Sparadrap', logo: LOGOS['sparadrap'], facts: ["Sparadrap : aide les enfants a avoir moins peur et moins mal lors des soins et a l'hopital.", "L'association forme aussi les professionnels de sante a mieux respecter les besoins des enfants soignes."] },
  { name: "L'Envol", logo: LOGOS['lenvol'], facts: ["L'Envol : organise des sejours adaptes et gratuits pour les enfants malades ou en situation de handicap.", "Chaque annee, L'Envol accompagne gratuitement plus de 8 000 enfants et familles a travers ses sejours et ateliers."] },
  { name: 'Institut Pasteur', logo: LOGOS['institut-pasteur'], facts: ["Institut Pasteur : mene des recherches sur les maladies infectieuses depuis plus de 130 ans.", "En 2024, l'Institut Pasteur a developpe un vaccin efficace contre le paludisme a Plasmodium vivax."] },
  { name: 'Action contre la Faim', logo: LOGOS['action-contre-la-faim'], facts: ["Action contre la Faim : lutte contre la malnutrition et la faim dans le monde.", "En 2025, l'association a teste au Mali et a Madagascar des actions pour anticiper les crises nutritionnelles."] },
  { name: 'Ligue contre le Cancer', logo: LOGOS['ligue-contre-le-cancer'], facts: ["Ligue contre le Cancer : finance la recherche et agit pour la prevention et le depistage des cancers.", "En 2024, la Ligue a finance plus de 800 projets de recherche, pour un total de 47,3 millions d'euros."] },
  { name: 'Helebor', logo: LOGOS['helebor'], facts: ["Helebor : soutient des projets innovants pour developper les soins palliatifs en France.", "L'association finance par exemple des sejours de repit pour des familles d'enfants gravement malades."] },
  { name: 'Croix Rouge française', logo: LOGOS['croix-rouge-francaise'], facts: ["Croix-Rouge francaise : secourt, soigne et accompagne les plus fragiles depuis 160 ans.", "En 2024, environ 5 000 secouristes de la Croix-Rouge ont ete mobilises pour les Jeux Olympiques et Paralympiques."] },
  { name: 'Amnesty International', logo: LOGOS['amnesty-international'], facts: ["Amnesty International : defend les droits humains partout dans le monde depuis 1961.", "L'association mene des enquetes et des campagnes pour denoncer les atteintes aux droits humains, y compris en France."] },
  { name: 'Association Française des Aidants', logo: LOGOS['association-francaise-des-aidants'], facts: ["Association Francaise des Aidants : soutient les proches aidants depuis 2003, partout en France.", "L'association a cree les Cafes des Aidants, un reseau de plus de 200 rencontres d'ecoute partout en France."] },
  { name: 'Solidarité Paysans', logo: LOGOS['solidarite-paysans'], facts: ["Solidarite Paysans : accompagne les agriculteurs en difficulte et lutte contre l'exclusion rurale.", "Plus de 1 300 benevoles de Solidarite Paysans aident les agriculteurs en difficulte dans 83 departements."] },
  { name: 'Le Rire Médecin', logo: LOGOS['le-rire-medecin'], facts: ["Le Rire Medecin : des clowns professionnels accompagnent les enfants hospitalises depuis 1991.", "En 2025, les 150 clowns de l'association offrent plus de 80 000 spectacles par an dans les hopitaux."] },
  { name: 'Chapitre 2', logo: LOGOS['chapitre-2'], facts: ["Chapitre 2 : accompagne vers l'autonomie des jeunes de 14 a 25 ans en grande vulnerabilite.", "L'association aide des jeunes sortant de l'aide sociale a l'enfance a s'inserer socialement et professionnellement."] },
];

// TODO (plus tard) : dons en direct / raids / objectifs de dons.
// const ZEVENT_DONS = [];
// const ZEVENT_RAIDS = [];
// const ZEVENT_OBJECTIFS = [];

function pushAsso(list, asso) {
  list.push({ type: 'asso', text: asso.name, logo: asso.logo, variant: 'zevent' });
  (asso.facts || []).forEach((text) => list.push({ type: 'text', text, variant: 'zevent' }));
}

function getInfoItems() {
  const items = [];
  ZEVENT_DATES.forEach((text) => items.push({ type: 'text', text, variant: 'zevent' }));
  ZEVENT_CTA.forEach((text) => items.push({ type: 'text', text, variant: 'zevent' }));

const withAssos = [];
  let a = 0;
  items.forEach((item, i) => {
    withAssos.push(item);
    if ((i + 1) % 2 === 0 && a < ASSOCIATIONS.length) {
      pushAsso(withAssos, ASSOCIATIONS[a]);
      a += 1;
    }
  });
  while (a < ASSOCIATIONS.length) {
    pushAsso(withAssos, ASSOCIATIONS[a]);
    a += 1;
  }

return withAssos;
}

module.exports = { getInfoItems };
