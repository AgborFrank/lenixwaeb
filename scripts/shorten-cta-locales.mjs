import fs from "fs";
import path from "path";

const root = path.join(import.meta.dirname, "..");
const locales = ["de", "fr", "es", "pt", "it", "id", "vi", "zh", "ar", "hi", "tr", "tl"];

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

/** Meaning-based CTAs — max 3 words per label */
const commonPatches = {
  fr: {
    Header: {
      buttons: {
        log_in: "Connexion",
        log_in_sign_up: "Connexion",
      },
    },
    Footer: {
      buttons: { recover_assets: "Récupérer" },
    },
    Home: {
      Hero: {
        btn_primary: "Ouvrir dossier",
        btn_secondary: "Contacter équipe",
        btn_login: "Connexion",
      },
      Pillars: {
        cards: {
          security: { cta: "Voir sécurité" },
          recovery: { cta: "Lancer recovery" },
          forensics: { cta: "Voir forensique" },
          finance: { cta: "Voir solutions" },
        },
      },
      CaseWorkflow: {
        btn_primary: "Ouvrir dossier",
        btn_secondary: "Parler analyste",
      },
      Merchant: {
        btn_complete: "Payer",
        btn_manual: "Payer manuel",
        point4_1: "Voir solutions",
        point4_3: "Ouvrir dossier",
      },
      Credibility: {
        col1_btn: "Docs sécurité",
        col2_btn: "Livre blanc",
      },
      Cta: {
        btn_primary: "Ouvrir dossier",
        btn_secondary: "Contacter équipe",
      },
      Features: {
        btn_connect: "Connecter",
        btn_manual: "Payer manuel",
        btn_whitepaper: "Livre blanc",
      },
      Payment: { cta: "Voir solutions" },
      Competition: { btn: "Programme communauté" },
    },
    Security: {
      cta: {
        btn_primary: "Ouvrir dossier",
        btn_secondary: "Contact sécurité",
      },
    },
  },
  es: {
    Header: {
      buttons: { log_in: "Entrar", log_in_sign_up: "Entrar" },
    },
    Footer: { buttons: { recover_assets: "Recuperar" } },
    Home: {
      Hero: {
        btn_primary: "Iniciar recovery",
        btn_secondary: "Contactar equipo",
        btn_login: "Entrar",
      },
      Pillars: {
        cards: {
          security: { cta: "Ver seguridad" },
          recovery: { cta: "Iniciar recovery" },
          forensics: { cta: "Ver forensia" },
          finance: { cta: "Ver soluciones" },
        },
      },
      CaseWorkflow: {
        btn_primary: "Abrir caso",
        btn_secondary: "Hablar analista",
      },
      Merchant: {
        btn_complete: "Pagar",
        btn_manual: "Pago manual",
        point4_1: "Ver soluciones",
        point4_3: "Iniciar recovery",
      },
      Credibility: {
        col1_btn: "Docs seguridad",
        col2_btn: "Whitepaper",
      },
      Cta: {
        btn_primary: "Abrir caso",
        btn_secondary: "Contactar equipo",
      },
      Features: {
        btn_connect: "Conectar",
        btn_manual: "Pago manual",
        btn_whitepaper: "Whitepaper",
      },
      Payment: { cta: "Ver soluciones" },
      Competition: { btn: "Ver comunidad" },
    },
    Security: {
      cta: {
        btn_primary: "Iniciar recovery",
        btn_secondary: "Contactar seguridad",
      },
    },
  },
  de: {
    Header: {
      buttons: { log_in: "Anmelden", log_in_sign_up: "Anmelden" },
    },
    Footer: { buttons: { recover_assets: "Recovery" } },
    Home: {
      Hero: {
        btn_primary: "Fall melden",
        btn_secondary: "Team kontaktieren",
        btn_login: "Anmelden",
      },
      Pillars: {
        cards: {
          security: { cta: "Sicherheit" },
          recovery: { cta: "Recovery starten" },
          forensics: { cta: "Forensik" },
          finance: { cta: "Lösungen" },
        },
      },
      CaseWorkflow: {
        btn_primary: "Fall melden",
        btn_secondary: "Analyst fragen",
      },
      Merchant: {
        btn_complete: "Bezahlen",
        btn_manual: "Manuell zahlen",
        point4_1: "Lösungen",
        point4_3: "Fall melden",
      },
      Credibility: {
        col1_btn: "Security-Docs",
        col2_btn: "Whitepaper",
      },
      Cta: {
        btn_primary: "Fall melden",
        btn_secondary: "Team kontaktieren",
      },
      Features: {
        btn_connect: "Verbinden",
        btn_manual: "Manuell zahlen",
        btn_whitepaper: "Whitepaper",
      },
      Payment: { cta: "Lösungen" },
      Competition: { btn: "Community" },
    },
    Security: {
      cta: {
        btn_primary: "Fall melden",
        btn_secondary: "Security-Team",
      },
    },
  },
  pt: {
    Header: {
      buttons: { log_in: "Entrar", log_in_sign_up: "Entrar" },
    },
    Footer: { buttons: { recover_assets: "Recuperar" } },
    Home: {
      Hero: {
        btn_primary: "Iniciar recovery",
        btn_secondary: "Contactar equipa",
        btn_login: "Entrar",
      },
      Pillars: {
        cards: {
          security: { cta: "Ver segurança" },
          recovery: { cta: "Iniciar recovery" },
          forensics: { cta: "Ver forensics" },
          finance: { cta: "Ver soluções" },
        },
      },
      CaseWorkflow: {
        btn_primary: "Abrir caso",
        btn_secondary: "Falar analista",
      },
      Merchant: {
        btn_complete: "Pagar",
        btn_manual: "Pagar manual",
        point4_1: "Ver soluções",
        point4_3: "Iniciar recovery",
      },
      Credibility: {
        col1_btn: "Docs segurança",
        col2_btn: "Whitepaper",
      },
      Cta: {
        btn_primary: "Abrir caso",
        btn_secondary: "Contactar equipa",
      },
      Features: {
        btn_connect: "Conectar",
        btn_manual: "Pagar manual",
        btn_whitepaper: "Whitepaper",
      },
      Payment: { cta: "Ver soluções" },
      Competition: { btn: "Ver comunidade" },
    },
    Security: {
      cta: {
        btn_primary: "Iniciar recovery",
        btn_secondary: "Contactar segurança",
      },
    },
  },
  it: {
    Header: {
      buttons: { log_in: "Accedi", log_in_sign_up: "Accedi" },
    },
    Footer: { buttons: { recover_assets: "Recupera" } },
    Home: {
      Hero: {
        btn_primary: "Apri caso",
        btn_secondary: "Contatta team",
        btn_login: "Accedi",
      },
      Pillars: {
        cards: {
          security: { cta: "Vedi sicurezza" },
          recovery: { cta: "Avvia recovery" },
          forensics: { cta: "Vedi forensics" },
          finance: { cta: "Vedi soluzioni" },
        },
      },
      CaseWorkflow: {
        btn_primary: "Apri caso",
        btn_secondary: "Parla analista",
      },
      Merchant: {
        btn_complete: "Paga",
        btn_manual: "Paga manuale",
        point4_1: "Vedi soluzioni",
        point4_3: "Apri caso",
      },
      Credibility: {
        col1_btn: "Docs sicurezza",
        col2_btn: "Whitepaper",
      },
      Cta: {
        btn_primary: "Apri caso",
        btn_secondary: "Contatta team",
      },
      Features: {
        btn_connect: "Connetti",
        btn_manual: "Paga manuale",
        btn_whitepaper: "Whitepaper",
      },
      Payment: { cta: "Vedi soluzioni" },
      Competition: { btn: "Vedi community" },
    },
    Security: {
      cta: {
        btn_primary: "Apri caso",
        btn_secondary: "Contatta security",
      },
    },
  },
  ar: {
    Header: {
      buttons: { log_in: "دخول", log_in_sign_up: "دخول" },
    },
    Footer: { buttons: { recover_assets: "استرداد" } },
    Home: {
      Hero: {
        btn_primary: "بدء الاسترداد",
        btn_secondary: "تواصل معنا",
        btn_login: "دخول",
      },
      Pillars: {
        cards: {
          security: { cta: "استكشف الأمان" },
          recovery: { cta: "بدء الاسترداد" },
          forensics: { cta: "عرض الطب الشرعي" },
          finance: { cta: "عرض الحلول" },
        },
      },
      CaseWorkflow: {
        btn_primary: "فتح قضية",
        btn_secondary: "تحدث محلل",
      },
      Merchant: {
        btn_complete: "إتمام الدفع",
        btn_manual: "دفع يدوي",
        point4_1: "استكشف الحلول",
        point4_3: "بدء الاسترداد",
      },
      Credibility: {
        col1_btn: "وثائق الأمان",
        col2_btn: "الورقة البيضاء",
      },
      Cta: {
        btn_primary: "فتح قضية",
        btn_secondary: "تواصل معنا",
      },
      Features: {
        btn_connect: "ربط المحفظة",
        btn_manual: "دفع يدوي",
        btn_whitepaper: "الورقة البيضاء",
      },
      Payment: { cta: "عرض الحلول" },
      Competition: { btn: "برنامج المجتمع" },
    },
    Security: {
      cta: {
        btn_primary: "بدء الاسترداد",
        btn_secondary: "تواصل الأمان",
      },
    },
  },
  zh: {
    Header: {
      buttons: { log_in: "登录", log_in_sign_up: "登录" },
    },
    Footer: { buttons: { recover_assets: "追回资产" } },
    Home: {
      Hero: {
        btn_primary: "开始追回",
        btn_secondary: "联系团队",
        btn_login: "登录",
      },
      Pillars: {
        cards: {
          security: { cta: "了解安全" },
          recovery: { cta: "开始追回" },
          forensics: { cta: "查看取证" },
          finance: { cta: "查看方案" },
        },
      },
      CaseWorkflow: {
        btn_primary: "提交案件",
        btn_secondary: "联系分析师",
      },
      Merchant: {
        btn_complete: "完成支付",
        btn_manual: "手动支付",
        point4_1: "查看方案",
        point4_3: "开始追回",
      },
      Credibility: {
        col1_btn: "安全文档",
        col2_btn: "白皮书",
      },
      Cta: {
        btn_primary: "提交案件",
        btn_secondary: "联系团队",
      },
      Features: {
        btn_connect: "连接钱包",
        btn_manual: "手动支付",
        btn_whitepaper: "白皮书",
      },
      Payment: { cta: "查看方案" },
      Competition: { btn: "社区计划" },
    },
    Security: {
      cta: {
        btn_primary: "开始追回",
        btn_secondary: "联系安全团队",
      },
    },
  },
  vi: {
    Header: {
      buttons: { log_in: "Đăng nhập", log_in_sign_up: "Đăng nhập" },
    },
    Footer: { buttons: { recover_assets: "Thu hồi" } },
    Home: {
      Hero: {
        btn_primary: "Thu hồi",
        btn_secondary: "Liên hệ",
        btn_login: "Đăng nhập",
      },
      Pillars: {
        cards: {
          security: { cta: "Xem bảo mật" },
          recovery: { cta: "Thu hồi" },
          forensics: { cta: "Xem forensics" },
          finance: { cta: "Xem giải pháp" },
        },
      },
      CaseWorkflow: {
        btn_primary: "Mở vụ việc",
        btn_secondary: "Nói chuyện analyst",
      },
      Merchant: {
        btn_complete: "Thanh toán",
        btn_manual: "Trả thủ công",
        point4_1: "Xem giải pháp",
        point4_3: "Thu hồi",
      },
      Credibility: {
        col1_btn: "Docs bảo mật",
        col2_btn: "Whitepaper",
      },
      Cta: {
        btn_primary: "Mở vụ việc",
        btn_secondary: "Liên hệ",
      },
      Features: {
        btn_connect: "Kết nối ví",
        btn_manual: "Trả thủ công",
        btn_whitepaper: "Whitepaper",
      },
      Payment: { cta: "Xem giải pháp" },
      Competition: { btn: "Cộng đồng" },
    },
    Security: {
      cta: {
        btn_primary: "Thu hồi",
        btn_secondary: "Liên hệ",
      },
    },
  },
  tr: {
    Header: {
      buttons: { log_in: "Giriş", log_in_sign_up: "Giriş" },
    },
    Footer: { buttons: { recover_assets: "Kurtar" } },
    Home: {
      Hero: {
        btn_primary: "Recovery başlat",
        btn_secondary: "Ekiple iletişim",
        btn_login: "Giriş",
      },
      Pillars: {
        cards: {
          security: { cta: "Güvenlik" },
          recovery: { cta: "Recovery başlat" },
          forensics: { cta: "Forensics" },
          finance: { cta: "Çözümler" },
        },
      },
      CaseWorkflow: {
        btn_primary: "Vaka aç",
        btn_secondary: "Analistle konuş",
      },
      Merchant: {
        btn_complete: "Öde",
        btn_manual: "Manuel öde",
        point4_1: "Çözümler",
        point4_3: "Recovery başlat",
      },
      Credibility: {
        col1_btn: "Güvenlik docs",
        col2_btn: "Whitepaper",
      },
      Cta: {
        btn_primary: "Vaka aç",
        btn_secondary: "Ekiple iletişim",
      },
      Features: {
        btn_connect: "Bağlan",
        btn_manual: "Manuel öde",
        btn_whitepaper: "Whitepaper",
      },
      Payment: { cta: "Çözümler" },
      Competition: { btn: "Topluluk" },
    },
    Security: {
      cta: {
        btn_primary: "Recovery başlat",
        btn_secondary: "Güvenlik ekibi",
      },
    },
  },
  hi: {
    Header: {
      buttons: { log_in: "लॉग इन", log_in_sign_up: "लॉग इन" },
    },
    Footer: { buttons: { recover_assets: "रिकवर करें" } },
    Home: {
      Hero: {
        btn_primary: "केस शुरू करें",
        btn_secondary: "टीम से संपर्क",
        btn_login: "लॉग इन",
      },
      Pillars: {
        cards: {
          security: { cta: "सुरक्षा देखें" },
          recovery: { cta: "रिकवरी शुरू" },
          forensics: { cta: "फोरेंसिक देखें" },
          finance: { cta: "समाधान देखें" },
        },
      },
      CaseWorkflow: {
        btn_primary: "केस शुरू",
        btn_secondary: "विश्लेषक से बात",
      },
      Merchant: {
        btn_complete: "भुगतान करें",
        btn_manual: "मैन्युअल भुगतान",
        point4_1: "समाधान देखें",
        point4_3: "केस शुरू",
      },
      Credibility: {
        col1_btn: "सुरक्षा docs",
        col2_btn: "Whitepaper",
      },
      Cta: {
        btn_primary: "केस शुरू",
        btn_secondary: "टीम से संपर्क",
      },
      Features: {
        btn_connect: "वॉलेट जोड़ें",
        btn_manual: "मैन्युअल भुगतान",
        btn_whitepaper: "Whitepaper",
      },
      Payment: { cta: "समाधान देखें" },
      Competition: { btn: "कम्युनिटी" },
    },
    Security: {
      cta: {
        btn_primary: "केस शुरू",
        btn_secondary: "सुरक्षा टीम",
      },
    },
  },
  id: {
    Header: {
      buttons: { log_in: "Masuk", log_in_sign_up: "Masuk" },
    },
    Footer: { buttons: { recover_assets: "Pulihkan" } },
    Home: {
      Hero: {
        btn_primary: "Mulai recovery",
        btn_secondary: "Hubungi tim",
        btn_login: "Masuk",
      },
      Pillars: {
        cards: {
          security: { cta: "Lihat keamanan" },
          recovery: { cta: "Mulai recovery" },
          forensics: { cta: "Lihat forensics" },
          finance: { cta: "Lihat solusi" },
        },
      },
      CaseWorkflow: {
        btn_primary: "Buka kasus",
        btn_secondary: "Tanya analis",
      },
      Merchant: {
        btn_complete: "Bayar",
        btn_manual: "Bayar manual",
        point4_1: "Lihat solusi",
        point4_3: "Mulai recovery",
      },
      Credibility: {
        col1_btn: "Docs keamanan",
        col2_btn: "Whitepaper",
      },
      Cta: {
        btn_primary: "Buka kasus",
        btn_secondary: "Hubungi tim",
      },
      Features: {
        btn_connect: "Hubungkan",
        btn_manual: "Bayar manual",
        btn_whitepaper: "Whitepaper",
      },
      Payment: { cta: "Lihat solusi" },
      Competition: { btn: "Komunitas" },
    },
    Security: {
      cta: {
        btn_primary: "Mulai recovery",
        btn_secondary: "Tim keamanan",
      },
    },
  },
  tl: {
    Header: {
      buttons: { log_in: "Mag-log in", log_in_sign_up: "Mag-log in" },
    },
    Footer: { buttons: { recover_assets: "I-recover" } },
    Home: {
      Hero: {
        btn_primary: "Simulan recovery",
        btn_secondary: "Makipag-ugnayan",
        btn_login: "Mag-log in",
      },
      Pillars: {
        cards: {
          security: { cta: "Tingnan security" },
          recovery: { cta: "Simulan recovery" },
          forensics: { cta: "Tingnan forensics" },
          finance: { cta: "Tingnan solutions" },
        },
      },
      CaseWorkflow: {
        btn_primary: "Simulan case",
        btn_secondary: "Makipag-usap analyst",
      },
      Merchant: {
        btn_complete: "Magbayad",
        btn_manual: "Manual bayad",
        point4_1: "Tingnan solutions",
        point4_3: "Simulan recovery",
      },
      Credibility: {
        col1_btn: "Security docs",
        col2_btn: "Whitepaper",
      },
      Cta: {
        btn_primary: "Simulan case",
        btn_secondary: "Makipag-ugnayan",
      },
      Features: {
        btn_connect: "Ikonekta",
        btn_manual: "Manual bayad",
        btn_whitepaper: "Whitepaper",
      },
      Payment: { cta: "Tingnan solutions" },
      Competition: { btn: "Community" },
    },
    Security: {
      cta: {
        btn_primary: "Simulan recovery",
        btn_secondary: "Security team",
      },
    },
  },
};

