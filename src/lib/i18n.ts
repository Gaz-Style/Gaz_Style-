export type SupportedLang = 'es' | 'en' | 'pt' | 'de' | 'fr';

export interface Translations {
  nav: {
    grupales: string;
    desafios: string;
    highMountain: string;
    boutique: string;
    niveles: string;
    comunidad: string;
  };
  hero: {
    trust_wfr: string;
    trust_sos: string;
    title_line1: string;
    title_line2: string;
    subtitle: string;
    btn_all_adventures: string;
    btn_help_choose: string;
  };
  sections: {
    grupales: {
      badge: string;
      title: string;
      highlightTitle: string;
      subtitle: string;
    };
    desafios: {
      badge: string;
      title: string;
      highlightTitle: string;
      subtitle: string;
    };
    highMountain: {
      badge: string;
      title: string;
      highlightTitle: string;
      subtitle: string;
    };
    boutique: {
      badge: string;
      title: string;
      highlightTitle: string;
      subtitle: string;
    };
  };
  cards: {
    duration: string;
    difficulty: string;
    altitude: string;
    view_details: string;
    view_details_spec: string;
  };
  levels: {
    badge: string;
    title: string;
    l1_title: string;
    l1_meta: string;
    l1_desc: string;
    l2_title: string;
    l2_meta: string;
    l2_desc: string;
    l3_title: string;
    l3_meta: string;
    l3_desc: string;
    l4_title: string;
    l4_meta: string;
    l4_desc: string;
  };
  modal: {
    cat_title: string;
    subtitle: string;
    close: string;
  };
  footer: {
    desc: string;
    expeditions: string;
    ecosystem: string;
    contact: string;
    rights: string;
  };
}

