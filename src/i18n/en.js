// frontend/src/i18n/en.js
// ============================================================================
// ENGLISH DICTIONARY
// Terminology follows ISO/IEC 17025 and ISO 9001 official English wording
// ============================================================================
export const en = {

  // ---------------------------------------------------------------- common
  commun: {
    chargement: 'Loading…',
    erreur: 'Something went wrong',
    reessayer: 'Try again',
    fermer: 'Close',
    annuler: 'Cancel',
    enregistrer: 'Save',
    supprimer: 'Delete',
    modifier: 'Edit',
    rechercher: 'Search',
    voir: 'View',
    voirDetail: 'View details',
    telecharger: 'Download',
    aucunResultat: 'No results',
    aucuneDonnee: 'No data available',
    obligatoire: 'required',
    optionnel: 'optional',
    surDevis: 'On quotation',
    oui: 'Yes',
    non: 'No',
    retour: 'Back',
    suivant: 'Next',
    precedent: 'Previous',
    langue: 'Language',
    changerLangue: 'Switch to French',
    date: 'Date',
    lieu: 'Location',
    statut: 'Status',
    categorie: 'Category',
    effacer: 'Clear',
  },

  // ------------------------------------------------------------ navigation
  nav: {
    accueil: 'Home',
    centre: 'About',
    laboratoires: 'Laboratories',
    analyses: 'Analyses',
    publications: 'Publications',
    contact: 'Contact',
    plus: 'More',
    equipe: 'Team',
    projets: 'Projects',
    partenaires: 'Partners',
    carrieres: 'Careers',
    actualites: 'News',
    evenements: 'Events',
    galerie: 'Gallery',
    faq: 'FAQ',
    portail: 'LIMS Portal',
    menuPrincipal: 'Main navigation',
    ouvrirMenu: 'Open menu',
    fermerMenu: 'Close menu',
    allerContenu: 'Skip to main content',
  },

  // ------------------------------------------------------------------ home
  accueil: {
    surtitre: 'Research centre · Yaoundé, Cameroon',
    titre1: 'From soil to result,',
    titreAccent: 'science in the service',
    titre2: 'of development.',
    intro: 'ICERD analyses your soils, water, plants, fertilisers and ores in three laboratories equipped to meet the requirements of ISO 17025 — supporting you from sample to decision.',
    ctaCatalogue: 'Analysis catalogue',
    ctaDevis: 'Request a quotation',
    clientDeja: 'Already an ICERD client?',
    suivezAnalyses: 'Track your analyses on the portal',
    qualiteCertifiee: 'Certified analytical quality',
    exigences: 'Requirements',
    partenaireDepuis: 'Partner since 2021',

    compteurLabos: 'Specialised laboratories',
    compteurAnalyses: 'Analyses in the catalogue',
    compteurRegionaux: 'Regional laboratories supported',
    compteurNorme: 'International requirements',

    divisionsSurtitre: 'Areas of activity',
    divisionsTitre: 'Three divisions, one foundation: reliable data.',
    div1Titre: 'Environmental studies',
    div1Texte: 'Impact assessments, audits, contamination and pollution studies — to evaluate the health of aquatic and terrestrial ecosystems and guide their preservation or rehabilitation.',
    div2Titre: 'Agricultural and forestry studies',
    div2Texte: 'Quality of soils, water and inputs for sound, sustainable management. Cost-effective, rapid analyses of soils, plants and inputs. Irrigation scheme design and water management.',
    div3Titre: 'Mining and geotechnics',
    div3Texte: 'Evaluation of mineral content of substrates, environmentally responsible mining, determination of geotechnical parameters for civil engineering works.',

    statsProjetsEnv: '15+ projects completed',
    statsProjetsAgri: '20+ projects completed',
    statsProjetsMine: '10+ projects completed',

    processusSurtitre: 'Analytical process',
    processusTitre: 'Full traceability of your samples, in 4 steps',
    etape1Titre: 'Receipt & coding',
    etape1Texte: 'Unique anonymised code, conformity check, traced storage location.',
    etape2Titre: 'Laboratory analysis',
    etape2Texte: 'Standard methods (ISO 11047, ASTM D2216…), AAS · ICP-OES · GC · HPLC.',
    etape3Titre: 'Two-stage validation',
    etape3Texte: 'Results entered by the technician are approved by the laboratory manager.',
    etape4Titre: 'Signed report',
    etape4Texte: 'PDF test report carrying a tamper-evident digital fingerprint.',

    tarifsSurtitre: 'Official rates',
    tarifsTitre: 'Our most requested analyses',
    voirCatalogue: 'Browse all {n} analyses',

    conseilSurtitre: 'Advisory services',
    conseilTitre: 'Experts who turn analysis into decisions.',
    conseilTexte: 'Our advisory service recommends the most suitable land-use practices and fertilisers to increase yields. ICERD assesses land according to soil and climate suitability for the intended crop — across Cameroon and the wider Central African region.',
    conseilCta: 'Discover the Centre',

    ctaFinalTitre: 'An agricultural, mining or construction project?',
    ctaFinalTexte: 'We reply within 48 working hours',
    ctaFinalBouton: 'Request a free quotation',
  },

  // -------------------------------------------------------------- analyses
  analyses: {
    titre: 'Our analyses, methods and turnaround times',
    intro: 'Official rates of the Centre. Analyses marked “on quotation” depend on volume and complexity — please contact us.',
    rechercher: 'Search for an analysis…',
    matrice: 'Matrix',
    toutes: 'All',
    categorie: 'Category',
    code: 'Code',
    nom: 'Analysis',
    methode: 'Method',
    unite: 'Unit',
    prix: 'Price',
    masquerPrix: 'Hide prices',
    delai: 'Turnaround',
    jours: '{n} days',
    laboratoire: 'Laboratory',
    resultats: '{n} analysis(es) found',
    demanderDevis: 'Request a quotation for this analysis',
    prixIndicatif: 'Indicative price',
    aucuneCorrespondance: 'No analysis matches this filter',
    matrices: {
      SOL: 'Soil', EAU: 'Water', PLANTE: 'Plant', ENGRAIS: 'Fertiliser',
      MINERAI: 'Ore', HYDROCARBURE: 'Hydrocarbon',
      PESTICIDE_PRODUIT: 'Pesticide', AUTRE: 'Other',
    },
    categories: {
      TOUTES: 'All',
      ROUTINE: 'Routine',
      SPECIALE: 'Special',
      ENVIRONNEMENTALE: 'Environmental',
      GEOTECHNIQUE: 'Geotechnical',
      CARTOGRAPHIE: 'Mapping',
    },
    cta: {
      titre: 'Have a project?',
      texte: 'Need a customised quotation or a specific analysis? Our team will reply within 48 hours.',
      devis: 'Request a quotation',
      laboratoires: 'Our laboratories'
    }
  },

  // --------------------------------------------------------------- contact
  contact: {
    titre: 'Tell us about your project',
    intro: 'Tell us what you need — we reply within 48 working hours.',
    nom: 'Full name',
    organisation: 'Organisation',
    email: 'Email address',
    telephone: 'Phone',
    sujet: 'Subject',
    message: 'Your message',
    envoyer: 'Send message',
    envoi: 'Sending…',
    succes: 'Message sent. We will reply within 48 working hours.',
    echec: 'Your message could not be sent. Please try again or call us.',
    adresse: 'Address',
    horaires: 'Opening hours',
    horairesValeur: 'Monday – Friday, 8 am – 5 pm',
    telephoneLabel: 'Phone',
    surtitre: 'CONTACT & QUOTE',
    coordonnees: 'Our coordinates',
    adresseDetail: '(behind the Catholic mission of Messame Ndongo, Odza district)',
    emailLabel: 'Email',
    reseaux: 'Follow us on social media',
    interventions: 'Interventions: throughout Cameroon and the Central African sub-region',
    objetEmail: 'Quote request',
    objets: {
      sol: 'Soil analysis',
      eau: 'Water analysis',
      plante: 'Plant / fertiliser analysis',
      geotechnique: 'Geotechnical study',
      cartographie: 'Mapping',
      terres: 'Land assessment / advisory',
      environnement: 'Environmental study',
      autre: 'Other'
    },
    pret: 'Request ready!',
    pretTexte: 'Your request is ready in your email client. Send it and our team will reply within 48 working hours.',
    nouvelleDemande: 'New request',
    demandeDevis: 'Quote request',
    nomPlaceholder: 'Your name or organisation',
    messagePlaceholder: "Describe your needs: number of samples, location, planned crop, type of analysis required...",
    infoEmail: "By clicking \"Prepare email\", your email client will open with the pre-filled request."
  },

  // ----------------------------------------------------------------- pages
  pages: {
    apropos: { 
      titre: 'A private research institute, a centre of excellence', 
      intro: 'The International Centre of Environmental Studies and Research for Development.' 
    },
    laboratoires: { 
      titre: 'Three laboratories, one complete analytical chain', 
      intro: 'Three specialised laboratories, one standard of reliability.' 
    },
    equipe: { 
      titre: 'Experts in the service of research', 
      intro: 'The people behind the results.' 
    },
    projets: { 
      titre: 'Our projects, our impact', 
      intro: 'Our ongoing and completed work.' 
    },
    publications: { 
      titre: 'Publications & Research', 
      intro: 'Work published by our researchers.' 
    },
    partenaires: { 
      titre: 'Together for development', 
      intro: 'Institutions, universities and companies that trust us.' 
    },
    carrieres: { 
      titre: 'Join the ICERD team', 
      intro: 'Join a team working for science and development.' 
    },
    actualites: { 
      titre: 'All the news from ICERD', 
      intro: 'Life at the Centre.',
      article: 'news',
      articles: 'news',
      aucune: 'No news in this category'
    },
    evenements: { 
      titre: 'Scientific calendar', 
      intro: 'Conferences, training courses and workshops.',
      aucun: 'No events in this category'
    },
    galerie: { 
      titre: 'Inside ICERD', 
      intro: 'Our laboratories, field missions and teams.',
      aucune: 'No photos in this category'
    },
    faq: { 
      titre: 'Frequently asked questions', 
      intro: 'Answers to the questions we are asked most often.',
      aucune: 'No questions in this category'
    },
    postuler: 'Apply',
    dateLimite: 'Deadline',
    lieu: 'Location',
    enSavoirPlus: 'Learn more',
    lireArticle: 'Read article',
    sInscrire: 'Register',
    aucunContenu: 'No content published yet.',
    etape: 'STEP', 
  },

  // ------------------------------------------------------------------ about
  apropos: {
    description: "ICERD — International Centre of Environmental Studies and Research for Development — is a Cameroonian limited liability company, specialized in agriculture, environment, mining and land assessment for the construction of large-scale works and infrastructures.",
    sousTitres: {
      environnement: 'Environmental Research',
      agriculture: 'Sustainable Agriculture',
      geologie: 'Geology and Mining',
      innovation: 'Scientific Innovation'
    },
    descriptions: {
      environnement: "Impact studies and ecosystem preservation",
      agriculture: "Yield optimization and soil management",
      geologie: "Mineral resource assessment and geotechnics",
      innovation: "Research and development for the future"
    },
    chiffres: {
      creation: 'Year of creation',
      labos: 'Specialised laboratories',
      regionaux: 'Regional laboratories supported',
      exigences: 'International requirements'
    },
    missions: {
      titre: 'OUR MISSIONS',
      sousTitre: 'Five complementary missions',
      i: 'Intensify',
      iDesc: 'Promote research-farmer partnerships to develop adapted, high-yield production systems.',
      c: 'Capitalize',
      cDesc: 'Leverage research results, local experiences and knowledge to approach modernization.',
      e: 'Establish',
      eDesc: 'Foster dialogue among rural stakeholders, pooling energies and knowledge for mastery of production techniques.',
      r: 'Reinforce',
      rDesc: 'Strengthen the skills of local agents, farmers and partners in the rational management of natural resources — ICERD\'s core business.',
      d: 'Develop',
      dDesc: 'Joint research for the emergence of an environmentally conscious industrial agriculture.'
    },
    vision: {
      titre: 'Supporting the Cameroon 2035 Vision',
      texte: "ICERD supports Cameroon's strategic vision for 2035: transforming the current production system, structured around family farms, into a modern, highly productive agriculture — large plantations resulting from the federation of smallholder farms, organized into cooperatives to supply processing plants.",
      partenariat: 'Since 2021, the Centre has been working with the Ministry of Agriculture and Rural Development (MINADER) on agricultural intensification and the modernization of smallholder farms.'
    },
    cta: {
      titre: 'Would you like to collaborate with us?',
      texte: 'Whether for a study, an analysis or a research partnership, our team is at your disposal.',
      contact: 'Contact us',
      laboratoires: 'Our laboratories'
    }
  },

  // ------------------------------------------------------------------ laboratories
  laboratoires: {
    hero: {
      surtitre: 'OUR LABORATORIES',
      description: 'Modern scientific equipment, outstanding technical expertise — for accuracy and precision of results.'
    },
    prestations: 'Services',
    appareillage: 'Equipment',
    slides: {
      0: {
        titre: 'Precision physicochemical analysis',
        description: 'Cutting-edge technologies for reliable results'
      },
      1: {
        titre: 'Geotechnics and soil mechanics',
        description: 'In-depth studies for sustainable construction'
      },
      2: {
        titre: 'Mapping and geomatics',
        description: 'Territory visualisation and analysis'
      }
    },
    icepc: {
      nom: "Physicochemical Analysis Laboratory",
      texte: "Physicochemical and physical analyses of rocks, soils, water, fertilisers and pesticides, using cutting-edge technology meeting the international requirements of ISO 17025.",
      prestations: [
        "In-situ soil examination (pedological prospecting with sampling)",
        "Agrochemical analyses: agricultural land suitability assessment, fertiliser doses, yield estimation",
        "Physical analyses: mechanisation suitability, erosion susceptibility, soil water reserve"
      ],
      appareils: "AAS · GFAAS · ICP-OES · GC · HPLC · FIMS (mercury) · TOC · Mass spectrometry · Flame photometry · Automatic titration",
      stats: 'analyses/year'
    },
    icgtec: {
      nom: "Geotechnical Analysis Laboratory",
      texte: "Determines the mechanical characteristics of soils to prescribe the best formulation for foundations and structures. Capable of performing many types of tests, including special tests.",
      prestations: [
        "Moisture content (ASTM D2216), specific gravity (ASTM D854)",
        "Atterberg limits, Proctor, CBR",
        "In-situ penetrometer testing, soil structural stability"
      ],
      appareils: "Dynamic penetrometer · Testing presses · Sieving equipment · Standardised ovens",
      stats: 'tests/year'
    },
    icemap: {
      nom: "Geomatics and Thematic Mapping Laboratory",
      texte: "Using state-of-the-art tools, production of reliable and strategic thematic maps, essential for planning, management and effective territorial development.",
      prestations: [
        "Geological, pedological and forest maps",
        "Land parcel development plans",
        "GPS surveys and remote sensing"
      ],
      appareils: "GIS · Differential GPS · Satellite imagery",
      stats: 'maps produced'
    },
    cta: {
      titre: 'Need a specific analysis?',
      texte: 'Our laboratories are at your disposal for all your projects. Contact us for a customised quotation.',
      catalogue: 'View catalogue',
      devis: 'Request a quotation'
    }
  },

  // ------------------------------------------------------------------ publications
  publications: {
    indexTitre: 'Scientific research index',
    travauxIndexes: 'indexed works',
    categories: {
      TOUTES: 'ALL',
      Article: 'Article',
      Rapport: 'Report',
      Thèse: 'Thesis',
      Communication: 'Communication',
      Livre: 'Book'
    },
    toutesAnnees: 'All years',
    rechercher: 'Search...',
    detailsDocument: 'Document details',
    ecritLe: 'Written on',
    resume: 'Abstract',
    consulterSource: 'View source (DOI)'
  },

  // ---------------------------------------------------------------- footer
  pied: {
    apropos: 'About',
    liens: 'Useful links',
    contactez: 'Contact us',
    description: 'International Centre of Environmental Studies and Research for Development. Analysis of soils, water, plants, fertilisers and ores.',
    droits: 'All rights reserved.',
    mentionsLegales: 'Legal notice',
  },

  // ---------------------------------------------------------------- portal
  portail: {
    connexion: 'Sign in',
    seConnecter: 'Sign in',
    seDeconnecter: 'Sign out',
    motDePasse: 'Password',
    identifiantsInvalides: 'Incorrect email or password',
    sessionExpiree: 'Session expired, please sign in again',
    bienvenue: 'Welcome, {nom}',

    tableauDeBord: 'Dashboard',
    clients: 'Clients',
    demandes: 'Requests',
    echantillons: 'Samples',
    resultats: 'Results',
    banque: 'Data bank',
    stocks: 'Inventory',
    factures: 'Invoices',
    exports: 'Exports',
    utilisateurs: 'Users',
    equipements: 'Equipment',

    mesDemandes: 'My requests',
    mesRapports: 'My reports',
    mesFactures: 'My invoices',

    suiviTempsReel: 'Track the progress of your samples in the laboratory in real time.',
    aucuneDemande: 'No requests recorded yet.',
    recueLe: 'Received on {date}',
    echeance: 'due {date}',
    avancement: 'Progress: {valides}/{total} analyses approved',
    rapportsIntro: 'Download your official reports as PDF. Each report carries a digital fingerprint (SHA-256) proving it has not been altered since issue.',
    aucunRapport: 'No report issued yet. You will be notified as soon as your results are approved.',
    telechargerPdf: 'Download PDF',
    telechargement: 'Downloading…',
    rapportAmende: 'Amended report',
    emisLe: 'issued on {date}',
    facturesIntro: 'Payment by bank transfer, cheque, cash at the Centre, MTN Mobile Money or Orange Money (details on your invoice).',
    aucuneFacture: 'No invoices yet.',
    emiseLe: 'Issued on {date}',
    payee: 'Paid',
    resteAPayer: 'Outstanding: {montant}',
    demande: 'Request',
    titrePortail: 'ICERD Portal',
    sousTitre: 'Laboratory Information Management System',
    champsRequis: 'Please fill in all fields',
    erreurConnexion: 'Sign-in failed. Please check your credentials.',
    connexionEnCours: 'Signing in…',
    retourSite: 'Back to public site',
    sitePublic: 'Public site',
    chargementPortail: 'Loading portal…',
    afficherMdp: 'Show password',
    masquerMdp: 'Hide password',
    groupeGestion: 'Management',
    groupeEspaceClient: 'Client area',
    groupeAdministration: 'Administration',
    banqueDonnees: 'Data bank',
  },

  // ------------------------------------------------- content pages (CMS)
  cms: {
    // Display labels for categories. The value stored in the database stays
    // in French (it is used as a filter); only the displayed label changes.
    cat: {
      TOUTES: 'All', TOUS: 'All',
      'Portes Ouvertes': 'Open day',
      Autre: 'Other',
      Alternance: 'Apprenticeship',
      Freelance: 'Freelance',
      Volontariat: 'Volunteering',
      Association: 'Association',
      'Présentation': 'Overview',
      'Qualité': 'Quality',
      Services: 'Services',
      TOUT: 'All',
      CDI: 'Permanent contract', CDD: 'Fixed-term contract', STAGE: 'Internship', CONSULTANCE: 'Consultancy',
      INSTITUTION: 'Institution', INSTITUTIONNEL: 'Institutional',
      ACADEMIQUE: 'Academic', PRIVE: 'Private sector', INTERNATIONAL: 'International',
      ANALYSES: 'Analyses', ECHANTILLONS: 'Samples', TARIFS: 'Pricing',
      RAPPORTS: 'Reports', DELAIS: 'Turnaround', PRELEVEMENT: 'Sampling',
      PAIEMENT: 'Payment', GENERALE: 'General',
      SEMINAIRE: 'Seminar', CONFERENCE: 'Conference',
      ATELIER: 'Workshop', FORMATION: 'Training',
      // News
      Annonce: 'Announcement', 'Événement': 'Event', Publication: 'Publication',
      Projet: 'Project', 'Communiqué': 'Press release',
      // Gallery
      Laboratoire: 'Laboratory', 'Équipe': 'Team', Terrain: 'Field',
      Formation: 'Training', 'Conférence': 'Conference', Visite: 'Visit',
      // Team
      Direction: 'Management', Chercheurs: 'Researchers', Techniciens: 'Technicians',
      Administratif: 'Administration', Stagiaires: 'Interns',
      // Projects
      'En cours': 'Ongoing', 'Terminé': 'Completed', 'En préparation': 'Planned',
      // Events
      'Séminaire': 'Seminar', Atelier: 'Workshop',
      // Partners
      Institutionnel: 'Institutional', 'Académique': 'Academic',
      'Privé': 'Private sector', International: 'International', ONG: 'NGO',
      // Careers
      Emploi: 'Position', Stage: 'Internship', Consultance: 'Consultancy',
    },

    chargement: {
      actualites: 'Loading news…',
      projets: 'Loading projects…',
      evenements: 'Loading events…',
      carrieres: 'Loading vacancies…',
      galerie: 'Loading gallery…',
      equipe: 'Loading team…',
      partenaires: 'Loading partners…',
      faq: 'Loading questions…',
      publications: 'Loading publications…',
    },

    surtitre: {
      actualites: 'NEWS',
      projets: 'RESEARCH PROJECTS',
      evenements: 'EVENTS',
      carrieres: 'CAREERS',
      galerie: 'GALLERY',
      equipe: 'OUR TEAM',
      partenaires: 'OUR PARTNERS',
      faq: 'FAQ',
    },

    intro: {
      actualites: 'Follow the latest news, publications and events from the Centre.',
      projets: 'Discover the research projects carried out by ICERD for the sustainable development of Cameroon and Central Africa.',
      evenements: 'All events organised by ICERD: seminars, conferences, workshops and training courses.',
      carrieres: 'We are recruiting talented people who care about scientific research and sustainable development.',
      galerie: 'A visual tour of our laboratories, our teams and our research activities.',
      equipe: 'A multidisciplinary team of researchers, engineers and technicians committed to scientific excellence and sustainable development.',
      partenaires: 'ICERD works with institutional, academic and international partners in research and development.',
      faq: 'Answers to the questions we are asked most often about ICERD.',
    },

    vide: {
      actualites: 'No news in this category',
      projets: 'No project matches this filter',
      evenements: 'No event in this category',
      carrieres: 'No vacancy matches your criteria',
      galerie: 'No photo in this category',
      equipe: 'No member in this category',
      partenaires: 'No partner in this category',
      faq: 'No question in this category',
    },

    videSous: {
      evenements: 'Check back later for our upcoming events',
      carrieres: 'Visit this page regularly for new opportunities',
      galerie: 'Browse other categories or come back later',
    },

    voirDetails: 'View details',
    voirDetailsFleche: 'View details →',
    voirPhoto: 'View details',
    visiterSite: 'Visit website',
    lireSuite: 'Read more',
    termine: 'Ended',
    unJour: 'one day',
    offreExpiree: 'Vacancy closed',
    postulerOffre: 'Apply for this position',
    candidatureSpontanee: 'Speculative application',
    candidatureSpontaneeTexte: 'Cannot find a vacancy that matches your profile? Send us a speculative application — we review every file.',
    pourPostuler: 'To apply, send your complete application (CV and cover letter) by email.',
    adresseReception: 'Send applications to:',
    redigerEmail: 'Write the email',
    collaborerTitre: 'Would you like to work with ICERD?',
    collaborerTexte: 'Join our network of partners and contribute to research and sustainable development.',
    aucuneDescription: 'No description provided.',
    dateLimite: 'Deadline',
    publieLe: 'Published on',
    rejoindreTitre: 'Join the ICERD team',
    rejoindreTexte: 'Would you like to be part of our research team? Browse our vacancies or send us a speculative application.',
    voirOffres: 'View vacancies',
  },

  // -------------------------------------------------------------- statuses
  statuts: {
    BROUILLON: 'Draft',
    ENREGISTREE: 'Registered',
    EN_COURS: 'Analyses in progress',
    VALIDEE: 'Results approved',
    RAPPORT_EMIS: 'Report available',
    FACTUREE: 'Invoiced',
    CLOTUREE: 'Closed',
    ANNULEE: 'Cancelled',
    RECU: 'Received', 
    CONFORME: 'Conforming', 
    NON_CONFORME: 'Non-conforming',
    EN_ANALYSE: 'Under analysis', 
    ANALYSE: 'Analysed', 
    ARCHIVE: 'Archived', 
    DETRUIT: 'Disposed of',
    EMISE: 'Issued', 
    PAYEE: 'Paid',
    PARTIELLEMENT_PAYEE: 'Partially paid', 
    IMPAYEE: 'Unpaid',
  },
};