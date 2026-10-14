(function () {
  var D = window.PASSEPARTOUT_DATA;
  if (!D) return;
  var R = D.routes[3];
  if (R.schede.some(function (s) { return s.heading.indexOf('Adamo ed Eva') > -1; })) return;

  function P(label, text, it) {
    var runs = [];
    if (label) runs.push({ text: label + ':  ', url: null, bold: true, italic: false });
    if (text) runs.push({ text: text, url: null, bold: false, italic: !!it });
    return { text: runs.map(function (r) { return r.text; }).join(''), runs: runs };
  }
  function B(t) { return P(null, '—  ' + t); }
  function N(t) { return P(null, t, true); }

  var row = R.table_rows.filter(function (r) { return r.n === '2'; })[0];
  row.titolo_full = 'da Diario di Anne Frank da Diario di Adamo ed Eva';
  row.titolo_links = [
    { text: 'Diario di Anne Frank', url: row.titolo_links[0].url },
    { text: 'Diario di Adamo ed Eva', url: 'https://drive.google.com/file/d/0B0GR9pL-PhUaT2lYd1lpQ2N1RkU/view?usp=drivesdk&resourcekey=0-1zOh8cg0iGrtRQHc2i5IKA' }
  ];
  row.autore = 'Anne Frank / Mark Twain';
  row.genere = 'Storico / Umoristico-satirico (racconto in forma di diario)';
  row.chiave = 'Punto di vista / Connessioni';

  var twain = { heading: '▸ da Diario di Adamo ed Eva  —  Mark Twain', paras: [
    N('⚑ Testo umoristico-satirico che gioca anche su stereotipi di genere (Eva chiacchierona, Adamo insofferente): conviene farli emergere in classe e trasformarli in domanda, non lasciarli passare come semplice battuta.'),
    P('Chiave di lettura', 'Punto di vista / Connessioni'),
    N('Ponte con Rotta 9: le due voci di Adamo ed Eva, che raccontano le stesse giornate con sguardi diversi, anticipano la logica delle due poesie "gemelle" di Luzi (la giovane ebrea e il giovane musulmano). Vale la pena richiamarlo quando si arriva a R9.'),
    P('Negoziazione (in gruppo)', null),
    B('Adamo ed Eva raccontano le stesse giornate, ma non vedono le stesse cose: lui registra il fastidio di una creatura nuova che parla sempre, lei la meraviglia di un mondo da nominare. In gruppo: scegliete un episodio narrato da entrambi e indicate con precisione quali parole rivelano due modi diversi di guardare lo stesso fatto.'),
    B('All\'inizio Adamo vede in Eva soprattutto un disturbo. Alla fine, davanti alla sua tomba, qualcosa è cambiato del tutto. In gruppo: cercate nel testo i segni di questo cambiamento. Quando comincia, e cosa lo provoca? Ricordate la volpe del Piccolo Principe: chi ha "addomesticato" chi?'),
    B('Eva dice di amare Adamo senza trovarne la ragione, pur provandoci. In gruppo: cosa significa, secondo voi, voler spiegare un legame e non riuscirci? E perché Twain sceglie di far ridere per raccontare l\'incontro tra due esseri così diversi? Cosa dice il riso che un tono serio non direbbe?'),
    B('Eva e Adamo vengono presentati con tratti "tipici" (lei chiacchiera, lui vuole stare in pace). In gruppo: Twain li prende in giro, o prende in giro i luoghi comuni su di loro? Come si capisce la differenza?'),
    P('Bussola personale', 'C\'è una persona che, all\'inizio, ti è sembrata "di troppo" (un compagno, un fratello, un vicino) e che col tempo è diventata importante? Cosa ha cambiato il tuo sguardo, e quando te ne sei accorto/a?'),
    P('Scrittura di rotta', 'Racconta una stessa giornata, o uno stesso episodio, in due pagine di diario: la tua e quella di una persona che ti sta accanto (un compagno di banco, un fratello), ciascuna con la propria voce, come fanno Adamo ed Eva. Non firmare le pagine: chi legge deve capire dal tono chi parla.')
  ] };

  var variante = { text: '', runs: [
    { text: 'Variante creativa (a scelta dello studente): ', url: null, bold: true, italic: true },
    { text: 'una pagina di diario in cui Eva, dal suo giardino, o Anne, dalla finestra dell\'Alloggio segreto con lo sguardo sul castagno, descrive il proprio spazio a chi non lo ha mai visto. Da valutare in base al gruppo: dare voce ad Anne è delicato, e per alcune classi è meglio riservarla a chi la sceglie liberamente.', url: null, bold: false, italic: true }
  ] };
  variante.text = variante.runs[0].text + variante.runs[1].text;

  var conf = { heading: '▸ Scrittura di rotta di confronto: due diari lontanissimi  —  Anne Frank e Mark Twain', paras: [
    P('Chiave di lettura', 'Confronto multi-testo (da proporre dopo la lettura di entrambi i testi)'),
    P('Negoziazione preliminare (in gruppo)', null),
    B('Anne scrive da uno spazio chiuso, in tempo di persecuzione, a un\'amica immaginaria. Adamo ed Eva scrivono da un giardino senza muri, all\'alba del mondo, senza nessuno che li legga. Costruite insieme una tabella a tre colonne (Anne / Adamo ed Eva / in comune) su tre punti: per chi si scrive, che cosa permette di dire il diario, come si costruisce il rapporto con chi è accanto.'),
    P('Scrittura di rotta', 'Scrivi una pagina di confronto tra i due diari. Parti dalla differenza che ti ha colpito di più, poi mostra con due esempi precisi, uno per testo, cosa li avvicina nonostante tutto. Concludi con una frase tua: che cosa dicono, insieme, sull\'"altro accanto a me"?'),
    variante
  ] };

  var i = -1;
  R.schede.forEach(function (s, k) { if (i < 0 && s.heading.indexOf('Anne Frank') > -1) i = k; });
  R.schede.splice(i + 1, 0, twain, conf);
})();
