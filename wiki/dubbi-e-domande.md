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

Servono URL LinkedIn, contenuti delle pagine legali e indicazioni sulla ricerca. Per ora LinkedIn non ha collegamento e la ricerca è disabilitata; Privacy e Cookie hanno testi Lorem ipsum da sostituire, Credits solo layout e titolo. Da completare prima della pubblicazione.

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
- **Articoli e documenti correlati:** uso placeholder per la revisione grafica. Servono contenuti, relazioni e URL dei file da Strapi; i download restano inattivi senza PDF.

## 12. Patrimonio: confronto con la 4° Release

- **Mobile:** mostra cinque esigenze contro nove sul desktop, con numerazione incoerente; sopratitoli, introduzione, FAQ e CTA hanno testi diversi o provvisori. Mantengo i nove contenuti desktop anche sul mobile, in accordion, e Jost.
- **Descrizioni:** Protezione del patrimonio e Passaggio generazionale ripetono lo stesso secondo paragrafo. Da confermare i testi e le icone ripetute nelle ultime cinque voci.
- **Ordine mobile:** le FAQ seguono i contenuti correlati, diversamente dal desktop. Mantengo per ora l’ordine desktop; da verificare quando saranno disponibili i correlati.
- **FAQ e correlati:** mancano le risposte e due domande sono segnaposto; uso Lorem ipsum. I correlati mostrano placeholder da sostituire con Strapi; i download restano inattivi senza PDF.

## 13. Contatti: confronto con la 4° Release

- **Mobile:** dopo il titolo riprende le sezioni di Chi siamo e non mostra sedi, mappa, newsletter e FAQ del desktop. Uso contenuti desktop e regole responsive comuni; da confrontare con il frame definitivo.
- **Testi:** il titolo della fascia sedi e la descrizione newsletter sono segnaposto. Mancano le risposte delle FAQ; uso Lorem ipsum per verificare l’accordion.
- **Servizi:** servono configurazione della mappa, mappe delle altre sedi e destinazioni dei moduli. Mappa di Milano statica da Figma, selezione sedi e invii disattivati; integrazioni da completare con Vito.

## 14. Home: confronto con la 4° Release

- **Foto hero:** uso provvisoriamente l’immagine Figma con watermark Unsplash+, nei ritagli desktop e mobile. Serve l’asset definitivo.
- **Testi:** presentazione della società, descrizioni dei servizi, introduzione Patrimonio, card del metodo e newsletter contengono segnaposto; servono i testi definitivi.
- **Destinazioni:** mancano i collegamenti delle singole esigenze patrimoniali e dei servizi; le card restano statiche e le frecce decorative.
- **Evento e articoli:** per la revisione grafica uso gli esempi e le immagini di Figma, definiti come placeholder in `src/pages/index.astro`; i pulsanti portano provvisoriamente agli elenchi Eventi e AG Informa. Da sostituire con i dati Strapi.

## 15. Team: contenuti e profili

- **Contenuti Strapi:** titoli di sezione, ruoli, biografie e articolo ripetuto sono in parte segnaposto. Uso i dati Figma nella pagina, da sostituire con i contenuti definitivi e le relazioni agli articoli; per ora i collegamenti portano ad AG Informa.
- **Dati mancanti:** mancano le foto di Sonia Franchini, Michela e Giuseppina Ranzenigo; mantengo i riquadri provvisori di Figma. Serve il cognome di Michela.
- **Mobile:** testi e biografie differiscono dal desktop; il sopratitolo operativo è “Il nostro metodo”. Uso i contenuti desktop anche sul mobile, lasciando crescere le schede con il testo.
- **Profili individuali:** il percorso è predisposto, ma non ho trovato il relativo design o un collegamento attivo in Present. Servono conferma della pagina di dettaglio e contenuti; i nomi nell’elenco restano senza link.

## 16. AG Informa: contenuti e collegamenti

- **Articoli:** introduzione, testi, date e categorie sono provvisori. Uso otto esempi della pagina Figma e due della Home per verificare il caricamento progressivo; servono dati, ordine e categorie definitivi da Strapi.
- **Dettagli:** i link portano al modello `/ag-informa/articolo-provvisorio/`, con contenuti di esempio da Figma; i collegamenti definitivi arriveranno dai dati Strapi.
- **Newsletter:** manca la destinazione di “Leggi l’ultima newsletter”, che resta disattivato. “Iscriviti” porta al modulo di Contatti; il servizio di iscrizione resta da integrare.

## 17. Dettaglio articolo: contenuti e mobile

- **Strapi:** testo, data, tempo di lettura, autore, nota sull’IA e correlati sono esempi Figma. Servono contenuti definitivi e accordo con Vito sul formato del corpo editoriale e sulle relazioni. Per ora ogni slug mostra lo stesso esempio.
- **Mobile:** manca un frame completo. Adatto il desktop con indice richiudibile prima del testo; da confrontare con la prossima release.
- **Indice:** Figma elenca “In breve: le risposte chiave”, ma non mostra la sezione corrispondente. Voce omessa in attesa del contenuto.
- **FAQ e documenti:** mancano risposte e PDF. Uso Lorem ipsum e download inattivi; servono testi, file e metadati definitivi.
- **Invito finale:** titolo e descrizione sono Lorem ipsum; servono i testi definitivi.

## 18. Eventi e formazione: contenuti e collegamenti

- **Calendario completo:** nel prototipo manca la destinazione. Collegamento inattivo in attesa dell’URL o del comportamento previsto.
- **Contenuti:** introduzione, date, luoghi e testi sono provvisori. Il desktop presenta differenze tra i due elenchi; uso gli stessi sei eventi della griglia in entrambe le sezioni, come sul mobile. Servono dati e criteri di selezione da Strapi.
- **Newsletter:** “Leggi l’ultima newsletter” attende la destinazione; “Iscriviti” porta al modulo di Contatti, ancora da integrare con il servizio.

## 19. Dettaglio evento: contenuti e mobile

- **Strapi:** testo, orario, categoria, documenti e correlati sono esempi Figma; il primo correlato ripete l’evento corrente. Servono dati definitivi, criteri di selezione e formato del corpo editoriale. Per ora ogni slug mostra lo stesso esempio e le schede portano a `/eventi-in-agenda/evento-provvisorio/`.
- **Mobile:** manca un frame dedicato. Adatto il desktop con copertina nel contenitore, informazioni e condivisione prima del testo; da confrontare con la prossima release.
- **Documenti e contatti:** mancano i PDF e il testo del piccolo invito ai contatti è Lorem ipsum. Download inattivi e contenuti da sostituire.
