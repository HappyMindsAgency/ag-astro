# Dubbi e domande

Punti da chiarire con designer e team sulla **3° Release** Figma e sull’architettura delle pagine. Le scelte indicate sotto sono provvisorie.

## 1. Titoli FAQ: 56 o 68 px?

Servizi e Patrimonio usano 56 px; Trust e Contatti 68 px. Per le future FAQ mantengo queste varianti, finché non viene confermata l'intenzione del design. Le domande potranno essere diverse per pagina, usando lo stesso componente.

## 2. Interlinee dei titoli mobile

Con dimensione del testo di 60 px, il design usa:

- **50 px:** Chi siamo e Contatti.
- **60 px:** Team, AG Informa, Eventi e Knowledge library.
- **69 px:** Visione e metodologia, Servizi, Trust e Patrimonio.

Mantengo le tre varianti nelle variabili `$line-height-page-title-mobile*`, selezionate da `mobileTitleLeading` in `PageIntro`. Da confermare se sono intenzionali.

## 3. Testi e menu mobile

Alcuni testi sono segnaposto e i font alternano Lato e Jost. Per ora uso **Jost e testi desktop**, mantenendo colori, griglia e interlinee mobile. Il menu aperto segue Bootstrap Collapse, in attesa del design definitivo. Servono conferme su testi, font e impaginazione alle larghezze intermedie.

## 4. Video di Chi siamo

Mancano video e poster definitivi: ho lasciato lo spazio vuoto, dimensionato sui frame, senza immagini o controlli fittizi. Servono file o URL e indicazioni su resa mobile, controlli e riproduzione.

## 5. Link e funzionalità mancanti

Servono URL LinkedIn, contenuti delle pagine legali e indicazioni sulla ricerca. Per ora LinkedIn non ha collegamento e la ricerca è disabilitata; le pagine legali hanno solo layout e titolo. Da completare prima della pubblicazione.

## 6. Contrasto dei testi

Il copyright nel footer (circa 1,9:1) e la descrizione della prima card desktop (circa 4,2:1) sono sotto il minimo di 4,5:1 per i testi normali previsto dalle [WCAG AA](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Mantengo i colori di Figma; da concordare con il designer una variante più leggibile.

## 7. Competenze e metodo di Chi siamo

Le tre descrizioni delle competenze desktop sono ancora segnaposto. Il mobile presenta sei competenze diverse e otto voci del metodo, contro tre e quattro del desktop. Mantengo per ora struttura e contenuti desktop anche sul mobile; servono testi definitivi e conferma delle voci. Le frecce delle competenze restano decorative finché non sono indicate le destinazioni.

## 8. Visione e metodologia: confronto con la 4° Release

- **Testi provvisori:** “Titolo della sezione”, terzo e quarto servizio, descrizioni dei servizi e paragrafi Lorem ipsum/Cras et lorem. Mantengo i testi attuali di Figma.
- **Invito finale:** il testo “Ogni mese…” parla di newsletter, mentre il pulsante porta ai servizi. Da confermare testo e destinazione.
- **Mobile:** introduzione e testo del metodo differiscono dal desktop; uso per ora le versioni desktop e Jost.
- **Servizi:** servono le destinazioni delle singole voci; le loro frecce restano decorative.

## 9. Servizi: confronto con la 4° Release

- **Mobile:** titolo e introduzione riprendono Visione e metodologia; il catalogo mostra sette servizi identici e le FAQ citano Trust e Patrimonio. Mantengo gli otto servizi e i testi desktop, compresi invito finale e contatti.
- **FAQ:** due domande sono segnaposto e mancano tutte le risposte. Uso risposte Lorem ipsum provvisorie per verificare l’accordion; servono i contenuti definitivi.
- **Frecce dei servizi:** mancano le destinazioni delle singole voci. Restano decorative; i collegamenti espliciti portano alle future pagine Patrimonio e Trust.

## 10. Architettura e slug

Dal [file degli slug](AG_Trustees_Slug.xlsx) restano da chiarire:

- **Galvani e Argos (P03):** pagina dedicata o sezione di Chi siamo? La pagina separata non è predisposta.
- **Family office (P08):** una nota nel file chiede di tenerla in standby perché potrebbe andare su Fidire. Non è predisposta.
- **Eventi (P13):** pagina autonoma o tab di AG Informa? Per ora è predisposta a `/eventi-in-agenda/`, come indicato per il lancio.
- **Library (P15–P16):** confermare nome e gerarchia. Uso `/knowledge-library/[tipologia]/`, dalla colonna Percorso IT; la colonna Pagina padre cita invece `/knowledge-library/tipologia/`.
- **Filtri tematici, Newsletter e accesso ai dati (P14, P20, P24):** presenza al lancio da decidere; pagine non predisposte.
- **Informazioni societarie (P26):** riga incompleta, senza percorso o indicazione sul lancio.
- **FAQ nel footer:** manca una pagina dedicata nel file. Servono conferma della destinazione e del rapporto con le FAQ della Library; per ora l’etichetta non ha collegamento.

## 11. Trust: confronto con la 4° Release

- **Mobile:** il breadcrumb indica Patrimonio, il sopratitolo riprende Visione e metodologia e alcune sezioni usano testi relativi al patrimonio. Mantengo i testi desktop e Jost; da confrontare con la prossima release.
- **FAQ:** due domande sono segnaposto e il prototipo non mostra risposte. Uso Lorem ipsum per verificare l’accordion; servono i testi definitivi.
- **Articoli e documenti correlati:** arriveranno da Strapi. Servono contenuti, relazioni e URL dei file; non uso i dati dimostrativi di Figma.
