import fs from "fs";
import path from "path";

const root = path.join(import.meta.dirname, "..");
const locales = ["de", "fr", "es", "pt", "it", "id", "vi", "zh", "ar", "hi", "tr", "tl"];

const SECTIONS_TO_PATCH = [
  "Hero",
  "Partners",
  "Pillars",
  "CaseWorkflow",
  "TrustSignals",
  "Merchant",
  "Credibility",
  "Cta",
];

const SECTIONS_FILL_IF_MISSING = [
  "Comparison",
  "Features",
  "Payment",
  "TokenDetails",
  "TokenSale",
  "LnxPurchaseWidget",
  "Competition",
];

function deepMerge(target, source) {
  const out = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function getAtPath(obj, pathParts) {
  return pathParts.reduce((current, part) => current?.[part], obj);
}

function countPatchUpdates(before, patch, pathParts = []) {
  let count = 0;
  for (const [key, value] of Object.entries(patch)) {
    const nextPath = [...pathParts, key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      count += countPatchUpdates(getAtPath(before, nextPath) || {}, value, nextPath);
    } else {
      const oldValue = getAtPath(before, nextPath);
      if (oldValue !== value) count++;
    }
  }
  return count;
}

function countLeafKeys(obj) {
  let count = 0;
  for (const value of Object.values(obj)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      count += countLeafKeys(value);
    } else {
      count++;
    }
  }
  return count;
}

const enPath = path.join(root, "messages", "en", "common.json");
const enData = JSON.parse(fs.readFileSync(enPath, "utf8"));
const enHome = enData.Home;