const solutionsPatches = {
  fr: {
    Overview: { learn_more: "Voir détails" },
    Recovery: { cta: "Ouvrir dossier" },
    Payments: { cta: "Voir paiements" },
    Lending: { cta: "Demander prêt" },
    Security: { cta: "Voir sécurité" },
    Cta: {
      btn_primary: "Contacter équipe",
      btn_secondary: "Ouvrir dossier",
    },
  },
  es: {
    Overview: { learn_more: "Ver detalles" },
    Recovery: { cta: "Iniciar recovery" },
    Payments: { cta: "Ver pagos" },
    Lending: { cta: "Pedir préstamo" },
    Security: { cta: "Ver seguridad" },
    Cta: {
      btn_primary: "Contactar equipo",
      btn_secondary: "Iniciar recovery",
    },
  },
  de: {
    Overview: { learn_more: "Details" },
    Recovery: { cta: "Fall melden" },
    Payments: { cta: "Zahlungen" },
    Lending: { cta: "Kredit beantragen" },
    Security: { cta: "Sicherheit" },
    Cta: {
      btn_primary: "Team kontaktieren",
      btn_secondary: "Fall melden",
    },
  },
  pt: {
    Overview: { learn_more: "Ver detalhes" },
    Recovery: { cta: "Iniciar recovery" },
    Payments: { cta: "Ver pagamentos" },
    Lending: { cta: "Pedir empréstimo" },
    Security: { cta: "Ver segurança" },
    Cta: {
      btn_primary: "Contactar equipa",
      btn_secondary: "Iniciar recovery",
    },
  },
  it: {
    Overview: { learn_more: "Vedi dettagli" },
    Recovery: { cta: "Apri caso" },
    Payments: { cta: "Vedi pagamenti" },
    Lending: { cta: "Richiedi prestito" },
    Security: { cta: "Vedi sicurezza" },
    Cta: {
      btn_primary: "Contatta team",
      btn_secondary: "Apri caso",
    },
  },
  ar: {
    Overview: { learn_more: "التفاصيل" },
    Recovery: { cta: "بدء الاسترداد" },
    Payments: { cta: "خيارات الدفع" },
    Lending: { cta: "طلب قرض" },
    Security: { cta: "نظرة الأمان" },
    Cta: {
      btn_primary: "تواصل معنا",
      btn_secondary: "بدء الاسترداد",
    },
  },
  zh: {
    Overview: { learn_more: "查看详情" },
    Recovery: { cta: "开始追回" },
    Payments: { cta: "支付选项" },
    Lending: { cta: "申请贷款" },
    Security: { cta: "安全概览" },
    Cta: {
      btn_primary: "联系团队",
      btn_secondary: "开始追回",
    },
  },
  vi: {
    Overview: { learn_more: "Chi tiết" },
    Recovery: { cta: "Thu hồi" },
    Payments: { cta: "Thanh toán" },
    Lending: { cta: "Đăng ký vay" },
    Security: { cta: "Bảo mật" },
    Cta: {
      btn_primary: "Liên hệ",
      btn_secondary: "Thu hồi",
    },
  },
  tr: {
    Overview: { learn_more: "Detaylar" },
    Recovery: { cta: "Recovery başlat" },
    Payments: { cta: "Ödeme seçenekleri" },
    Lending: { cta: "Kredi başvur" },
    Security: { cta: "Güvenlik özeti" },
    Cta: {
      btn_primary: "Ekiple iletişim",
      btn_secondary: "Recovery başlat",
    },
  },
  hi: {
    Overview: { learn_more: "विवरण देखें" },
    Recovery: { cta: "केस शुरू" },
    Payments: { cta: "भुगतान विकल्प" },
    Lending: { cta: "ऋण आवेदन" },
    Security: { cta: "सुरक्षा अवलोकन" },
    Cta: {
      btn_primary: "टीम से संपर्क",
      btn_secondary: "केस शुरू",
    },
  },
  id: {
    Overview: { learn_more: "Lihat detail" },
    Recovery: { cta: "Mulai recovery" },
    Payments: { cta: "Opsi pembayaran" },
    Lending: { cta: "Ajukan pinjaman" },
    Security: { cta: "Ringkasan keamanan" },
    Cta: {
      btn_primary: "Hubungi tim",
      btn_secondary: "Mulai recovery",
    },
  },
  tl: {
    Overview: { learn_more: "Tingnan detalye" },
    Recovery: { cta: "Simulan recovery" },
    Payments: { cta: "Payment options" },
    Lending: { cta: "Mag-apply loan" },
    Security: { cta: "Security overview" },
    Cta: {
      btn_primary: "Makipag-ugnayan",
      btn_secondary: "Simulan recovery",
    },
  },
};

