/*
(c) by Thomas Konings
Random Name Generator for Javascript
*/

const adj = [
  'abstinent',
  'achtsam',
  'afrikanisch',
  'akkurat',
  'alkoholisch',
  'alphabetisch',
  'ängstlich',
  'ärgerlich',
  'automatisch',
  'baff',
  'bairisch',
  'bang',
  'bankrott',
  'bedrohlich',
  'begünstigt',
  'behaglich',
  'beharrlich',
  'blind',
  'brillant',
  'bunt',
  'charmant',
  'chemisch',
  'chorisch',
  'christlich',
  'chronisch',
  'chronologisch',
  'cremefarben',
  'dämlich',
  'dämmrig',
  'dankbar',
  'darstellbar',
  'dazugehörig',
  'deckend',
  'demokratisch',
  'depressiv',
  'derb',
  'dialogisch',
  'diebisch',
  'dumm',
  'dringend',
  'dünn',
  'eckig',
  'edel',
  'effizient',
  'egoistisch',
  'ehebrecherisch',
  'ehrerbietig',
  'ehrfürchtig',
  'ehrgeizig',
  'ehrlos',
  'eigenständig',
  'einladend',
  'elektrisch',
  'evangelisch',
  'fabelhaft',
  'fachkundig',
  'fad',
  'fadenscheinig',
  'fahrlässig',
  'faktisch',
  'fantasielos',
  'fantastisch',
  'fein',
  'fest',
  'fettig',
  'fit',
  'flach',
  'flauschig',
  'flott',
  'frei',
  'gängig',
  'garstig',
  'gastfreundlich',
  'gebogen',
  'gedrückt',
  'geeignet',
  'gefährlich',
  'gefangen',
  'geisterhaft',
  'gelb',
  'gereizt',
  'glatt',
  'gleichberechtigt',
  'glücklich',
  'grafisch',
  'groß',
  'gründlich',
  'haarig',
  'halb',
  'halsbrecherisch',
  'hämisch',
  'handlungsfähig',
  'heiß',
  'hell',
  'herzoglich',
  'hinfällig',
  'hoch',
  'hoffnungsvoll',
  'hündisch',
  'hyperaktiv',
  'ideal',
  'identisch',
  'idyllisch',
  'illegal',
  'illusorisch',
  'imaginär',
  'imponierend',
  'individuell',
  'inhaltlich',
  'inklusiv',
  'integriert',
  'international',
  'isoliert',
  'jährlich',
  'jetzig',
  'jodhaltig',
  'jordanisch',
  'jüdisch',
  'jugendlich',
  'jung',
  'jungfräulich',
  'juristisch',
  'kahl',
  'kalorisch',
  'kämpferisch',
  'katholisch',
  'käuflich',
  'keusch',
  'kirchlich',
  'klangvoll',
  'knackig',
  'kokett',
  'kontrovers',
  'korrekt',
  'krank',
  'krumm',
  'künstlich',
  'kurz',
  'labbrig',
  'labil',
  'lahm',
  'ländlich',
  'laut',
  'lebensgroß',
  'legitim',
  'leicht',
  'lieb',
  'lockig',
  'lokal',
  'löslich',
  'luftig',
  'luxuriös',
  'mächtig',
  'männlich',
  'maßvoll',
  'materiell',
  'mehrsprachig',
  'meisterlich',
  'mental',
  'mickrig',
  'mitleidig',
  'monatlich',
  'motorisch',
  'musikalisch',
  'mutig',
  'mütterlich',
  'mystisch',
  'nächtlich',
  'nah',
  'närrisch',
  'nass',
  'negativ',
  'neidisch',
  'neu',
  'niedrig',
  'niveaulos',
  'nördlich',
  'normal',
  'notdürftig',
  'nützlich',
  'oberschlau',
  'obsolet',
  'obszön',
  'ockerfarben',
  'öd',
  'offen',
  'öffentlich',
  'ökologisch',
  'ölig',
  'olympiareif',
  'operativ',
  'oral',
  'örtlich',
  'österlich',
  'ozonhaltig',
  'pädagogisch',
  'paradiesisch',
  'parkartig',
  'parlamentarisch',
  'passiv',
  'peinlich',
  'pensioniert',
  'persönlich',
  'perspektivlos',
  'pflichtbewusst',
  'phantastisch',
  'physisch',
  'politisch',
  'poetisch',
  'praktisch',
  'provokant',
  'psychisch',
  'qualitativ',
  'qualvoll',
  'quecksilberhaltig',
  'quengelig',
  'quergestreift',
  'quicklebendig',
  'quietschfidel',
  'quirlig',
  'rabenschwarz',
  'radikal',
  'raffiniert',
  'rankenartig',
  'rasch',
  'ratlos',
  'rauchfrei',
  'recyclebar',
  'reformbedürftig',
  'regnerisch',
  'reich',
  'rein',
  'relativ',
  'respektvoll',
  'rhythmisch',
  'riesig',
  'roh',
  'rostig',
  'rückläufig',
  'rund',
  'sachkundig',
  'sachlich',
  'saisonal',
  'salzig',
  'sauer',
  'scharf',
  'schattig',
  'schleimig',
  'schreckenerregend',
  'schusselig',
  'seidenweich',
  'selbstständig',
  'sesshaft',
  'sicher',
  'soft',
  'sperrig',
  'spitz',
  'steil',
  'stramm',
  'sympathisch',
  'tailliert',
  'taktvoll',
  'technisch',
  'temperamentvoll',
  'theoretisch',
  'topografisch',
  'tot',
  'trächtig',
  'traditionell',
  'treu',
  'trocken',
  'trotzig',
  'tüchtig',
  'typisch',
  'übel',
  'übertrieben',
  'überparteilich',
  'ultimativ',
  'ultrakurz',
  'umkehrbar',
  'umständlich',
  'unbehaglich',
  'unerlässlich',
  'uralt',
  'utopisch',
  'variabel',
  'väterlich',
  'verabscheuungswürdig',
  'verantwortungslos',
  'verblüfft',
  'verdaulich',
  'verklemmt',
  'versichert',
  'viertürig',
  'viral',
  'voll',
  'vulgär',
  'wach',
  'weise',
  'wahlberechtigt',
  'warm',
  'wässrig',
  'weich',
  'weihnachtlich',
  'weit',
  'weise',
  'weiß',
  'weitreichend',
  'wertvoll',
  'widerlegbar',
  'wirtschaftlich',
  'wohnlich',
  'würdig',
  'youtubebegeistert',
  'zackig',
  'zahlenmäßig',
  'zapplig',
  'zart',
  'zehnjährig',
  'zeitlich',
  'zentral',
  'zickig',
  'zinslos',
  'zivil',
  'zornig',
  'zuckerfrei',
  'zuvorkommend',
  'zweckgebunden',
  'zweifach',
  'zynisch'
]

