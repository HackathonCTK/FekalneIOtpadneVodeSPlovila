/*
 * ČistoMore — Plovi odgovorno: ilustracije za odjeljak „Korak po korak u slikama“.
 * Nacrtano za ovu stranicu (bez tuđih autorskih prava). Boje dolaze iz CSS varijabli
 * (klase .il-*, vidi plovi-odgovorno.css), pa crteži prate tamni i svijetli način.
 * Ključ = redni broj koraka u PO_CONTENT.*.howto.steps.
 */
window.PO_ILLUSTRATIONS = [
  /* 1. Sustav na brodu: WC → Y-ventil → spremnik → palubni čep WASTE; ventil prema moru zatvoren */
  '<svg viewBox="0 0 320 200" role="presentation" aria-hidden="true">' +
    '<rect class="il-water" x="0" y="150" width="320" height="50"/>' +
    '<path class="il-hull" d="M14 70 H306 L284 168 Q160 190 36 168 Z"/>' +
    '<path class="il-line" d="M14 70 H306" stroke-width="3"/>' +
    /* WC */
    '<path class="il-obj" d="M52 118 h40 v10 q0 18 -20 22 q-20 -4 -20 -22 z"/>' +
    '<rect class="il-obj" x="48" y="96" width="14" height="24" rx="3"/>' +
    /* cijev WC → Y-ventil */
    '<path class="il-pipe" d="M72 150 V160 H128"/>' +
    /* Y-ventil */
    '<circle class="il-acc-stroke" cx="138" cy="160" r="10"/>' +
    '<path class="il-line" d="M138 150 V140 M131 167 L145 153" stroke-width="2.5"/>' +
    /* prema moru: zatvoreno */
    '<path class="il-pipe il-dim" d="M138 170 V186"/>' +
    '<g class="il-warn-stroke"><path d="M128 178 l20 14 M148 178 l-20 14" stroke-width="4"/></g>' +
    /* cijev Y-ventil → spremnik */
    '<path class="il-pipe" d="M148 160 H190"/>' +
    /* spremnik */
    '<rect class="il-tank" x="190" y="104" width="78" height="56" rx="10"/>' +
    '<path class="il-tank-fill" d="M194 134 q18 -6 35 0 t35 0 V150 a6 6 0 0 1 -6 6 H200 a6 6 0 0 1 -6 -6 Z"/>' +
    /* cijev spremnik → palubni čep */
    '<path class="il-pipe" d="M248 104 V74"/>' +
    '<rect class="il-acc" x="236" y="62" width="24" height="10" rx="3"/>' +
    '<text class="il-label il-label-acc" x="248" y="52" text-anchor="middle">WASTE</text>' +
    /* strelice toka */
    '<path class="il-arrow" d="M100 156 l8 4 l-8 4"/><path class="il-arrow" d="M168 156 l8 4 l-8 4"/><path class="il-arrow" d="M244 92 l4 -8 l4 8"/>' +
  '</svg>',

  /* 2. Prihvatna stanica uz gat */
  '<svg viewBox="0 0 320 200" role="presentation" aria-hidden="true">' +
    '<rect class="il-water" x="0" y="136" width="320" height="64"/>' +
    '<path class="il-wave" d="M0 150 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0"/>' +
    /* gat */
    '<rect class="il-obj" x="168" y="122" width="152" height="16" rx="3"/>' +
    '<path class="il-line" d="M186 138 V176 M232 138 V176 M278 138 V176" stroke-width="5"/>' +
    /* pumpa */
    '<rect class="il-panel" x="246" y="58" width="44" height="64" rx="8"/>' +
    '<rect class="il-acc" x="240" y="34" width="56" height="20" rx="5"/>' +
    '<text class="il-label il-label-on-acc" x="268" y="48" text-anchor="middle">PUMP OUT</text>' +
    '<circle class="il-acc-stroke" cx="268" cy="80" r="8"/>' +
    '<rect class="il-line-box" x="256" y="96" width="24" height="14" rx="3"/>' +
    /* crijevo do broda */
    '<path class="il-hose" d="M250 104 C 210 104, 200 70, 150 74 C 120 76, 118 92, 112 96"/>' +
    /* brod */
    '<path class="il-hull" d="M8 100 H160 L146 140 H24 Z"/>' +
    '<rect class="il-obj" x="40" y="70" width="58" height="30" rx="6"/>' +
    '<path class="il-line" d="M58 70 V30 M58 34 L92 66 H58" stroke-width="2.5"/>' +
    '<rect class="il-acc" x="104" y="94" width="16" height="7" rx="2"/>' +
    /* konop */
    '<path class="il-rope" d="M150 104 Q 170 118 182 122"/>' +
  '</svg>',

  /* 3. Tri palubna čepa: FUEL, WATER, WASTE */
  '<svg viewBox="0 0 320 200" role="presentation" aria-hidden="true">' +
    '<rect class="il-deck" x="10" y="30" width="300" height="140" rx="18"/>' +
    '<path class="il-plank" d="M10 76 H310 M10 124 H310"/>' +
    '<g class="il-cap il-dim"><circle cx="70" cy="100" r="34"/><circle cx="70" cy="100" r="24"/><path d="M60 100 h20"/></g>' +
    '<text class="il-label" x="70" y="154" text-anchor="middle">FUEL</text>' +
    '<g class="il-cap il-dim"><circle cx="160" cy="100" r="34"/><circle cx="160" cy="100" r="24"/><path d="M150 100 h20"/></g>' +
    '<text class="il-label" x="160" y="154" text-anchor="middle">WATER</text>' +
    '<g class="il-cap il-cap-ok"><circle cx="250" cy="100" r="34"/><circle cx="250" cy="100" r="24"/><path d="M240 100 h20"/></g>' +
    '<text class="il-label il-label-acc" x="250" y="154" text-anchor="middle">WASTE</text>' +
    '<circle class="il-acc" cx="278" cy="70" r="13"/><path class="il-check" d="M271 70 l5 5 l9 -10"/>' +
  '</svg>',

  /* 4. Nastavak crijeva na čepu WASTE, pumpa siše */
  '<svg viewBox="0 0 320 200" role="presentation" aria-hidden="true">' +
    '<rect class="il-deck" x="0" y="128" width="320" height="72"/>' +
    '<path class="il-plank" d="M0 160 H320"/>' +
    '<ellipse class="il-cap il-cap-ok" cx="130" cy="130" rx="44" ry="12"/>' +
    '<text class="il-label il-label-acc" x="130" y="164" text-anchor="middle">WASTE</text>' +
    /* nastavak */
    '<path class="il-nozzle" d="M112 128 L118 92 H142 L148 128 Z"/>' +
    '<rect class="il-panel" x="114" y="70" width="32" height="24" rx="6"/>' +
    '<path class="il-line" d="M146 80 h14" stroke-width="5"/>' +
    /* crijevo prema stanici */
    '<path class="il-hose" d="M130 70 C 130 30, 200 24, 230 40 S 300 70, 318 60"/>' +
    /* strelice: sadržaj ide u crijevo */
    '<path class="il-arrow" d="M186 30 l10 2 l-6 8"/><path class="il-arrow" d="M262 58 l10 0 l-4 9"/>' +
    '<path class="il-arrow il-arrow-up" d="M130 118 V100 M124 106 l6 -6 l6 6"/>' +
  '</svg>',

  /* 5. Ispiranje: čista voda kroz WC u spremnik, pa ponovno pražnjenje */
  '<svg viewBox="0 0 320 200" role="presentation" aria-hidden="true">' +
    /* WC */
    '<path class="il-obj" d="M40 96 h64 v14 q0 30 -32 36 q-32 -6 -32 -36 z"/>' +
    '<rect class="il-obj" x="34" y="60" width="22" height="38" rx="4"/>' +
    '<path class="il-drop" d="M72 66 q-8 12 0 16 q8 -4 0 -16z"/><path class="il-drop" d="M88 52 q-6 9 0 12 q6 -3 0 -12z"/>' +
    '<path class="il-pipe" d="M72 146 V170 H186"/>' +
    '<path class="il-arrow" d="M140 166 l8 4 l-8 4"/>' +
    /* spremnik */
    '<rect class="il-tank" x="186" y="96" width="104" height="80" rx="12"/>' +
    '<path class="il-water-fill" d="M190 150 q22 -8 48 0 t48 0 V166 a8 8 0 0 1 -8 8 H198 a8 8 0 0 1 -8 -8 Z"/>' +
    /* ponovi */
    '<path class="il-repeat" d="M226 64 a26 26 0 1 1 26 26"/><path class="il-repeat-head" d="M244 82 l8 8 l-8 8"/>' +
    '<text class="il-label il-label-acc" x="238" y="70" text-anchor="middle">2×</text>' +
  '</svg>',

  /* 6. Potvrda o isporuci otpada i brodski dnevnik */
  '<svg viewBox="0 0 320 200" role="presentation" aria-hidden="true">' +
    '<rect class="il-paper" x="46" y="20" width="124" height="162" rx="10"/>' +
    '<path class="il-paper-line" d="M66 50 H150 M66 72 H150 M66 90 H134 M66 108 H146 M66 126 H120"/>' +
    '<circle class="il-acc-stroke il-stamp" cx="132" cy="150" r="20"/><path class="il-check-acc" d="M122 150 l7 7 l13 -14"/>' +
    /* dnevnik */
    '<rect class="il-book" x="186" y="58" width="96" height="124" rx="10"/>' +
    '<path class="il-book-spine" d="M200 58 V182"/>' +
    '<path class="il-paper-line" d="M214 86 H268 M214 106 H268 M214 126 H252"/>' +
    '<rect class="il-acc" x="214" y="142" width="18" height="18" rx="4"/><path class="il-check" d="M217 151 l4 4 l8 -9"/>' +
    '<path class="il-paper-line" d="M240 151 H268"/>' +
  '</svg>'
];