const widgetBtnPatches = {
  fr: { btn_pay_card: "Payer par carte", btn_giveaway: "Bonus LNX", btn_connect: "Connecter" },
  es: { btn_pay_card: "Pagar con tarjeta", btn_giveaway: "Bonus LNX", btn_connect: "Conectar" },
  de: { btn_pay_card: "Mit Karte zahlen", btn_giveaway: "LNX-Bonus", btn_connect: "Verbinden" },
  pt: { btn_pay_card: "Pagar com cartão", btn_giveaway: "Bónus LNX", btn_connect: "Conectar" },
  it: { btn_pay_card: "Paga con carta", btn_giveaway: "Bonus LNX", btn_connect: "Connetti" },
  ar: { btn_pay_card: "الدفع بالبطاقة", btn_giveaway: "مكافأة LNX", btn_connect: "ربط المحفظة" },
  zh: { btn_pay_card: "银行卡支付", btn_giveaway: "LNX 奖励", btn_connect: "连接钱包" },
  vi: { btn_pay_card: "Thẻ tín dụng", btn_giveaway: "Bonus LNX", btn_connect: "Kết nối ví" },
  tr: { btn_pay_card: "Kartla öde", btn_giveaway: "LNX bonus", btn_connect: "Bağlan" },
  hi: { btn_pay_card: "कार्ड से भुगतान", btn_giveaway: "LNX बोनस", btn_connect: "वॉलेट जोड़ें" },
  id: { btn_pay_card: "Bayar kartu", btn_giveaway: "Bonus LNX", btn_connect: "Hubungkan" },
  tl: { btn_pay_card: "Magbayad card", btn_giveaway: "LNX bonus", btn_connect: "Ikonekta" },
};