const nom = [
  'das Alphabet',
  'das Altenheim',
  'das Amulett',
  'die Anlage',
  'der Arm',
  'der Aufkleber',
  'der Auspuff',
  'das Auto',
  'der Ball',
  'die Bar',
  'der Baum',
  'die Bestellliste',
  'das Betttuch',
  'der Biokraftstoff',
  'das Blatt',
  'das Buch',
  'das Callcenter',
  'die Castingshow',
  'der Chinese',
  'der Clip',
  'der Computer',
  'das Dach',
  'die Dichtung',
  'die Disco',
  'der Dollar',
  'die Dorfschule',
  'der Eimer',
  'die Eisenbahn',
  'der Engel',
  'das Erdöl',
  'das Ergebnis',
  'das Fahrrad',
  'der Feuerlöscher',
  'der Film',
  'das Foto',
  'die Freiheit',
  'das Gehirn',
  'der Gehweg',
  'das Grundgesetz',
  'das Grundstück',
  'das Gymnasium',
  'der Hafen',
  'das Haus',
  'das Heimatland',
  'das Holz',
  'das Horn',
  'der Igel',
  'der Impfstoff',
  'die Information',
  'die Infusion',
  'die Insel',
  'der Jachthafen',
  'die Jacke',
  'der Jäger',
  'das Jobcenter',
  'der Jugendclub',
  'der Kaktus',
  'der Kamm',
  'die Kammer',
  'der Keller',
  'die Kugel',
  'die Leber',
  'die Leiste',
  'der Leiter',
  'die Liebe',
  'der Locher',
  'die Maus',
  'der Monat',
  'der Monitor',
  'das Musikstück',
  'der Muskel',
  'die Nabelschnur',
  'der Nachbar',
  'der Nagel',
  'die Nase',
  'die Natur',
  'die Nonne',
  'die Notunterkunft',
  'das Obst',
  'der Ochse',
  'der Offizier',
  'die Orgel',
  'das Paket',
  'das Papier',
  'das Passwort',
  'der Politiker',
  'das Poster',
  'der Quader',
  'der Quark',
  'das Quecksilber',
  'die Quelle',
  'der Quastenflosser',
  'der Rabe',
  'das Radio',
  'die Rakete',
  'der Reifen',
  'der Rettungswagen',
  'der Ritter',
  'der Sand',
  'der Scanner',
  'das Schloss',
  'der Stein',
  'der Strauch',
  'die Tasche',
  'der Taschenrechner',
  'die Tastatur',
  'die Taste',
  'der Tiger',
  'der Tisch',
  'der Turnschuh',
  'die Uhr',
  'die Ulme',
  'der Umschlagplatz',
  'die Umwelt',
  'das Unwetter',
  'die Vanille',
  'der Vater',
  'die Verdauung',
  'der Verkehr',
  'die Versicherung',
  'der Vogel',
  'die Waage',
  'der Waggon',
  'das Waschzeug',
  'das Wasser',
  'das Wort',
  'das Xylophon',
  'der Yogalehrer',
  'der Zahn',
  'das Zeichen',
  'die Zeitung',
  'das Zentrum'
]

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

// function capFirst(string: string) {
//   return string.charAt(0).toUpperCase() + string.slice(1)
// }

// export function generateName(id: string) {
//   if (id === 'dummy') return 'frei'
//   const name =
//     capFirst(name1[getRandomInt(0, name1.length + 1)]) +
//     ' ' +
//     capFirst(name2[getRandomInt(0, name2.length + 1)])
//   return name
// }

// der --> er / die --> e / das -> es

const getAdj = (number: number) => {
  let adjektiv = adj[number]
  adjektiv = `${adjektiv[0].toUpperCase()}${adjektiv.slice(1)}`

  return adjektiv
}

const getNom = (number: number) => {
  const [artikel, nomen] = nom[number].split(' ')
  switch (artikel) {
    case 'der':
      return `er ${nomen}`
    case 'die':
      return `e ${nomen}`
    case 'das':
      return `es ${nomen}`
  }
}

export const getName = (id: string) => {
  if (id === 'dummy') return 'frei'

  return `${getAdj(getRandomInt(0, adj.length - 1))}${getNom(
    getRandomInt(0, nom.length - 1)
  )}`
}
