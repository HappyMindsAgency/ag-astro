# Dubbi e domande

Punti da chiarire con designer e team sulla **3° Release** Figma. Le scelte indicate sotto sono provvisorie.

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

Servono URL LinkedIn, destinazioni delle voci legali e indicazioni sulla ricerca. Per ora uso etichette senza collegamento e ricerca disabilitata; i percorsi del menu anticipano pagine ancora da realizzare. Da completare prima della pubblicazione.

## 6. Contrasto dei testi

Il copyright nel footer (circa 1,9:1) e la descrizione della prima card desktop (circa 4,2:1) sono sotto il minimo di 4,5:1 per i testi normali previsto dalle [WCAG AA](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Mantengo i colori di Figma; da concordare con il designer una variante più leggibile.

## 7. Competenze e metodo di Chi siamo

Le tre descrizioni delle competenze desktop sono ancora segnaposto. Il mobile presenta sei competenze diverse e otto voci del metodo, contro tre e quattro del desktop. Mantengo per ora struttura e contenuti desktop anche sul mobile; servono testi definitivi e conferma delle voci. Le frecce delle competenze restano decorative finché non sono indicate le destinazioni.

## 8. Visione e metodologia: confronto con la 4° Release

- **Testi provvisori:** “Titolo della sezione”, terzo e quarto servizio, descrizioni dei servizi e paragrafi Lorem ipsum/Cras et lorem. Mantengo i testi attuali di Figma.
- **Invito finale:** il testo “Ogni mese…” parla di newsletter, mentre il pulsante porta ai servizi. Da confermare testo e destinazione.
- **Mobile:** introduzione e testo del metodo differiscono dal desktop; uso per ora le versioni desktop e Jost.
- **Navigazione:** il breadcrumb desktop indica ancora “Chi siamo”; nella pagina uso “Visione e metodologia”. Servono conferma della posizione nel menu e destinazioni dei singoli servizi; le loro frecce restano decorative.
