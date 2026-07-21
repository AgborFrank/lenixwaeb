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

const securityPatches = {
  fr: {
    assurance: {
      eyebrow: "Vérification",
      title: "Ce que nous pouvons montrer",
      description: "Revue indépendante des contrats et contrôles opérationnels documentés — pas de promesses sans preuve.",
      iso_link: "À propos",
    },
    audit: {
      eyebrow: "Smart contracts",
      title: "Périmètre audit CertiK",
      certik_link: "Docs sécurité",
    },
    practices: {
      eyebrow: "Opérations",
      title: "Comment nous traitons le sensible",
      description: "Les dossiers recovery impliquent des données victimes et des flux à enjeu. Voici nos limites.",
      image_alt: "Équipe ops surveillant l'activité et les alertes sécurité",
    },
    cta: {
      title: "Besoin de documentation ?",
      subtitle: "Contactez-nous pour résumés d'audit, alignement ISO ou revues enterprise.",
      btn_primary: "Ouvrir dossier",
      btn_secondary: "Contact sécurité",
    },
  },
  es: {
    assurance: {
      eyebrow: "Verificación",
      title: "Lo que podemos mostrar",
      description: "Revisión independiente de contratos y controles operativos documentados — sin promesas sin evidencia.",
      iso_link: "Sobre Lenix",
    },
    audit: {
      eyebrow: "Smart contracts",
      title: "Alcance audit CertiK",
      certik_link: "Docs seguridad",
    },
    practices: {
      eyebrow: "Operaciones",
      title: "Cómo manejamos lo sensible",
      description: "Los casos de recovery involucran datos de víctimas y flujos críticos. Estos son nuestros límites.",
      image_alt: "Equipo de operaciones monitoreando actividad y alertas de seguridad",
    },
    cta: {
      title: "¿Necesita documentación?",
      subtitle: "Contacte al equipo para resúmenes de auditoría, ISO o revisiones enterprise.",
      btn_primary: "Iniciar recovery",
      btn_secondary: "Contactar seguridad",
    },
  },
  de: {
    assurance: {
      eyebrow: "Verifizierung",
      title: "Was wir vorlegen können",
      description: "Unabhängige Vertragsprüfung und dokumentierte Betriebskontrollen — keine Claims ohne Beleg.",
      iso_link: "Über Lenix",
    },
    audit: {
      eyebrow: "Smart Contracts",
      title: "CertiK-Auditumfang",
      certik_link: "Security-Docs",
    },
    practices: {
      eyebrow: "Betrieb",
      title: "Umgang mit sensiblen Fällen",
      description: "Recovery-Fälle betreffen Opferdaten und kritische Geldflüsse. Das sind unsere Grenzen.",
      image_alt: "Ops-Team überwacht Protokollaktivität und Security-Alerts",
    },
    cta: {
      title: "Dokumentation benötigt?",
      subtitle: "Kontakt für Audit-Zusammenfassungen, ISO-Details oder Enterprise-Reviews.",
      btn_primary: "Fall melden",
      btn_secondary: "Security-Team",
    },
  },
  pt: {
    assurance: {
      eyebrow: "Verificação",
      title: "O que podemos mostrar",
      description: "Revisão independente de contratos e controlos operacionais documentados — sem promessas vazias.",
      iso_link: "Sobre Lenix",
    },
    audit: {
      eyebrow: "Smart contracts",
      title: "Âmbito audit CertiK",
      certik_link: "Docs segurança",
    },
    practices: {
      eyebrow: "Operações",
      title: "Como tratamos o sensível",
      description: "Casos recovery envolvem dados de vítimas e fluxos críticos. Estes são os nossos limites.",
      image_alt: "Equipa ops a monitorizar atividade e alertas de segurança",
    },
    cta: {
      title: "Precisa de documentação?",
      subtitle: "Contacte a equipa para resumos de auditoria, ISO ou revisões enterprise.",
      btn_primary: "Iniciar recovery",
      btn_secondary: "Contactar segurança",
    },
  },
  it: {
    assurance: {
      eyebrow: "Verifica",
      title: "Cosa possiamo mostrare",
      description: "Revisione indipendente dei contratti e controlli operativi documentati — niente claim senza prove.",
      iso_link: "Chi siamo",
    },
    audit: {
      eyebrow: "Smart contract",
      title: "Ambito audit CertiK",
      certik_link: "Docs sicurezza",
    },
    practices: {
      eyebrow: "Operazioni",
      title: "Come gestiamo il sensibile",
      description: "I casi recovery coinvolgono dati delle vittime e flussi critici. Questi sono i nostri limiti.",
      image_alt: "Team ops che monitora attività e alert di sicurezza",
    },
    cta: {
      title: "Serve documentazione?",
      subtitle: "Contatta il team per riepiloghi audit, ISO o revisioni enterprise.",
      btn_primary: "Apri caso",
      btn_secondary: "Contatta security",
    },
  },
  ar: {
    assurance: {
      eyebrow: "التحقق",
      title: "ما يمكننا إظهاره",
      description: "مراجعة مستقلة للعقود وضوابط تشغيل موثّقة — لا ادعاءات بلا دليل.",
      iso_link: "عن Lenix",
    },
    audit: {
      eyebrow: "العقود الذكية",
      title: "نطاق تدقيق CertiK",
      certik_link: "وثائق الأمان",
    },
    practices: {
      eyebrow: "العمليات",
      title: "كيف نتعامل مع الحساس",
      description: "قضايا الاسترداد تتضمن بيانات الضحايا وتدفقات عالية المخاطر. هذه حدودنا.",
      image_alt: "فريق عمليات يراقب النشاط وتنبيهات الأمان",
    },
    cta: {
      title: "تحتاج وثائق؟",
      subtitle: "تواصل مع الفريق لملخصات التدقيق أو ISO أو مراجعات المؤسسات.",
      btn_primary: "بدء الاسترداد",
      btn_secondary: "تواصل الأمان",
    },
  },
  zh: {
    assurance: {
      eyebrow: "验证",
      title: "我们可以提供什么",
      description: "独立合约审查与 documented 运营控制 — 不无依据的安全宣传。",
      iso_link: "关于 Lenix",
    },
    audit: {
      eyebrow: "智能合约",
      title: "CertiK 审计范围",
      certik_link: "安全文档",
    },
    practices: {
      eyebrow: "运营",
      title: "如何处理敏感工作",
      description: "追回案件涉及受害者数据和高风险资金流。以下是我们的边界。",
      image_alt: "运营团队监控协议活动与安全告警",
    },
    cta: {
      title: "需要安全文档？",
      subtitle: "联系团队获取审计摘要、ISO 说明或企业安全审查。",
      btn_primary: "开始追回",
      btn_secondary: "联系安全团队",
    },
  },
  vi: {
    assurance: {
      eyebrow: "Xác minh",
      title: "Những gì chúng tôi có thể cung cấp",
      description: "Đánh giá hợp đồng độc lập và kiểm soát vận hành có tài liệu — không hứa hẹn suông.",
      iso_link: "Về Lenix",
    },
    audit: {
      eyebrow: "Smart contract",
      title: "Phạm vi audit CertiK",
      certik_link: "Docs bảo mật",
    },
    practices: {
      eyebrow: "Vận hành",
      title: "Cách xử lý dữ liệu nhạy cảm",
      description: "Vụ thu hồi liên quan dữ liệu nạn nhân và dòng tiền rủi ro cao. Đây là ranh giới của chúng tôi.",
      image_alt: "Đội vận hành giám sát hoạt động và cảnh báo bảo mật",
    },
    cta: {
      title: "Cần tài liệu bảo mật?",
      subtitle: "Liên hệ để nhận tóm tắt audit, chi tiết ISO hoặc đánh giá doanh nghiệp.",
      btn_primary: "Thu hồi",
      btn_secondary: "Liên hệ",
    },
  },
  tr: {
    assurance: {
      eyebrow: "Doğrulama",
      title: "Gösterebileceklerimiz",
      description: "Bağımsız sözleşme incelemesi ve belgelenmiş operasyon kontrolleri — kanıtsız iddia yok.",
      iso_link: "Lenix hakkında",
    },
    audit: {
      eyebrow: "Smart contract",
      title: "CertiK audit kapsamı",
      certik_link: "Güvenlik docs",
    },
    practices: {
      eyebrow: "Operasyon",
      title: "Hassas işleri nasıl yönetiriz",
      description: "Recovery vakaları mağdur verisi ve yüksek riskli akışlar içerir. Sınırlarımız bunlar.",
      image_alt: "Ops ekibi protokol aktivitesi ve güvenlik uyarılarını izliyor",
    },
    cta: {
      title: "Dokümantasyon mu lazım?",
      subtitle: "Audit özetleri, ISO detayları veya kurumsal incelemeler için ekiple iletişime geçin.",
      btn_primary: "Recovery başlat",
      btn_secondary: "Güvenlik ekibi",
    },
  },
  hi: {
    assurance: {
      eyebrow: "सत्यापन",
      title: "हम क्या दिखा सकते हैं",
      description: "स्वतंत्र अनुबंध समीक्षा और दस्तावेज़ित संचालन नियंत्रण — बिना सबूत दावे नहीं।",
      iso_link: "Lenix के बारे में",
    },
    audit: {
      eyebrow: "स्मार्ट अनुबंध",
      title: "CertiK ऑडिट दायरा",
      certik_link: "सुरक्षा docs",
    },
    practices: {
      eyebrow: "संचालन",
      title: "संवेदनशील कार्य कैसे",
      description: "रिकवरी मामले पीड़ित डेटा और उच्च जोखिम वाले फ्लो शामिल करते हैं। ये हमारी सीमाएँ हैं।",
      image_alt: "ऑप्स टीम गतिविधि और सुरक्षा अलर्ट की निगरानी करती है",
    },
    cta: {
      title: "दस्तावेज़ चाहिए?",
      subtitle: "ऑडिट सारांश, ISO विवरण या एंटरप्राइज़ समीक्षा के लिए संपर्क करें।",
      btn_primary: "केस शुरू",
      btn_secondary: "सुरक्षा टीम",
    },
  },
  id: {
    assurance: {
      eyebrow: "Verifikasi",
      title: "Apa yang bisa kami tunjukkan",
      description: "Tinjauan kontrak independen dan kontrol operasional terdokumentasi — tanpa klaim kosong.",
      iso_link: "Tentang Lenix",
    },
    audit: {
      eyebrow: "Smart contract",
      title: "Cakupan audit CertiK",
      certik_link: "Docs keamanan",
    },
    practices: {
      eyebrow: "Operasi",
      title: "Cara menangani pekerjaan sensitif",
      description: "Kasus recovery melibatkan data korban dan aliran dana berisiko tinggi. Ini batas kami.",
      image_alt: "Tim ops memantau aktivitas protokol dan peringatan keamanan",
    },
    cta: {
      title: "Butuh dokumentasi?",
      subtitle: "Hubungi tim untuk ringkasan audit, detail ISO, atau tinjauan enterprise.",
      btn_primary: "Mulai recovery",
      btn_secondary: "Tim keamanan",
    },
  },
  tl: {
    assurance: {
      eyebrow: "Beripikasyon",
      title: "Ano ang maipapakita namin",
      description: "Independent contract review at documented operational controls — walang claim na walang ebidensya.",
      iso_link: "Tungkol sa Lenix",
    },
    audit: {
      eyebrow: "Smart contract",
      title: "CertiK audit scope",
      certik_link: "Security docs",
    },
    practices: {
      eyebrow: "Operations",
      title: "Paano namin hinahawakan ang sensitibo",
      description: "Recovery cases may victim data at high-stakes flows. Ito ang aming boundaries.",
      image_alt: "Ops team na nagmo-monitor ng activity at security alerts",
    },
    cta: {
      title: "Kailangan ng documentation?",
      subtitle: "Makipag-ugnayan para sa audit summaries, ISO details, o enterprise reviews.",
      btn_primary: "Simulan recovery",
      btn_secondary: "Security team",
    },
  },
};

for (const locale of locales) {
  const filePath = path.join(root, "messages", locale, "common.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  data.Security = deepMerge(data.Security || {}, securityPatches[locale]);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
  console.log(`Patched Security for ${locale}`);
}

console.log("Done.");
