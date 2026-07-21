import fs from "fs";
import path from "path";

const root = path.join(import.meta.dirname, "..");
const locales = ["de", "fr", "es", "pt", "it", "id", "vi", "zh", "ar", "hi", "tr", "tl"];

const patches = {
  de: {
    mock_brand: "Lenix Händler",
    security_link: "Sicherheit",
    CaseStudy: {
      eyebrow: "Fallbeispiel",
      title1: "Wenn gestohlene Gelder ",
      title2: "eine zentralisierte Börse erreichen",
      subtitle:
        "Anonymisiertes Beispiel. Kennungen geändert. Der Prozess ist repräsentativ—keine Garantie für Wiederherstellung.",
      situation: {
        label: "Ausgangslage",
        text: "Eine Unternehmens-Wallet sendete USDC an einen Phishing-Vertrag. Innerhalb weniger Stunden flossen die Mittel über zwei Zwischen-Wallets zu einer großen Börse.",
      },
      action: {
        label: "Was Lenix tat",
        text: "Wir kartierten den vollständigen Transaktionsweg, kennzeichneten die Einzahlungsadresse und erstellten ein Beweispaket mit Transaktionsgraphen und Zeitlinien für das Compliance-Team der Börse.",
      },
      outcome: {
        label: "Ergebnis",
        text: "Das Compliance-Team der Börse nahm die Einreichung an. Mittel wurden bis zur Prüfung eingefroren. Anwälte erhielten dieselbe Dokumentation für parallele rechtliche Schritte.",
      },
      disclaimer:
        "Ergebnisse variieren je nach Fall, Rechtsordnung und Reaktionszeit der Börse. Dieses Beispiel zeigt, wie Lenix Spuren dokumentiert—nicht jeder Fall endet mit Wiederherstellung.",
    },
    Security: {
      meta: {
        title: "Sicherheit & Audits | Lenix Protocol",
        description:
          "CertiK-Smart-Contract-Audits, ISO-27001-konforme Abläufe und Sicherheitskontrollen für Lenix Forensik- und Recovery-Infrastruktur.",
      },
      hero: {
        eyebrow: "Sicherheit",
        title1: "Geprüftes Protokoll. ",
        title2: "Dokumentierte Kontrollen.",
        subtitle:
          "Lenix verbindet unabhängige Smart-Contract-Prüfungen mit operativen Sicherheitspraktiken für Teams, die sensible Recovery- und Custody-Workflows betreiben.",
      },
      audit: {
        title: "Smart-Contract-Audit",
        desc: "Kernverträge in Produktionsflüssen wurden von CertiK geprüft. Der Audit-Umfang deckt deployment-kritische Komponenten und bekannte Angriffsflächen ab.",
        certik_text:
          "CertiK prüfte Lenix-Smart-Contracts auf gängige Schwachstellen, Zugriffskontrollen und Logikfehler in Token- und Vault-Flows.",
        certik_link: "Unternehmensübersicht und Dokumentation ansehen",
        items: {
          contracts: {
            title: "Vertragsprüfungsumfang",
            desc: "Token-Sale-, Vault- und Protokollmodule in Live-Zahlungs- und Custody-Pfaden.",
          },
          access: {
            title: "Zugriffskontrolle",
            desc: "Rollenbasierte Berechtigungen, Multi-Sig-Anforderungen und Upgrade-Pfade, wo zutreffend.",
          },
          monitoring: {
            title: "Laufende Überwachung",
            desc: "Produktionsdeployments werden auf anomale Vertragsinteraktionen und operative Alerts überwacht.",
          },
        },
      },
      iso: {
        title: "ISO-27001-konforme Abläufe",
        desc: "Lenix Protocol unterhält Informationssicherheitsmanagement-Praktiken nach ISO 27001 für Kundendaten, Ermittlungsmaterialien und interne Systeme.",
      },
      practices: {
        data: {
          title: "Datenhandhabung",
          desc: "Fallmaterialien werden mit Zugriffskontrollen gespeichert. Ermittlungsdaten werden nur an autorisierte Parteien weitergegeben.",
        },
        incident: {
          title: "Incident Response",
          desc: "Definierte Verfahren für Sicherheitsvorfälle, die Kundendaten, Protokollinfrastruktur oder Ermittlungsworkflows betreffen.",
        },
        custody: {
          title: "Custody-Grenzen",
          desc: "Lenix bereitet Beweise vor und koordiniert Wege. Wir nehmen keine Custody von Wallet-Keys oder Seed-Phrasen.",
        },
      },
      cta: {
        title: "Fragen zu unserer Sicherheitslage?",
        subtitle: "Kontaktieren Sie uns für Dokumentationsanfragen oder Enterprise-Sicherheitsreviews.",
        btn_primary: "Recovery-Fall starten",
        btn_secondary: "Sicherheitsteam kontaktieren",
      },
    },
  },
  fr: {
    mock_brand: "Marchand Lenix",
    security_link: "Sécurité",
    CaseStudy: {
      eyebrow: "Exemple de cas",
      title1: "Quand des fonds volés atteignent ",
      title2: "un exchange custodial",
      subtitle:
        "Exemple anonymisé. Identifiants modifiés. Le processus est représentatif—sans garantie de récupération.",
      situation: {
        label: "Situation",
        text: "Un portefeuille d'entreprise a envoyé des USDC à un contrat de phishing. En quelques heures, les fonds ont transité par deux portefeuilles intermédiaires vers un grand exchange.",
      },
      action: {
        label: "Ce que Lenix a fait",
        text: "Nous avons cartographié le parcours complet, identifié l'adresse de dépôt et préparé un dossier de preuves avec graphes de transactions et chronologie pour l'équipe compliance de l'exchange.",
      },
      outcome: {
        label: "Résultat",
        text: "Le service compliance de l'exchange a accepté le dossier. Les fonds ont été gelés en attente d'examen. Les avocats ont reçu la même documentation pour les démarches juridiques parallèles.",
      },
      disclaimer:
        "Les résultats varient selon le cas, la juridiction et le délai de réponse de l'exchange. Cet exemple montre comment Lenix documente une piste—chaque cas ne se termine pas par une récupération.",
    },
    Security: {
      meta: {
        title: "Sécurité & Audits | Lenix Protocol",
        description:
          "Audits CertiK, opérations alignées ISO 27001 et contrôles de sécurité pour l'infrastructure forensique et de récupération Lenix.",
      },
      hero: {
        eyebrow: "Sécurité",
        title1: "Protocole audité. ",
        title2: "Contrôles documentés.",
        subtitle:
          "Lenix combine une revue tierce des smart contracts avec des pratiques de sécurité opérationnelle pour les équipes gérant des workflows sensibles de récupération et de custody.",
      },
      audit: {
        title: "Audit de smart contract",
        desc: "Les contrats principaux utilisés en production ont été revus par CertiK. Le périmètre couvre les composants critiques et les surfaces d'attaque connues.",
        certik_text:
          "CertiK a examiné les smart contracts Lenix pour les vulnérabilités courantes, les contrôles d'accès et les failles logiques des flux token et vault.",
        certik_link: "Voir la présentation et la documentation",
        items: {
          contracts: {
            title: "Périmètre de revue",
            desc: "Modules de vente de token, vault et protocole utilisés dans les flux de paiement et custody en production.",
          },
          access: {
            title: "Contrôle d'accès",
            desc: "Permissions par rôle, exigences multi-sig et chemins de mise à jour le cas échéant.",
          },
          monitoring: {
            title: "Surveillance continue",
            desc: "Les déploiements en production sont surveillés pour détecter les interactions anormales et alertes opérationnelles.",
          },
        },
      },
      iso: {
        title: "Opérations alignées ISO 27001",
        desc: "Lenix Protocol maintient des pratiques de gestion de la sécurité de l'information alignées sur ISO 27001 pour les données clients, les matériaux d'enquête et les systèmes internes.",
      },
      practices: {
        data: {
          title: "Traitement des données",
          desc: "Les dossiers sont stockés avec contrôles d'accès. Les données d'enquête ne sont partagées qu'avec des parties autorisées.",
        },
        incident: {
          title: "Réponse aux incidents",
          desc: "Procédures définies pour les événements de sécurité affectant les données clients, l'infrastructure ou les workflows d'enquête.",
        },
        custody: {
          title: "Limites de custody",
          desc: "Lenix prépare les preuves et coordonne les voies. Nous ne prenons pas en custody les clés ou phrases secrètes des clients.",
        },
      },
      cta: {
        title: "Des questions sur notre posture de sécurité ?",
        subtitle: "Contactez-nous pour des demandes de documentation ou des revues sécurité enterprise.",
        btn_primary: "Ouvrir un dossier de récupération",
        btn_secondary: "Contacter l'équipe sécurité",
      },
    },
  },
  es: {
    mock_brand: "Comerciante Lenix",
    security_link: "Seguridad",
    CaseStudy: {
      eyebrow: "Ejemplo de caso",
      title1: "Cuando fondos robados llegan ",
      title2: "a un exchange custodial",
      subtitle:
        "Ejemplo anonimizado. Identificadores cambiados. El proceso es representativo—no garantiza recuperación.",
      situation: {
        label: "Situación",
        text: "Una wallet empresarial envió USDC a un contrato de phishing. En horas, los fondos pasaron por dos wallets intermedias y se depositaron en un exchange importante.",
      },
      action: {
        label: "Qué hizo Lenix",
        text: "Mapeamos la ruta completa, etiquetamos la dirección de depósito y preparamos un paquete de evidencia con grafos de transacciones y cronología para el equipo de compliance del exchange.",
      },
      outcome: {
        label: "Resultado",
        text: "El equipo de compliance aceptó el expediente. Los fondos quedaron congelados pendientes de revisión. El asesor legal recibió la misma documentación para pasos legales paralelos.",
      },
      disclaimer:
        "Los resultados varían según el caso, la jurisdicción y el tiempo de respuesta del exchange. Este ejemplo muestra cómo Lenix documenta un rastro—no todos los casos terminan en recuperación.",
    },
    Security: {
      meta: {
        title: "Seguridad y Auditorías | Lenix Protocol",
        description:
          "Auditorías CertiK, operaciones alineadas con ISO 27001 y controles de seguridad para la infraestructura forense y de recuperación de Lenix.",
      },
      hero: {
        eyebrow: "Seguridad",
        title1: "Protocolo auditado. ",
        title2: "Controles documentados.",
        subtitle:
          "Lenix combina revisión externa de smart contracts con prácticas de seguridad operativa para equipos que manejan flujos sensibles de recuperación y custodia.",
      },
      audit: {
        title: "Auditoría de smart contract",
        desc: "Los contratos principales en flujos de producción fueron revisados por CertiK. El alcance cubre componentes críticos y superficies de ataque conocidas.",
        certik_text:
          "CertiK revisó los smart contracts de Lenix en busca de vulnerabilidades comunes, control de acceso y fallos lógicos en flujos de token y vault.",
        certik_link: "Ver resumen de la empresa y documentación",
        items: {
          contracts: {
            title: "Alcance de revisión",
            desc: "Venta de token, vault y módulos de protocolo usados en rutas de pago y custodia en vivo.",
          },
          access: {
            title: "Control de acceso",
            desc: "Permisos por rol, requisitos multi-sig y rutas de actualización cuando aplique.",
          },
          monitoring: {
            title: "Monitoreo continuo",
            desc: "Los despliegues en producción se monitorean por interacciones anómalas y alertas operativas.",
          },
        },
      },
      iso: {
        title: "Operaciones alineadas con ISO 27001",
        desc: "Lenix Protocol mantiene prácticas de gestión de seguridad de la información alineadas con ISO 27001 para datos de clientes, materiales de investigación y sistemas internos.",
      },
      practices: {
        data: {
          title: "Manejo de datos",
          desc: "Los materiales del caso se almacenan con controles de acceso. Los datos de investigación se comparten solo con partes autorizadas.",
        },
        incident: {
          title: "Respuesta a incidentes",
          desc: "Procedimientos definidos para eventos de seguridad que afecten datos de clientes, infraestructura del protocolo o flujos de investigación.",
        },
        custody: {
          title: "Límites de custodia",
          desc: "Lenix prepara evidencia y coordina vías. No tomamos custodia de claves ni frases semilla de clientes.",
        },
      },
      cta: {
        title: "¿Preguntas sobre nuestra postura de seguridad?",
        subtitle: "Contacte a nuestro equipo para solicitudes de documentación o revisiones de seguridad enterprise.",
        btn_primary: "Iniciar caso de recuperación",
        btn_secondary: "Contactar equipo de seguridad",
      },
    },
  },
  pt: {
    mock_brand: "Comerciante Lenix",
    security_link: "Segurança",
    CaseStudy: {
      eyebrow: "Exemplo de caso",
      title1: "Quando fundos roubados chegam ",
      title2: "a uma exchange custodial",
      subtitle:
        "Exemplo anonimizado. Identificadores alterados. O processo é representativo—sem garantia de recuperação.",
      situation: {
        label: "Situação",
        text: "Uma carteira empresarial enviou USDC a um contrato de phishing. Em horas, os fundos passaram por duas carteiras intermediárias e foram depositados numa grande exchange.",
      },
      action: {
        label: "O que a Lenix fez",
        text: "Mapeámos o percurso completo, identificámos o endereço de depósito e preparámos um pacote de evidências com grafos de transações e cronologia para a equipa de compliance da exchange.",
      },
      outcome: {
        label: "Resultado",
        text: "A equipa de compliance aceitou o pedido. Os fundos foram congelados pendente de revisão. O conselho jurídico recebeu a mesma documentação para passos legais paralelos.",
      },
      disclaimer:
        "Os resultados variam consoante o caso, jurisdição e tempo de resposta da exchange. Este exemplo mostra como a Lenix documenta um rasto—nem todos os casos terminam em recuperação.",
    },
    Security: {
      meta: {
        title: "Segurança e Auditorias | Lenix Protocol",
        description:
          "Auditorias CertiK, operações alinhadas com ISO 27001 e controlos de segurança para a infraestrutura forense e de recuperação da Lenix.",
      },
      hero: {
        eyebrow: "Segurança",
        title1: "Protocolo auditado. ",
        title2: "Controlos documentados.",
        subtitle:
          "A Lenix combina revisão externa de smart contracts com práticas de segurança operacional para equipas que gerem fluxos sensíveis de recuperação e custódia.",
      },
      audit: {
        title: "Auditoria de smart contract",
        desc: "Contratos centrais em fluxos de produção foram revistos pela CertiK. O âmbito cobre componentes críticos e superfícies de ataque conhecidas.",
        certik_text:
          "A CertiK reviu os smart contracts Lenix quanto a vulnerabilidades comuns, controlo de acesso e falhas lógicas em fluxos de token e vault.",
        certik_link: "Ver visão geral da empresa e documentação",
        items: {
          contracts: {
            title: "Âmbito de revisão",
            desc: "Venda de token, vault e módulos de protocolo usados em rotas de pagamento e custódia em produção.",
          },
          access: {
            title: "Controlo de acesso",
            desc: "Permissões por função, requisitos multi-sig e caminhos de upgrade quando aplicável.",
          },
          monitoring: {
            title: "Monitorização contínua",
            desc: "Implementações em produção são monitorizadas para interações anómalas e alertas operacionais.",
          },
        },
      },
      iso: {
        title: "Operações alinhadas com ISO 27001",
        desc: "A Lenix Protocol mantém práticas de gestão de segurança da informação alinhadas com ISO 27001 para dados de clientes, materiais de investigação e sistemas internos.",
      },
      practices: {
        data: {
          title: "Tratamento de dados",
          desc: "Materiais de casos são armazenados com controlos de acesso. Dados de investigação são partilhados apenas com partes autorizadas.",
        },
        incident: {
          title: "Resposta a incidentes",
          desc: "Procedimentos definidos para eventos de segurança que afetem dados de clientes, infraestrutura do protocolo ou fluxos de investigação.",
        },
        custody: {
          title: "Limites de custódia",
          desc: "A Lenix prepara evidências e coordena vias. Não tomamos custódia de chaves ou frases seed de clientes.",
        },
      },
      cta: {
        title: "Perguntas sobre a nossa postura de segurança?",
        subtitle: "Contacte a nossa equipa para pedidos de documentação ou revisões de segurança enterprise.",
        btn_primary: "Iniciar caso de recuperação",
        btn_secondary: "Contactar equipa de segurança",
      },
    },
  },
  it: {
    mock_brand: "Commerciante Lenix",
    security_link: "Sicurezza",
    CaseStudy: {
      eyebrow: "Esempio di caso",
      title1: "Quando fondi rubati raggiungono ",
      title2: "un exchange custodial",
      subtitle:
        "Esempio anonimizzato. Identificatori modificati. Il processo è rappresentativo—nessuna garanzia di recupero.",
      situation: {
        label: "Situazione",
        text: "Un wallet aziendale ha inviato USDC a un contratto di phishing. In poche ore i fondi sono passati per due wallet intermedi e depositati su un grande exchange.",
      },
      action: {
        label: "Cosa ha fatto Lenix",
        text: "Abbiamo mappato l'intero percorso, etichettato l'indirizzo di deposito e preparato un pacchetto di prove con grafici delle transazioni e cronologia per il team compliance dell'exchange.",
      },
      outcome: {
        label: "Esito",
        text: "Il desk compliance dell'exchange ha accettato la segnalazione. I fondi sono stati congelati in attesa di revisione. I consulenti legali hanno ricevuto la stessa documentazione per azioni parallele.",
      },
      disclaimer:
        "I risultati variano per caso, giurisdizione e tempi di risposta dell'exchange. Questo esempio mostra come Lenix documenta una traccia—non ogni caso si conclude con un recupero.",
    },
    Security: {
      meta: {
        title: "Sicurezza e Audit | Lenix Protocol",
        description:
          "Audit CertiK, operazioni allineate ISO 27001 e controlli di sicurezza per l'infrastruttura forense e di recupero Lenix.",
      },
      hero: {
        eyebrow: "Sicurezza",
        title1: "Protocollo auditato. ",
        title2: "Controlli documentati.",
        subtitle:
          "Lenix combina revisione esterna degli smart contract con pratiche di sicurezza operativa per team che gestiscono workflow sensibili di recupero e custody.",
      },
      audit: {
        title: "Audit smart contract",
        desc: "I contratti core usati nei flussi di produzione sono stati revisionati da CertiK. L'ambito copre componenti critici e superfici di attacco note.",
        certik_text:
          "CertiK ha esaminato gli smart contract Lenix per vulnerabilità comuni, controllo degli accessi e errori logici nei flussi token e vault.",
        certik_link: "Vedi panoramica aziendale e documentazione",
        items: {
          contracts: {
            title: "Ambito di revisione",
            desc: "Token sale, vault e moduli di protocollo usati nei percorsi di pagamento e custody in produzione.",
          },
          access: {
            title: "Controllo accessi",
            desc: "Permessi basati su ruoli, requisiti multi-sig e percorsi di upgrade dove applicabile.",
          },
          monitoring: {
            title: "Monitoraggio continuo",
            desc: "I deployment in produzione sono monitorati per interazioni anomale e alert operativi.",
          },
        },
      },
      iso: {
        title: "Operazioni allineate ISO 27001",
        desc: "Lenix Protocol mantiene pratiche di gestione della sicurezza delle informazioni allineate a ISO 27001 per dati clienti, materiali di indagine e sistemi interni.",
      },
      practices: {
        data: {
          title: "Gestione dati",
          desc: "I materiali dei casi sono archiviati con controlli di accesso. I dati di indagine sono condivisi solo con parti autorizzate.",
        },
        incident: {
          title: "Risposta agli incidenti",
          desc: "Procedure definite per eventi di sicurezza che coinvolgono dati clienti, infrastruttura del protocollo o workflow di indagine.",
        },
        custody: {
          title: "Limiti di custody",
          desc: "Lenix prepara le prove e coordina i percorsi. Non prendiamo in custody chiavi o seed phrase dei clienti.",
        },
      },
      cta: {
        title: "Domande sulla nostra postura di sicurezza?",
        subtitle: "Contattate il team per richieste di documentazione o revisioni security enterprise.",
        btn_primary: "Avvia caso di recupero",
        btn_secondary: "Contatta il team sicurezza",
      },
    },
  },
  id: {
    mock_brand: "Merchant Lenix",
    security_link: "Keamanan",
    CaseStudy: {
      eyebrow: "Contoh kasus",
      title1: "Ketika dana curian mencapai ",
      title2: "exchange kustodial",
      subtitle:
        "Contoh anonim. Identitas diubah. Proses ini representatif—bukan jaminan pemulihan.",
      situation: {
        label: "Situasi",
        text: "Dompet bisnis mengirim USDC ke kontrak phishing. Dalam beberapa jam, dana berpindah melalui dua dompet perantara dan disetor ke exchange besar.",
      },
      action: {
        label: "Yang dilakukan Lenix",
        text: "Kami memetakan jalur transaksi penuh, menandai alamat deposit, dan menyiapkan paket bukti dengan graf transaksi dan catatan timeline untuk tim compliance exchange.",
      },
      outcome: {
        label: "Hasil",
        text: "Meja compliance exchange menerima laporan. Dana dibekukan menunggu tinjauan. Penasihat hukum menerima dokumentasi yang sama untuk langkah legal paralel.",
      },
      disclaimer:
        "Hasil bervariasi menurut kasus, yurisdiksi, dan waktu respons exchange. Contoh ini menunjukkan bagaimana Lenix mendokumentasikan jejak—tidak setiap kasus berakhir dengan pemulihan.",
    },
    Security: {
      meta: {
        title: "Keamanan & Audit | Lenix Protocol",
        description:
          "Audit smart contract CertiK, operasi selaras ISO 27001, dan kontrol keamanan untuk infrastruktur forensik dan pemulihan Lenix.",
      },
      hero: {
        eyebrow: "Keamanan",
        title1: "Protokol diaudit. ",
        title2: "Kontrol terdokumentasi.",
        subtitle:
          "Lenix menggabungkan tinjauan smart contract pihak ketiga dengan praktik keamanan operasional untuk tim yang menangani alur pemulihan dan kustodi sensitif.",
      },
      audit: {
        title: "Audit smart contract",
        desc: "Kontrak inti dalam alur produksi telah ditinjau CertiK. Cakupan audit meliputi komponen kritis deployment dan permukaan serangan yang dikenal.",
        certik_text:
          "CertiK meninjau smart contract Lenix untuk kerentanan umum, kontrol akses, dan kelemahan logika pada alur token dan vault.",
        certik_link: "Lihat ringkasan perusahaan dan dokumentasi",
        items: {
          contracts: {
            title: "Cakupan tinjauan kontrak",
            desc: "Token sale, vault, dan modul protokol yang digunakan di jalur pembayaran dan kustodi live.",
          },
          access: {
            title: "Kontrol akses",
            desc: "Izin berbasis peran, persyaratan multi-sig, dan jalur upgrade jika berlaku.",
          },
          monitoring: {
            title: "Pemantauan berkelanjutan",
            desc: "Deployment produksi dipantau untuk interaksi kontrak anomali dan alert operasional.",
          },
        },
      },
      iso: {
        title: "Operasi selaras ISO 27001",
        desc: "Lenix Protocol mempertahankan praktik manajemen keamanan informasi selaras ISO 27001 untuk data klien, materi investigasi, dan sistem internal.",
      },
      practices: {
        data: {
          title: "Penanganan data",
          desc: "Materi kasus disimpan dengan kontrol akses. Data investigasi dibagikan hanya kepada pihak yang berwenang.",
        },
        incident: {
          title: "Respons insiden",
          desc: "Prosedur terdefinisi untuk peristiwa keamanan yang memengaruhi data klien, infrastruktur protokol, atau alur investigasi.",
        },
        custody: {
          title: "Batas kustodi",
          desc: "Lenix menyiapkan bukti dan mengoordinasikan jalur. Kami tidak mengambil kustodi kunci wallet atau seed phrase klien.",
        },
      },
      cta: {
        title: "Pertanyaan tentang postur keamanan kami?",
        subtitle: "Hubungi tim kami untuk permintaan dokumentasi atau tinjauan keamanan enterprise.",
        btn_primary: "Mulai kasus pemulihan",
        btn_secondary: "Hubungi tim keamanan",
      },
    },
  },
  vi: {
    mock_brand: "Thương nhân Lenix",
    security_link: "Bảo mật",
    CaseStudy: {
      eyebrow: "Ví dụ vụ việc",
      title1: "Khi tiền bị đánh cắp đến ",
      title2: "sàn giao dịch custodial",
      subtitle:
        "Ví dụ ẩn danh. Định danh đã thay đổi. Quy trình mang tính minh họa—không đảm bảo thu hồi.",
      situation: {
        label: "Tình huống",
        text: "Ví doanh nghiệp gửi USDC tới hợp đồng phishing. Trong vài giờ, tiền chuyển qua hai ví trung gian và nạp vào một sàn lớn.",
      },
      action: {
        label: "Lenix đã làm gì",
        text: "Chúng tôi lập bản đồ toàn bộ luồng giao dịch, gắn nhãn địa chỉ nạp và chuẩn bị gói bằng chứng với đồ thị giao dịch và dòng thời gian cho đội compliance của sàn.",
      },
      outcome: {
        label: "Kết quả",
        text: "Bộ phận compliance của sàn chấp nhận hồ sơ. Tiền bị đóng băng chờ xem xét. Luật sư nhận cùng tài liệu cho các bước pháp lý song song.",
      },
      disclaimer:
        "Kết quả khác nhau theo vụ việc, pháp lý và thời gian phản hồi của sàn. Ví dụ này cho thấy Lenix ghi nhận dấu vết—không phải mọi vụ đều thu hồi được.",
    },
    Security: {
      meta: {
        title: "Bảo mật & Kiểm toán | Lenix Protocol",
        description:
          "Kiểm toán smart contract CertiK, vận hành theo ISO 27001 và kiểm soát bảo mật cho hạ tầng điều tra và thu hồi của Lenix.",
      },
      hero: {
        eyebrow: "Bảo mật",
        title1: "Giao thức được kiểm toán. ",
        title2: "Kiểm soát có tài liệu.",
        subtitle:
          "Lenix kết hợp đánh giá smart contract bên thứ ba với thực hành bảo mật vận hành cho các đội xử lý quy trình thu hồi và lưu ký nhạy cảm.",
      },
      audit: {
        title: "Kiểm toán smart contract",
        desc: "Hợp đồng lõi trong luồng sản xuất đã được CertiK xem xét. Phạm vi bao gồm thành phần triển khai quan trọng và bề mặt tấn công đã biết.",
        certik_text:
          "CertiK xem xét smart contract Lenix về lỗ hổng phổ biến, kiểm soát truy cập và lỗi logic trong luồng token và vault.",
        certik_link: "Xem tổng quan công ty và tài liệu",
        items: {
          contracts: {
            title: "Phạm vi xem xét hợp đồng",
            desc: "Bán token, vault và module giao thức dùng trong luồng thanh toán và lưu ký thực tế.",
          },
          access: {
            title: "Kiểm soát truy cập",
            desc: "Quyền theo vai trò, yêu cầu multi-sig và đường nâng cấp khi áp dụng.",
          },
          monitoring: {
            title: "Giám sát liên tục",
            desc: "Triển khai sản xuất được giám sát tương tác bất thường và cảnh báo vận hành.",
          },
        },
      },
      iso: {
        title: "Vận hành theo ISO 27001",
        desc: "Lenix Protocol duy trì thực hành quản lý an ninh thông tin theo ISO 27001 cho dữ liệu khách hàng, tài liệu điều tra và hệ thống nội bộ.",
      },
      practices: {
        data: {
          title: "Xử lý dữ liệu",
          desc: "Tài liệu vụ việc được lưu với kiểm soát truy cập. Dữ liệu điều tra chỉ chia sẻ với bên được ủy quyền.",
        },
        incident: {
          title: "Ứng phó sự cố",
          desc: "Quy trình xác định cho sự kiện bảo mật ảnh hưởng dữ liệu khách hàng, hạ tầng giao thức hoặc quy trình điều tra.",
        },
        custody: {
          title: "Ran giới lưu ký",
          desc: "Lenix chuẩn bị bằng chứng và phối hợp lộ trình. Chúng tôi không giữ khóa ví hay seed phrase của khách hàng.",
        },
      },
      cta: {
        title: "Câu hỏi về tư thế bảo mật của chúng tôi?",
        subtitle: "Liên hệ đội ngũ để yêu cầu tài liệu hoặc đánh giá bảo mật doanh nghiệp.",
        btn_primary: "Bắt đầu vụ thu hồi",
        btn_secondary: "Liên hệ đội bảo mật",
      },
    },
  },
  zh: {
    mock_brand: "Lenix 商户",
    security_link: "安全",
    CaseStudy: {
      eyebrow: "案例示例",
      title1: "当被盗资金进入 ",
      title2: "中心化交易所",
      subtitle: "匿名化示例。标识已更改。流程具有代表性——不保证追回。",
      situation: {
        label: "情况",
        text: "企业钱包向钓鱼合约发送 USDC。数小时内，资金经两个中转钱包存入大型交易所。",
      },
      action: {
        label: "Lenix 做了什么",
        text: "我们绘制完整交易路径，标记充值地址，并为交易所合规团队准备含交易图谱与时间线的证据包。",
      },
      outcome: {
        label: "结果",
        text: "交易所合规部门受理材料。资金冻结待审核。法律顾问收到相同文档以并行推进法律程序。",
      },
      disclaimer:
        "结果因案件、司法管辖区及交易所响应时间而异。此示例展示 Lenix 如何记录链上轨迹——并非每个案件都能追回。",
    },
    Security: {
      meta: {
        title: "安全与审计 | Lenix Protocol",
        description: "CertiK 智能合约审计、ISO 27001 对齐运营及 Lenix 取证与追回基础设施的安全控制。",
      },
      hero: {
        eyebrow: "安全",
        title1: "经审计的协议。",
        title2: "有文档的控制措施。",
        subtitle: "Lenix 将第三方智能合约审查与运营安全实践结合，服务于处理敏感追回与托管流程的团队。",
      },
      audit: {
        title: "智能合约审计",
        desc: "生产流程中的核心合约已由 CertiK 审查。审计范围涵盖部署关键组件与已知攻击面。",
        certik_text: "CertiK 审查 Lenix 智能合约的常见漏洞、访问控制及代币与金库流程中的逻辑缺陷。",
        certik_link: "查看公司概览与文档",
        items: {
          contracts: {
            title: "合约审查范围",
            desc: "用于实时支付与托管路径的代币销售、金库及协议模块。",
          },
          access: {
            title: "访问控制",
            desc: "基于角色的权限、多签要求及适用的升级路径。",
          },
          monitoring: {
            title: "持续监控",
            desc: "监控生产部署中的异常合约交互与运营告警。",
          },
        },
      },
      iso: {
        title: "ISO 27001 对齐运营",
        desc: "Lenix Protocol 针对客户数据、调查材料及内部系统，维持与 ISO 27001 对齐的信息安全管理实践。",
      },
      practices: {
        data: {
          title: "数据处理",
          desc: "案件材料以访问控制存储。调查数据仅与授权方共享。",
        },
        incident: {
          title: "事件响应",
          desc: "针对影响客户数据、协议基础设施或调查流程的安全事件，有明确定义的处理程序。",
        },
        custody: {
          title: "托管边界",
          desc: "Lenix 准备证据并协调路径。我们不托管客户钱包密钥或助记词。",
        },
      },
      cta: {
        title: "对我们的安全态势有疑问？",
        subtitle: "联系团队获取文档或企业安全审查。",
        btn_primary: "发起追回案件",
        btn_secondary: "联系安全团队",
      },
    },
  },
  ar: {
    mock_brand: "تاجر Lenix",
    security_link: "الأمان",
    CaseStudy: {
      eyebrow: "مثال على حالة",
      title1: "عندما تصل الأموال المسروقة ",
      title2: "إلى منصة مركزية",
      subtitle: "مثال مجهول الهوية. تم تغيير المعرفات. العملية تمثيلية—وليست ضمانًا للاسترداد.",
      situation: {
        label: "الوضع",
        text: "أرسلت محفظة شركة USDC إلى عقد تصيد. خلال ساعات، انتقلت الأموال عبر محفظتين وسيطتين وأودعت في منصة كبرى.",
      },
      action: {
        label: "ما فعلته Lenix",
        text: "رسمنا مسار المعاملات بالكامل، حددنا عنوان الإيداع، وأعددنا حزمة أدلة برسوم بيانية وجدول زمني لفريق الامتثال في المنصة.",
      },
      outcome: {
        label: "النتيجة",
        text: "قبل مكتب الامتثال في المنصة الملف. جُمدت الأموال pending المراجعة. تلقى المستشار القانوني نفس الوثائق للإجراءات القانونية المتوازية.",
      },
      disclaimer:
        "تختلف النتائج حسب الحالة والاختصاص القضائي ووقت استجابة المنصة. يُظهر هذا المثال كيف توثق Lenix المسار—وليس كل حالة تنتهي بالاسترداد.",
    },
    Security: {
      meta: {
        title: "الأمان والتدقيق | Lenix Protocol",
        description:
          "تدقيق CertiK للعقود الذكية، وعمليات متوافقة مع ISO 27001، وضوابط أمنية لبنية Lenix للتحقيق والاسترداد.",
      },
      hero: {
        eyebrow: "الأمان",
        title1: "بروتوكول مدقق. ",
        title2: "ضوابط موثقة.",
        subtitle:
          "تجمع Lenix بين مراجعة طرف ثالث للعقود الذكية وممارسات أمن تشغيلية للفرق التي تتعامل مع سير عمل استرداد وحفظ حساس.",
      },
      audit: {
        title: "تدقيق العقود الذكية",
        desc: "تمت مراجعة العقود الأساسية في مسارات الإنتاج بواسطة CertiK. يغطي النطاق المكونات الحرجة وأسطح الهجوم المعروفة.",
        certik_text:
          "راجعت CertiK عقود Lenix الذكية بحثًا عن ثغرات شائعة ومشكلات التحكم بالوصول والأخطاء المنطقية في تدفقات الرمز والخزنة.",
        certik_link: "عرض نظرة عامة على الشركة والوثائق",
        items: {
          contracts: {
            title: "نطاق مراجعة العقود",
            desc: "بيع الرمز والخزنة ووحدات البروتوكول المستخدمة في مسارات الدفع والحفظ المباشرة.",
          },
          access: {
            title: "التحكم بالوصول",
            desc: "صلاحيات قائمة على الأدوار، متطلبات التوقيع المتعدد، ومسارات الترقية حيث ينطبق.",
          },
          monitoring: {
            title: "المراقبة المستمرة",
            desc: "تُراقب نشرات الإنتاج للتفاعلات غير الطبيعية والتنبيهات التشغيلية.",
          },
        },
      },
      iso: {
        title: "عمليات متوافقة مع ISO 27001",
        desc: "تحافظ Lenix Protocol على ممارسات إدارة أمن المعلومات المتوافقة مع ISO 27001 لبيانات العملاء ومواد التحقيق والأنظمة الداخلية.",
      },
      practices: {
        data: {
          title: "معالجة البيانات",
          desc: "تُخزن مواد الحالات بضوابط وصول. تُشارك بيانات التحقيق فقط مع الأطراف المصرح لها.",
        },
        incident: {
          title: "الاستجابة للحوادث",
          desc: "إجراءات محددة للأحداث الأمنية التي تؤثر على بيانات العملاء أو بنية البروتوكول أو سير عمل التحقيق.",
        },
        custody: {
          title: "حدود الحفظ",
          desc: "تُعد Lenix الأدلة وتنسق المسارات. لا نحتفظ بمفاتيح المحافظ أو عبارات الاسترداد للعملاء.",
        },
      },
      cta: {
        title: "أسئلة حول وضعنا الأمني؟",
        subtitle: "تواصل مع فريقنا لطلبات الوثائق أو مراجعات الأمان للمؤسسات.",
        btn_primary: "بدء حالة استرداد",
        btn_secondary: "تواصل مع فريق الأمان",
      },
    },
  },
  hi: {
    mock_brand: "Lenix मर्चेंट",
    security_link: "सुरक्षा",
    CaseStudy: {
      eyebrow: "केस उदाहरण",
      title1: "जब चोरी की गई राशि ",
      title2: "कस्टोडियल एक्सचेंज तक पहुँचती है",
      subtitle:
        "गुमनाम उदाहरण। पहचान बदली गई। प्रक्रिया प्रतिनिधि है—रिकवरी की गारंटी नहीं।",
      situation: {
        label: "स्थिति",
        text: "एक व्यापारिक वॉलेट ने USDC एक फ़िशिंग कॉन्ट्रैक्ट को भेजा। कुछ घंटों में धन दो मध्यस्थ वॉलेट से होकर बड़े एक्सचेंज में जमा हुआ।",
      },
      action: {
        label: "Lenix ने क्या किया",
        text: "हमने पूरा लेन-देन पATH मैप किया, जमा पता लेबल किया, और एक्सचेंज compliance टीम के लिए ट्रांज़ैक्शन ग्राफ और टाइमलाइन के साथ साक्ष्य पैकेट तैयार किया।",
      },
      outcome: {
        label: "परिणाम",
        text: "एक्सचेंज compliance डेस्क ने फाइलिंग स्वीकार की। समीक्षा तक धन फ्रोज़। काउंsel को समान दस्तावेज़ मिले।",
      },
      disclaimer:
        "परिणाम केस, अधिकार क्षेत्र और एक्सचेंज प्रतिक्रिया समय के अनुसार भिन्न होते हैं। यह उदाहरण दिखाता है कि Lenix ट्रेल कैसे दस्तावेज़ करता है—हर केस में रिकवरी नहीं होती।",
    },
    Security: {
      meta: {
        title: "सुरक्षा और ऑडिट | Lenix Protocol",
        description:
          "CertiK स्मार्ट कॉन्ट्रैक्ट ऑडिट, ISO 27001-संरेखित संचालन, और Lenix फ़ोरेंसिक व रिकवरी इन्फ्रास्ट्रक्चर के लिए सुरक्षा नियंत्रण।",
      },
      hero: {
        eyebrow: "सुरक्षा",
        title1: "ऑडिटेड प्रोटोकॉल। ",
        title2: "दस्तावेज़ित नियंत्रण।",
        subtitle:
          "Lenix संवेदनशील रिकवरी और कस्टडी वर्कफ़्लो वाली टीमों के लिए तृतीय-पक्ष स्मार्ट कॉन्ट्रैक्ट समीक्षा और परिचालन सुरक्षा प्रथाओं को जोड़ता है।",
      },
      audit: {
        title: "स्मार्ट कॉन्ट्रैक्ट ऑडिट",
        desc: "प्रोडक्शन फ़्लो में उपयोग किए गए मुख्य कॉन्ट्रैक्ट CertiK द्वारा समीक्षित हैं। ऑडिट स्कोप में deployment-महत्वपूर्ण घटक और ज्ञात हमले की सतहें शामिल हैं।",
        certik_text:
          "CertiK ने Lenix स्मार्ट कॉन्ट्रैक्ट की सामान्य कमजोरियों, एक्सेस नियंत्रण और टोकन/वॉल्ट फ़्लो में तार्किक दोषों की समीक्षा की।",
        certik_link: "कंपनी अवलोकन और दस्तावेज़ देखें",
        items: {
          contracts: {
            title: "कॉन्ट्रैक्ट समीक्षा स्कोप",
            desc: "लाइव भुगतान और कस्टडी पATH में उपयोग किए गए टोकन सेल, वॉल्ट और प्रोटोकॉल मॉड्यूल।",
          },
          access: {
            title: "एक्सेस नियंत्रण",
            desc: "भूमिका-आधारित अनुमतियाँ, multi-sig आवश्यकताएँ, और जहाँ लागू हो अपग्रेड पATH।",
          },
          monitoring: {
            title: "निरंतर निगरानी",
            desc: "प्रोडक्शन deployments में असामान्य कॉन्ट्रैक्ट इंटरैक्शन और परिचालन अलर्ट की निगरानी।",
          },
        },
      },
      iso: {
        title: "ISO 27001-संरेखित संचालन",
        desc: "Lenix Protocol क्लाइंट डेटा, जांच सामग्री और आंतरिक सिस्टम के लिए ISO 27001 के अनुरूप सूचना सुरक्षा प्रबंधन प्रथाएँ बनाए रखता है।",
      },
      practices: {
        data: {
          title: "डेटा हैंडलिंग",
          desc: "केस सामग्री एक्सेस नियंत्रण के साथ संग्रहीत। जांच डेटा केवल अधिकृत पक्षों के साथ साझा।",
        },
        incident: {
          title: "घटना प्रतिक्रिया",
          desc: "क्लाइंट डेटा, प्रोटोकॉल इन्फ्रास्ट्रक्चर या जांच वर्कफ़्लो को प्रभावित करने वाली सुरक्षा घटनाओं के लिए परिभाषित प्रक्रियाएँ।",
        },
        custody: {
          title: "कस्टडी सीमाएँ",
          desc: "Lenix साक्ष्य तैयार करता है और पATH समन्वय करता है। हम क्लाइंट वॉलेट कीज़ या seed phrases की कस्टडी नहीं लेते।",
        },
      },
      cta: {
        title: "हमारी सुरक्षा स्थिति के बारे में प्रश्न?",
        subtitle: "दस्तावेज़ अनुरोध या एंटरप्राइज़ सुरक्षा समीक्षा के लिए हमारी टीम से संपर्क करें।",
        btn_primary: "रिकवरी केस शुरू करें",
        btn_secondary: "सुरक्षा टीम से संपर्क करें",
      },
    },
  },
  tr: {
    mock_brand: "Lenix Satıcı",
    security_link: "Güvenlik",
    CaseStudy: {
      eyebrow: "Vaka örneği",
      title1: "Çalıntı fonlar ",
      title2: "merkezi bir borsaya ulaştığında",
      subtitle:
        "Anonimleştirilmiş örnek. Tanımlayıcılar değiştirildi. Süreç temsilidir—kurtarma garantisi değildir.",
      situation: {
        label: "Durum",
        text: "Bir iş cüzdanı USDC'yi bir oltalama sözleşmesine gönderdi. Saatler içinde fonlar iki ara cüzdan üzerinden büyük bir borsaya yatırıldı.",
      },
      action: {
        label: "Lenix'in yaptığı",
        text: "Tam işlem yolunu haritaladık, yatırma adresini etiketledik ve borsa uyum ekibi için işlem grafikleri ve zaman çizelgesi içeren kanıt paketi hazırladık.",
      },
      outcome: {
        label: "Sonuç",
        text: "Borsa uyum masası başvuruyu kabul etti. Fonlar inceleme beklerken donduruldu. Hukuk danışmanları paralel adımlar için aynı belgeleri aldı.",
      },
      disclaimer:
        "Sonuçlar vaka, yargı alanı ve borsa yanıt süresine göre değişir. Bu örnek Lenix'in izi nasıl belgelediğini gösterir—her vaka kurtarmayla bitmez.",
    },
    Security: {
      meta: {
        title: "Güvenlik ve Denetimler | Lenix Protocol",
        description:
          "CertiK akıllı sözleşme denetimleri, ISO 27001 uyumlu operasyonlar ve Lenix adli bilişim ve kurtarma altyapısı için güvenlik kontrolleri.",
      },
      hero: {
        eyebrow: "Güvenlik",
        title1: "Denetlenmiş protokol. ",
        title2: "Belgelendirilmiş kontroller.",
        subtitle:
          "Lenix, hassas kurtarma ve saklama iş akışlarını yöneten ekipler için üçüncü taraf akıllı sözleşme incelemesini operasyonel güvenlik uygulamalarıyla birleştirir.",
      },
      audit: {
        title: "Akıllı sözleşme denetimi",
        desc: "Üretim akışlarındaki temel sözleşmeler CertiK tarafından incelendi. Denetim kapsamı dağıtım açısından kritik bileşenleri ve bilinen saldırı yüzeylerini kapsar.",
        certik_text:
          "CertiK, Lenix akıllı sözleşmelerini yaygın güvenlik açıkları, erişim kontrolü ve token/vault akışlarındaki mantık hataları açısından inceledi.",
        certik_link: "Şirket özeti ve belgeleri görüntüle",
        items: {
          contracts: {
            title: "Sözleşme inceleme kapsamı",
            desc: "Canlı ödeme ve saklama yollarında kullanılan token satışı, vault ve protokol modülleri.",
          },
          access: {
            title: "Erişim kontrolü",
            desc: "Rol tabanlı izinler, multi-sig gereksinimleri ve uygun olduğunda yükseltme yolları.",
          },
          monitoring: {
            title: "Sürekli izleme",
            desc: "Üretim dağıtımları anormal sözleşme etkileşimleri ve operasyonel uyarılar için izlenir.",
          },
        },
      },
      iso: {
        title: "ISO 27001 uyumlu operasyonlar",
        desc: "Lenix Protocol, müşteri verileri, soruşturma materyalleri ve dahili sistemler için ISO 27001 ile uyumlu bilgi güvenliği yönetimi uygulamalarını sürdürür.",
      },
      practices: {
        data: {
          title: "Veri işleme",
          desc: "Vaka materyalleri erişim kontrolleriyle saklanır. Soruşturma verileri yalnızca yetkili taraflarla paylaşılır.",
        },
        incident: {
          title: "Olay müdahalesi",
          desc: "Müşteri verilerini, protokol altyapısını veya soruşturma iş akışlarını etkileyen güvenlik olayları için tanımlı prosedürler.",
        },
        custody: {
          title: "Saklama sınırları",
          desc: "Lenix kanıt hazırlar ve yolları koordine eder. Müşteri cüzdan anahtarlarını veya seed ifadelerini saklamayız.",
        },
      },
      cta: {
        title: "Güvenlik duruşumuz hakkında sorularınız mı var?",
        subtitle: "Belge talepleri veya kurumsal güvenlik incelemeleri için ekibimizle iletişime geçin.",
        btn_primary: "Kurtarma vakası başlat",
        btn_secondary: "Güvenlik ekibiyle iletişim",
      },
    },
  },
  tl: {
    mock_brand: "Lenix Merchant",
    security_link: "Seguridad",
    CaseStudy: {
      eyebrow: "Halimbawang kaso",
      title1: "Kapag ang ninakaw na pondo ay umabot ",
      title2: "sa custodial exchange",
      subtitle:
        "Anonymized na halimbawa. Binago ang mga identifier. Representatibo ang proseso—hindi garantiya ng recovery.",
      situation: {
        label: "Sitwasyon",
        text: "Isang business wallet ang nagpadala ng USDC sa phishing contract. Sa loob ng ilang oras, dumaan ang pondo sa dalawang intermediary wallet at na-deposit sa malaking exchange.",
      },
      action: {
        label: "Ginawa ng Lenix",
        text: "In-map namin ang buong transaction path, na-label ang deposit address, at naghanda ng evidence packet na may transaction graphs at timeline para sa compliance team ng exchange.",
      },
      outcome: {
        label: "Resulta",
        text: "Tinanggap ng exchange compliance desk ang filing. Na-freeze ang pondo habang nire-review. Natanggap ng counsel ang parehong dokumentasyon para sa parallel legal steps.",
      },
      disclaimer:
        "Nag-iiba ang resulta ayon sa kaso, hurisdiksyon, at response time ng exchange. Ipinapakita ng halimbawang ito kung paano idinodokumento ng Lenix ang trail—hindi lahat ng kaso ay nauuwi sa recovery.",
    },
    Security: {
      meta: {
        title: "Seguridad at Audit | Lenix Protocol",
        description:
          "CertiK smart contract audit, ISO 27001-aligned operations, at security controls para sa Lenix forensics at recovery infrastructure.",
      },
      hero: {
        eyebrow: "Seguridad",
        title1: "Na-audit na protocol. ",
        title2: "May dokumentasyon na kontrol.",
        subtitle:
          "Pinagsasama ng Lenix ang third-party smart contract review at operational security practices para sa mga team na humahawak ng sensitibong recovery at custody workflows.",
      },
      audit: {
        title: "Smart contract audit",
        desc: "Na-review ng CertiK ang core contracts sa production flows. Saklaw ng audit ang deployment-critical components at kilalang attack surfaces.",
        certik_text:
          "Tiningnan ng CertiK ang Lenix smart contracts para sa common vulnerabilities, access control, at logic flaws sa token at vault flows.",
        certik_link: "Tingnan ang company overview at documentation",
        items: {
          contracts: {
            title: "Contract review scope",
            desc: "Token sale, vault, at protocol modules na ginagamit sa live payment at custody paths.",
          },
          access: {
            title: "Access control",
            desc: "Role-based permissions, multi-sig requirements, at upgrade paths kung applicable.",
          },
          monitoring: {
            title: "Tuloy-tuloy na monitoring",
            desc: "Minomonitor ang production deployments para sa anomalous contract interactions at operational alerts.",
          },
        },
      },
      iso: {
        title: "ISO 27001-aligned operations",
        desc: "Pinapanatili ng Lenix Protocol ang information security management practices na aligned sa ISO 27001 para sa client data, investigation materials, at internal systems.",
      },
      practices: {
        data: {
          title: "Data handling",
          desc: "Naka-store ang case materials na may access controls. Ibinabahagi lang ang investigation data sa authorized parties.",
        },
        incident: {
          title: "Incident response",
          desc: "May tinukoy na procedures para sa security events na nakakaapekto sa client data, protocol infrastructure, o investigation workflows.",
        },
        custody: {
          title: "Custody boundaries",
          desc: "Naghahanda ang Lenix ng ebidensya at nagko-coordinate ng pathways. Hindi kami kumukuha ng custody ng client wallet keys o seed phrases.",
        },
      },
      cta: {
        title: "May tanong tungkol sa security posture namin?",
        subtitle: "Makipag-ugnayan sa team para sa documentation requests o enterprise security reviews.",
        btn_primary: "Simulan ang recovery case",
        btn_secondary: "Makipag-ugnayan sa security team",
      },
    },
  },
};

for (const locale of locales) {
  const filePath = path.join(root, "messages", locale, "common.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const patch = patches[locale];

  data.Footer.links.security = patch.security_link;
  data.Home.Merchant.mock_brand = patch.mock_brand;

  const cta = data.Home.Cta;
  delete data.Home.Cta;
  data.Home.CaseStudy = patch.CaseStudy;
  data.Home.Cta = cta;

  data.Security = patch.Security;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
  console.log(`Updated ${locale}/common.json`);
}

console.log("Done.");
