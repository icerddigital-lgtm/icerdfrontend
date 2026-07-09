// frontend/src/i18n/fr.js
// ============================================================================
// DICTIONNAIRE FRANÇAIS — langue de référence
// Toute clé ajoutée ici doit exister dans en.js (sinon repli sur le français).
// ============================================================================
export const fr = {

  // ---------------------------------------------------------------- commun
  commun: {
    chargement: 'Chargement…',
    erreur: 'Une erreur est survenue',
    reessayer: 'Réessayer',
    fermer: 'Fermer',
    annuler: 'Annuler',
    enregistrer: 'Enregistrer',
    supprimer: 'Supprimer',
    modifier: 'Modifier',
    rechercher: 'Rechercher',
    voir: 'Voir',
    voirDetail: 'Voir le détail',
    telecharger: 'Télécharger',
    aucunResultat: 'Aucun résultat',
    aucuneDonnee: 'Aucune donnée disponible',
    obligatoire: 'obligatoire',
    optionnel: 'optionnel',
    surDevis: 'Sur devis',
    oui: 'Oui',
    non: 'Non',
    retour: 'Retour',
    suivant: 'Suivant',
    precedent: 'Précédent',
    langue: 'Langue',
    changerLangue: 'Passer en anglais',
    date: 'Date',
    lieu: 'Lieu',
    statut: 'Statut',
    categorie: 'Catégorie',
    effacer: 'Effacer',
  },

  // ------------------------------------------------------------ navigation
  nav: {
    accueil: 'Accueil',
    centre: 'Le Centre',
    laboratoires: 'Laboratoires',
    analyses: 'Analyses',
    publications: 'Publications',
    contact: 'Contact',
    plus: 'Plus',
    equipe: 'Équipe',
    projets: 'Projets',
    partenaires: 'Partenaires',
    carrieres: 'Carrières',
    actualites: 'Actualités',
    evenements: 'Événements',
    galerie: 'Galerie',
    faq: 'FAQ',
    portail: 'Portail LIMS',
    menuPrincipal: 'Navigation principale',
    ouvrirMenu: 'Ouvrir le menu',
    fermerMenu: 'Fermer le menu',
    allerContenu: 'Aller au contenu principal',
  },

  // ---------------------------------------------------------------- accueil
  accueil: {
    surtitre: 'Centre de recherche · Yaoundé, Cameroun',
    titre1: 'Du sol au résultat,',
    titreAccent: 'la science au service',
    titre2: 'du développement.',
    intro: "L'ICERD analyse vos sols, eaux, plantes, engrais et minerais dans trois laboratoires équipés selon les exigences de la norme ISO 17025 — et vous accompagne de l'échantillon jusqu'à la décision.",
    ctaCatalogue: "Catalogue d'analyses",
    ctaDevis: 'Demander un devis',
    clientDeja: 'Client ICERD ?',
    suivezAnalyses: 'Suivez vos analyses sur le portail',
    qualiteCertifiee: 'Qualité analytique certifiée',
    exigences: 'Exigences',
    partenaireDepuis: 'Partenaire 2021',

    compteurLabos: 'Laboratoires spécialisés',
    compteurAnalyses: 'Analyses au catalogue',
    compteurRegionaux: 'Laboratoires régionaux appuyés',
    compteurNorme: 'Exigences internationales',

    divisionsSurtitre: "Secteurs d'activité",
    divisionsTitre: 'Trois divisions, un même socle : la donnée fiable.',
    div1Titre: 'Études environnementales',
    div1Texte: "Études d'impacts, audits, contamination et pollution — pour évaluer la santé des écosystèmes aquatiques et terrestres et guider leur préservation ou leur réhabilitation.",
    div2Titre: 'Études agricoles et forestières',
    div2Texte: "Qualité des sols, de l'eau et des intrants pour une gestion rationnelle et durable. Analyses rentables et rapides des sols, plantes et intrants. Irrigation des périmètres et gestion de l'eau.",
    div3Titre: 'Mines et géotechnique',
    div3Texte: "Évaluation des teneurs minérales des substrats, extraction minière respectueuse de l'environnement, détermination des paramètres géotechniques pour la construction d'ouvrages.",

    statsProjetsEnv: "15+ projets réalisés",
    statsProjetsAgri: "20+ projets réalisés",
    statsProjetsMine: "10+ projets réalisés",

    processusSurtitre: 'Processus analytique',
    processusTitre: 'La traçabilité de vos échantillons, en 4 étapes',
    etape1Titre: 'Réception & codification',
    etape1Texte: 'Code unique anonymisé, contrôle de conformité, stockage tracé.',
    etape2Titre: 'Analyse au laboratoire',
    etape2Texte: 'Méthodes normalisées (ISO 11047, ASTM D2216…), AAS · ICP-OES · GC · HPLC.',
    etape3Titre: 'Double validation',
    etape3Texte: 'Le résultat saisi par le technicien est validé par le chef de laboratoire.',
    etape4Titre: 'Rapport signé',
    etape4Texte: "Rapport d'essai PDF avec empreinte numérique infalsifiable.",

    tarifsSurtitre: 'Tarifs officiels',
    tarifsTitre: 'Nos analyses les plus demandées',
    voirCatalogue: 'Voir les {n} analyses du catalogue',

    conseilSurtitre: 'Appui-conseil',
    conseilTitre: "Des experts pour transformer l'analyse en décision.",
    conseilTexte: "Le service appui-conseil propose les modes d'utilisation des terres et les fertilisants les mieux adaptés, pour une production accrue. L'ICERD évalue les terres selon l'aptitude du sol et du climat pour la culture envisagée — au Cameroun et dans toute la sous-région Afrique Centrale.",
    conseilCta: 'Découvrir le Centre',

    ctaFinalTitre: 'Un projet agricole, minier ou de construction ?',
    ctaFinalTexte: 'Réponse sous 48 h ouvrées',
    ctaFinalBouton: 'Demander un devis gratuit',
  },

  // --------------------------------------------------------------- analyses
  analyses: {
    titre: 'Nos analyses, méthodes et délais',
    intro: "Tarifs officiels du Centre. Les analyses « sur devis » dépendent du volume et de la complexité : contactez-nous.",
    rechercher: 'Rechercher une analyse…',
    matrice: 'Matrice',
    toutes: 'Toutes',
    categorie: 'Catégorie',
    code: 'Code',
    nom: 'Analyse',
    methode: 'Méthode',
    unite: 'Unité',
    prix: 'Prix',
    masquerPrix: 'Masquer prix',
    delai: 'Délai',
    jours: '{n} jours',
    laboratoire: 'Laboratoire',
    resultats: '{n} analyse(s) trouvée(s)',
    demanderDevis: 'Demander un devis pour cette analyse',
    prixIndicatif: 'Prix indicatif',
    aucuneCorrespondance: 'Aucune analyse ne correspond à ce filtre',
    matrices: {
      SOL: 'Sol', EAU: 'Eau', PLANTE: 'Plante', ENGRAIS: 'Engrais',
      MINERAI: 'Minerai', HYDROCARBURE: 'Hydrocarbure',
      PESTICIDE_PRODUIT: 'Pesticide', AUTRE: 'Autre',
    },
    categories: {
      TOUTES: 'Toutes',
      ROUTINE: 'Routine',
      SPECIALE: 'Spéciale',
      ENVIRONNEMENTALE: 'Environnementale',
      GEOTECHNIQUE: 'Géotechnique',
      CARTOGRAPHIE: 'Cartographie',
    },
    cta: {
      titre: 'Vous avez un projet ?',
      texte: 'Besoin d\'un devis personnalisé ou d\'une analyse spécifique ? Notre équipe vous répond sous 48 heures.',
      devis: 'Demander un devis',
      laboratoires: 'Nos laboratoires'
    }
  },

  // ---------------------------------------------------------------- contact
  contact: {
    titre: 'Parlez-nous de votre projet',
    intro: 'Décrivez votre besoin : nous revenons vers vous sous 48 heures ouvrées.',
    nom: 'Nom complet',
    organisation: 'Organisation',
    email: 'Adresse email',
    telephone: 'Téléphone',
    sujet: 'Sujet',
    message: 'Votre message',
    envoyer: 'Envoyer le message',
    envoi: 'Envoi en cours…',
    succes: 'Message envoyé. Nous vous répondons sous 48 heures ouvrées.',
    echec: "Le message n'a pas pu être envoyé. Réessayez ou appelez-nous.",
    adresse: 'Adresse',
    horaires: 'Horaires',
    horairesValeur: 'Lundi – Vendredi, 8h – 17h',
    telephoneLabel: 'Téléphone',
    surtitre: 'CONTACT & DEVIS',
    coordonnees: 'Nos coordonnées',
    adresseDetail: '(derrière la mission catholique de Messame Ndongo, quartier Odza)',
    emailLabel: 'Email',
    reseaux: 'Rejoignez-nous sur nos réseaux',
    interventions: 'Interventions : tout le Cameroun et la sous-région Afrique Centrale',
    objetEmail: 'Demande de devis',
    objets: {
      sol: 'Analyse de sol',
      eau: "Analyse d'eau",
      plante: 'Analyse de plantes / engrais',
      geotechnique: 'Étude géotechnique',
      cartographie: 'Cartographie',
      terres: "Évaluation de terres / appui-conseil",
      environnement: 'Étude environnementale',
      autre: 'Autre'
    },
    pret: 'Demande préparée !',
    pretTexte: 'Votre demande est préparée dans votre messagerie. Envoyez-la et notre équipe vous répondra sous 48 heures ouvrées.',
    nouvelleDemande: 'Nouvelle demande',
    demandeDevis: 'Demande de devis',
    nomPlaceholder: 'Votre nom ou celui de votre organisation',
    messagePlaceholder: "Décrivez votre besoin : nombre d'échantillons, localisation, culture envisagée, type d'analyse souhaité...",
    infoEmail: "En cliquant sur \"Préparer l'email\", votre client email s'ouvrira avec la demande pré-remplie."
  },

  // ------------------------------------------------------------------ pages
  pages: {
    apropos: { 
      titre: 'Un institut de recherche privé, un centre d\'excellence', 
      intro: "L'International Centre of Environmental Studies and Research for Development." 
    },
    laboratoires: { 
      titre: 'Trois laboratoires, une chaîne analytique complète', 
      intro: 'Trois laboratoires spécialisés, un même exigence de fiabilité.' 
    },
    equipe: { 
      titre: 'Des experts au service de la recherche', 
      intro: 'Les femmes et les hommes derrière les résultats.' 
    },
    projets: { 
      titre: 'Nos projets, notre impact', 
      intro: 'Nos travaux en cours et réalisés.' 
    },
    publications: { 
      titre: 'Publications & Travaux', 
      intro: 'Les travaux publiés par nos chercheurs.' 
    },
    partenaires: { 
      titre: 'Ensemble pour le développement', 
      intro: 'Institutions, universités et entreprises qui nous font confiance.' 
    },
    carrieres: { 
      titre: "Rejoignez l'équipe ICERD", 
      intro: 'Rejoignez une équipe au service de la science et du développement.' 
    },
    actualites: { 
      titre: "Toute l'actualité de l'ICERD", 
      intro: 'La vie du Centre.',
      article: 'actualité',
      articles: 'actualités',
      aucune: 'Aucune actualité dans cette catégorie'
    },
    evenements: { 
      titre: 'Agenda scientifique', 
      intro: 'Conférences, formations et ateliers.',
      aucun: 'Aucun événement dans cette catégorie'
    },
    galerie: { 
      titre: "Immersion au cœur de l'ICERD", 
      intro: 'Nos laboratoires, nos missions de terrain, nos équipes.',
      aucune: 'Aucune photo dans cette catégorie'
    },
    faq: { 
      titre: 'Foire aux questions', 
      intro: 'Les réponses aux questions que l\'on nous pose le plus souvent.',
      aucune: 'Aucune question dans cette catégorie'
    },
    postuler: 'Postuler',
    dateLimite: 'Date limite',
    lieu: 'Lieu',
    enSavoirPlus: 'En savoir plus',
    lireArticle: "Lire l'article",
    sInscrire: "S'inscrire",
    aucunContenu: 'Aucun contenu publié pour le moment.',
    etape: 'ÉTAPE', 
  },

  // ------------------------------------------------------------------ apropos
  apropos: {
    description: "L'ICERD — International Centre of Environmental Studies and Research for Development — est une société à responsabilité limitée de droit camerounais, spécialisée dans l'agriculture, l'environnement, les mines et l'étude des terrains pour la construction d'ouvrages et d'infrastructures d'envergure.",
    sousTitres: {
      environnement: 'Recherche environnementale',
      agriculture: 'Agriculture durable',
      geologie: 'Géologie et mines',
      innovation: 'Innovation scientifique'
    },
    descriptions: {
      environnement: "Études d'impact et préservation des écosystèmes",
      agriculture: "Optimisation des rendements et gestion des sols",
      geologie: "Évaluation des ressources minérales et géotechnique",
      innovation: "Recherche et développement pour l'avenir"
    },
    chiffres: {
      creation: 'Année de création',
      labos: 'Laboratoires spécialisés',
      regionaux: 'Laboratoires régionaux appuyés',
      exigences: 'Exigences internationales'
    },
    missions: {
      titre: 'NOS MISSIONS',
      sousTitre: 'Cinq missions complémentaires',
      i: 'Intensifier',
      iDesc: 'Valoriser les partenariats recherche-paysan pour développer des systèmes de production adaptés et à haut rendement.',
      c: 'Capitaliser',
      cDesc: 'Valoriser les résultats de recherche, les expériences et savoirs locaux ; mutualiser ces connaissances pour aborder la modernisation.',
      e: 'Établir',
      eDesc: 'Un dialogue entre acteurs ruraux, en mutualisant énergies, idées et connaissances pour une maîtrise des techniques de production.',
      r: 'Renforcer',
      rDesc: 'Les compétences des agents locaux, agriculteurs et partenaires en gestion rationnelle des ressources naturelles — cœur de métier de l\'ICERD.',
      d: 'Développer',
      dDesc: 'Une recherche conjointe pour l\'émergence d\'une agriculture industrielle soucieuse de l\'environnement.'
    },
    vision: {
      titre: 'Accompagner la Vision Cameroun 2035',
      texte: "L'ICERD accompagne la vision stratégique du Cameroun à l'horizon 2035 : transformer l'outil de production actuel, structuré en exploitations familiales, en une agriculture moderne de grande productivité — de grandes plantations issues de la fédération des champs paysans, regroupés en organisations ou coopératives pour alimenter les usines de transformation.",
      partenariat: 'Depuis 2021, le Centre travaille avec le Ministère de l\'Agriculture et du Développement Rural (MINADER) sur l\'intensification de l\'agriculture et la modernisation des exploitations paysannes.'
    },
    cta: {
      titre: 'Vous souhaitez collaborer avec nous ?',
      texte: 'Que ce soit pour une étude, une analyse ou un partenariat de recherche, notre équipe est à votre disposition.',
      contact: 'Nous contacter',
      laboratoires: 'Nos laboratoires'
    }
  },

  // ------------------------------------------------------------------ laboratoires
  laboratoires: {
    hero: {
      surtitre: 'NOS LABORATOIRES',
      description: 'Équipements scientifiques modernes, expertise technique remarquable — pour l\'exactitude et la finesse des résultats.'
    },
    prestations: 'Prestations',
    appareillage: 'Appareillage',
    slides: {
      0: {
        titre: 'Analyse physicochimique de précision',
        description: 'Technologies de pointe pour des résultats fiables'
      },
      1: {
        titre: 'Géotechnique et mécanique des sols',
        description: 'Études approfondies pour la construction durable'
      },
      2: {
        titre: 'Cartographie et géomatique',
        description: 'Visualisation et analyse des territoires'
      }
    },
    icepc: {
      nom: "Laboratoire d'analyses physicochimiques",
      texte: "Analyses physicochimiques et physiques des roches, sols, eaux, engrais et pesticides, avec une technologie de pointe répondant aux exigences internationales définies par la norme ISO 17025.",
      prestations: [
        "Examen des sols in situ (prospection pédologique avec prélèvement)",
        "Analyses agrochimiques : évaluation de l'aptitude agricole des terres, doses de fertilisants, estimation des rendements",
        "Analyses physiques : aptitude à la mécanisation, susceptibilité à l'érosion, réserve d'eau du sol"
      ],
      appareils: "AAS · GFAAS · ICP-OES · GC · HPLC · FIMS (mercure) · TOC · Spectrométrie de masse · Photométrie de flamme · Titrimétrie automatique",
      stats: 'analyses/an'
    },
    icgtec: {
      nom: "Laboratoire d'analyses géotechniques",
      texte: "Détermine les caractéristiques mécaniques des sols en vue de prescrire la meilleure formulation pour les fondations et les constructions. Capable de réaliser de nombreux types d'essais, y compris les essais spéciaux.",
      prestations: [
        "Teneur en eau (ASTM D2216), poids spécifique (ASTM D854)",
        "Limites d'Atterberg, Proctor, CBR",
        "Essais pénétrométriques in situ, stabilité structurale des sols"
      ],
      appareils: "Pénétromètre dynamique · Presses d'essais · Tamiseurs · Étuves normalisées",
      stats: 'essais/an'
    },
    icemap: {
      nom: "Laboratoire de géomatique et cartographie thématique",
      texte: "Grâce à des outils de pointe, production de cartes thématiques fiables et stratégiques, indispensables à la planification, à la gestion et à l'aménagement efficace des territoires.",
      prestations: [
        "Cartes géologiques, pédologiques et forestières",
        "Plans d'aménagement parcellaire",
        "Levés GPS et télédétection"
      ],
      appareils: "SIG · GPS différentiel · Imagerie satellitaire",
      stats: 'cartes produites'
    },
    cta: {
      titre: 'Besoin d\'une analyse spécifique ?',
      texte: 'Nos laboratoires sont à votre disposition pour tous vos projets. Contactez-nous pour un devis personnalisé.',
      catalogue: 'Voir le catalogue',
      devis: 'Demander un devis'
    }
  },

  // ------------------------------------------------------------------ publications
  publications: {
    indexTitre: 'Index de la recherche scientifique',
    travauxIndexes: 'travaux indexés',
    categories: {
      TOUTES: 'TOUTES',
      Article: 'Article',
      Rapport: 'Rapport',
      Thèse: 'Thèse',
      Communication: 'Communication',
      Livre: 'Livre'
    },
    toutesAnnees: 'Toutes les années',
    rechercher: 'Rechercher...',
    detailsDocument: 'Détails document',
    ecritLe: 'Écrit le',
    resume: 'Résumé / Abstract',
    consulterSource: 'Consulter la source (DOI)'
  },

  // ------------------------------------------------------------------ pied
  pied: {
    apropos: 'À propos',
    liens: 'Liens utiles',
    contactez: 'Contactez-nous',
    description: "Centre international d'études et de recherche en environnement pour le développement. Analyses de sols, eaux, plantes, engrais et minerais.",
    droits: 'Tous droits réservés.',
    mentionsLegales: 'Mentions légales',
  },

  // --------------------------------------------------------------- portail
  portail: {
    connexion: 'Connexion',
    seConnecter: 'Se connecter',
    seDeconnecter: 'Se déconnecter',
    motDePasse: 'Mot de passe',
    identifiantsInvalides: 'Email ou mot de passe incorrect',
    sessionExpiree: 'Session expirée, reconnectez-vous',
    bienvenue: 'Bienvenue, {nom}',

    tableauDeBord: 'Tableau de bord',
    clients: 'Clients',
    demandes: 'Demandes',
    echantillons: 'Échantillons',
    resultats: 'Résultats',
    banque: 'Banque de données',
    stocks: 'Stocks',
    factures: 'Factures',
    exports: 'Exports',
    utilisateurs: 'Utilisateurs',
    equipements: 'Équipements',

    mesDemandes: 'Mes demandes',
    mesRapports: 'Mes rapports',
    mesFactures: 'Mes factures',

    suiviTempsReel: "Suivez en temps réel l'avancement de vos échantillons au laboratoire.",
    aucuneDemande: 'Aucune demande enregistrée pour le moment.',
    recueLe: 'Reçue le {date}',
    echeance: 'échéance {date}',
    avancement: 'Avancement : {valides}/{total} analyses validées',
    rapportsIntro: "Téléchargez vos rapports officiels au format PDF. Chaque rapport porte une empreinte numérique (SHA-256) garantissant qu'il n'a pas été modifié depuis son émission.",
    aucunRapport: 'Aucun rapport émis pour l\'instant. Vous serez notifié dès validation de vos résultats.',
    telechargerPdf: 'Télécharger le PDF',
    telechargement: 'Téléchargement…',
    rapportAmende: 'Rapport amendé',
    emisLe: 'émis le {date}',
    facturesIntro: 'Règlement par virement, chèque, espèces au Centre, MTN Mobile Money ou Orange Money (références sur votre facture).',
    aucuneFacture: 'Aucune facture pour le moment.',
    emiseLe: 'Émise le {date}',
    payee: 'Payée',
    resteAPayer: 'Reste à payer : {montant}',
    demande: 'Demande',
    titrePortail: 'Portail ICERD',
    sousTitre: 'Laboratory Information Management System',
    champsRequis: 'Veuillez remplir tous les champs',
    erreurConnexion: 'Erreur de connexion. Vérifiez vos identifiants.',
    connexionEnCours: 'Connexion…',
    retourSite: 'Retour au site public',
    sitePublic: 'Site public',
    chargementPortail: 'Chargement du portail…',
    afficherMdp: 'Afficher le mot de passe',
    masquerMdp: 'Masquer le mot de passe',
    groupeGestion: 'Gestion',
    groupeEspaceClient: 'Espace Client',
    groupeAdministration: 'Administration',
    banqueDonnees: 'Banque de données',
  },

  // ------------------------------------------------- pages de contenu (CMS)
  cms: {
    // Libellés d'affichage des catégories. La VALEUR stockée en base reste
    // en français (elle sert de filtre) ; seul le libellé affiché change.
    cat: {
      TOUTES: 'Toutes', TOUS: 'Tous',
      // Valeurs vues dans les listes du code et dans la base
      'Portes Ouvertes': 'Portes ouvertes',
      Autre: 'Autre',
      Alternance: 'Alternance',
      Freelance: 'Freelance',
      Volontariat: 'Volontariat',
      Association: 'Association',
      'Présentation': 'Présentation',
      'Qualité': 'Qualité',
      Services: 'Services',
      // Filtres « tout »
      TOUT: 'Tout',
      // Contrats (carrières)
      CDI: 'CDI', CDD: 'CDD', STAGE: 'Stage', CONSULTANCE: 'Consultance',
      // Types de partenaires en base
      INSTITUTION: 'Institution', INSTITUTIONNEL: 'Institutionnel',
      ACADEMIQUE: 'Académique', PRIVE: 'Privé', INTERNATIONAL: 'International',
      // Catégories de FAQ (majuscules en base)
      ANALYSES: 'Analyses', ECHANTILLONS: 'Échantillons', TARIFS: 'Tarifs',
      RAPPORTS: 'Rapports', DELAIS: 'Délais', PRELEVEMENT: 'Prélèvement',
      PAIEMENT: 'Paiement', GENERALE: 'Général',
      // Types d'événements en base
      SEMINAIRE: 'Séminaire', CONFERENCE: 'Conférence',
      ATELIER: 'Atelier', FORMATION: 'Formation',
      // Actualités
      Annonce: 'Annonce', 'Événement': 'Événement', Publication: 'Publication',
      Projet: 'Projet', 'Communiqué': 'Communiqué',
      // Galerie
      Laboratoire: 'Laboratoire', 'Équipe': 'Équipe', Terrain: 'Terrain',
      Formation: 'Formation', 'Conférence': 'Conférence', Visite: 'Visite',
      // Équipe
      Direction: 'Direction', Chercheurs: 'Chercheurs', Techniciens: 'Techniciens',
      Administratif: 'Administratif', Stagiaires: 'Stagiaires',
      // Projets
      'En cours': 'En cours', 'Terminé': 'Terminé', 'En préparation': 'En préparation',
      // Événements
      'Séminaire': 'Séminaire', Atelier: 'Atelier',
      // Partenaires
      Institutionnel: 'Institutionnel', 'Académique': 'Académique',
      'Privé': 'Privé', International: 'International', ONG: 'ONG',
      // Carrières
      Emploi: 'Emploi', Stage: 'Stage', Consultance: 'Consultance',
    },

    chargement: {
      actualites: 'Chargement des actualités…',
      projets: 'Chargement des projets…',
      evenements: 'Chargement des événements…',
      carrieres: 'Chargement des offres…',
      galerie: 'Chargement de la galerie…',
      equipe: "Chargement de l'équipe…",
      partenaires: 'Chargement des partenaires…',
      faq: 'Chargement des questions…',
      publications: 'Chargement des publications…',
    },

    surtitre: {
      actualites: 'ACTUALITÉS',
      projets: 'PROJETS DE RECHERCHE',
      evenements: 'ÉVÉNEMENTS',
      carrieres: 'CARRIÈRES',
      galerie: 'GALERIE',
      equipe: 'NOTRE ÉQUIPE',
      partenaires: 'NOS PARTENAIRES',
      faq: 'FAQ',
    },

    intro: {
      actualites: "Suivez les dernières nouvelles, publications et événements du Centre.",
      projets: "Découvrez les projets de recherche menés par l'ICERD pour le développement durable du Cameroun et de l'Afrique Centrale.",
      evenements: "Retrouvez tous les événements organisés par l'ICERD : séminaires, conférences, ateliers et formations.",
      carrieres: 'Nous recrutons des talents passionnés par la recherche scientifique et le développement durable.',
      galerie: 'Découvrez en images nos laboratoires, nos équipes et nos activités de recherche.',
      equipe: "Une équipe pluridisciplinaire de chercheurs, ingénieurs et techniciens dédiés à l'excellence scientifique et au développement durable.",
      partenaires: "L'ICERD collabore avec des partenaires institutionnels, académiques et internationaux pour la recherche et le développement.",
      faq: "Les réponses aux questions les plus fréquemment posées sur l'ICERD.",
    },

    vide: {
      actualites: 'Aucune actualité dans cette catégorie',
      projets: 'Aucun projet ne correspond à ce filtre',
      evenements: 'Aucun événement dans cette catégorie',
      carrieres: 'Aucune offre ne correspond à vos critères',
      galerie: 'Aucune photo dans cette catégorie',
      equipe: 'Aucun membre dans cette catégorie',
      partenaires: 'Aucun partenaire dans cette catégorie',
      faq: 'Aucune question dans cette catégorie',
    },

    videSous: {
      evenements: 'Revenez plus tard pour découvrir nos prochains événements',
      carrieres: 'Consultez régulièrement cette page pour de nouvelles opportunités',
      galerie: "Explorez d'autres catégories ou revenez plus tard",
    },

    // Actions et mentions
    voirDetails: 'Voir les détails',
    voirDetailsFleche: 'Voir les détails →',
    voirPhoto: 'Voir détails',
    visiterSite: 'Visiter le site',
    lireSuite: 'Lire la suite',
    termine: 'Terminé',
    unJour: 'un jour',
    offreExpiree: 'Offre expirée',
    postulerOffre: "Postuler à l'offre",
    candidatureSpontanee: 'Candidature spontanée',
    candidatureSpontaneeTexte: "Vous ne trouvez pas d'offre correspondant à votre profil ? Envoyez-nous votre candidature spontanée : nous étudions chaque dossier.",
    pourPostuler: 'Pour postuler, envoyez votre dossier complet (CV et lettre de motivation) par courrier électronique.',
    adresseReception: 'Adresse de réception :',
    redigerEmail: "Rédiger l'e-mail",
    collaborerTitre: "Vous souhaitez collaborer avec l'ICERD ?",
    collaborerTexte: 'Rejoignez notre réseau de partenaires pour contribuer à la recherche et au développement durable.',
    aucuneDescription: 'Aucune description fournie.',
    dateLimite: 'Date limite',
    publieLe: 'Publié le',
    rejoindreTitre: "Rejoindre l'équipe ICERD",
    rejoindreTexte: "Vous souhaitez faire partie de notre équipe de recherche ? Consultez nos offres d'emploi ou envoyez-nous votre candidature spontanée.",
    voirOffres: 'Voir les offres',
  },

  // -------------------------------------------------------------- statuts
  statuts: {
    BROUILLON: 'Brouillon',
    ENREGISTREE: 'Enregistrée',
    EN_COURS: 'Analyses en cours',
    VALIDEE: 'Résultats validés',
    RAPPORT_EMIS: 'Rapport disponible',
    FACTUREE: 'Facturée',
    CLOTUREE: 'Clôturée',
    ANNULEE: 'Annulée',
    RECU: 'Reçu', 
    CONFORME: 'Conforme', 
    NON_CONFORME: 'Non conforme',
    EN_ANALYSE: 'En analyse', 
    ANALYSE: 'Analysé', 
    ARCHIVE: 'Archivé', 
    DETRUIT: 'Détruit',
    EMISE: 'Émise', 
    PAYEE: 'Payée',
    PARTIELLEMENT_PAYEE: 'Partiellement payée', 
    IMPAYEE: 'Impayée',
  },
};