export const DICTIONARY: Record<SupportedLang, Translations> = {
  es: {
    nav: {
      grupales: 'Grupales',
      desafios: 'Desafíos',
      highMountain: 'High Mountain',
      boutique: 'Boutique',
      niveles: 'Niveles',
      comunidad: 'Comunidad',
    },
    hero: {
      trust_wfr: 'Expediciones Guiadas',
      trust_sos: 'SOS Satelital Garmin',
      title_line1: 'SANTIAGO DESDE',
      title_line2: 'LA CIMA.',
      subtitle: 'Expediciones de montaña, ascensos al atardecer y cumbres en los Andes centrales. Salidas grupales y privadas por los cerros más icónicos de Santiago, desde rutas clásicas hasta desafíos de alta exigencia.',
      btn_all_adventures: 'Ver todas las aventuras',
      btn_help_choose: 'Ayúdame a elegir',
    },
    sections: {
      grupales: {
        badge: 'COMUNIDAD & ATARDECERES',
        title: 'SALIDAS',
        highlightTitle: 'GRUPALES',
        subtitle: 'Cumbres de día, atardeceres y rutas clásicas con la comunidad Gaz-Style. Atardeceres dorados y panorámicas 360° sobre el valle de Santiago.',
      },
      desafios: {
        badge: 'ENDURANCE FULL DAY',
        title: 'TRAVESÍAS &',
        highlightTitle: 'DESAFÍOS',
        subtitle: 'Retos de resistencia física y mental en la cuenca central con +1.500m de desnivel vertical y filos andinos.',
      },
      highMountain: {
        badge: 'GRANDES CUMBRES 5.000M+ · ESTÁNDAR PUMA ADVENTURES',
        title: 'EXPEDITION',
        highlightTitle: 'HIGH MOUNTAIN',
        subtitle: 'Expediciones técnicas de altura en los Andes (El Plomo, Leonera, San José) con porteo, arrieros y monitoreo satelital.',
      },
      boutique: {
        badge: '100% PRIVADO & TAILOR-MADE',
        title: 'EXPEDITION',
        highlightTitle: 'BOUTIQUE',
        subtitle: 'Experiencias privadas a tu propio ritmo con transporte ejecutivo hotel a hotel, catering gourmet y video Reel 4K profesional.',
      },
    },
    cards: {
      duration: 'Duración',
      difficulty: 'Dificultad',
      altitude: 'Altura',
      view_details: 'VER DETALLES',
      view_details_spec: 'Ver Detalles y Ficha Técnica →',
    },
    levels: {
      badge: 'Graduación Técnica · Cuenca Central',
      title: 'Sistema de Niveles de Montaña',
      l1_title: 'Iniciación Activa',
      l1_meta: 'Desnivel <400m+ · 3.5 hrs',
      l1_desc: 'Ritmo amable y pausas panorámicas. Ideal para tu primera cumbre, fotografía profesional y panorámicas al atardecer sobre la cuenca.',
      l2_title: 'Cardio & Desconexión',
      l2_meta: 'Desnivel 400 a 800m+ · 4-5 hrs',
      l2_desc: 'Ritmo deportivo sostenido para botar el estrés de la oficina. Exige calzado con buen agarre, respiración constante y energía activa.',
      l3_title: 'Desafío Andino',
      l3_meta: 'Desnivel 800 a 1.400m+ · 6-8 hrs',
      l3_desc: 'Pendientes pronunciadas, acarreos andinos y exposición a la altura de la precordillera. Requiere buena hidratación y determinación mental.',
      l4_title: 'Resistencia Extrema',
      l4_meta: 'Desnivel >1.500m+ · Filos Andinos',
      l4_desc: 'Jornadas de resistencia física total por aristas andinas no aptas para principiantes. Exige equipo técnico y preparación cardiovascular.',
    },
    modal: {
      cat_title: 'Catálogo de Expediciones',
      subtitle: 'Todas las Aventuras',
      close: 'Cerrar',
    },
    footer: {
      desc: 'Expediciones en los Andes chilenos, seguridad en montaña y cumbres sobre el valle de Santiago. Guiado por Gaz.',
      expeditions: 'Expediciones',
      ecosystem: 'Ecosistema',
      contact: 'Contacto Directo',
      rights: '© 2026 GAZ_STYLE · SANTIAGO HIKING. TODOS LOS DERECHOS RESERVADOS.',
    },
  },

  en: {
    nav: {
      grupales: 'Group Treks',
      desafios: 'Challenges',
      highMountain: 'High Mountain',
      boutique: 'Boutique',
      niveles: 'Levels',
      comunidad: 'Community',
    },
    hero: {
      trust_wfr: 'Guided Expeditions',
      trust_sos: 'Garmin Satellite SOS',
      title_line1: 'UNLOCK',
      title_line2: 'THE SUMMIT.',
      subtitle: 'Guided mountain expeditions, sunset ascents, and summits in the central Andes. Group and private treks across Santiago’s most iconic peaks, from classic day hikes to demanding endurance challenges.',
      btn_all_adventures: 'Explore All Adventures',
      btn_help_choose: 'Help Me Choose',
    },
    sections: {
      grupales: {
        badge: 'COMMUNITY & SUNSET EXPEDITIONS',
        title: 'GROUP',
        highlightTitle: 'TREKS',
        subtitle: 'Day summits, golden-hour sunsets, and iconic routes with the mountain community. Golden light and 360° views above the Santiago cloud sea.',
      },
      desafios: {
        badge: 'ENDURANCE FULL DAY',
        title: 'TRAVERSES &',
        highlightTitle: 'CHALLENGES',
        subtitle: 'Ultimate tests of endurance and willpower in the central Andes with +1,500m vertical elevation gains across high ridges.',
      },
      highMountain: {
        badge: 'MAJOR SUMMITS 5,000M+ · HIGH ALTITUDE EXPEDITIONS',
        title: 'EXPEDITION',
        highlightTitle: 'HIGH MOUNTAIN',
        subtitle: 'Technical high-altitude expeditions in the Andes (Mt. El Plomo, Leonera, San José Volcano) with mule pack support and satellite safety.',
      },
      boutique: {
        badge: '100% PRIVATE & TAILOR-MADE',
        title: 'EXPEDITION',
        highlightTitle: 'BOUTIQUE',
        subtitle: 'Private bespoke experiences at your own pace with door-to-door luxury hotel transfers, mountain gourmet catering, and edited 4K Reel.',
      },
    },
    cards: {
      duration: 'Duration',
      difficulty: 'Difficulty',
      altitude: 'Altitude',
      view_details: 'VIEW DETAILS',
      view_details_spec: 'View Details & Technical Specs →',
    },
    levels: {
      badge: 'Technical Mountain Grading · Central Andes',
      title: 'Mountain Level System',
      l1_title: 'Active Initiation',
      l1_meta: 'Elevation Gain <400m+ · 3.5 hrs',
      l1_desc: 'Gentle pace with scenic resting stops. Ideal for your first Andean summit, pro photo shots, and sunset coffee over the valley.',
      l2_title: 'Cardio & Reset',
      l2_meta: 'Elevation Gain 400 to 800m+ · 4-5 hrs',
      l2_desc: 'Sustained athletic mountain pace to shake off city stress. Requires trail shoes with great grip, steady breathing, and energy.',
      l3_title: 'Andean Challenge',
      l3_meta: 'Elevation Gain 800 to 1,400m+ · 6-8 hrs',
      l3_desc: 'Steep inclines, loose scree slopes, and altitude exposure. Demands strong hydration, stamina, and mental fortitude.',
      l4_title: 'Extreme Endurance',
      l4_meta: 'Elevation Gain >1,500m+ · High Alpine Ridges',
      l4_desc: 'Full-day non-stop endurance push across exposed Andean knife-edge ridges. Strict cardio readiness required.',
    },
    modal: {
      cat_title: 'Expedition Catalog',
      subtitle: 'All Adventures',
      close: 'Close',
    },
    footer: {
      desc: 'Expeditions in the Chilean Andes, backcountry safety, and summits above Santiago. Guided by Gaz.',
      expeditions: 'Expeditions',
      ecosystem: 'Ecosystem',
      contact: 'Direct Contact',
      rights: '© 2026 GAZ_STYLE · SANTIAGO HIKING. ALL RIGHTS RESERVED.',
    },
  },

  fr: {
    nav: {
      grupales: 'Sorties Groupe',
      desafios: 'Défis & Traversées',
      highMountain: 'Haute Montagne',
      boutique: 'Boutique',
      niveles: 'Niveaux',
      comunidad: 'Communauté',
    },
    hero: {
      trust_wfr: 'Expéditions Guidées',
      trust_sos: 'SOS Satellite Garmin',
      title_line1: 'DÉBLOQUEZ',
      title_line2: 'LE SOMMET.',
      subtitle: 'Expéditions en montagne, ascensions au coucher du soleil et sommets dans les Andes centrales. Sorties en groupe et privées sur les sommets les plus emblématiques de Santiago.',
      btn_all_adventures: 'Voir toutes les aventures',
      btn_help_choose: 'Aidez-moi à choisir',
    },
    sections: {
      grupales: {
        badge: 'COMMUNAUTÉ & COUCHERS DE SOLEIL',
        title: 'SORTIES',
        highlightTitle: 'EN GROUPE',
        subtitle: 'Ascensions à la journée, couchers de soleil dorés et sentiers emblématiques. Couchers de soleil dorés et vues panoramiques à 360° sur la vallée de Santiago.',
      },
      desafios: {
        badge: 'ENDURANCE JOURNÉE ENTIÈRE',
        title: 'TRAVERSÉES &',
        highlightTitle: 'GRANDS DÉFIS',
        subtitle: 'Épreuves d’endurance physique et mentale sur les crêtes de la cordillère centrale avec plus de 1 500 m de dénivelé positif.',
      },
      highMountain: {
        badge: 'GRANDS SOMMETS 5 000M+ · EXPÉDITIONS D’ALTITUDE',
        title: 'EXPÉDITION',
        highlightTitle: 'HAUTE MONTAGNE',
        subtitle: 'Expéditions techniques d’altitude dans les Andes (El Plomo 5 424 m, Leonera, Volcan San José) avec logistique muletière et balises Garmin.',
      },
      boutique: {
        badge: '100% PRIVÉ & SUR MESURE',
        title: 'EXPÉDITION',
        highlightTitle: 'BOUTIQUE',
        subtitle: 'Expériences privées exclusives à votre rythme avec transport exécutif hôtel à hôtel, traiteur gourmet et vidéo Reel 4K professionnelle.',
      },
    },
    cards: {
      duration: 'Durée',
      difficulty: 'Difficulté',
      altitude: 'Altitude',
      view_details: 'VOIR DÉTAILS',
      view_details_spec: 'Voir Détails et Fiche Technique →',
    },
    levels: {
      badge: 'Graduation Technique · Andes Centrales',
      title: 'Système de Niveaux de Montagne',
      l1_title: 'Initiation Active',
      l1_meta: 'Dénivelé <400m+ · 3.5 hrs',
      l1_desc: 'Rythme accessible et pauses panoramiques. Idéal pour votre premier sommet andin, photos d’exception et couchers de soleil sur la vallée.',
      l2_title: 'Cardio & Déconnexion',
      l2_meta: 'Dénivelé 400 à 800m+ · 4-5 hrs',
      l2_desc: 'Rythme sportif régulier pour évacuer la tension urbaine. Chaussures à bonne adhérence et souffle constant recommandés.',
      l3_title: 'Défi Andin',
      l3_meta: 'Dénivelé 800 à 1 400m+ · 6-8 hrs',
      l3_desc: 'Pentes abruptes, éboulis andins et exposition à l’altitude. Exige une excellente hydratation et détermination.',
      l4_title: 'Endurance Extrême',
      l4_meta: 'Dénivelé >1 500m+ · Crêtes Alpines',
      l4_desc: 'Journées complètes d’effort soutenu sur des arêtes andines effilées. Préparation cardiovasculaire rigoureuse indispensable.',
    },
    modal: {
      cat_title: 'Catalogue des Expéditions',
      subtitle: 'Toutes les Aventures',
      close: 'Fermer',
    },
    footer: {
      desc: 'Expéditions dans les Andes chiliennes, sécurité en montagne et cimes dominant Santiago. Guidé par Gaz.',
      expeditions: 'Expéditions',
      ecosystem: 'Écosystème',
      contact: 'Contact Direct',
      rights: '© 2026 GAZ_STYLE · SANTIAGO HIKING. TOUS DROITS RÉSERVÉS.',
    },
  },

  pt: {
    nav: {
      grupales: 'Saídas em Grupo',
      desafios: 'Desafios',
      highMountain: 'Alta Montanha',
      boutique: 'Boutique',
      niveles: 'Níveis',
      comunidad: 'Comunidade',
    },
    hero: {
      trust_wfr: 'Expedições Guiadas',
      trust_sos: 'SOS Satélite Garmin',
      title_line1: 'DESBLOQUEIE',
      title_line2: 'O CUME.',
      subtitle: 'Expedições de montanha, subidas ao pôr do sol e cumes nos Andes centrais. Saídas em grupo e privadas pelas montanhas mais emblemáticas de Santiago.',
      btn_all_adventures: 'Ver todas as aventuras',
      btn_help_choose: 'Ajude-me a escolher',
    },
    sections: {
      grupales: {
        badge: 'COMUNIDADE & PÔR DO SOL',
        title: 'SAÍDAS EM',
        highlightTitle: 'GRUPO',
        subtitle: 'Cumes de um dia, pores do sol dourados e rotas clássicas com a comunidade. Pores do sol dourados e vistas panorâmicas sobre o vale de Santiago.',
      },
      desafios: {
        badge: 'ENDURANCE DIA COMPLETO',
        title: 'TRAVESSIAS &',
        highlightTitle: 'DESAFIOS',
        subtitle: 'Grandes testes de resistência física e mental na cordilheira central com +1.500m de desnível positivo sobre cristas andinas.',
      },
      highMountain: {
        badge: 'GRANDES CUMES 5.000M+ · ALTA MONTANHA',
        title: 'EXPEDIÇÃO',
        highlightTitle: 'HIGH MOUNTAIN',
        subtitle: 'Expedições técnicas de altitude nos Andes (El Plomo 5.424m, Leonera, Vulcão San José) com mulas de carga e segurança via satélite.',
      },
      boutique: {
        badge: '100% PRIVADO & TAILOR-MADE',
        title: 'EXPEDIÇÃO',
        highlightTitle: 'BOUTIQUE',
        subtitle: 'Experiências exclusivas no seu próprio ritmo com transporte executivo porta a porta, gastronomia gourmet e vídeo Reel 4K.',
      },
    },
    cards: {
      duration: 'Duração',
      difficulty: 'Dificuldade',
      altitude: 'Altitude',
      view_details: 'VER DETALHES',
      view_details_spec: 'Ver Detalhes e Ficha Técnica →',
    },
    levels: {
      badge: 'Graduação Técnica · Andes Centrais',
      title: 'Sistema de Níveis de Montanha',
      l1_title: 'Iniciação Ativa',
      l1_meta: 'Desnível <400m+ · 3.5 hrs',
      l1_desc: 'Ritmo suave e paradas panorâmicas. Ideal para o seu primeiro cume, fotos de alta qualidade e pores do sol sobre o vale.',
      l2_title: 'Cardio & Desconexão',
      l2_meta: 'Desnível 400 a 800m+ · 4-5 hrs',
      l2_desc: 'Ritmo esportivo constante para descarregar a rotina. Exige calçados com boa aderência e respiração controlada.',
      l3_title: 'Desafio Andino',
      l3_meta: 'Desnível 800 a 1.400m+ · 6-8 hrs',
      l3_desc: 'Subidas íngremes, terrenos soltos e exposição à altitude. Requer boa hidratação e determinação mental.',
      l4_title: 'Resistência Extrema',
      l4_meta: 'Desnível >1.500m+ · Arestas Andinas',
      l4_desc: 'Jornadas intensas de resistência por cristas andinas expostas. Preparação cardiovascular exigente.',
    },
    modal: {
      cat_title: 'Catálogo de Expedições',
      subtitle: 'Todas as Aventuras',
      close: 'Fechar',
    },
    footer: {
      desc: 'Expedições nos Andes chilenos, segurança em montanha e cumes sobre o vale de Santiago. Guiado por Gaz.',
      expeditions: 'Expedições',
      ecosystem: 'Ecossistema',
      contact: 'Contato Direto',
      rights: '© 2026 GAZ_STYLE · SANTIAGO HIKING. TODOS OS DIREITOS RESERVADOS.',
    },
  },

  de: {
    nav: {
      grupales: 'Gruppentouren',
      desafios: 'Herausforderungen',
      highMountain: 'Hochgebirge',
      boutique: 'Boutique',
      niveles: 'Levels',
      comunidad: 'Community',
    },
    hero: {
      trust_wfr: 'Geführte Expeditionen',
      trust_sos: 'Garmin Satelliten-SOS',
      title_line1: 'EROBERE',
      title_line2: 'DEN GIPFEL.',
      subtitle: 'Geführte Bergexpeditionen, Sonnenuntergangstouren und Gipfel in den zentralen Anden. Gruppen- und Privattouren auf den bekanntesten Bergen Santiagos.',
      btn_all_adventures: 'Alle Abenteuer entdecken',
      btn_help_choose: 'Hilf mir bei der Auswahl',
    },
    sections: {
      grupales: {
        badge: 'COMMUNITY & SUNSET TOUREN',
        title: 'GRUPPEN',
        highlightTitle: 'TOUREN',
        subtitle: 'Tagestouren, Sonnenuntergänge und Klassiker mit der Bergcommunity. Goldenes Licht und 360°-Panoramablicke über dem Wolkenmeer von Santiago.',
      },
      desafios: {
        badge: 'ENDURANCE GANZTAGES-CHALLENGES',
        title: 'TRAVERSEN &',
        highlightTitle: 'CHALLENGES',
        subtitle: 'Die ultimativen Prüfungen für Ausdauer und Willenskraft in den zentralen Anden mit über 1.500m Höhenunterschied auf alpinen Kämmen.',
      },
      highMountain: {
        badge: 'HOHE GIPFEL 5.000M+ · HOCHTOUREN',
        title: 'EXPEDITION',
        highlightTitle: 'HIGH MOUNTAIN',
        subtitle: 'Technische Hochgebirgsexpeditionen in den Anden (El Plomo 5.424m, Leonera, Vulkan San José) mit Maultiertransport und Satellitensicherheit.',
      },
      boutique: {
        badge: '100% PRIVAT & MASSGESCHNEIDERT',
        title: 'EXPEDITION',
        highlightTitle: 'BOUTIQUE',
        subtitle: 'Exklusive Privaterlebnisse in Ihrem eigenen Tempo mit Executive-Transfer von Hotel zu Hotel, Gourmet-Catering und 4K-Video.',
      },
    },
    cards: {
      duration: 'Dauer',
      difficulty: 'Schwierigkeit',
      altitude: 'Höhe',
      view_details: 'DETAILS ANSEHEN',
      view_details_spec: 'Details & Datenblatt anzeigen →',
    },
    levels: {
      badge: 'Technische Berg-Graduierung · Zentralanden',
      title: 'Berg-Stufensystem',
      l1_title: 'Aktiver Einstieg',
      l1_meta: 'Höhenmeter <400m+ · 3.5 Std.',
      l1_desc: 'Angenehmes Tempo mit Panoramapausen. Perfekt für deinen ersten Andengipfel, professionelle Fotos und Kaffee zum Sonnenuntergang.',
      l2_title: 'Cardio & Reset',
      l2_meta: 'Höhenmeter 400 bis 800m+ · 4-5 Std.',
      l2_desc: 'Stetiges sportliches Tempo gegen Alltagsstress. Erfordert griffiges Schuhwerk und gleichmäßige Atmung.',
      l3_title: 'Anden-Herausforderung',
      l3_meta: 'Höhenmeter 800 bis 1.400m+ · 6-8 Std.',
      l3_desc: 'Steile Hänge, Geröllfelder und Höhenexposition. Verlangt gute Ausdauer und mentale Entschlossenheit.',
      l4_title: 'Extreme Ausdauer',
      l4_meta: 'Höhenmeter >1.500m+ · Alpine Grate',
      l4_desc: 'Ganztägige Höchstleistungen über ausgesetzte Andengrate. Eine hervorragende kardiovaskuläre Fitness ist Pflicht.',
    },
    modal: {
      cat_title: 'Expeditionskatalog',
      subtitle: 'Alle Abenteuer',
      close: 'Schließen',
    },
    footer: {
      desc: 'Expeditionen in den chilenischen Anden, Bergsicherheit und Gipfelerlebnisse über Santiago. Geführt von Gaz.',
      expeditions: 'Expeditionen',
      ecosystem: 'Ökosystem',
      contact: 'Direktkontakt',
      rights: '© 2026 GAZ_STYLE · SANTIAGO HIKING. ALLE RECHTE VORBEHALTEN.',
    },
  },
};

export function getDictionary(lang: string): Translations {
  const code = (lang || 'es').toLowerCase() as SupportedLang;
  return DICTIONARY[code] || DICTIONARY.es;
}
