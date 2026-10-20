# Dubbi e domande

Punti da chiarire con designer e team sulla **3° Release** Figma. Le scelte indicate sotto sono provvisorie.

## 1. Sopratitoli: 14 o 16 px?

Nel desktop sono a 16 px in Chi siamo, Visione e metodologia, Trust, Patrimonio e Servizi; a 14 px in Team, Contatti, AG Informa, Eventi e Knowledge library.

Per coerenza uso provvisoriamente **16 px**, definiti in `$font-size-page-eyebrow`. Da confermare se uniformarli o mantenere la distinzione.

## 2. Titoli FAQ: 56 o 68 px?

Servizi e Patrimonio usano 56 px; Trust e Contatti 68 px. Per le future FAQ mantengo queste varianti, finché non viene confermata l'intenzione del design. Le domande potranno essere diverse per pagina, usando lo stesso componente.

## 3. Interlinee dei titoli mobile

Con dimensione del testo di 60 px, il design usa:

- **50 px:** Chi siamo e Contatti.
- **60 px:** Team, AG Informa, Eventi e Knowledge library.
- **69 px:** Visione e metodologia, Servizi, Trust e Patrimonio.

Mantengo le tre varianti nelle variabili `$line-height-page-title-mobile*`, selezionate da `mobileTitleLeading` in `PageIntro`. Da confermare se sono intenzionali.

## 4. Testi e menu mobile

Alcuni testi sono segnaposto e i font alternano Lato e Jost. Per ora uso **Jost e testi desktop**, mantenendo colori, griglia e interlinee mobile. Il menu aperto segue Bootstrap Collapse, in attesa del design definitivo. Servono conferme su testi, font e impaginazione alle larghezze intermedie.

## 5. Video di Chi siamo

Mancano video e poster definitivi: ho lasciato lo spazio vuoto, dimensionato sui frame, senza immagini o controlli fittizi. Servono file o URL e indicazioni su resa mobile, controlli e riproduzione.

## 6. Link e funzionalità mancanti

Servono URL LinkedIn, destinazioni delle voci legali e indicazioni sulla ricerca. Per ora uso etichette senza collegamento e ricerca disabilitata; i percorsi del menu anticipano pagine ancora da realizzare. Da completare prima della pubblicazione.

## 7. Contrasto dei testi

Il copyright nel footer (circa 1,9:1) e la descrizione della prima card desktop (circa 4,2:1) sono sotto il minimo di 4,5:1 per i testi normali previsto dalle [WCAG AA](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Mantengo i colori di Figma; da concordare con il designer una variante più leggibile.