const patches = {
  de: {
    Hero: {
      title1: "Blockchain-Forensik und Wiederherstellung ",
      title2: "für gestohlene digitale Vermögenswerte",
      title3: ".",
      subtitle1:
        "Lenix verfolgt Gelder über Blockchains und bereitet Beweispakete für Börsen, Aufsichtsbehörden und Anwälte vor.",
      subtitle2:
        "Wir versprechen keine Wiederherstellung. Wir sagen Ihnen, was die Chain zeigt und welche Wege existieren können, bevor Sie sich binden.",
      btn_primary: "Recovery-Fall starten",
      btn_secondary: "Team kontaktieren",
      btn_login: "Anmelden",
    },
    Partners: {
      eyebrow: "Ökosystem",
      title: "Entwickelt für Börsen, Custody und Zahlungsnetze",
      subtitle:
        "Lenix verbindet Tracing, Recovery-Workflows und Settlement-Infrastruktur im gesamten Crypto-Stack.",
    },
    Pillars: {
      title1: "Ein Protokoll, ",
      title2: "vier Workflows",
      subtitle:
        "Wählen Sie den Einstieg, der zu Ihrer Situation passt. Jeder Pfad hat dedizierte Tools und einen klaren nächsten Schritt.",
      cards: {
        security: {
          title: "Blockchain-Sicherheit",
          desc: "Geprüfte Vaults, Multi-Sig-Custody und Monitoring für Teams, die Vermögenswerte sicher on-chain halten müssen.",
          cta: "Sicherheit ansehen",
        },
        recovery: {
          title: "Asset Recovery",
          desc: "Tracing, Börsenkoordination und rechtliche Wege, wenn Krypto verloren, gestohlen oder blockiert ist.",
          cta: "Recovery starten",
        },
        forensics: {
          title: "Blockchain-Forensik",
          desc: "Wallet-Ermittlungen und Transaktionsmapping für Compliance-Teams und rechtliche Prüfung.",
          cta: "Forensik ansehen",
        },
        finance: {
          title: "Finanzdienstleistungen",
          desc: "Krypto-zu-Fiat-Zahlungen, Lending, Wallet und Vault-Tools zum Bewegen und Halten von Werten.",
          cta: "Lösungen ansehen",
        },
      },
    },
    CaseWorkflow: {
      eyebrow: "So funktioniert es",
      title1: "Vom Intake bis zu ",
      title2: "handlungsfähigen Beweisen",
      subtitle:
        "Ein strukturierter Prozess für Opfer, Compliance-Teams und Anwälte—ohne vage Versprechen.",
      step_label: "Schritt {number}",
      steps: {
        submit: {
          title: "Fall einreichen",
          desc: "Teilen Sie Wallet-Adressen, Transaktions-Hashes, Zeitlinien und den Ablauf. Die Erstprüfung ist kostenlos.",
        },
        trace: {
          title: "Spuren verfolgen und abbilden",
          desc: "Wir folgen Geldern über Chains, Mixer, Bridges und Börseneinzahlungen, um zu identifizieren, wo der Wert gelandet ist.",
        },
        deliver: {
          title: "Beweise liefern",
          desc: "Sie erhalten dokumentierte Ergebnisse, formatiert für Compliance-Desks von Börsen, Aufsichtsbehörden oder Anwälte.",
        },
      },
      btn_primary: "Fall-Intake beginnen",
      btn_secondary: "Mit Analyst sprechen",
    },
    TrustSignals: {
      eyebrow: "Betriebsstandards",
      title1: "Entwickelt für Fälle, in denen ",
      title2: "Vertrauen zählt",
      subtitle:
        "Recovery ist ein Ziel für Betrüger. Lenix folgt Praktiken, die seriöse Firmen zum Schutz von Opfern und Institutionen nutzen.",
      image_alt: "Analyst prüft Blockchain-Ermittlungs-Dashboard und Transaktionsbelege",
      items: {
        no_fees: {
          title: "Keine Vorauszahlungen zum Freischalten",
          desc: "Wir verlangen keine Vorauszahlungen, um Ihre Mittel freizugeben, zu entsperren oder zu übertragen.",
        },
        no_seed: {
          title: "Niemals Seed-Phrasen anfordern",
          desc: "Kein Remote-Zugriff, keine privaten Keys, keine Recovery-Phrase-Anfragen—niemals.",
        },
        no_custody: {
          title: "Wir halten Ihre Assets nicht",
          desc: "Lenix bereitet Beweise vor und koordiniert Wege. Wir sind kein Custodian für Ihre Wallet.",
        },
        honest: {
          title: "Ehrliche Fallbewertung",
          desc: "Wenn eine Spur erschöpft ist oder Recovery unwahrscheinlich ist, sagen wir das vor kostenpflichtigem Engagement.",
        },
        audited: {
          title: "Geprüfter Protokoll-Stack",
          desc: "Smart Contracts von CertiK geprüft. Betrieb im Einklang mit ISO-27001-Kontrollen.",
        },
        chains: {
          title: "Multi-Chain-Abdeckung",
          desc: "Tracing-Workflows unterstützen wichtige EVM-Netzwerke und gängige Asset-Typen in Diebstahlfällen.",
        },
      },
    },
    Merchant: {
      widget_alert: "Rechnungszahlungsalarm von B Shaw",
      widget_req: "ZAHLUNGSANFRAGE",
      widget_verified: "VERIFIZIERTER ZAHLUNGSLINK",
      widget_receipt: "TRANSAKTIONSBELEG WIRD GESENDET AN ",
      widget_wallet: "Wallet-Adresse",
      widget_order: "BESTELLUNG",
      widget_gas: "GASGEBÜHR",
      btn_complete: "Zahlung abschließen",
      btn_manual: "Manuell bezahlen",
      mock_brand: "Lenix Händler",
      image_alt: "Lenix Händler- und Compliance-Operations-Dashboard",
      title1: "Händler-Infrastruktur mit ",
      title2: "integrierter Recovery",
      title3: ".",
      point1: "Krypto akzeptieren und in Fiat abrechnen über Checkout-Flows und Merchant-APIs.",
      point2: "Erlöse über geprüfte Vault-Custody mit Multi-Sig-Kontrollen leiten.",
      point3:
        "Wenn nach der Abrechnung etwas schiefgeht, unterstützt dasselbe Protokoll Tracing- und Recovery-Workflows.",
      point4_1: "Lösungen erkunden",
      point4_2: " oder ",
      point4_3: "Recovery-Fall starten",
      point4_4: ".",
    },
    Credibility: {
      eyebrow: "Verifizierung",
      title1: "Geprüfter Code. ",
      title2: "Dokumentierte Kontrollen.",
      subtitle1:
        "Von CertiK geprüfte Smart Contracts und ISO-27001-konforme Abläufe für Teams, die mehr als Marketingversprechen brauchen.",
      subtitle2_1: "Lesen Sie das ",
      subtitle2_2: "Whitepaper",
      subtitle2_3: " und Audit-Dokumentation zu Architektur, Token-Nutzen und Sicherheitskontrollen.",
      col1_text:
        "Lenix-Protokoll-Smart-Contracts wurden von CertiK geprüft. Das Audit deckt Kernprotokoll-Komponenten in Produktionsflüssen ab.",
      col1_btn: "Sicherheitsdokumentation ansehen",
      col2_text:
        "Das Whitepaper erklärt, wie Recovery-, Custody- und Zahlungsmodule zusammenhängen—und wo LNX im Protokolldesign steht.",
      col2_btn: "Whitepaper lesen",
    },
    Cta: {
      title: "Bereit, einen Fall zu eröffnen?",
      subtitle:
        "Teilen Sie, was passiert ist, und die On-Chain-Details, die Sie haben. Wir antworten mit einer ehrlichen Einschätzung, ob Tracing- und Recovery-Wege existieren.",
      btn_primary: "Fall-Intake starten",
      btn_secondary: "Team kontaktieren",
    },
  },
  fr: {
    Hero: {
      title1: "Forensique blockchain et récupération ",
      title2: "d'actifs numériques volés",
      title3: ".",
      subtitle1:
        "Lenix trace les fonds sur les chaînes et prépare des dossiers de preuves pour les exchanges, régulateurs et conseils.",
      subtitle2:
        "Nous ne promettons pas la récupération. Nous vous disons ce que la chaîne montre et quelles voies peuvent exister avant votre engagement.",
      btn_primary: "Ouvrir un dossier de récupération",
      btn_secondary: "Contacter notre équipe",
      btn_login: "Se connecter",
    },
    Partners: {
      eyebrow: "Écosystème",
      title: "Conçu pour les exchanges, la custody et les rails de paiement",
      subtitle:
        "Lenix connecte le tracing, les workflows de récupération et l'infrastructure de règlement dans l'ensemble de la stack crypto.",
    },
    Pillars: {
      title1: "Un protocole, ",
      title2: "quatre workflows",
      subtitle:
        "Choisissez le point d'entrée adapté à votre situation. Chaque voie dispose d'outils dédiés et d'une prochaine étape claire.",
      cards: {
        security: {
          title: "Sécurité blockchain",
          desc: "Vaults audités, custody multi-sig et monitoring pour les équipes qui doivent conserver des actifs en sécurité on-chain.",
          cta: "Explorer la sécurité",
        },
        recovery: {
          title: "Récupération d'actifs",
          desc: "Tracing, coordination avec les exchanges et voies juridiques lorsque des crypto sont perdues, volées ou bloquées.",
          cta: "Démarrer la récupération",
        },
        forensics: {
          title: "Forensique blockchain",
          desc: "Enquêtes au niveau des portefeuilles et cartographie des transactions pour les équipes compliance et la revue juridique.",
          cta: "Voir la forensique",
        },
        finance: {
          title: "Services financiers",
          desc: "Paiements crypto-fiat, prêt, wallet et vault pour déplacer et conserver de la valeur.",
          cta: "Voir les solutions",
        },
      },
    },
    CaseWorkflow: {
      eyebrow: "Comment ça marche",
      title1: "De l'intake aux ",
      title2: "preuves exploitables",
      subtitle:
        "Un processus structuré conçu pour les victimes, équipes compliance et conseils—sans promesses vagues.",
      step_label: "Étape {number}",
      steps: {
        submit: {
          title: "Soumettre votre dossier",
          desc: "Partagez adresses de portefeuille, hashes de transaction, chronologies et faits. L'examen initial est gratuit.",
        },
        trace: {
          title: "Tracer et cartographier les flux",
          desc: "Nous suivons les fonds sur les chaînes, mixers, bridges et dépôts exchange pour identifier où la valeur a abouti.",
        },
        deliver: {
          title: "Livrer les preuves",
          desc: "Vous recevez des conclusions documentées, formatées pour les desks compliance des exchanges, régulateurs ou conseils.",
        },
      },
      btn_primary: "Commencer l'intake",
      btn_secondary: "Parler à un analyste",
    },
    TrustSignals: {
      eyebrow: "Standards opérationnels",
      title1: "Conçu pour les dossiers où ",
      title2: "la confiance compte",
      subtitle:
        "La récupération est une cible pour les arnaques. Lenix applique les pratiques que les firmes sérieuses utilisent pour protéger victimes et institutions.",
      image_alt: "Analyste examinant un tableau de bord d'enquête blockchain et des preuves de transaction",
      items: {
        no_fees: {
          title: "Pas de frais de déblocage anticipés",
          desc: "Nous ne demandons pas de paiements anticipés pour libérer, débloquer ou transférer vos fonds.",
        },
        no_seed: {
          title: "Jamais de phrase secrète",
          desc: "Pas d'accès à distance, pas de clés privées, pas de demande de phrase de récupération—jamais.",
        },
        no_custody: {
          title: "Nous ne détenons pas vos actifs",
          desc: "Lenix prépare les preuves et coordonne les voies. Nous ne sommes pas custodian de votre portefeuille.",
        },
        honest: {
          title: "Évaluation honnête du dossier",
          desc: "Si une piste est épuisée ou la récupération improbable, nous le disons avant un engagement payant.",
        },
        audited: {
          title: "Stack protocolaire audité",
          desc: "Smart contracts revus par CertiK. Opérations alignées sur les contrôles ISO 27001.",
        },
        chains: {
          title: "Couverture multi-chaînes",
          desc: "Les workflows de tracing couvrent les principaux réseaux EVM et types d'actifs courants dans les cas de vol.",
        },
      },
    },
    Merchant: {
      widget_alert: "Alerte de paiement de facture de B Shaw",
      widget_req: "DEMANDE DE PAIEMENT",
      widget_verified: "LIEN DE PAIEMENT VÉRIFIÉ",
      widget_receipt: "LE REÇU DE TRANSACTION SERA ENVOYÉ À ",
      widget_wallet: "Adresse du portefeuille",
      widget_order: "COMMANDE",
      widget_gas: "FRAIS DE GAS",
      btn_complete: "Finaliser le paiement",
      btn_manual: "Payer manuellement",
      mock_brand: "Marchand Lenix",
      image_alt: "Tableau de bord opérations marchand et compliance Lenix",
      title1: "Infrastructure marchande avec ",
      title2: "récupération intégrée",
      title3: ".",
      point1: "Acceptez la crypto et réglez en fiat via checkout et APIs marchands.",
      point2: "Acheminez les recettes via une custody vault auditée avec contrôles multi-sig.",
      point3:
        "Si un problème survient après règlement, le même protocole prend en charge tracing et workflows de récupération.",
      point4_1: "Explorer les solutions",
      point4_2: " ou ",
      point4_3: "ouvrir un dossier de récupération",
      point4_4: ".",
    },
    Credibility: {
      eyebrow: "Vérification",
      title1: "Code audité. ",
      title2: "Contrôles documentés.",
      subtitle1:
        "Smart contracts revus par CertiK et opérations alignées ISO 27001 pour les équipes qui exigent plus que du marketing.",
      subtitle2_1: "Consultez le ",
      subtitle2_2: "whitepaper",
      subtitle2_3: " et la documentation d'audit sur l'architecture, l'utilité du token et les contrôles de sécurité.",
      col1_text:
        "Les smart contracts Lenix Protocol ont été revus par CertiK. L'audit couvre les composants core utilisés en production.",
      col1_btn: "Consulter la doc sécurité",
      col2_text:
        "Le whitepaper explique comment recovery, custody et paiements s'articulent—et la place de LNX dans le design du protocole.",
      col2_btn: "Lire le whitepaper",
    },
    Cta: {
      title: "Prêt à ouvrir un dossier ?",
      subtitle:
        "Décrivez ce qui s'est passé et les détails on-chain dont vous disposez. Nous répondons avec une lecture honnête des voies de tracing et récupération.",
      btn_primary: "Commencer l'intake",
      btn_secondary: "Contacter notre équipe",
    },
  },
  es: {
    Hero: {
      title1: "Forensia blockchain y recuperación ",
      title2: "de activos digitales robados",
      title3: ".",
      subtitle1:
        "Lenix rastrea fondos entre cadenas y prepara paquetes de evidencia para exchanges, reguladores y asesores legales.",
      subtitle2:
        "No prometemos recuperación. Le decimos lo que muestra la cadena y qué caminos pueden existir antes de que se comprometa.",
      btn_primary: "Iniciar caso de recuperación",
      btn_secondary: "Contactar al equipo",
      btn_login: "Iniciar sesión",
    },
    Partners: {
      eyebrow: "Ecosistema",
      title: "Diseñado para exchanges, custodia y redes de pago",
      subtitle:
        "Lenix conecta rastreo, flujos de recuperación e infraestructura de liquidación en todo el stack cripto.",
    },
    Pillars: {
      title1: "Un protocolo, ",
      title2: "cuatro flujos de trabajo",
      subtitle:
        "Elija el punto de entrada que coincida con su situación. Cada ruta tiene herramientas dedicadas y un siguiente paso claro.",
      cards: {
        security: {
          title: "Seguridad blockchain",
          desc: "Vaults auditados, custodia multi-sig y monitoreo para equipos que necesitan activos seguros on-chain.",
          cta: "Explorar seguridad",
        },
        recovery: {
          title: "Recuperación de activos",
          desc: "Rastreo, coordinación con exchanges y vías legales cuando la cripto se pierde, roba o queda bloqueada.",
          cta: "Iniciar recuperación",
        },
        forensics: {
          title: "Forensia blockchain",
          desc: "Investigaciones a nivel de wallet y mapeo de transacciones para equipos de compliance y revisión legal.",
          cta: "Ver forensia",
        },
        finance: {
          title: "Servicios financieros",
          desc: "Pagos cripto-fiat, préstamos, wallet y vault para mover y custodiar valor.",
          cta: "Ver soluciones",
        },
      },
    },
    CaseWorkflow: {
      eyebrow: "Cómo funciona",
      title1: "Desde la recepción hasta ",
      title2: "evidencia accionable",
      subtitle:
        "Un proceso estructurado para víctimas, equipos de compliance y asesores—sin promesas vagas.",
      step_label: "Paso {number}",
      steps: {
        submit: {
          title: "Enviar su caso",
          desc: "Comparta direcciones de wallet, hashes de transacción, cronologías y lo ocurrido. La revisión inicial es gratuita.",
        },
        trace: {
          title: "Rastrear y mapear flujos",
          desc: "Seguimos fondos entre cadenas, mixers, bridges y depósitos en exchanges para identificar dónde terminó el valor.",
        },
        deliver: {
          title: "Entregar evidencia",
          desc: "Recibe hallazgos documentados, formateados para mesas de compliance de exchanges, reguladores o asesores legales.",
        },
      },
      btn_primary: "Comenzar intake del caso",
      btn_secondary: "Hablar con un analista",
    },
    TrustSignals: {
      eyebrow: "Estándares operativos",
      title1: "Diseñado para casos donde ",
      title2: "la confianza importa",
      subtitle:
        "La recuperación es blanco de estafas. Lenix sigue prácticas que las firmas serias usan para proteger víctimas e instituciones.",
      image_alt: "Analista revisando panel de investigación blockchain y evidencia de transacciones",
      items: {
        no_fees: {
          title: "Sin tarifas anticipadas de desbloqueo",
          desc: "No pedimos pagos por adelantado para liberar, desbloquear o transferir sus fondos.",
        },
        no_seed: {
          title: "Nunca pedimos frases semilla",
          desc: "Sin acceso remoto, sin claves privadas, sin solicitudes de frase de recuperación—nunca.",
        },
        no_custody: {
          title: "No custodiamos sus activos",
          desc: "Lenix prepara evidencia y coordina vías. No somos custodio de su wallet.",
        },
        honest: {
          title: "Evaluación honesta del caso",
          desc: "Si el rastro está agotado o la recuperación es improbable, lo decimos antes de un compromiso de pago.",
        },
        audited: {
          title: "Stack de protocolo auditado",
          desc: "Smart contracts revisados por CertiK. Operaciones alineadas con controles ISO 27001.",
        },
        chains: {
          title: "Cobertura multi-cadena",
          desc: "Los flujos de rastreo cubren redes EVM principales y tipos de activos comunes en casos de robo.",
        },
      },
    },
    Merchant: {
      widget_alert: "Alerta de pago de factura de B Shaw",
      widget_req: "SOLICITUD DE PAGO",
      widget_verified: "ENLACE DE PAGO VERIFICADO",
      widget_receipt: "EL RECIBO DE TRANSACCIÓN SE ENVIARÁ A ",
      widget_wallet: "Dirección de wallet",
      widget_order: "PEDIDO",
      widget_gas: "TARIFA DE GAS",
      btn_complete: "Completar pago",
      btn_manual: "Pagar manualmente",
      mock_brand: "Comerciante Lenix",
      image_alt: "Panel de operaciones de comerciante y compliance de Lenix",
      title1: "Infraestructura de comerciante con ",
      title2: "recuperación integrada",
      title3: ".",
      point1: "Acepte cripto y liquide en fiat mediante checkout y APIs de comerciante.",
      point2: "Dirija los ingresos por custodia vault auditada con controles multi-sig.",
      point3:
        "Si algo falla tras la liquidación, el mismo protocolo admite rastreo y flujos de recuperación.",
      point4_1: "Explorar soluciones",
      point4_2: " o ",
      point4_3: "iniciar un caso de recuperación",
      point4_4: ".",
    },
    Credibility: {
      eyebrow: "Verificación",
      title1: "Código auditado. ",
      title2: "Controles documentados.",
      subtitle1:
        "Smart contracts revisados por CertiK y operaciones alineadas con ISO 27001 para equipos que necesitan más que marketing.",
      subtitle2_1: "Lea el ",
      subtitle2_2: "whitepaper",
      subtitle2_3: " y la documentación de auditoría sobre arquitectura, utilidad del token y controles de seguridad.",
      col1_text:
        "Los smart contracts de Lenix Protocol fueron revisados por CertiK. La auditoría cubre componentes core usados en flujos de producción.",
      col1_btn: "Revisar documentación de seguridad",
      col2_text:
        "El whitepaper explica cómo se conectan recuperación, custodia y pagos—y dónde encaja LNX en el diseño del protocolo.",
      col2_btn: "Leer whitepaper",
    },
    Cta: {
      title: "¿Listo para abrir un caso?",
      subtitle:
        "Comparta qué ocurrió y los detalles on-chain que tenga. Respondemos con una lectura honesta sobre si existen vías de rastreo y recuperación.",
      btn_primary: "Iniciar intake del caso",
      btn_secondary: "Contactar al equipo",
    },
  },
  pt: {
    Hero: {
      title1: "Forense blockchain e recuperação ",
      title2: "de ativos digitais roubados",
      title3: ".",
      subtitle1:
        "A Lenix rastreia fundos entre cadeias e prepara pacotes de evidência para exchanges, reguladores e assessores jurídicos.",
      subtitle2:
        "Não prometemos recuperação. Dizemos o que a chain mostra e que caminhos podem existir antes de se comprometer.",
      btn_primary: "Iniciar caso de recuperação",
      btn_secondary: "Contactar a equipa",
      btn_login: "Iniciar sessão",
    },
    Partners: {
      eyebrow: "Ecossistema",
      title: "Concebido para exchanges, custódia e redes de pagamento",
      subtitle:
        "A Lenix liga rastreio, fluxos de recuperação e infraestrutura de liquidação em todo o stack cripto.",
    },
    Pillars: {
      title1: "Um protocolo, ",
      title2: "quatro fluxos de trabalho",
      subtitle:
        "Escolha o ponto de entrada adequado à sua situação. Cada percurso tem ferramentas dedicadas e um próximo passo claro.",
      cards: {
        security: {
          title: "Segurança blockchain",
          desc: "Vaults auditados, custódia multi-sig e monitorização para equipas que precisam de ativos seguros on-chain.",
          cta: "Explorar segurança",
        },
        recovery: {
          title: "Recuperação de ativos",
          desc: "Rastreio, coordenação com exchanges e vias legais quando cripto é perdida, roubada ou bloqueada.",
          cta: "Iniciar recuperação",
        },
        forensics: {
          title: "Forense blockchain",
          desc: "Investigações ao nível da wallet e mapeamento de transações para equipas de compliance e revisão legal.",
          cta: "Ver forense",
        },
        finance: {
          title: "Serviços financeiros",
          desc: "Pagamentos cripto-fiat, empréstimos, wallet e vault para mover e deter valor.",
          cta: "Ver soluções",
        },
      },
    },
    CaseWorkflow: {
      eyebrow: "Como funciona",
      title1: "Do intake à ",
      title2: "evidência acionável",
      subtitle:
        "Um processo estruturado para vítimas, equipas de compliance e assessores—sem promessas vagas.",
      step_label: "Passo {number}",
      steps: {
        submit: {
          title: "Submeter o seu caso",
          desc: "Partilhe endereços de wallet, hashes de transação, cronologias e o que aconteceu. A revisão inicial é gratuita.",
        },
        trace: {
          title: "Rastrear e mapear fluxos",
          desc: "Seguimos fundos entre cadeias, mixers, bridges e depósitos em exchanges para identificar onde o valor aterrou.",
        },
        deliver: {
          title: "Entregar evidência",
          desc: "Recebe conclusões documentadas, formatadas para mesas de compliance de exchanges, reguladores ou assessores.",
        },
      },
      btn_primary: "Iniciar intake do caso",
      btn_secondary: "Falar com um analista",
    },
    TrustSignals: {
      eyebrow: "Padrões operacionais",
      title1: "Concebido para casos em que ",
      title2: "a confiança importa",
      subtitle:
        "A recuperação é alvo de fraudes. A Lenix segue práticas que firmas sérias usam para proteger vítimas e instituições.",
      image_alt: "Analista a rever painel de investigação blockchain e evidência de transações",
      items: {
        no_fees: {
          title: "Sem taxas antecipadas de desbloqueio",
          desc: "Não pedimos pagamentos adiantados para libertar, desbloquear ou transferir os seus fundos.",
        },
        no_seed: {
          title: "Nunca pedimos frases seed",
          desc: "Sem acesso remoto, sem chaves privadas, sem pedidos de frase de recuperação—nunca.",
        },
        no_custody: {
          title: "Não detemos os seus ativos",
          desc: "A Lenix prepara evidência e coordena caminhos. Não somos custodiante da sua wallet.",
        },
        honest: {
          title: "Avaliação honesta do caso",
          desc: "Se o rasto estiver esgotado ou a recuperação for improvável, dizemo-lo antes de um compromisso pago.",
        },
        audited: {
          title: "Stack de protocolo auditado",
          desc: "Smart contracts revistos pela CertiK. Operações alinhadas com controlos ISO 27001.",
        },
        chains: {
          title: "Cobertura multi-chain",
          desc: "Fluxos de rastreio suportam redes EVM principais e tipos de ativos comuns em casos de roubo.",
        },
      },
    },
    Merchant: {
      widget_alert: "Alerta de pagamento de fatura de B Shaw",
      widget_req: "PEDIDO DE PAGAMENTO",
      widget_verified: "LINK DE PAGAMENTO VERIFICADO",
      widget_receipt: "O RECIBO DA TRANSAÇÃO SERÁ ENVIADO PARA ",
      widget_wallet: "Endereço da wallet",
      widget_order: "ENCOMENDA",
      widget_gas: "TAXA DE GAS",
      btn_complete: "Concluir pagamento",
      btn_manual: "Pagar manualmente",
      mock_brand: "Comerciante Lenix",
      image_alt: "Painel de operações de comerciante e compliance da Lenix",
      title1: "Infraestrutura de comerciante com ",
      title2: "recuperação integrada",
      title3: ".",
      point1: "Aceite cripto e liquide em fiat via checkout e APIs de comerciante.",
      point2: "Encaminhe receitas por custódia vault auditada com controlos multi-sig.",
      point3:
        "Se algo correr mal após liquidação, o mesmo protocolo suporta rastreio e fluxos de recuperação.",
      point4_1: "Explorar soluções",
      point4_2: " ou ",
      point4_3: "iniciar um caso de recuperação",
      point4_4: ".",
    },
    Credibility: {
      eyebrow: "Verificação",
      title1: "Código auditado. ",
      title2: "Controlos documentados.",
      subtitle1:
        "Smart contracts revistos pela CertiK e operações alinhadas com ISO 27001 para equipas que precisam de mais do que marketing.",
      subtitle2_1: "Leia o ",
      subtitle2_2: "whitepaper",
      subtitle2_3: " e a documentação de auditoria sobre arquitetura, utilidade do token e controlos de segurança.",
      col1_text:
        "Os smart contracts Lenix Protocol foram revistos pela CertiK. A auditoria cobre componentes core usados em fluxos de produção.",
      col1_btn: "Rever documentação de segurança",
      col2_text:
        "O whitepaper explica como recovery, custódia e pagamentos se ligam—e onde o LNX se encaixa no design do protocolo.",
      col2_btn: "Ler whitepaper",
    },
    Cta: {
      title: "Pronto para abrir um caso?",
      subtitle:
        "Partilhe o que aconteceu e os detalhes on-chain que tem. Respondemos com uma leitura honesta sobre vias de rastreio e recuperação.",
      btn_primary: "Iniciar intake do caso",
      btn_secondary: "Contactar a equipa",
    },
  },
  it: {
    Hero: {
      title1: "Forensics blockchain e recupero ",
      title2: "di asset digitali rubati",
      title3: ".",
      subtitle1:
        "Lenix traccia i fondi tra le chain e prepara pacchetti di prove per exchange, regolatori e consulenti legali.",
      subtitle2:
        "Non promettiamo il recupero. Vi diciamo cosa mostra la chain e quali percorsi possono esistere prima del vostro impegno.",
      btn_primary: "Avvia caso di recupero",
      btn_secondary: "Contatta il team",
      btn_login: "Accedi",
    },
    Partners: {
      eyebrow: "Ecosistema",
      title: "Progettato per exchange, custody e reti di pagamento",
      subtitle:
        "Lenix collega tracing, workflow di recupero e infrastruttura di settlement in tutto lo stack crypto.",
    },
    Pillars: {
      title1: "Un protocollo, ",
      title2: "quattro workflow",
      subtitle:
        "Scegliete il punto di ingresso adatto alla vostra situazione. Ogni percorso ha strumenti dedicati e un passo successivo chiaro.",
      cards: {
        security: {
          title: "Sicurezza blockchain",
          desc: "Vault auditati, custody multi-sig e monitoraggio per team che devono custodire asset in sicurezza on-chain.",
          cta: "Esplora sicurezza",
        },
        recovery: {
          title: "Recupero asset",
          desc: "Tracing, coordinamento con exchange e percorsi legali quando crypto è persa, rubata o bloccata.",
          cta: "Avvia recupero",
        },
        forensics: {
          title: "Forensics blockchain",
          desc: "Indagini a livello wallet e mappatura transazioni per team compliance e revisione legale.",
          cta: "Vedi forensics",
        },
        finance: {
          title: "Servizi finanziari",
          desc: "Pagamenti crypto-fiat, lending, wallet e vault per muovere e detenere valore.",
          cta: "Vedi soluzioni",
        },
      },
    },
    CaseWorkflow: {
      eyebrow: "Come funziona",
      title1: "Dall'intake a ",
      title2: "prove utilizzabili",
      subtitle:
        "Un processo strutturato per vittime, team compliance e consulenti—senza promesse vaghe.",
      step_label: "Passo {number}",
      steps: {
        submit: {
          title: "Invia il tuo caso",
          desc: "Condividi indirizzi wallet, hash di transazione, timeline e cosa è successo. La revisione iniziale è gratuita.",
        },
        trace: {
          title: "Traccia e mappa i flussi",
          desc: "Seguiamo i fondi tra chain, mixer, bridge e depositi exchange per identificare dove è finito il valore.",
        },
        deliver: {
          title: "Consegna le prove",
          desc: "Ricevi risultati documentati, formattati per desk compliance di exchange, regolatori o consulenti legali.",
        },
      },
      btn_primary: "Inizia intake del caso",
      btn_secondary: "Parla con un analista",
    },
    TrustSignals: {
      eyebrow: "Standard operativi",
      title1: "Progettato per casi in cui ",
      title2: "la fiducia conta",
      subtitle:
        "Il recupero è un bersaglio per truffe. Lenix segue pratiche che le firm serie usano per proteggere vittime e istituzioni.",
      image_alt: "Analista che esamina dashboard di indagine blockchain e prove di transazione",
      items: {
        no_fees: {
          title: "Nessuna tariffa anticipata di sblocco",
          desc: "Non chiediamo pagamenti anticipati per rilasciare, sbloccare o trasferire i vostri fondi.",
        },
        no_seed: {
          title: "Mai chiedere seed phrase",
          desc: "Nessun accesso remoto, nessuna chiave privata, nessuna richiesta di frase di recupero—mai.",
        },
        no_custody: {
          title: "Non custodiamo i vostri asset",
          desc: "Lenix prepara prove e coordina percorsi. Non siamo custodian del vostro wallet.",
        },
        honest: {
          title: "Valutazione onesta del caso",
          desc: "Se una traccia è esaurita o il recupero è improbabile, lo diciamo prima di un impegno a pagamento.",
        },
        audited: {
          title: "Stack protocollo auditato",
          desc: "Smart contract revisionati da CertiK. Operazioni allineate ai controlli ISO 27001.",
        },
        chains: {
          title: "Copertura multi-chain",
          desc: "I workflow di tracing supportano le principali reti EVM e tipi di asset comuni nei casi di furto.",
        },
      },
    },
    Merchant: {
      widget_alert: "Avviso pagamento fattura da B Shaw",
      widget_req: "RICHIESTA DI PAGAMENTO",
      widget_verified: "LINK DI PAGAMENTO VERIFICATO",
      widget_receipt: "LA RICEVUTA DELLA TRANSAZIONE SARÀ INVIATA A ",
      widget_wallet: "Indirizzo wallet",
      widget_order: "ORDINE",
      widget_gas: "COMMISSIONE GAS",
      btn_complete: "Completa pagamento",
      btn_manual: "Paga manualmente",
      mock_brand: "Commerciante Lenix",
      image_alt: "Dashboard operazioni merchant e compliance Lenix",
      title1: "Infrastruttura merchant con ",
      title2: "recupero integrato",
      title3: ".",
      point1: "Accetta crypto e liquida in fiat tramite checkout e API merchant.",
      point2: "Instrada i proventi tramite custody vault auditata con controlli multi-sig.",
      point3:
        "Se qualcosa va storto dopo il settlement, lo stesso protocollo supporta tracing e workflow di recupero.",
      point4_1: "Esplora soluzioni",
      point4_2: " o ",
      point4_3: "avvia un caso di recupero",
      point4_4: ".",
    },
    Credibility: {
      eyebrow: "Verifica",
      title1: "Codice auditato. ",
      title2: "Controlli documentati.",
      subtitle1:
        "Smart contract revisionati da CertiK e operazioni allineate ISO 27001 per team che richiedono più del marketing.",
      subtitle2_1: "Leggi il ",
      subtitle2_2: "whitepaper",
      subtitle2_3: " e la documentazione di audit su architettura, utilità del token e controlli di sicurezza.",
      col1_text:
        "Gli smart contract Lenix Protocol sono stati revisionati da CertiK. L'audit copre i componenti core usati nei flussi di produzione.",
      col1_btn: "Consulta documentazione sicurezza",
      col2_text:
        "Il whitepaper spiega come recovery, custody e pagamenti si collegano—e dove LNX si inserisce nel design del protocollo.",
      col2_btn: "Leggi whitepaper",
    },
    Cta: {
      title: "Pronto ad aprire un caso?",
      subtitle:
        "Condividi cosa è successo e i dettagli on-chain che hai. Rispondiamo con una lettura onesta su percorsi di tracing e recupero.",
      btn_primary: "Inizia intake del caso",
      btn_secondary: "Contatta il team",
    },
  },
  id: {
    Hero: {
      title1: "Forensik blockchain dan pemulihan ",
      title2: "aset digital yang dicuri",
      title3: ".",
      subtitle1:
        "Lenix melacak dana lintas chain dan menyiapkan paket bukti untuk exchange, regulator, dan penasihat hukum.",
      subtitle2:
        "Kami tidak menjanjikan pemulihan. Kami memberi tahu apa yang ditunjukkan chain dan jalur apa yang mungkin ada sebelum Anda berkomitmen.",
      btn_primary: "Mulai kasus pemulihan",
      btn_secondary: "Hubungi tim kami",
      btn_login: "Masuk",
    },
    Partners: {
      eyebrow: "Ekosistem",
      title: "Dibangun untuk exchange, kustodi, dan jaringan pembayaran",
      subtitle:
        "Lenix menghubungkan pelacakan, alur pemulihan, dan infrastruktur settlement di seluruh stack kripto.",
    },
    Pillars: {
      title1: "Satu protokol, ",
      title2: "empat alur kerja",
      subtitle:
        "Pilih titik masuk yang sesuai situasi Anda. Setiap jalur memiliki tooling khusus dan langkah berikutnya yang jelas.",
      cards: {
        security: {
          title: "Keamanan blockchain",
          desc: "Vault diaudit, kustodi multi-sig, dan monitoring untuk tim yang perlu aset aman on-chain.",
          cta: "Jelajahi keamanan",
        },
        recovery: {
          title: "Pemulihan aset",
          desc: "Pelacakan, koordinasi exchange, dan jalur hukum saat kripto hilang, dicuri, atau terjebak.",
          cta: "Mulai pemulihan",
        },
        forensics: {
          title: "Forensik blockchain",
          desc: "Investigasi tingkat wallet dan pemetaan transaksi untuk tim compliance dan tinjauan hukum.",
          cta: "Lihat forensik",
        },
        finance: {
          title: "Layanan keuangan",
          desc: "Pembayaran kripto-fiat, lending, wallet, dan vault untuk memindahkan dan menahan nilai.",
          cta: "Lihat solusi",
        },
      },
    },
    CaseWorkflow: {
      eyebrow: "Cara kerjanya",
      title1: "Dari intake hingga ",
      title2: "bukti yang dapat ditindaklanjuti",
      subtitle:
        "Proses terstruktur untuk korban, tim compliance, dan penasihat—bukan janji samar.",
      step_label: "Langkah {number}",
      steps: {
        submit: {
          title: "Ajukan kasus Anda",
          desc: "Bagikan alamat wallet, hash transaksi, timeline, dan apa yang terjadi. Tinjauan awal gratis.",
        },
        trace: {
          title: "Lacak dan petakan aliran",
          desc: "Kami mengikuti dana lintas chain, mixer, bridge, dan deposit exchange untuk mengidentifikasi di mana nilai berakhir.",
        },
        deliver: {
          title: "Serahkan bukti",
          desc: "Anda menerima temuan terdokumentasi, diformat untuk meja compliance exchange, regulator, atau penasihat hukum.",
        },
      },
      btn_primary: "Mulai intake kasus",
      btn_secondary: "Bicara dengan analis",
    },
    TrustSignals: {
      eyebrow: "Standar operasional",
      title1: "Dibangun untuk kasus di mana ",
      title2: "kepercayaan penting",
      subtitle:
        "Pemulihan menjadi target penipuan. Lenix mengikuti praktik yang digunakan firma serius untuk melindungi korban dan institusi.",
      image_alt: "Analis meninjau dashboard investigasi blockchain dan bukti transaksi",
      items: {
        no_fees: {
          title: "Tanpa biaya unlock di muka",
          desc: "Kami tidak meminta pembayaran di muka untuk melepaskan, membuka, atau mentransfer dana Anda.",
        },
        no_seed: {
          title: "Tidak pernah minta seed phrase",
          desc: "Tanpa akses jarak jauh, tanpa private key, tanpa permintaan recovery phrase—selamanya.",
        },
        no_custody: {
          title: "Kami tidak memegang aset Anda",
          desc: "Lenix menyiapkan bukti dan mengoordinasikan jalur. Kami bukan kustodian wallet Anda.",
        },
        honest: {
          title: "Penilaian kasus yang jujur",
          desc: "Jika jejak habis atau pemulihan tidak mungkin, kami sampaikan sebelum engagement berbayar.",
        },
        audited: {
          title: "Stack protokol diaudit",
          desc: "Smart contract ditinjau CertiK. Operasi selaras dengan kontrol ISO 27001.",
        },
        chains: {
          title: "Cakupan multi-chain",
          desc: "Alur pelacakan mendukung jaringan EVM utama dan jenis aset umum dalam kasus pencurian.",
        },
      },
    },
    Merchant: {
      widget_alert: "Peringatan pembayaran faktur dari B Shaw",
      widget_req: "PERMINTAAN PEMBAYARAN",
      widget_verified: "TAUTAN PEMBAYARAN TERVERIFIKASI",
      widget_receipt: "BUKTI TRANSAKSI AKAN DIKIRIM KE ",
      widget_wallet: "Alamat wallet",
      widget_order: "PESANAN",
      widget_gas: "BIAYA GAS",
      btn_complete: "Selesaikan pembayaran",
      btn_manual: "Bayar manual",
      mock_brand: "Merchant Lenix",
      image_alt: "Dashboard operasi merchant dan compliance Lenix",
      title1: "Infrastruktur merchant dengan ",
      title2: "pemulihan terintegrasi",
      title3: ".",
      point1: "Terima kripto dan settle ke fiat melalui checkout dan API merchant.",
      point2: "Alihkan hasil melalui kustodi vault diaudit dengan kontrol multi-sig.",
      point3:
        "Jika ada masalah setelah settlement, protokol yang sama mendukung pelacakan dan alur pemulihan.",
      point4_1: "Jelajahi solusi",
      point4_2: " atau ",
      point4_3: "mulai kasus pemulihan",
      point4_4: ".",
    },
    Credibility: {
      eyebrow: "Verifikasi",
      title1: "Kode diaudit. ",
      title2: "Kontrol terdokumentasi.",
      subtitle1:
        "Smart contract ditinjau CertiK dan operasi selaras ISO 27001 untuk tim yang butuh lebih dari klaim marketing.",
      subtitle2_1: "Baca ",
      subtitle2_2: "whitepaper",
      subtitle2_3: " dan dokumentasi audit tentang arsitektur, utilitas token, dan kontrol keamanan.",
      col1_text:
        "Smart contract Lenix Protocol telah ditinjau CertiK. Audit mencakup komponen inti protokol yang digunakan dalam alur produksi.",
      col1_btn: "Tinjau dokumen keamanan",
      col2_text:
        "Whitepaper menjelaskan bagaimana modul pemulihan, kustodi, dan pembayaran terhubung—dan posisi LNX dalam desain protokol.",
      col2_btn: "Baca whitepaper",
    },
    Cta: {
      title: "Siap membuka kasus?",
      subtitle:
        "Bagikan apa yang terjadi dan detail on-chain yang Anda miliki. Kami merespons dengan penilaian jujur apakah jalur pelacakan dan pemulihan ada.",
      btn_primary: "Mulai intake kasus",
      btn_secondary: "Hubungi tim kami",
    },
  },
  vi: {
    Hero: {
      title1: "Điều tra blockchain và thu hồi ",
      title2: "tài sản số bị đánh cắp",
      title3: ".",
      subtitle1:
        "Lenix truy vết quỹ qua các chuỗi và chuẩn bị gói bằng chứng cho sàn giao dịch, cơ quan quản lý và luật sư.",
      subtitle2:
        "Chúng tôi không hứa thu hồi. Chúng tôi cho bạn biết chuỗi khối cho thấy gì và những con đường nào có thể tồn tại trước khi bạn cam kết.",
      btn_primary: "Bắt đầu vụ thu hồi",
      btn_secondary: "Liên hệ đội ngũ",
      btn_login: "Đăng nhập",
    },
    Partners: {
      eyebrow: "Hệ sinh thái",
      title: "Thiết kế cho sàn giao dịch, lưu ký và mạng thanh toán",
      subtitle:
        "Lenix kết nối truy vết, quy trình thu hồi và hạ tầng thanh toán trên toàn bộ stack crypto.",
    },
    Pillars: {
      title1: "Một giao thức, ",
      title2: "bốn quy trình",
      subtitle:
        "Chọn điểm vào phù hợp tình huống của bạn. Mỗi lộ trình có công cụ riêng và bước tiếp theo rõ ràng.",
      cards: {
        security: {
          title: "Bảo mật blockchain",
          desc: "Vault được kiểm toán, lưu ký multi-sig và giám sát cho đội cần giữ tài sản an toàn on-chain.",
          cta: "Khám phá bảo mật",
        },
        recovery: {
          title: "Thu hồi tài sản",
          desc: "Truy vết, phối hợp sàn và lộ trình pháp lý khi crypto bị mất, đánh cắp hoặc kẹt.",
          cta: "Bắt đầu thu hồi",
        },
        forensics: {
          title: "Điều tra blockchain",
          desc: "Điều tra cấp ví và lập bản đồ giao dịch cho đội compliance và rà soát pháp lý.",
          cta: "Xem điều tra",
        },
        finance: {
          title: "Dịch vụ tài chính",
          desc: "Thanh toán crypto-fiat, cho vay, ví và vault để di chuyển và giữ giá trị.",
          cta: "Xem giải pháp",
        },
      },
    },
    CaseWorkflow: {
      eyebrow: "Cách hoạt động",
      title1: "Từ tiếp nhận đến ",
      title2: "bằng chứng có thể hành động",
      subtitle:
        "Quy trình có cấu trúc cho nạn nhân, đội compliance và luật sư—không phải lời hứa mơ hồ.",
      step_label: "Bước {number}",
      steps: {
        submit: {
          title: "Gửi vụ việc của bạn",
          desc: "Chia sẻ địa chỉ ví, hash giao dịch, dòng thời gian và diễn biến. Đánh giá ban đầu miễn phí.",
        },
        trace: {
          title: "Truy vết và lập bản đồ luồng",
          desc: "Chúng tôi theo dõi quỹ qua chuỗi, mixer, bridge và nạp sàn để xác định giá trị đi đâu.",
        },
        deliver: {
          title: "Giao bằng chứng",
          desc: "Bạn nhận phát hiện có tài liệu, định dạng cho bàn compliance sàn, cơ quan quản lý hoặc luật sư.",
        },
      },
      btn_primary: "Bắt đầu tiếp nhận vụ việc",
      btn_secondary: "Trao đổi với chuyên viên phân tích",
    },
    TrustSignals: {
      eyebrow: "Tiêu chuẩn vận hành",
      title1: "Thiết kế cho các vụ ",
      title2: "cần sự tin cậy",
      subtitle:
        "Thu hồi là mục tiêu của lừa đảo. Lenix tuân thủ thực hành mà các công ty nghiêm túc dùng để bảo vệ nạn nhân và tổ chức.",
      image_alt: "Chuyên viên phân tích xem bảng điều tra blockchain và bằng chứng giao dịch",
      items: {
        no_fees: {
          title: "Không phí mở khóa trước",
          desc: "Chúng tôi không yêu cầu thanh toán trước để giải phóng, mở khóa hoặc chuyển quỹ của bạn.",
        },
        no_seed: {
          title: "Không bao giờ hỏi seed phrase",
          desc: "Không truy cập từ xa, không private key, không yêu cầu cụm từ khôi phục—không bao giờ.",
        },
        no_custody: {
          title: "Chúng tôi không giữ tài sản của bạn",
          desc: "Lenix chuẩn bị bằng chứng và phối hợp lộ trình. Chúng tôi không phải người giữ ký quỹ ví của bạn.",
        },
        honest: {
          title: "Đánh giá vụ việc trung thực",
          desc: "Nếu dấu vết cạn hoặc thu hồi khó khả thi, chúng tôi nói rõ trước khi cam kết trả phí.",
        },
        audited: {
          title: "Stack giao thức được kiểm toán",
          desc: "Smart contract được CertiK rà soát. Vận hành theo kiểm soát ISO 27001.",
        },
        chains: {
          title: "Phủ sóng đa chuỗi",
          desc: "Quy trình truy vết hỗ trợ mạng EVM chính và loại tài sản phổ biến trong vụ trộm.",
        },
      },
    },
    Merchant: {
      widget_alert: "Cảnh báo thanh toán hóa đơn từ B Shaw",
      widget_req: "YÊU CẦU THANH TOÁN",
      widget_verified: "LIÊN KẾT THANH TOÁN ĐÃ XÁC MINH",
      widget_receipt: "BIÊN LAI GIAO DỊCH SẼ GỬI ĐẾN ",
      widget_wallet: "Địa chỉ ví",
      widget_order: "ĐƠN HÀNG",
      widget_gas: "PHÍ GAS",
      btn_complete: "Hoàn tất thanh toán",
      btn_manual: "Thanh toán thủ công",
      mock_brand: "Thương nhân Lenix",
      image_alt: "Bảng điều khiển vận hành thương nhân và compliance Lenix",
      title1: "Hạ tầng thương nhân với ",
      title2: "thu hồi tích hợp",
      title3: ".",
      point1: "Chấp nhận crypto và quyết toán fiat qua checkout và API thương nhân.",
      point2: "Định tuyến doanh thu qua lưu ký vault được kiểm toán với kiểm soát multi-sig.",
      point3:
        "Nếu có sự cố sau quyết toán, cùng giao thức hỗ trợ truy vết và quy trình thu hồi.",
      point4_1: "Khám phá giải pháp",
      point4_2: " hoặc ",
      point4_3: "bắt đầu vụ thu hồi",
      point4_4: ".",
    },
    Credibility: {
      eyebrow: "Xác minh",
      title1: "Mã được kiểm toán. ",
      title2: "Kiểm soát có tài liệu.",
      subtitle1:
        "Smart contract được CertiK rà soát và vận hành theo ISO 27001 cho đội cần hơn cả tuyên bố marketing.",
      subtitle2_1: "Đọc ",
      subtitle2_2: "whitepaper",
      subtitle2_3: " và tài liệu kiểm toán về kiến trúc, tiện ích token và kiểm soát bảo mật.",
      col1_text:
        "Smart contract Lenix Protocol đã được CertiK rà soát. Kiểm toán bao gồm thành phần lõi dùng trong luồng sản xuất.",
      col1_btn: "Xem tài liệu bảo mật",
      col2_text:
        "Whitepaper giải thích cách module thu hồi, lưu ký và thanh toán kết nối—và vị trí LNX trong thiết kế giao thức.",
      col2_btn: "Đọc whitepaper",
    },
    Cta: {
      title: "Sẵn sàng mở vụ việc?",
      subtitle:
        "Chia sẻ diễn biến và chi tiết on-chain bạn có. Chúng tôi phản hồi với đánh giá trung thực về lộ trình truy vết và thu hồi.",
      btn_primary: "Bắt đầu tiếp nhận vụ việc",
      btn_secondary: "Liên hệ đội ngũ",
    },
  },
  zh: {
    Hero: {
      title1: "区块链取证与追回 ",
      title2: "被盗数字资产",
      title3: "。",
      subtitle1: "Lenix 跨链追踪资金，并为交易所、监管机构和法律顾问准备证据包。",
      subtitle2: "我们不承诺追回。在您投入之前，我们会如实说明链上显示的内容以及可能存在的路径。",
      btn_primary: "发起追回案件",
      btn_secondary: "联系团队",
      btn_login: "登录",
    },
    Partners: {
      eyebrow: "生态",
      title: "面向交易所、托管与支付通道而构建",
      subtitle: "Lenix 在加密技术栈中连接追踪、追回流程与结算基础设施。",
    },
    Pillars: {
      title1: "一个协议，",
      title2: "四条工作流",
      subtitle: "选择与您的处境匹配的入口。每条路径都有专用工具与明确的下一步。",
      cards: {
        security: {
          title: "区块链安全",
          desc: "经审计的金库、多签托管与监控，适用于需要在链上安全持有资产的团队。",
          cta: "了解安全",
        },
        recovery: {
          title: "资产追回",
          desc: "当加密资产丢失、被盗或卡住时，提供追踪、交易所协调与法律路径。",
          cta: "开始追回",
        },
        forensics: {
          title: "区块链取证",
          desc: "面向合规团队与法律审查的钱包级调查与交易映射。",
          cta: "查看取证",
        },
        finance: {
          title: "金融服务",
          desc: "加密兑法币支付、借贷、钱包与金库工具，用于转移与持有价值。",
          cta: "查看解决方案",
        },
      },
    },
    CaseWorkflow: {
      eyebrow: "工作流程",
      title1: "从受理到 ",
      title2: "可执行的证据",
      subtitle: "为受害者、合规团队与法律顾问设计的结构化流程——不是空泛承诺。",
      step_label: "步骤 {number}",
      steps: {
        submit: {
          title: "提交案件",
          desc: "提供钱包地址、交易哈希、时间线与事件经过。初步审查免费。",
        },
        trace: {
          title: "追踪并映射资金流",
          desc: "我们跨链、混币器、跨链桥与交易所充值追踪资金，确定价值最终去向。",
        },
        deliver: {
          title: "交付证据",
          desc: "您将收到格式化文档，适用于交易所合规部门、监管机构或法律顾问。",
        },
      },
      btn_primary: "开始案件受理",
      btn_secondary: "联系分析师",
    },
    TrustSignals: {
      eyebrow: "运营标准",
      title1: "为 ",
      title2: "信任至关重要的案件而构建",
      subtitle: "追回领域是诈骗重灾区。Lenix 遵循严肃机构保护受害者与机构所采用的做法。",
      image_alt: "分析师查看区块链调查仪表板与交易证据",
      items: {
        no_fees: {
          title: "无预付解锁费用",
          desc: "我们不会要求预付费用来释放、解锁或转移您的资金。",
        },
        no_seed: {
          title: "绝不索要助记词",
          desc: "无远程访问、无私钥、无恢复短语请求——绝不。",
        },
        no_custody: {
          title: "我们不托管您的资产",
          desc: "Lenix 准备证据并协调路径。我们不是您钱包的托管方。",
        },
        honest: {
          title: "诚实的案件评估",
          desc: "若追踪线索已耗尽或追回可能性低，我们会在付费合作前如实说明。",
        },
        audited: {
          title: "经审计的协议栈",
          desc: "智能合约经 CertiK 审查。运营符合 ISO 27001 控制要求。",
        },
        chains: {
          title: "多链覆盖",
          desc: "追踪工作流支持主要 EVM 网络及盗窃案件中常见的资产类型。",
        },
      },
    },
    Merchant: {
      widget_alert: "来自 B Shaw 的发票付款提醒",
      widget_req: "付款请求",
      widget_verified: "已验证付款链接",
      widget_receipt: "交易收据将发送至 ",
      widget_wallet: "钱包地址",
      widget_order: "订单",
      widget_gas: "Gas 费用",
      btn_complete: "完成付款",
      btn_manual: "手动付款",
      mock_brand: "Lenix 商户",
      image_alt: "Lenix 商户与合规运营仪表板",
      title1: "商户基础设施，",
      title2: "内置追回能力",
      title3: "。",
      point1: "通过结账流程与商户 API 接受加密资产并以法币结算。",
      point2: "通过经审计的多签金库托管路由收入。",
      point3: "若结算后出现问题，同一协议支持追踪与追回工作流。",
      point4_1: "探索解决方案",
      point4_2: "或",
      point4_3: "发起追回案件",
      point4_4: "。",
    },
    Credibility: {
      eyebrow: "验证",
      title1: "经审计的代码。",
      title2: "有文档的控制措施。",
      subtitle1: "CertiK 审查的智能合约与 ISO 27001 对齐运营，满足需要实质保障而非营销说辞的团队。",
      subtitle2_1: "阅读",
      subtitle2_2: "白皮书",
      subtitle2_3: "及审计文档，了解架构、代币用途与安全控制。",
      col1_text: "Lenix Protocol 智能合约已由 CertiK 审查。审计涵盖生产流程中使用的核心协议组件。",
      col1_btn: "查看安全文档",
      col2_text: "白皮书说明追回、托管与支付模块如何衔接——以及 LNX 在协议设计中的位置。",
      col2_btn: "阅读白皮书",
    },
    Cta: {
      title: "准备开启案件？",
      subtitle: "说明事件经过及您掌握的链上细节。我们将如实评估是否存在追踪与追回路径。",
      btn_primary: "开始案件受理",
      btn_secondary: "联系团队",
    },
  },
  ar: {
    Hero: {
      title1: "التحقيق الجنائي على البلوكشين واسترداد ",
      title2: "الأصول الرقمية المسروقة",
      title3: ".",
      subtitle1:
        "تتتبع Lenix الأموال عبر السلاسل وتُعد حزم أدلة للمنصات والجهات التنظيمية والمستشارين القانونيين.",
      subtitle2:
        "لا نعد بالاسترداد. نخبرك بما تُظهره السلسلة وما المسارات المحتملة قبل أن تلتزم.",
      btn_primary: "بدء حالة استرداد",
      btn_secondary: "تواصل مع فريقنا",
      btn_login: "تسجيل الدخول",
    },
    Partners: {
      eyebrow: "النظام البيئي",
      title: "مصمم للعمل مع المنصات والحفظ وقنوات الدفع",
      subtitle: "تربط Lenix التتبع وسير عمل الاسترداد وبنية التسوية عبر مكدس العملات المشفرة.",
    },
    Pillars: {
      title1: "بروتوكول واحد، ",
      title2: "أربعة مسارات عمل",
      subtitle: "اختر نقطة الدخول المناسبة لوضعك. لكل مسار أدوات مخصصة وخطوة تالية واضحة.",
      cards: {
        security: {
          title: "أمان البلوكشين",
          desc: "خزائن مدققة وحفظ متعدد التوقيع ومراقبة للفرق التي تحتاج أصولًا آمنة on-chain.",
          cta: "استكشف الأمان",
        },
        recovery: {
          title: "استرداد الأصول",
          desc: "تتبع وتنسيق مع المنصات ومسارات قانونية عند فقدان العملات أو سرقتها أو تعطلها.",
          cta: "بدء الاسترداد",
        },
        forensics: {
          title: "التحقيق الجنائي على البلوكشين",
          desc: "تحقيقات على مستوى المحفظة وخرائط للمعاملات لفرق الامتثال والمراجعة القانونية.",
          cta: "عرض التحقيق",
        },
        finance: {
          title: "الخدمات المالية",
          desc: "مدفوعات crypto-fiat وإقراض ومحفظة وخزائن لنقل وحفظ القيمة.",
          cta: "عرض الحلول",
        },
      },
    },
    CaseWorkflow: {
      eyebrow: "كيف يعمل",
      title1: "من الاستقبال إلى ",
      title2: "أدلة قابلة للتنفيذ",
      subtitle: "عملية منظمة للضحايا وفرق الامتثال والمستشارين—لا وعود مبهمة.",
      step_label: "الخطوة {number}",
      steps: {
        submit: {
          title: "قدّم حالتك",
          desc: "شارك عناوين المحافظ وهashes المعاملات والجداول الزمنية وما حدث. المراجعة الأولية مجانية.",
        },
        trace: {
          title: "تتبع ورسم التدفقات",
          desc: "نتابع الأموال عبر السلاسل وال mixers والجسور وإيداعات المنصات لتحديد أين استقرت القيمة.",
        },
        deliver: {
          title: "تسليم الأدلة",
          desc: "تتلقى نتائج موثقة بصيغة مناسبة لمكاتب امتثال المنصات أو الجهات التنظيمية أو المستشارين.",
        },
      },
      btn_primary: "بدء استقبال الحالة",
      btn_secondary: "تحدث مع محلل",
    },
    TrustSignals: {
      eyebrow: "معايير التشغيل",
      title1: "مصمم للحالات التي ",
      title2: "الثقة فيها مهمة",
      subtitle: "الاسترداد هدف للاحتيال. تتبع Lenix ممارسات تستخدمها شركات جادة لحماية الضحايا والمؤسسات.",
      image_alt: "محلل يراجع لوحة تحقيق بلوكشين وأدلة المعاملات",
      items: {
        no_fees: {
          title: "لا رسوم فتح مسبقة",
          desc: "لا نطلب مدفوعات مقدمة لإطلاق أو فتح أو تحويل أموالك.",
        },
        no_seed: {
          title: "لا نطلب عبارات الاسترداد أبدًا",
          desc: "لا وصول عن بُعد، لا مفاتيح خاصة، لا طلبات لعبارة الاسترداد—أبدًا.",
        },
        no_custody: {
          title: "لا نحتفظ بأصولك",
          desc: "تُعد Lenix الأدلة وتنسق المسارات. لسنا حارسًا لمحفظتك.",
        },
        honest: {
          title: "تقييم صادق للحالة",
          desc: "إذا استُنفد المسار أو كان الاسترداد غير مرجح، نقول ذلك قبل التزام مدفوع.",
        },
        audited: {
          title: "مكدس بروتوكول مدقق",
          desc: "عقود ذكية راجعتها CertiK. عمليات متوافقة مع ضوابط ISO 27001.",
        },
        chains: {
          title: "تغطية متعددة السلاسل",
          desc: "مسارات التتبع تدعم شبكات EVM الرئيسية وأنواع الأصول الشائعة في حالات السرقة.",
        },
      },
    },
    Merchant: {
      widget_alert: "تنبيه دفع فاتورة من B Shaw",
      widget_req: "طلب دفع",
      widget_verified: "رابط دفع موثق",
      widget_receipt: "سيتم إرسال إيصال المعاملة إلى ",
      widget_wallet: "عنوان المحفظة",
      widget_order: "الطلب",
      widget_gas: "رسوم الغاز",
      btn_complete: "إتمام الدفع",
      btn_manual: "الدفع يدويًا",
      mock_brand: "تاجر Lenix",
      image_alt: "لوحة عمليات التاجر والامتثال Lenix",
      title1: "بنية تجارية مع ",
      title2: "استرداد مدمج",
      title3: ".",
      point1: "اقبل العملات المشفرة وسوِّ بال fiat عبر checkout وواجهات التاجر.",
      point2: "وجّه العائدات عبر حفظ vault مدقق مع ضوابط multi-sig.",
      point3: "إذا حدث خطأ بعد التسوية، يدعم نفس البروتوكول التتبع ومسارات الاسترداد.",
      point4_1: "استكشف الحلول",
      point4_2: " أو ",
      point4_3: "ابدأ حالة استرداد",
      point4_4: ".",
    },
    Credibility: {
      eyebrow: "التحقق",
      title1: "كود مدقق. ",
      title2: "ضوابط موثقة.",
      subtitle1: "عقود ذكية راجعتها CertiK وعمليات متوافقة مع ISO 27001 للفرق التي تحتاج أكثر من ادعاءات تسويقية.",
      subtitle2_1: "اقرأ ",
      subtitle2_2: "الورقة البيضاء",
      subtitle2_3: " ووثائق التدقيق للبنية وفائدة الرمز وضوابط الأمان.",
      col1_text: "راجعت CertiK عقود Lenix Protocol الذكية. يغطي التدقيق مكونات البروتوكول الأساسية في مسارات الإنتاج.",
      col1_btn: "مراجعة وثائق الأمان",
      col2_text: "تشرح الورقة البيضاء كيف تتصل وحدات الاسترداد والحفظ والدفع—ومكان LNX في تصميم البروتوكول.",
      col2_btn: "اقرأ الورقة البيضاء",
    },
    Cta: {
      title: "مستعد لفتح حالة؟",
      subtitle: "شارك ما حدث والتفاصيل on-chain لديك. نرد بتقييم صادق لمسارات التتبع والاسترداد.",
      btn_primary: "بدء استقبال الحالة",
      btn_secondary: "تواصل مع فريقنا",
    },
  },
  hi: {
    Hero: {
      title1: "ब्लॉकचेन फ़ोरेंसिक और रिकवरी ",
      title2: "चोरी हुए डिजिटल संपत्तियों के लिए",
      title3: "।",
      subtitle1:
        "Lenix चेनों पर फंड ट्रेस करता है और एक्सचेंज, नियामकों और वकीलों के लिए साक्ष्य पैकेज तैयार करता है।",
      subtitle2:
        "हम रिकवरी का वादा नहीं करते। हम बताते हैं कि चेन क्या दिखाती है और प्रतिबद्धता से पहले कौन-से रास्ते संभव हो सकते हैं।",
      btn_primary: "रिकवरी केस शुरू करें",
      btn_secondary: "हमारी टीम से संपर्क करें",
      btn_login: "लॉग इन",
    },
    Partners: {
      eyebrow: "इकोसिस्टम",
      title: "एक्सचेंज, कस्टडी और भुगतान रेल के साथ काम करने के लिए बनाया गया",
      subtitle: "Lenix क्रिप्टो स्टैक में ट्रेसिंग, रिकवरी वर्कफ़्लो और सेटलमेंट इन्फ्रास्ट्रक्चर जोड़ता है।",
    },
    Pillars: {
      title1: "एक प्रोटोकॉल, ",
      title2: "चार वर्कफ़्लो",
      subtitle: "अपनी स्थिति से मेल खाने वाला प्रवेश बिंदु चुनें। हर रास्ते में समर्पित टूलिंग और स्पष्ट अगला कदम है।",
      cards: {
        security: {
          title: "ब्लॉकचेन सुरक्षा",
          desc: "ऑडिटेड वॉल्ट, मल्टी-सिग कस्टडी और मॉनिटरिंग उन टीमों के लिए जिन्हें on-chain सुरक्षित संपत्ति रखनी है।",
          cta: "सुरक्षा देखें",
        },
        recovery: {
          title: "संपत्ति रिकवरी",
          desc: "जब क्रिप्टो खो जाए, चोरी हो या अटक जाए—ट्रेसिंग, एक्सचेंज समन्वय और कानूनी रास्ते।",
          cta: "रिकवरी शुरू करें",
        },
        forensics: {
          title: "ब्लॉकचेन फ़ोरेंसिक",
          desc: "कंप्लायंस टीमों और कानूनी समीक्षा के लिए वॉलेट-स्तरीय जांच और लेन-देन मैपिंग।",
          cta: "फ़ोरेंसिक देखें",
        },
        finance: {
          title: "वित्तीय सेवाएँ",
          desc: "क्रिप्टो-से-फ़ियाट भुगतान, lending, wallet और vault—मूल्य स्थानांतरित और रखने के लिए।",
          cta: "समाधान देखें",
        },
      },
    },
    CaseWorkflow: {
      eyebrow: "यह कैसे काम करता है",
      title1: "इंटेक से ",
      title2: "कार्रवाई योग्य साक्ष्य तक",
      subtitle: "पीड़ितों, कंप्लायंस टीमों और वकीलों के लिए संरचित प्रक्रिया—अस्पष्ट वादे नहीं।",
      step_label: "चरण {number}",
      steps: {
        submit: {
          title: "अपना केस जमा करें",
          desc: "वॉलेट पते, लेन-देन हैश, समयरेखा और क्या हुआ—साझा करें। प्रारंभिक समीक्षा निःशुल्क है।",
        },
        trace: {
          title: "प्रवाह ट्रेस और मैप करें",
          desc: "हम चेन, मिक्सर, ब्रिज और एक्सचेंज जमा पर फंड का पीछा करते हैं कि मूल्य कहाँ पहुँचा।",
        },
        deliver: {
          title: "साक्ष्य प्रदान करें",
          desc: "आपको दस्तावेज़ित निष्कर्ष मिलते हैं—एक्सचेंज कंप्लायंस, नियामकों या वकीलों के लिए प्रारूपित।",
        },
      },
      btn_primary: "केस इंटेक शुरू करें",
      btn_secondary: "विश्लेषक से बात करें",
    },
    TrustSignals: {
      eyebrow: "संचालन मानक",
      title1: "ऐसे मामलों के लिए बनाया गया जहाँ ",
      title2: "विश्वास मायने रखता है",
      subtitle: "रिकवरी घोटालों का लक्ष्य है। Lenix गंभीर फर्मों की प्रथाओं का पालन करता है जो पीड़ितों और संस्थानों की रक्षा करती हैं।",
      image_alt: "विश्लेषक ब्लॉकचेन जांच डैशबोर्ड और लेन-देन साक्ष्य की समीक्षा कर रहा है",
      items: {
        no_fees: {
          title: "कोई अग्रिम अनलॉक शुल्क नहीं",
          desc: "हम आपके फंड जारी, अनलॉक या ट्रांसफर करने के लिए अग्रिम भुगतान नहीं मांगते।",
        },
        no_seed: {
          title: "कभी seed phrase नहीं मांगते",
          desc: "कोई रिमोट एक्सेस नहीं, कोई private key नहीं, कोई recovery phrase अनुरोध नहीं—कभी नहीं।",
        },
        no_custody: {
          title: "हम आपकी संपत्ति नहीं रखते",
          desc: "Lenix साक्ष्य तैयार करता है और रास्ते समन्वयित करता है। हम आपके वॉलेट के कस्टोडियन नहीं हैं।",
        },
        honest: {
          title: "ईमानदार केस मूल्यांकन",
          desc: "यदि ट्रेल समाप्त है या रिकवरी असंभाव्य है, तो हम paid engagement से पहले बताते हैं।",
        },
        audited: {
          title: "ऑडिटेड प्रोटोकॉल स्टैक",
          desc: "CertiK द्वारा समीक्षित smart contracts। ISO 27001 नियंत्रणों के अनुरूप संचालन।",
        },
        chains: {
          title: "मल्टी-चेन कवरेज",
          desc: "ट्रेसिंग वर्कफ़्लो प्रमुख EVM नेटवर्क और चोरी के मामलों में सामान्य संपत्ति प्रकारों का समर्थन करते हैं।",
        },
      },
    },
    Merchant: {
      widget_alert: "B Shaw से चालान भुगतान अलर्ट",
      widget_req: "भुगतान अनुरोध",
      widget_verified: "सत्यापित भुगतान लिंक",
      widget_receipt: "लेन-देन रसीद भेजी जाएगी ",
      widget_wallet: "वॉलेट पता",
      widget_order: "ऑर्डर",
      widget_gas: "GAS शुल्क",
      btn_complete: "भुगतान पूरा करें",
      btn_manual: "मैन्युअल भुगतान",
      mock_brand: "Lenix मर्चेंट",
      image_alt: "Lenix मर्चेंट और कंप्लायंस संचालन डैशबोर्ड",
      title1: "मर्चेंट इन्फ्रास्ट्रक्चर ",
      title2: "रिकवरी के साथ",
      title3: "।",
      point1: "checkout फ़्लो और merchant API के माध्यम से क्रिप्टो स्वीकार करें और fiat में settle करें।",
      point2: "आय को multi-sig नियंत्रण वाली ऑडिटेड vault कस्टडी से रूट करें।",
      point3: "सेटलमेंट के बाद कुछ गलत हो तो, वही प्रोटोकॉल ट्रेसिंग और रिकवरी वर्कफ़्लो का समर्थन करता है।",
      point4_1: "समाधान देखें",
      point4_2: " या ",
      point4_3: "रिकवरी केस शुरू करें",
      point4_4: "।",
    },
    Credibility: {
      eyebrow: "सत्यापन",
      title1: "ऑडिटेड कोड। ",
      title2: "दस्तावेज़ित नियंत्रण।",
      subtitle1:
        "CertiK-समीक्षित smart contracts और ISO 27001-संरेखित संचालन उन टीमों के लिए जिन्हें मार्केटिंग दावों से अधिक चाहिए।",
      subtitle2_1: "पढ़ें ",
      subtitle2_2: "व्हाइटपेपर",
      subtitle2_3: " और ऑडिट दस्तावेज़—आर्किटेक्चर, टोकन उपयोगिता और सुरक्षा नियंत्रण के लिए।",
      col1_text:
        "Lenix Protocol smart contracts की CertiK ने समीक्षा की है। ऑडिट में production फ़्लो में उपयोग किए गए core प्रोटोकॉल घटक शामिल हैं।",
      col1_btn: "सुरक्षा दस्तावेज़ देखें",
      col2_text:
        "व्हाइटपेपर बताता है कि recovery, custody और payment मॉड्यूल कैसे जुड़ते हैं—और LNX प्रोटोकॉल डिज़ाइन में कहाँ फिट बैठता है।",
      col2_btn: "व्हाइटपेपर पढ़ें",
    },
    Cta: {
      title: "केस खोलने के लिए तैयार?",
      subtitle:
        "बताएँ क्या हुआ और आपके पास जो on-chain विवरण हैं। हम ईमानदारी से बताते हैं कि ट्रेसिंग और रिकवरी के रास्ते हैं या नहीं।",
      btn_primary: "केस इंटेक शुरू करें",
      btn_secondary: "हमारी टीम से संपर्क करें",
    },
  },
  tr: {
    Hero: {
      title1: "Blockchain adli bilişim ve ",
      title2: "çalıntı dijital varlıkların kurtarılması",
      title3: ".",
      subtitle1:
        "Lenix fonları zincirler arasında izler ve borsalar, düzenleyiciler ve avukatlar için kanıt paketleri hazırlar.",
      subtitle2:
        "Kurtarma vaat etmiyoruz. Taahhüt etmeden önce zincirin ne gösterdiğini ve hangi yolların mümkün olabileceğini söylüyoruz.",
      btn_primary: "Kurtarma vakası başlat",
      btn_secondary: "Ekibimizle iletişime geçin",
      btn_login: "Giriş yap",
    },
    Partners: {
      eyebrow: "Ekosistem",
      title: "Borsalar, saklama ve ödeme altyapılarıyla çalışmak için tasarlandı",
      subtitle: "Lenix, kripto yığınında izleme, kurtarma iş akışları ve settlement altyapısını birbirine bağlar.",
    },
    Pillars: {
      title1: "Tek protokol, ",
      title2: "dört iş akışı",
      subtitle: "Durumunuza uygun giriş noktasını seçin. Her yolun özel araçları ve net bir sonraki adımı vardır.",
      cards: {
        security: {
          title: "Blockchain güvenliği",
          desc: "On-chain güvenli varlık tutması gereken ekipler için denetlenmiş vault'lar, multi-sig saklama ve izleme.",
          cta: "Güvenliği keşfedin",
        },
        recovery: {
          title: "Varlık kurtarma",
          desc: "Kripto kaybolduğunda, çalındığında veya takıldığında izleme, borsa koordinasyonu ve hukuki yollar.",
          cta: "Kurtarmayı başlat",
        },
        forensics: {
          title: "Blockchain adli bilişim",
          desc: "Uyum ekipleri ve hukuki inceleme için cüzdan düzeyinde soruşturmalar ve işlem haritalama.",
          cta: "Adli bilişimi görüntüle",
        },
        finance: {
          title: "Finansal hizmetler",
          desc: "Değer taşımak ve tutmak için kripto-fiat ödemeler, lending, cüzdan ve vault araçları.",
          cta: "Çözümleri görüntüle",
        },
      },
    },
    CaseWorkflow: {
      eyebrow: "Nasıl çalışır",
      title1: "Intake'ten ",
      title2: "eyleme dönük kanıta",
      subtitle: "Mağdurlar, uyum ekipleri ve avukatlar için yapılandırılmış süreç—belirsiz vaatler değil.",
      step_label: "Adım {number}",
      steps: {
        submit: {
          title: "Vakanızı gönderin",
          desc: "Cüzdan adresleri, işlem hash'leri, zaman çizelgeleri ve neler olduğunu paylaşın. İlk inceleme ücretsizdir.",
        },
        trace: {
          title: "Akışları izleyin ve haritalayın",
          desc: "Değerin nereye ulaştığını belirlemek için fonları zincirler, mixer'lar, köprüler ve borsa yatırımları boyunca takip ederiz.",
        },
        deliver: {
          title: "Kanıt teslim edin",
          desc: "Borsa uyum masaları, düzenleyiciler veya avukatlar için formatlanmış belgelenmiş bulgular alırsınız.",
        },
      },
      btn_primary: "Vaka intake'ini başlat",
      btn_secondary: "Analistle konuşun",
    },
    TrustSignals: {
      eyebrow: "Operasyon standartları",
      title1: "Güvenin ",
      title2: "önemli olduğu vakalar için",
      subtitle:
        "Kurtarma dolandırıcıların hedefidir. Lenix, mağdurları ve kurumları korumak için ciddi firmaların uyguladığı yöntemleri izler.",
      image_alt: "Analist blockchain soruşturma paneli ve işlem kanıtlarını inceliyor",
      items: {
        no_fees: {
          title: "Ön ödemeli kilit açma ücreti yok",
          desc: "Fonlarınızı serbest bırakmak, kilidini açmak veya transfer etmek için peşin ödeme istemiyoruz.",
        },
        no_seed: {
          title: "Asla seed phrase istemeyiz",
          desc: "Uzaktan erişim yok, özel anahtar yok, kurtarma ifadesi talebi yok—asla.",
        },
        no_custody: {
          title: "Varlıklarınızı tutmuyoruz",
          desc: "Lenix kanıt hazırlar ve yolları koordine eder. Cüzdanınızın saklayıcısı değiliz.",
        },
        honest: {
          title: "Dürüst vaka değerlendirmesi",
          desc: "İz tükendiyse veya kurtarma olası değilse, ücretli taahhütten önce söyleriz.",
        },
        audited: {
          title: "Denetlenmiş protokol yığını",
          desc: "CertiK tarafından incelenen akıllı sözleşmeler. ISO 27001 kontrolleriyle uyumlu operasyonlar.",
        },
        chains: {
          title: "Çoklu zincir kapsamı",
          desc: "İzleme iş akışları büyük EVM ağlarını ve hırsızlık vakalarında yaygın varlık türlerini destekler.",
        },
      },
    },
    Merchant: {
      widget_alert: "B Shaw'dan fatura ödeme uyarısı",
      widget_req: "ÖDEME TALEBİ",
      widget_verified: "DOĞRULANMIŞ ÖDEME LİNKİ",
      widget_receipt: "İŞLEM MAKBUZU GÖNDERİLECEK: ",
      widget_wallet: "Cüzdan adresi",
      widget_order: "SİPARİŞ",
      widget_gas: "GAS ÜCRETİ",
      btn_complete: "Ödemeyi tamamla",
      btn_manual: "Manuel öde",
      mock_brand: "Lenix Satıcı",
      image_alt: "Lenix satıcı ve uyum operasyonları paneli",
      title1: "Satıcı altyapısı, ",
      title2: "entegre kurtarma ile",
      title3: ".",
      point1: "Checkout akışları ve satıcı API'leriyle kripto kabul edin ve fiat'ta settle edin.",
      point2: "Geliri multi-sig kontrollü denetlenmiş vault saklaması üzerinden yönlendirin.",
      point3: "Settlement sonrası bir sorun olursa, aynı protokol izleme ve kurtarma iş akışlarını destekler.",
      point4_1: "Çözümleri keşfedin",
      point4_2: " veya ",
      point4_3: "kurtarma vakası başlatın",
      point4_4: ".",
    },
    Credibility: {
      eyebrow: "Doğrulama",
      title1: "Denetlenmiş kod. ",
      title2: "Belgelendirilmiş kontroller.",
      subtitle1:
        "CertiK tarafından incelenen akıllı sözleşmeler ve ISO 27001 uyumlu operasyonlar—pazarlama iddialarından fazlasını isteyen ekipler için.",
      subtitle2_1: "Okuyun: ",
      subtitle2_2: "whitepaper",
      subtitle2_3: " ve mimari, token faydası ve güvenlik kontrolleri için denetim belgeleri.",
      col1_text:
        "Lenix Protocol akıllı sözleşmeleri CertiK tarafından incelendi. Denetim, üretim akışlarında kullanılan temel protokol bileşenlerini kapsar.",
      col1_btn: "Güvenlik belgelerini inceleyin",
      col2_text:
        "Whitepaper, kurtarma, saklama ve ödeme modüllerinin nasıl bağlandığını—ve LNX'in protokol tasarımındaki yerini açıklar.",
      col2_btn: "Whitepaper'ı okuyun",
    },
    Cta: {
      title: "Vaka açmaya hazır mısınız?",
      subtitle:
        "Ne olduğunu ve sahip olduğunuz on-chain ayrıntıları paylaşın. İzleme ve kurtarma yollarının olup olmadığı konusunda dürüst bir değerlendirme yaparız.",
      btn_primary: "Vaka intake'ini başlat",
      btn_secondary: "Ekibimizle iletişime geçin",
    },
  },
  tl: {
    Hero: {
      title1: "Blockchain forensics at recovery ",
      title2: "para sa ninakaw na digital assets",
      title3: ".",
      subtitle1:
        "Tina-trace ng Lenix ang pondo sa iba't ibang chain at naghahanda ng evidence packages para sa exchanges, regulators, at counsel.",
      subtitle2:
        "Hindi kami nangangako ng recovery. Sinasabi namin kung ano ang ipinapakita ng chain at anong mga landas ang posible bago ka mag-commit.",
      btn_primary: "Simulan ang recovery case",
      btn_secondary: "Makipag-ugnayan sa team",
      btn_login: "Mag-log in",
    },
    Partners: {
      eyebrow: "Ecosystem",
      title: "Ginawa para sa exchanges, custody, at payment rails",
      subtitle:
        "Pinag-uugnay ng Lenix ang tracing, recovery workflows, at settlement infrastructure sa buong crypto stack.",
    },
    Pillars: {
      title1: "Isang protocol, ",
      title2: "apat na workflow",
      subtitle:
        "Piliin ang entry point na tumutugma sa sitwasyon mo. Bawat landas may dedicated tooling at malinaw na susunod na hakbang.",
      cards: {
        security: {
          title: "Blockchain Security",
          desc: "Audited vaults, multi-sig custody, at monitoring para sa mga team na kailangang ligtas ang assets on-chain.",
          cta: "Tuklasin ang security",
        },
        recovery: {
          title: "Asset Recovery",
          desc: "Tracing, exchange coordination, at legal pathways kapag nawala, ninakaw, o na-stuck ang crypto.",
          cta: "Simulan ang recovery",
        },
        forensics: {
          title: "Blockchain Forensics",
          desc: "Wallet-level investigations at transaction mapping para sa compliance teams at legal review.",
          cta: "Tingnan ang forensics",
        },
        finance: {
          title: "Financial Services",
          desc: "Crypto-to-fiat payments, lending, wallet, at vault tools para ilipat at i-hold ang value.",
          cta: "Tingnan ang solutions",
        },
      },
    },
    CaseWorkflow: {
      eyebrow: "Paano ito gumagana",
      title1: "Mula sa intake hanggang ",
      title2: "actionable evidence",
      subtitle:
        "Structured process para sa victims, compliance teams, at counsel—hindi vague promises.",
      step_label: "Hakbang {number}",
      steps: {
        submit: {
          title: "Isumite ang case mo",
          desc: "Ibahagi ang wallet addresses, transaction hashes, timelines, at nangyari. Libre ang initial review.",
        },
        trace: {
          title: "I-trace at i-map ang flows",
          desc: "Sinusundan namin ang pondo sa chains, mixers, bridges, at exchange deposits para malaman kung saan napunta ang value.",
        },
        deliver: {
          title: "I-deliver ang evidence",
          desc: "Makakatanggap ka ng documented findings na naka-format para sa exchange compliance desks, regulators, o legal counsel.",
        },
      },
      btn_primary: "Simulan ang case intake",
      btn_secondary: "Makipag-usap sa analyst",
    },
    TrustSignals: {
      eyebrow: "Operating standards",
      title1: "Ginawa para sa mga case kung saan ",
      title2: "mahalaga ang tiwala",
      subtitle:
        "Target ng scams ang recovery. Sumusunod ang Lenix sa mga praktis na ginagamit ng seryosong firms para protektahan ang victims at institutions.",
      image_alt: "Analyst na nire-review ang blockchain investigation dashboard at transaction evidence",
      items: {
        no_fees: {
          title: "Walang upfront unlock fees",
          desc: "Hindi kami humihingi ng advance payment para i-release, i-unlock, o i-transfer ang pondo mo.",
        },
        no_seed: {
          title: "Hindi kailanman hihingi ng seed phrases",
          desc: "Walang remote access, walang private keys, walang recovery phrase requests—kailanman.",
        },
        no_custody: {
          title: "Hindi namin hinahawakan ang assets mo",
          desc: "Naghahanda ang Lenix ng ebidensya at nagko-coordinate ng pathways. Hindi kami custodian ng wallet mo.",
        },
        honest: {
          title: "Tapat na case assessment",
          desc: "Kung ubos na ang trail o unlikely ang recovery, sasabihin namin bago ang paid engagement.",
        },
        audited: {
          title: "Audited protocol stack",
          desc: "Smart contracts na ni-review ng CertiK. Operations aligned sa ISO 27001 controls.",
        },
        chains: {
          title: "Multi-chain coverage",
          desc: "Sinusuportahan ng tracing workflows ang major EVM networks at common asset types sa theft cases.",
        },
      },
    },
    Merchant: {
      widget_alert: "Invoice Payment Alert mula kay B Shaw",
      widget_req: "PAYMENT REQUEST",
      widget_verified: "VERIFIED PAYMENT LINK",
      widget_receipt: "IPAPADALA ANG TRANSACTION RECEIPT SA ",
      widget_wallet: "Wallet address",
      widget_order: "ORDER",
      widget_gas: "GAS FEE",
      btn_complete: "Kumpletuhin ang payment",
      btn_manual: "Magbayad manually",
      mock_brand: "Lenix Merchant",
      image_alt: "Lenix merchant at compliance operations dashboard",
      title1: "Merchant infrastructure na may ",
      title2: "built-in recovery",
      title3: ".",
      point1: "Tanggapin ang crypto at mag-settle sa fiat sa checkout flows at merchant APIs.",
      point2: "I-route ang proceeds sa audited vault custody na may multi-sig controls.",
      point3:
        "Kung may mali pagkatapos ng settlement, sinusuportahan ng parehong protocol ang tracing at recovery workflows.",
      point4_1: "Tuklasin ang solutions",
      point4_2: " o ",
      point4_3: "simulan ang recovery case",
      point4_4: ".",
    },
    Credibility: {
      eyebrow: "Verification",
      title1: "Audited code. ",
      title2: "Documented controls.",
      subtitle1:
        "CertiK-reviewed smart contracts at ISO 27001-aligned operations para sa mga team na kailangan ng higit sa marketing claims.",
      subtitle2_1: "Basahin ang ",
      subtitle2_2: "whitepaper",
      subtitle2_3: " at audit documentation para sa architecture, token utility, at security controls.",
      col1_text:
        "Na-review ng CertiK ang Lenix Protocol smart contracts. Saklaw ng audit ang core protocol components sa production flows.",
      col1_btn: "Review security docs",
      col2_text:
        "Ipinapaliwanag ng whitepaper kung paano nagkakaugnay ang recovery, custody, at payment modules—at kung saan pumapasok ang LNX sa protocol design.",
      col2_btn: "Basahin ang whitepaper",
    },
    Cta: {
      title: "Handa nang magbukas ng case?",
      subtitle:
        "Ibahagi kung ano ang nangyari at ang on-chain details na mayroon ka. Sumasagot kami nang tapat kung may tracing at recovery paths.",
      btn_primary: "Simulan ang case intake",
      btn_secondary: "Makipag-ugnayan sa team",
    },
  },
};

for (const locale of locales) {
  const filePath = path.join(root, "messages", locale, "common.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const patch = patches[locale];

  if (!data.Home) data.Home = {};

  const beforeHome = JSON.parse(JSON.stringify(data.Home));
  let updatedCount = 0;

  for (const section of SECTIONS_TO_PATCH) {
    if (!patch[section]) continue;
    updatedCount += countPatchUpdates(beforeHome[section] || {}, patch[section]);
    data.Home[section] = deepMerge(data.Home[section] || {}, patch[section]);
  }

  for (const section of SECTIONS_FILL_IF_MISSING) {
    if (!data.Home[section] && enHome[section]) {
      data.Home[section] = enHome[section];
      updatedCount += countLeafKeys(enHome[section]);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
  console.log(`${locale}: ${updatedCount} keys updated`);
}

console.log("Done.");