for (const locale of locales) {
  if (commonPatches[locale]) {
    commonPatches[locale].Home = commonPatches[locale].Home || {};
    commonPatches[locale].Home.LnxPurchaseWidget = {
      ...(commonPatches[locale].Home.LnxPurchaseWidget || {}),
      ...widgetBtnPatches[locale],
    };
  }
}

function countWords(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

for (const locale of locales) {
  const commonPath = path.join(root, "messages", locale, "common.json");
  const solutionsPath = path.join(root, "messages", locale, "solutions.json");

  const common = JSON.parse(fs.readFileSync(commonPath, "utf8"));
  const patch = commonPatches[locale];
  if (patch) {
    for (const [topKey, topVal] of Object.entries(patch)) {
      common[topKey] = deepMerge(common[topKey] || {}, topVal);
    }
  }
  fs.writeFileSync(commonPath, JSON.stringify(common, null, 2) + "\n");

  if (fs.existsSync(solutionsPath)) {
    const solutions = JSON.parse(fs.readFileSync(solutionsPath, "utf8"));
    const solPatch = solutionsPatches[locale];
    if (solPatch) {
      for (const [key, val] of Object.entries(solPatch)) {
        solutions[key] = deepMerge(solutions[key] || {}, val);
      }
    }
    fs.writeFileSync(solutionsPath, JSON.stringify(solutions, null, 2) + "\n");
  }

  const check = [];
  const collect = (obj, prefix) => {
    for (const [k, v] of Object.entries(obj || {})) {
      const p = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === "object") collect(v, p);
      else if (typeof v === "string" && /btn|cta|learn_more|point4_[13]|col.*_btn|recover_assets|log_in/i.test(k)) {
        if (countWords(v) > 3) check.push(`${p}: "${v}" (${countWords(v)} words)`);
      }
    }
  };
  collect(JSON.parse(fs.readFileSync(commonPath, "utf8")), "common");
  if (fs.existsSync(solutionsPath)) {
    collect(JSON.parse(fs.readFileSync(solutionsPath, "utf8")), "solutions");
  }

  console.log(`${locale}: patched${check.length ? ` — still >3 words:\n  ${check.join("\n  ")}` : " — all CTAs ≤3 words"}`);
}

console.log("Done.");
