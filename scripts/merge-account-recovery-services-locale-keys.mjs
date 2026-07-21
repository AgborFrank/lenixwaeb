import fs from "fs";
import path from "path";

const root = path.join(import.meta.dirname, "..");
const locales = ["fr", "es", "de", "ar", "pt", "zh", "it", "vi", "tl", "tr", "hi", "id"];

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

const enSource = JSON.parse(
  fs.readFileSync(path.join(root, "messages", "en", "common.json"), "utf8"),
);
const accountRecoveryServicesEn = enSource.AccountRecoveryServices;

const translations = {
  fr: {
    AccountRecoveryServices: {
      page: {
        title: "Services de récupération",
        subtitle:
          "Soumettez une demande de récupération pour des actifs crypto perdus ou volés. Notre équipe forensique évaluera votre dossier et vous contactera sous 24 à 48 heures.",
        process_title: "Processus",
        form_title: "Détails de récupération d'actifs et forensique",
        form_subtitle:
          "Nous vous aidons à tracer et récupérer des actifs crypto perdus et à constituer des preuves vérifiées pour une récupération légale des fonds.",
      },
      process: {
        assessment: {
          title: "Évaluation",
          description: "Nous analysons la piste et évaluons la récupérabilité.",
        },
        strategy: {
          title: "Stratégie",
          description: "Plan sur mesure avec appui juridique et forensique.",
        },
        recovery: {
          title: "Récupération",
          description: "Nous mobilisons les exchanges et les autorités pour récupérer les fonds.",
        },
        return: {
          title: "Restitution",
          description: "Fonds transférés vers votre portefeuille vérifié.",
        },
      },
      form: {
        name: "Nom",
        name_placeholder: "ex. Jean Dupont",
        transaction_hash: "Hash de transaction / Adresse de portefeuille",
        transaction_hash_placeholder: "Saisissez un hash ou une adresse (ex. 0x1234...)",
        amount_stolen: "Montant approximatif volé",
        amount_stolen_placeholder: "Saisissez le montant estimé (ex. 200000)",
        incident_summary: "Résumé de l'incident",
        incident_summary_placeholder: "ex. Des fonds ont été volés via une arnaque au phishing...",
        evidence: "Capture d'écran ou autre preuve à l'appui de la demande",
        phone_number: "Numéro de téléphone",
        blockchain: "Sélectionner la blockchain",
        blockchain_placeholder: "Sélectionner une blockchain",
        currency: "Sélectionner la devise",
        currency_placeholder: "Sélectionner une devise",
        privacy_prefix:
          "Lenix Protocol a besoin de vos coordonnées pour vous contacter au sujet de votre dossier de récupération. Pour plus de détails, consultez notre",
        privacy_policy: "Politique de confidentialité",
        privacy_suffix: ".",
        submit: "Soumettre la demande de récupération",
        submitting: "Envoi en cours...",
      },
      blockchains: {
        BTC: "Bitcoin (BTC)",
        ETH: "Ethereum (ETH)",
        SOL: "Solana (SOL)",
        TRX: "Tron (TRX)",
        BNB: "Binance Smart Chain (BNB)",
        MATIC: "Polygon Mainnet (MATIC)",
        AVAX: "Avalanche C-Chain (AVAX)",
        ARB: "Arbitrum One (ARB)",
        BASE: "Base (BASE)",
        FANTOM: "Fantom (Fantom)",
        GNOSIS: "Gnosis Chain (GNOSIS)",
        KAVA: "Kava (KAVA)",
        POL: "Polkadot (POL)",
        SUI: "Sui (SUI)",
        OTHER: "Autre",
      },
      success: {
        title: "Demande envoyée",
        description:
          "Notre équipe de récupération examinera votre dossier et vous contactera sous 24 à 48 heures.",
        submit_another: "Soumettre une autre demande",
      },
      toast: {
        required_fields: "Veuillez remplir tous les champs obligatoires",
        submit_failed: "Échec de l'envoi de la demande de récupération",
        submit_success:
          "Demande de récupération envoyée. Notre équipe vous contactera prochainement.",
      },
    },
  },
  es: {
    AccountRecoveryServices: {
      page: {
        title: "Servicios de recuperación",
        subtitle:
          "Envíe una solicitud de recuperación de activos cripto perdidos o robados. Nuestro equipo forense evaluará su caso y se pondrá en contacto en 24–48 horas.",
        process_title: "Proceso",
        form_title: "Detalles de recuperación de activos y forense",
        form_subtitle:
          "Le ayudamos a rastrear y recuperar activos cripto perdidos y a reunir pruebas verificadas para la recuperación legal de fondos.",
      },
      process: {
        assessment: {
          title: "Evaluación",
          description: "Analizamos el rastro y evaluamos la recuperabilidad.",
        },
        strategy: {
          title: "Estrategia",
          description: "Plan personalizado con apoyo legal y forense.",
        },
        recovery: {
          title: "Recuperación",
          description: "Contactamos exchanges y autoridades para recuperar los fondos.",
        },
        return: {
          title: "Devolución",
          description: "Fondos transferidos a su cartera verificada.",
        },
      },
      form: {
        name: "Nombre",
        name_placeholder: "p. ej. Juan Pérez",
        transaction_hash: "Hash de transacción / Dirección de cartera",
        transaction_hash_placeholder: "Introduzca un hash o dirección (p. ej. 0x1234...)",
        amount_stolen: "Importe aproximado robado",
        amount_stolen_placeholder: "Introduzca el importe estimado (p. ej. 200000)",
        incident_summary: "Resumen del incidente",
        incident_summary_placeholder: "p. ej. Los fondos fueron robados mediante un phishing...",
        evidence: "Captura de pantalla u otra prueba que respalde la reclamación",
        phone_number: "Número de teléfono",
        blockchain: "Seleccionar blockchain",
        blockchain_placeholder: "Seleccionar blockchain",
        currency: "Seleccionar moneda",
        currency_placeholder: "Seleccionar moneda",
        privacy_prefix:
          "Lenix Protocol necesita sus datos de contacto para comunicarse sobre su caso de recuperación. Para más información, consulte nuestra",
        privacy_policy: "Política de privacidad",
        privacy_suffix: ".",
        submit: "Enviar solicitud de recuperación",
        submitting: "Enviando...",
      },
      blockchains: {
        BTC: "Bitcoin (BTC)",
        ETH: "Ethereum (ETH)",
        SOL: "Solana (SOL)",
        TRX: "Tron (TRX)",
        BNB: "Binance Smart Chain (BNB)",
        MATIC: "Polygon Mainnet (MATIC)",
        AVAX: "Avalanche C-Chain (AVAX)",
        ARB: "Arbitrum One (ARB)",
        BASE: "Base (BASE)",
        FANTOM: "Fantom (Fantom)",
        GNOSIS: "Gnosis Chain (GNOSIS)",
        KAVA: "Kava (KAVA)",
        POL: "Polkadot (POL)",
        SUI: "Sui (SUI)",
        OTHER: "Otro",
      },
      success: {
        title: "Solicitud enviada",
        description:
          "Nuestro equipo de recuperación revisará su caso y se pondrá en contacto en 24–48 horas.",
        submit_another: "Enviar otra solicitud",
      },
      toast: {
        required_fields: "Complete todos los campos obligatorios",
        submit_failed: "No se pudo enviar la solicitud de recuperación",
        submit_success:
          "Solicitud de recuperación enviada. Nuestro equipo se pondrá en contacto pronto.",
      },
    },
  },
  de: {
    AccountRecoveryServices: {
      page: {
        title: "Wiederherstellungsdienste",
        subtitle:
          "Reichen Sie eine Wiederherstellungsanfrage für verlorene oder gestohlene Krypto-Assets ein. Unser Forensik-Team prüft Ihren Fall und meldet sich innerhalb von 24–48 Stunden.",
        process_title: "Ablauf",
        form_title: "Details zur Asset-Wiederherstellung und Forensik",
        form_subtitle:
          "Wir helfen Ihnen, verlorene Krypto-Assets nachzuverfolgen und wiederherzustellen sowie verifizierte Beweise für die rechtmäßige Rückführung von Geldern zu erstellen.",
      },
      process: {
        assessment: {
          title: "Bewertung",
          description: "Wir analysieren die Spur und bewerten die Wiederherstellbarkeit.",
        },
        strategy: {
          title: "Strategie",
          description: "Maßgeschneiderter Plan mit rechtlicher und forensischer Unterstützung.",
        },
        recovery: {
          title: "Wiederherstellung",
          description: "Wir wenden uns an Börsen und Behörden, um Gelder zurückzuholen.",
        },
        return: {
          title: "Rückführung",
          description: "Gelder werden an Ihre verifizierte Wallet überwiesen.",
        },
      },
      form: {
        name: "Name",
        name_placeholder: "z. B. Max Mustermann",
        transaction_hash: "Transaktions-Hash / Wallet-Adresse",
        transaction_hash_placeholder: "Hash oder Adresse eingeben (z. B. 0x1234...)",
        amount_stolen: "Ungefährer gestohlener Betrag",
        amount_stolen_placeholder: "Geschätzten Betrag eingeben (z. B. 200000)",
        incident_summary: "Vorfallzusammenfassung",
        incident_summary_placeholder: "z. B. Gelder wurden durch Phishing-Betrug gestohlen...",
        evidence: "Screenshot oder anderer Nachweis zur Unterstützung der Meldung",
        phone_number: "Telefonnummer",
        blockchain: "Blockchain auswählen",
        blockchain_placeholder: "Blockchain auswählen",
        currency: "Währung auswählen",
        currency_placeholder: "Währung auswählen",
        privacy_prefix:
          "Lenix Protocol benötigt Ihre Kontaktdaten, um Sie zu Ihrem Wiederherstellungsfall zu kontaktieren. Details finden Sie in unserer",
        privacy_policy: "Datenschutzrichtlinie",
        privacy_suffix: ".",
        submit: "Wiederherstellungsanfrage senden",
        submitting: "Wird gesendet...",
      },
      blockchains: {
        BTC: "Bitcoin (BTC)",
        ETH: "Ethereum (ETH)",
        SOL: "Solana (SOL)",
        TRX: "Tron (TRX)",
        BNB: "Binance Smart Chain (BNB)",
        MATIC: "Polygon Mainnet (MATIC)",
        AVAX: "Avalanche C-Chain (AVAX)",
        ARB: "Arbitrum One (ARB)",
        BASE: "Base (BASE)",
        FANTOM: "Fantom (Fantom)",
        GNOSIS: "Gnosis Chain (GNOSIS)",
        KAVA: "Kava (KAVA)",
        POL: "Polkadot (POL)",
        SUI: "Sui (SUI)",
        OTHER: "Sonstige",
      },
      success: {
        title: "Anfrage gesendet",
        description:
          "Unser Wiederherstellungsteam prüft Ihren Fall und meldet sich innerhalb von 24–48 Stunden.",
        submit_another: "Weitere Anfrage senden",
      },
      toast: {
        required_fields: "Bitte füllen Sie alle Pflichtfelder aus",
        submit_failed: "Wiederherstellungsanfrage konnte nicht gesendet werden",
        submit_success:
          "Wiederherstellungsanfrage gesendet. Unser Team wird sich in Kürze bei Ihnen melden.",
      },
    },
  },
  ar: {
    AccountRecoveryServices: {
      page: {
        title: "خدمات الاسترداد",
        subtitle:
          "قدّم طلب استرداد للأصول الرقمية المفقودة أو المسروقة. سيقيّم فريقنا الجنائي حالتك ويتواصل معك خلال 24–48 ساعة.",
        process_title: "العملية",
        form_title: "تفاصيل استرداد الأصول والتحليل الجنائي",
        form_subtitle:
          "نساعدك على تتبع واسترداد الأصول الرقمية المفقودة وبناء أدلة موثّقة لاسترداد الأموال وفق القانون.",
      },
      process: {
        assessment: {
          title: "التقييم",
          description: "نحلّل مسار الأموال ونقيّم إمكانية الاسترداد.",
        },
        strategy: {
          title: "الاستراتيجية",
          description: "خطة مخصّصة بدعم قانوني وجنائي.",
        },
        recovery: {
          title: "الاسترداد",
          description: "نتواصل مع المنصات والجهات المختصة لاسترجاع الأموال.",
        },
        return: {
          title: "الإرجاع",
          description: "تحويل الأموال إلى محفظتك الموثّقة.",
        },
      },
      form: {
        name: "الاسم",
        name_placeholder: "مثال: أحمد محمد",
        transaction_hash: "تجزئة المعاملة / عنوان المحفظة",
        transaction_hash_placeholder: "أدخل تجزئة أو عنوانًا (مثال: 0x1234...)",
        amount_stolen: "المبلغ التقريبي المسروق",
        amount_stolen_placeholder: "أدخل المبلغ التقديري (مثال: 200000)",
        incident_summary: "ملخص الحادث",
        incident_summary_placeholder: "مثال: سُرقت الأموال عبر عملية تصيّد احتيالي...",
        evidence: "لقطة شاشة أو دليل آخر يدعم المطالبة",
        phone_number: "رقم الهاتف",
        blockchain: "اختر البلوك تشين",
        blockchain_placeholder: "اختر البلوك تشين",
        currency: "اختر العملة",
        currency_placeholder: "اختر العملة",
        privacy_prefix:
          "يحتاج Lenix Protocol إلى بيانات الاتصال الخاصة بك للتواصل بشأن حالة الاسترداد. للتفاصيل، راجع",
        privacy_policy: "سياسة الخصوصية",
        privacy_suffix: ".",
        submit: "إرسال طلب الاسترداد",
        submitting: "جارٍ الإرسال...",
      },
      blockchains: {
        BTC: "Bitcoin (BTC)",
        ETH: "Ethereum (ETH)",
        SOL: "Solana (SOL)",
        TRX: "Tron (TRX)",
        BNB: "Binance Smart Chain (BNB)",
        MATIC: "Polygon Mainnet (MATIC)",
        AVAX: "Avalanche C-Chain (AVAX)",
        ARB: "Arbitrum One (ARB)",
        BASE: "Base (BASE)",
        FANTOM: "Fantom (Fantom)",
        GNOSIS: "Gnosis Chain (GNOSIS)",
        KAVA: "Kava (KAVA)",
        POL: "Polkadot (POL)",
        SUI: "Sui (SUI)",
        OTHER: "أخرى",
      },
      success: {
        title: "تم إرسال الطلب",
        description: "سيراجع فريق الاسترداد حالتك ويتواصل معك خلال 24–48 ساعة.",
        submit_another: "إرسال طلب آخر",
      },
      toast: {
        required_fields: "يرجى تعبئة جميع الحقول المطلوبة",
        submit_failed: "تعذّر إرسال طلب الاسترداد",
        submit_success: "تم إرسال طلب الاسترداد. سيتواصل فريقنا معك قريبًا.",
      },
    },
  },
  pt: {
    AccountRecoveryServices: {
      page: {
        title: "Serviços de recuperação",
        subtitle:
          "Envie um pedido de recuperação de ativos cripto perdidos ou roubados. A nossa equipa forense avaliará o seu caso e entrará em contacto em 24–48 horas.",
        process_title: "Processo",
        form_title: "Detalhes de recuperação de ativos e forense",
        form_subtitle:
          "Ajudamo-lo a rastrear e recuperar ativos cripto perdidos e a reunir provas verificadas para a recuperação legal de fundos.",
      },
      process: {
        assessment: {
          title: "Avaliação",
          description: "Analisamos o rasto e avaliamos a recuperabilidade.",
        },
        strategy: {
          title: "Estratégia",
          description: "Plano personalizado com apoio legal e forense.",
        },
        recovery: {
          title: "Recuperação",
          description: "Contactamos exchanges e autoridades para recuperar os fundos.",
        },
        return: {
          title: "Devolução",
          description: "Fundos transferidos para a sua carteira verificada.",
        },
      },
      form: {
        name: "Nome",
        name_placeholder: "ex. João Silva",
        transaction_hash: "Hash da transação / Endereço da carteira",
        transaction_hash_placeholder: "Introduza um hash ou endereço (ex. 0x1234...)",
        amount_stolen: "Montante aproximado roubado",
        amount_stolen_placeholder: "Introduza o montante estimado (ex. 200000)",
        incident_summary: "Resumo do incidente",
        incident_summary_placeholder: "ex. Os fundos foram roubados num esquema de phishing...",
        evidence: "Captura de ecrã ou outra prova que suporte a reclamação",
        phone_number: "Número de telefone",
        blockchain: "Selecionar blockchain",
        blockchain_placeholder: "Selecionar blockchain",
        currency: "Selecionar moeda",
        currency_placeholder: "Selecionar moeda",
        privacy_prefix:
          "O Lenix Protocol precisa dos seus dados de contacto para falar consigo sobre o seu caso de recuperação. Para mais informações, consulte a nossa",
        privacy_policy: "Política de Privacidade",
        privacy_suffix: ".",
        submit: "Enviar pedido de recuperação",
        submitting: "A enviar...",
      },
      blockchains: {
        BTC: "Bitcoin (BTC)",
        ETH: "Ethereum (ETH)",
        SOL: "Solana (SOL)",
        TRX: "Tron (TRX)",
        BNB: "Binance Smart Chain (BNB)",
        MATIC: "Polygon Mainnet (MATIC)",
        AVAX: "Avalanche C-Chain (AVAX)",
        ARB: "Arbitrum One (ARB)",
        BASE: "Base (BASE)",
        FANTOM: "Fantom (Fantom)",
        GNOSIS: "Gnosis Chain (GNOSIS)",
        KAVA: "Kava (KAVA)",
        POL: "Polkadot (POL)",
        SUI: "Sui (SUI)",
        OTHER: "Outro",
      },
      success: {
        title: "Pedido enviado",
        description:
          "A nossa equipa de recuperação analisará o seu caso e entrará em contacto em 24–48 horas.",
        submit_another: "Enviar outro pedido",
      },
      toast: {
        required_fields: "Preencha todos os campos obrigatórios",
        submit_failed: "Falha ao enviar o pedido de recuperação",
        submit_success:
          "Pedido de recuperação enviado. A nossa equipa entrará em contacto em breve.",
      },
    },
  },
  zh: {
    AccountRecoveryServices: {
      page: {
        title: "资产恢复服务",
        subtitle:
          "提交丢失或被盗加密资产的恢复申请。我们的取证团队将评估您的案件，并在 24–48 小时内与您联系。",
        process_title: "流程",
        form_title: "资产恢复与取证详情",
        form_subtitle: "我们协助您追踪并恢复丢失的加密资产，并构建经核实的证据以支持合法资金追回。",
      },
      process: {
        assessment: {
          title: "评估",
          description: "我们分析资金轨迹并评估可恢复性。",
        },
        strategy: {
          title: "策略",
          description: "定制方案，提供法律与取证支持。",
        },
        recovery: {
          title: "恢复",
          description: "我们与交易所及监管机构协作以追回资金。",
        },
        return: {
          title: "返还",
          description: "资金转入您已验证的钱包。",
        },
      },
      form: {
        name: "姓名",
        name_placeholder: "例如：张三",
        transaction_hash: "交易哈希 / 钱包地址",
        transaction_hash_placeholder: "输入哈希或地址（例如 0x1234...）",
        amount_stolen: "被盗大致金额",
        amount_stolen_placeholder: "输入估计金额（例如 200000）",
        incident_summary: "事件摘要",
        incident_summary_placeholder: "例如：资金通过钓鱼诈骗被盗...",
        evidence: "截图或其他支持索赔的证据",
        phone_number: "电话号码",
        blockchain: "选择区块链",
        blockchain_placeholder: "选择区块链",
        currency: "选择币种",
        currency_placeholder: "选择币种",
        privacy_prefix:
          "Lenix Protocol 需要您的联系方式以便就恢复案件与您沟通。详情请参阅我们的",
        privacy_policy: "隐私政策",
        privacy_suffix: "。",
        submit: "提交恢复申请",
        submitting: "提交中...",
      },
      blockchains: {
        BTC: "Bitcoin (BTC)",
        ETH: "Ethereum (ETH)",
        SOL: "Solana (SOL)",
        TRX: "Tron (TRX)",
        BNB: "Binance Smart Chain (BNB)",
        MATIC: "Polygon Mainnet (MATIC)",
        AVAX: "Avalanche C-Chain (AVAX)",
        ARB: "Arbitrum One (ARB)",
        BASE: "Base (BASE)",
        FANTOM: "Fantom (Fantom)",
        GNOSIS: "Gnosis Chain (GNOSIS)",
        KAVA: "Kava (KAVA)",
        POL: "Polkadot (POL)",
        SUI: "Sui (SUI)",
        OTHER: "其他",
      },
      success: {
        title: "申请已提交",
        description: "我们的恢复团队将审核您的案件，并在 24–48 小时内与您联系。",
        submit_another: "提交另一份申请",
      },
      toast: {
        required_fields: "请填写所有必填字段",
        submit_failed: "恢复申请提交失败",
        submit_success: "恢复申请已提交。我们的团队将尽快与您联系。",
      },
    },
  },
  it: {
    AccountRecoveryServices: {
      page: {
        title: "Servizi di recupero",
        subtitle:
          "Invia una richiesta di recupero per asset crypto persi o rubati. Il nostro team forense valuterà il tuo caso e ti contatterà entro 24–48 ore.",
        process_title: "Processo",
        form_title: "Dettagli recupero asset e forensics",
        form_subtitle:
          "Ti aiutiamo a tracciare e recuperare asset crypto persi e a costruire prove verificate per il recupero legale dei fondi.",
      },
      process: {
        assessment: {
          title: "Valutazione",
          description: "Analizziamo la traccia e valutiamo la recuperabilità.",
        },
        strategy: {
          title: "Strategia",
          description: "Piano su misura con supporto legale e forense.",
        },
        recovery: {
          title: "Recupero",
          description: "Coinvolgiamo exchange e autorità per recuperare i fondi.",
        },
        return: {
          title: "Restituzione",
          description: "Fondi trasferiti al tuo wallet verificato.",
        },
      },
      form: {
        name: "Nome",
        name_placeholder: "es. Mario Rossi",
        transaction_hash: "Hash transazione / Indirizzo wallet",
        transaction_hash_placeholder: "Inserisci un hash o un indirizzo (es. 0x1234...)",
        amount_stolen: "Importo approssimativo rubato",
        amount_stolen_placeholder: "Inserisci l'importo stimato (es. 200000)",
        incident_summary: "Riepilogo dell'incidente",
        incident_summary_placeholder: "es. I fondi sono stati rubati tramite phishing...",
        evidence: "Screenshot o altra prova a supporto della richiesta",
        phone_number: "Numero di telefono",
        blockchain: "Seleziona blockchain",
        blockchain_placeholder: "Seleziona blockchain",
        currency: "Seleziona valuta",
        currency_placeholder: "Seleziona valuta",
        privacy_prefix:
          "Lenix Protocol ha bisogno dei tuoi contatti per informarti sul caso di recupero. Per i dettagli, consulta la nostra",
        privacy_policy: "Informativa sulla privacy",
        privacy_suffix: ".",
        submit: "Invia richiesta di recupero",
        submitting: "Invio in corso...",
      },
      blockchains: {
        BTC: "Bitcoin (BTC)",
        ETH: "Ethereum (ETH)",
        SOL: "Solana (SOL)",
        TRX: "Tron (TRX)",
        BNB: "Binance Smart Chain (BNB)",
        MATIC: "Polygon Mainnet (MATIC)",
        AVAX: "Avalanche C-Chain (AVAX)",
        ARB: "Arbitrum One (ARB)",
        BASE: "Base (BASE)",
        FANTOM: "Fantom (Fantom)",
        GNOSIS: "Gnosis Chain (GNOSIS)",
        KAVA: "Kava (KAVA)",
        POL: "Polkadot (POL)",
        SUI: "Sui (SUI)",
        OTHER: "Altro",
      },
      success: {
        title: "Richiesta inviata",
        description:
          "Il nostro team di recupero esaminerà il tuo caso e ti contatterà entro 24–48 ore.",
        submit_another: "Invia un'altra richiesta",
      },
      toast: {
        required_fields: "Compila tutti i campi obbligatori",
        submit_failed: "Impossibile inviare la richiesta di recupero",
        submit_success:
          "Richiesta di recupero inviata. Il nostro team ti contatterà a breve.",
      },
    },
  },
  vi: {
    AccountRecoveryServices: {
      page: {
        title: "Dịch vụ khôi phục",
        subtitle:
          "Gửi yêu cầu khôi phục tài sản crypto bị mất hoặc bị đánh cắp. Đội forensics sẽ đánh giá hồ sơ và liên hệ với bạn trong 24–48 giờ.",
        process_title: "Quy trình",
        form_title: "Chi tiết khôi phục tài sản và forensics",
        form_subtitle:
          "Chúng tôi giúp bạn truy vết và khôi phục tài sản crypto bị mất, đồng thời xây dựng bằng chứng đã xác minh cho việc thu hồi tiền theo pháp luật.",
      },
      process: {
        assessment: {
          title: "Đánh giá",
          description: "Chúng tôi phân tích dấu vết và đánh giá khả năng khôi phục.",
        },
        strategy: {
          title: "Chiến lược",
          description: "Kế hoạch tùy chỉnh với hỗ trợ pháp lý và forensics.",
        },
        recovery: {
          title: "Khôi phục",
          description: "Chúng tôi phối hợp với sàn giao dịch và cơ quan chức năng để thu hồi tiền.",
        },
        return: {
          title: "Hoàn trả",
          description: "Chuyển tiền vào ví đã xác minh của bạn.",
        },
      },
      form: {
        name: "Họ và tên",
        name_placeholder: "vd. Nguyễn Văn A",
        transaction_hash: "Hash giao dịch / Địa chỉ ví",
        transaction_hash_placeholder: "Nhập hash hoặc địa chỉ (vd. 0x1234...)",
        amount_stolen: "Số tiền bị đánh cắp (ước tính)",
        amount_stolen_placeholder: "Nhập số tiền ước tính (vd. 200000)",
        incident_summary: "Tóm tắt sự cố",
        incident_summary_placeholder: "vd. Tiền bị đánh cắp qua lừa đảo phishing...",
        evidence: "Ảnh chụp màn hình hoặc bằng chứng khác hỗ trợ yêu cầu",
        phone_number: "Số điện thoại",
        blockchain: "Chọn blockchain",
        blockchain_placeholder: "Chọn blockchain",
        currency: "Chọn loại tiền",
        currency_placeholder: "Chọn loại tiền",
        privacy_prefix:
          "Lenix Protocol cần thông tin liên hệ của bạn để trao đổi về hồ sơ khôi phục. Xem chi tiết tại",
        privacy_policy: "Chính sách quyền riêng tư",
        privacy_suffix: ".",
        submit: "Gửi yêu cầu khôi phục",
        submitting: "Đang gửi...",
      },
      blockchains: {
        BTC: "Bitcoin (BTC)",
        ETH: "Ethereum (ETH)",
        SOL: "Solana (SOL)",
        TRX: "Tron (TRX)",
        BNB: "Binance Smart Chain (BNB)",
        MATIC: "Polygon Mainnet (MATIC)",
        AVAX: "Avalanche C-Chain (AVAX)",
        ARB: "Arbitrum One (ARB)",
        BASE: "Base (BASE)",
        FANTOM: "Fantom (Fantom)",
        GNOSIS: "Gnosis Chain (GNOSIS)",
        KAVA: "Kava (KAVA)",
        POL: "Polkadot (POL)",
        SUI: "Sui (SUI)",
        OTHER: "Khác",
      },
      success: {
        title: "Đã gửi yêu cầu",
        description:
          "Đội khôi phục sẽ xem xét hồ sơ và liên hệ với bạn trong 24–48 giờ.",
        submit_another: "Gửi yêu cầu khác",
      },
      toast: {
        required_fields: "Vui lòng điền đầy đủ các trường bắt buộc",
        submit_failed: "Không thể gửi yêu cầu khôi phục",
        submit_success: "Đã gửi yêu cầu khôi phục. Đội ngũ sẽ liên hệ với bạn sớm.",
      },
    },
  },
  tl: {
    AccountRecoveryServices: {
      page: {
        title: "Mga Serbisyo sa Recovery",
        subtitle:
          "Mag-submit ng recovery request para sa nawala o ninakaw na crypto assets. Susuriin ng forensic team namin ang kaso at makikipag-ugnayan sa loob ng 24–48 oras.",
        process_title: "Proseso",
        form_title: "Detalye ng Asset Recovery at Forensics",
        form_subtitle:
          "Tutulungan ka naming i-trace at i-recover ang nawalang crypto assets at bumuo ng verified evidence para sa legal na pagbawi ng pondo.",
      },
      process: {
        assessment: {
          title: "Assessment",
          description: "Sinusuri namin ang trail at tinataya ang posibilidad ng recovery.",
        },
        strategy: {
          title: "Strategy",
          description: "Customized na plano na may legal at forensic support.",
        },
        recovery: {
          title: "Recovery",
          description: "Kumokontak kami sa mga exchange at awtoridad para mabawi ang pondo.",
        },
        return: {
          title: "Pagbabalik",
          description: "Ililipat ang pondo sa iyong verified wallet.",
        },
      },
      form: {
        name: "Pangalan",
        name_placeholder: "hal. Juan dela Cruz",
        transaction_hash: "Transaction hash / Wallet address",
        transaction_hash_placeholder: "Ilagay ang hash o address (hal. 0x1234...)",
        amount_stolen: "Tinatayang halagang ninakaw",
        amount_stolen_placeholder: "Ilagay ang tinatayang halaga (hal. 200000)",
        incident_summary: "Buod ng Insidente",
        incident_summary_placeholder: "hal. Ninakaw ang pondo sa pamamagitan ng phishing scam...",
        evidence: "Screenshot o iba pang ebidensya na sumusuporta sa claim",
        phone_number: "Numero ng Telepono",
        blockchain: "Pumili ng Blockchain",
        blockchain_placeholder: "Pumili ng blockchain",
        currency: "Pumili ng currency",
        currency_placeholder: "Pumili ng currency",
        privacy_prefix:
          "Kailangan ng Lenix Protocol ang iyong contact info para makipag-ugnayan tungkol sa recovery case. Para sa detalye, tingnan ang aming",
        privacy_policy: "Privacy Policy",
        privacy_suffix: ".",
        submit: "I-submit ang Recovery Request",
        submitting: "Isinusumite...",
      },
      blockchains: {
        BTC: "Bitcoin (BTC)",
        ETH: "Ethereum (ETH)",
        SOL: "Solana (SOL)",
        TRX: "Tron (TRX)",
        BNB: "Binance Smart Chain (BNB)",
        MATIC: "Polygon Mainnet (MATIC)",
        AVAX: "Avalanche C-Chain (AVAX)",
        ARB: "Arbitrum One (ARB)",
        BASE: "Base (BASE)",
        FANTOM: "Fantom (Fantom)",
        GNOSIS: "Gnosis Chain (GNOSIS)",
        KAVA: "Kava (KAVA)",
        POL: "Polkadot (POL)",
        SUI: "Sui (SUI)",
        OTHER: "Iba pa",
      },
      success: {
        title: "Na-submit ang Request",
        description:
          "Susuriin ng recovery team namin ang kaso at makikipag-ugnayan sa loob ng 24–48 oras.",
        submit_another: "Mag-submit ng Isa Pang Request",
      },
      toast: {
        required_fields: "Pakipunan ang lahat ng kinakailangang field",
        submit_failed: "Hindi na-submit ang recovery request",
        submit_success:
          "Na-submit ang recovery request. Makikipag-ugnayan ang team namin sa lalong madaling panahon.",
      },
    },
  },
  tr: {
    AccountRecoveryServices: {
      page: {
        title: "Kurtarma hizmetleri",
        subtitle:
          "Kayıp veya çalınmış kripto varlıklar için kurtarma talebi gönderin. Adli bilişim ekibimiz dosyanızı değerlendirir ve 24–48 saat içinde sizinle iletişime geçer.",
        process_title: "Süreç",
        form_title: "Varlık kurtarma ve adli bilişim detayları",
        form_subtitle:
          "Kayıp kripto varlıkları izlemenize ve kurtarmanıza, ayrıca yasal fon geri kazanımı için doğrulanmış kanıt oluşturmanıza yardımcı oluyoruz.",
      },
      process: {
        assessment: {
          title: "Değerlendirme",
          description: "İzleri analiz eder ve kurtarılabilirliği değerlendiririz.",
        },
        strategy: {
          title: "Strateji",
          description: "Hukuki ve adli destekle özelleştirilmiş plan.",
        },
        recovery: {
          title: "Kurtarma",
          description: "Fonları geri almak için borsalar ve yetkililerle çalışırız.",
        },
        return: {
          title: "İade",
          description: "Fonlar doğrulanmış cüzdanınıza aktarılır.",
        },
      },
      form: {
        name: "Ad",
        name_placeholder: "ör. Ahmet Yılmaz",
        transaction_hash: "İşlem hash'i / Cüzdan adresi",
        transaction_hash_placeholder: "Hash veya adres girin (ör. 0x1234...)",
        amount_stolen: "Yaklaşık çalınan tutar",
        amount_stolen_placeholder: "Tahmini tutarı girin (ör. 200000)",
        incident_summary: "Olay özeti",
        incident_summary_placeholder: "ör. Fonlar oltalama dolandırıcılığıyla çalındı...",
        evidence: "Ekran görüntüsü veya talebi destekleyen başka kanıt",
        phone_number: "Telefon numarası",
        blockchain: "Blockchain seçin",
        blockchain_placeholder: "Blockchain seçin",
        currency: "Para birimi seçin",
        currency_placeholder: "Para birimi seçin",
        privacy_prefix:
          "Lenix Protocol, kurtarma dosyanız hakkında sizinle iletişim kurmak için iletişim bilgilerinize ihtiyaç duyar. Ayrıntılar için",
        privacy_policy: "Gizlilik Politikamıza",
        privacy_suffix: " bakın.",
        submit: "Kurtarma talebi gönder",
        submitting: "Gönderiliyor...",
      },
      blockchains: {
        BTC: "Bitcoin (BTC)",
        ETH: "Ethereum (ETH)",
        SOL: "Solana (SOL)",
        TRX: "Tron (TRX)",
        BNB: "Binance Smart Chain (BNB)",
        MATIC: "Polygon Mainnet (MATIC)",
        AVAX: "Avalanche C-Chain (AVAX)",
        ARB: "Arbitrum One (ARB)",
        BASE: "Base (BASE)",
        FANTOM: "Fantom (Fantom)",
        GNOSIS: "Gnosis Chain (GNOSIS)",
        KAVA: "Kava (KAVA)",
        POL: "Polkadot (POL)",
        SUI: "Sui (SUI)",
        OTHER: "Diğer",
      },
      success: {
        title: "Talep gönderildi",
        description:
          "Kurtarma ekibimiz dosyanızı inceleyecek ve 24–48 saat içinde sizinle iletişime geçecek.",
        submit_another: "Başka bir talep gönder",
      },
      toast: {
        required_fields: "Lütfen tüm zorunlu alanları doldurun",
        submit_failed: "Kurtarma talebi gönderilemedi",
        submit_success: "Kurtarma talebi gönderildi. Ekibimiz yakında sizinle iletişime geçecek.",
      },
    },
  },
  hi: {
    AccountRecoveryServices: {
      page: {
        title: "रिकवरी सेवाएँ",
        subtitle:
          "खोए या चोरी हुए क्रिप्टो संपत्ति के लिए रिकवरी अनुरोध जमा करें। हमारी फोरेंसिक टीम आपके मामले का आकलन करेगी और 24–48 घंटों में संपर्क करेगी।",
        process_title: "प्रक्रिया",
        form_title: "संपत्ति रिकवरी और फोरेंसिक विवरण",
        form_subtitle:
          "हम आपको खोई क्रिप्टो संपत्ति का पता लगाने और पुनर्प्राप्त करने में मदद करते हैं, साथ ही कानूनी धन वसूली के लिए सत्यापित साक्ष्य तैयार करते हैं।",
      },
      process: {
        assessment: {
          title: "आकलन",
          description: "हम ट्रेल का विश्लेषण करते हैं और पुनर्प्राप्ति की संभावना तय करते हैं।",
        },
        strategy: {
          title: "रणनीति",
          description: "कानूनी और फोरेंसिक सहायता के साथ अनुकूलित योजना।",
        },
        recovery: {
          title: "रिकवरी",
          description: "धन वापस पाने के लिए हम एक्सचेंज और अधिकारियों से संपर्क करते हैं।",
        },
        return: {
          title: "वापसी",
          description: "धन आपके सत्यापित वॉलेट में स्थानांतरित किया जाता है।",
        },
      },
      form: {
        name: "नाम",
        name_placeholder: "उदा. राहुल शर्मा",
        transaction_hash: "लेनदेन हैश / वॉलेट पता",
        transaction_hash_placeholder: "हैश या पता दर्ज करें (उदा. 0x1234...)",
        amount_stolen: "अनुमानित चोरी की राशि",
        amount_stolen_placeholder: "अनुमानित राशि दर्ज करें (उदा. 200000)",
        incident_summary: "घटना सारांश",
        incident_summary_placeholder: "उदा. फ़िशिंग घोटाले से धन चोरी हुआ...",
        evidence: "स्क्रीनशॉट या दावे का समर्थन करने वाला अन्य साक्ष्य",
        phone_number: "फ़ोन नंबर",
        blockchain: "ब्लॉकचेन चुनें",
        blockchain_placeholder: "ब्लॉकचेन चुनें",
        currency: "मुद्रा चुनें",
        currency_placeholder: "मुद्रा चुनें",
        privacy_prefix:
          "Lenix Protocol को आपके रिकवरी मामले पर संपर्क करने के लिए आपकी संपर्क जानकारी चाहिए। विवरण के लिए हमारी",
        privacy_policy: "गोपनीयता नीति",
        privacy_suffix: " देखें।",
        submit: "रिकवरी अनुरोध जमा करें",
        submitting: "जमा हो रहा है...",
      },
      blockchains: {
        BTC: "Bitcoin (BTC)",
        ETH: "Ethereum (ETH)",
        SOL: "Solana (SOL)",
        TRX: "Tron (TRX)",
        BNB: "Binance Smart Chain (BNB)",
        MATIC: "Polygon Mainnet (MATIC)",
        AVAX: "Avalanche C-Chain (AVAX)",
        ARB: "Arbitrum One (ARB)",
        BASE: "Base (BASE)",
        FANTOM: "Fantom (Fantom)",
        GNOSIS: "Gnosis Chain (GNOSIS)",
        KAVA: "Kava (KAVA)",
        POL: "Polkadot (POL)",
        SUI: "Sui (SUI)",
        OTHER: "अन्य",
      },
      success: {
        title: "अनुरोध जमा हो गया",
        description:
          "हमारी रिकवरी टीम आपके मामले की समीक्षा करेगी और 24–48 घंटों में संपर्क करेगी।",
        submit_another: "दूसरा अनुरोध जमा करें",
      },
      toast: {
        required_fields: "कृपया सभी आवश्यक फ़ील्ड भरें",
        submit_failed: "रिकवरी अनुरोध जमा नहीं हो सका",
        submit_success: "रिकवरी अनुरोध जमा हो गया। हमारी टीम जल्द संपर्क करेगी।",
      },
    },
  },
  id: {
    AccountRecoveryServices: {
      page: {
        title: "Layanan pemulihan",
        subtitle:
          "Kirim permintaan pemulihan untuk aset kripto yang hilang atau dicuri. Tim forensik kami akan menilai kasus Anda dan menghubungi dalam 24–48 jam.",
        process_title: "Proses",
        form_title: "Detail pemulihan aset dan forensik",
        form_subtitle:
          "Kami membantu Anda melacak dan memulihkan aset kripto yang hilang serta menyusun bukti terverifikasi untuk pemulihan dana secara legal.",
      },
      process: {
        assessment: {
          title: "Penilaian",
          description: "Kami menganalisis jejak dan menilai kemungkinan pemulihan.",
        },
        strategy: {
          title: "Strategi",
          description: "Rencana khusus dengan dukungan hukum dan forensik.",
        },
        recovery: {
          title: "Pemulihan",
          description: "Kami berkoordinasi dengan bursa dan otoritas untuk mengambil kembali dana.",
        },
        return: {
          title: "Pengembalian",
          description: "Dana ditransfer ke dompet terverifikasi Anda.",
        },
      },
      form: {
        name: "Nama",
        name_placeholder: "mis. Budi Santoso",
        transaction_hash: "Hash transaksi / Alamat dompet",
        transaction_hash_placeholder: "Masukkan hash atau alamat (mis. 0x1234...)",
        amount_stolen: "Perkiraan jumlah yang dicuri",
        amount_stolen_placeholder: "Masukkan perkiraan jumlah (mis. 200000)",
        incident_summary: "Ringkasan insiden",
        incident_summary_placeholder: "mis. Dana dicuri melalui penipuan phishing...",
        evidence: "Tangkapan layar atau bukti lain yang mendukung klaim",
        phone_number: "Nomor telepon",
        blockchain: "Pilih blockchain",
        blockchain_placeholder: "Pilih blockchain",
        currency: "Pilih mata uang",
        currency_placeholder: "Pilih mata uang",
        privacy_prefix:
          "Lenix Protocol memerlukan informasi kontak Anda untuk menghubungi terkait kasus pemulihan. Untuk detail, lihat",
        privacy_policy: "Kebijakan Privasi",
        privacy_suffix: " kami.",
        submit: "Kirim permintaan pemulihan",
        submitting: "Mengirim...",
      },
      blockchains: {
        BTC: "Bitcoin (BTC)",
        ETH: "Ethereum (ETH)",
        SOL: "Solana (SOL)",
        TRX: "Tron (TRX)",
        BNB: "Binance Smart Chain (BNB)",
        MATIC: "Polygon Mainnet (MATIC)",
        AVAX: "Avalanche C-Chain (AVAX)",
        ARB: "Arbitrum One (ARB)",
        BASE: "Base (BASE)",
        FANTOM: "Fantom (Fantom)",
        GNOSIS: "Gnosis Chain (GNOSIS)",
        KAVA: "Kava (KAVA)",
        POL: "Polkadot (POL)",
        SUI: "Sui (SUI)",
        OTHER: "Lainnya",
      },
      success: {
        title: "Permintaan terkirim",
        description:
          "Tim pemulihan kami akan meninjau kasus Anda dan menghubungi dalam 24–48 jam.",
        submit_another: "Kirim permintaan lain",
      },
      toast: {
        required_fields: "Harap isi semua field wajib",
        submit_failed: "Gagal mengirim permintaan pemulihan",
        submit_success:
          "Permintaan pemulihan terkirim. Tim kami akan segera menghubungi Anda.",
      },
    },
  },
};

for (const locale of locales) {
  const filePath = path.join(root, "messages", locale, "common.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const patch = translations[locale];
  if (!patch?.AccountRecoveryServices) continue;
  data.AccountRecoveryServices = deepMerge(
    data.AccountRecoveryServices || {},
    patch.AccountRecoveryServices,
  );
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Updated ${locale}/common.json`);
}
