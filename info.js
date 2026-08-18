// Contenu affiche dans le bandeau ZEvent. Pense comme filler.js du bandeau
// habituel : une simple liste d'items qui tournent en boucle. Pour l'instant
// on n'a que les infos generales de l'event (dates + appel a participer),
// mais la structure est prete a accueillir d'autres categories plus tard
// (dons en direct, raids, objectifs de dons, associations, etc.) sans tout
// reecrire : il suffira d'ajouter de nouveaux tableaux ici et de les
// entrelacer dans getInfoItems(), exactement comme CHANNEL_POINTS_PROMO et
// ZEVENT_PROMO sont entrelaces dans le bandeau habituel.

const ZEVENT_DATES = [
  "Le ZEVENT revient les 4, 5 et 6 septembre 2026 pour sa 10e et derniere edition !",
  "Rendez-vous des le 4 septembre 2026 pour tout un week-end de streaming caritatif.",
];

const ZEVENT_CTA = [
  "Viens participer et faire grimper la cagnotte pendant tout le week-end !",
  "Chaque don compte : merci de soutenir les associations du ZEvent !",
  "Plus d'infos et la liste des associations sur zevent.fr",
];

// TODO (plus tard) : dons en direct / raids / objectifs de dons / assos.
// const ZEVENT_DONS = [];
// const ZEVENT_RAIDS = [];
// const ZEVENT_OBJECTIFS = [];
// const ZEVENT_ASSOS = [];

function getInfoItems() {
  const items = [];
  let d = 0;
  let c = 0;
  // Alterne dates / appel a participer pour varier le rythme du bandeau.
  const total = ZEVENT_DATES.length + ZEVENT_CTA.length;
  for (let i = 0; i < total; i += 1) {
    if (i % 2 === 0 && d < ZEVENT_DATES.length) {
      items.push({ text: ZEVENT_DATES[d], variant: 'zevent' });
      d += 1;
    } else if (c < ZEVENT_CTA.length) {
      items.push({ text: ZEVENT_CTA[c], variant: 'zevent' });
      c += 1;
    } else if (d < ZEVENT_DATES.length) {
      items.push({ text: ZEVENT_DATES[d], variant: 'zevent' });
      d += 1;
    }
  }
  return items;
}

module.exports = { getInfoItems };
