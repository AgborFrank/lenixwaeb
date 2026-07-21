import fs from "fs";
import path from "path";

const root = path.join(import.meta.dirname, "..");
const locales = ["fr","es","de","ar","pt","zh","it","vi","tl","tr","hi","id"];

const translations = {
  "fr": {
    "AccountLenixWallet": {
      "page": {
        "title": "Portefeuille",
        "subtitle": "Gérez vos actifs crypto",
        "setup_title": "Configurer votre portefeuille",
        "setup_subtitle": "Créez ou importez un portefeuille pour commencer",
        "unlock_title": "Déverrouiller le portefeuille",
        "unlock_subtitle": "Entrez votre mot de passe pour continuer",
        "password_placeholder": "Mot de passe",
        "unlocking": "Déverrouillage...",
        "unlock": "Déverrouiller",
        "network_placeholder": "Réseau",
        "logo_alt": "Portefeuille Lenix",
        "show_evm_wallet": "Afficher le portefeuille EVM",
        "show_bitcoin_wallet": "Afficher le portefeuille Bitcoin",
        "evm_wallet": "Portefeuille EVM",
        "bitcoin_wallet": "Portefeuille Bitcoin"
      },
      "networks": {
        "all": "Tous les réseaux",
        "ethereum": "Ethereum",
        "bsc": "BNB Chain",
        "polygon": "Polygon",
        "bitcoin": "Bitcoin"
      },
      "actions": {
        "send": "Envoyer",
        "receive": "Recevoir",
        "buy": "Acheter",
        "swap": "Échanger",
        "coming_soon": "Bientôt disponible"
      },
      "wallet_card": {
        "total_balance": "Solde total",
        "hide_balance": "Masquer le solde",
        "show_balance": "Afficher le solde",
        "lock_wallet": "Verrouiller le portefeuille",
        "evm_networks": "Réseaux EVM",
        "evm_chains": "ETH · BSC · Polygon · Arbitrum",
        "address_copied": "Adresse copiée"
      },
      "bitcoin_card": {
        "btc_balance": "Solde BTC",
        "not_activated": "Non activé",
        "activate_prompt": "Activez votre portefeuille Bitcoin natif",
        "password_placeholder": "Entrez le mot de passe du portefeuille",
        "creating": "Création...",
        "activate": "Activer",
        "bitcoin_network": "Réseau Bitcoin",
        "segwit": "SegWit natif BIP-84",
        "bitcoin_alt": "Bitcoin",
        "enter_password": "Entrez le mot de passe de votre portefeuille",
        "wallet_created": "Portefeuille Bitcoin créé",
        "create_failed": "Échec de la création du portefeuille Bitcoin",
        "address_copied": "Adresse copiée"
      },
      "token_list": {
        "assets": "Actifs",
        "market": "Marché",
        "tokens_count": "{count} jetons",
        "no_assets": "Aucun actif pour l'instant",
        "frozen": "Gelé",
        "deposit_to_unfreeze": "Déposez {amount} BTC pour débloquer",
        "frozen_by_admin": "Gelé par l'administrateur",
        "token_fallback": "Jeton"
      },
      "activity": {
        "title": "Activité",
        "no_activity": "Aucune activité récente",
        "done": "Terminé",
        "pending": "En attente"
      },
      "security": {
        "title": "Sécurité",
        "protected": "Protégé",
        "recovery_phrase": "Phrase de récupération",
        "backed_up": "Sauvegardée",
        "password": "Mot de passe",
        "active": "Actif",
        "withdrawal_limit": "Limite de retrait",
        "not_set": "Non définie",
        "set": "Définie"
      },
      "receive_modal": {
        "title": "Recevoir",
        "network": "Réseau",
        "evm_networks": "Réseaux EVM",
        "evm_chains": "ETH, BSC, Polygon, Arbitrum",
        "bitcoin": "Bitcoin",
        "bitcoin_chains": "SegWit natif (BIP-84)",
        "not_set_up": "(Non configuré)",
        "qr_alt": "Code QR",
        "copied": "Copié",
        "btc_warning": "Envoyez uniquement des BTC à cette adresse",
        "evm_warning": "Envoyez uniquement des jetons compatibles ERC-20"
      },
      "send_modal": {
        "title": "Envoyer des crypto",
        "description": "Saisissez l'adresse du destinataire et le montant du retrait pour envoyer des crypto."
      },
      "setup": {
        "back": "Retour",
        "welcome_title": "Le portefeuille le plus sécurisé au monde",
        "welcome_description": "Configurez votre portefeuille pour commencer. Lenix Wallet est le portefeuille le plus sécurisé et privé au monde pour protéger vos crypto.",
        "create_new": "Créer un nouveau portefeuille",
        "import_existing": "Importer un portefeuille existant",
        "terms_notice": "En créant ou important un portefeuille, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.",
        "backup_title": "Sauvegardez votre phrase de récupération",
        "backup_description": "Notez ces 12 mots dans l'ordre et conservez-les en lieu sûr. Si vous les perdez, vous risquez de perdre vos fonds définitivement.",
        "security_check_title": "Contrôle de sécurité",
        "security_check_description": "Ne partagez jamais cette phrase avec qui que ce soit. Le support Lenix ne vous la demandera jamais.",
        "saved_phrase": "J'ai sauvegardé ma phrase de récupération",
        "verify_title": "Vérifier la phrase de récupération",
        "verify_description": "Confirmez que vous avez sauvegardé votre phrase en saisissant les mots demandés ci-dessous.",
        "word_label": "Mot n°{number}",
        "word_placeholder": "Saisissez le mot n°{number}",
        "verify_continue": "Vérifier et continuer",
        "password_title": "Définir un mot de passe sécurisé",
        "password_description": "Ce mot de passe sera utilisé pour chiffrer votre portefeuille sur cet appareil.",
        "password_label": "Mot de passe",
        "confirm_password_label": "Confirmer le mot de passe",
        "create_wallet": "Créer le portefeuille",
        "processing": "Traitement...",
        "import_title": "Importer une phrase de récupération",
        "import_description": "Entrez votre phrase de récupération de 12 ou 24 mots pour restaurer votre portefeuille.",
        "import_placeholder": "pomme banane cerise...",
        "continue": "Continuer",
        "import_wallet": "Importer le portefeuille"
      },
      "toast": {
        "wallet_unlocked": "Portefeuille déverrouillé",
        "incorrect_password": "Mot de passe incorrect",
        "phrase_copied": "Phrase de récupération copiée dans le presse-papiers",
        "incorrect_words": "Mots incorrects. Veuillez réessayer.",
        "password_min_length": "Le mot de passe doit contenir au moins 8 caractères",
        "passwords_mismatch": "Les mots de passe ne correspondent pas",
        "wallet_created": "Portefeuille créé avec succès !",
        "create_failed": "Échec de la création du portefeuille",
        "invalid_phrase": "Phrase de récupération invalide. 12 ou 24 mots attendus, {count} reçus.",
        "wallet_imported": "Portefeuille importé avec succès !",
        "import_failed": "Échec de l'importation du portefeuille"
      }
    }
  },
  "es": {
    "AccountLenixWallet": {
      "page": {
        "title": "Cartera",
        "subtitle": "Administra tus activos cripto",
        "setup_title": "Configura tu cartera",
        "setup_subtitle": "Crea o importa una cartera para comenzar",
        "unlock_title": "Desbloquear cartera",
        "unlock_subtitle": "Introduce tu contraseña para continuar",
        "password_placeholder": "Contraseña",
        "unlocking": "Desbloqueando...",
        "unlock": "Desbloquear",
        "network_placeholder": "Red",
        "logo_alt": "Cartera Lenix",
        "show_evm_wallet": "Mostrar cartera EVM",
        "show_bitcoin_wallet": "Mostrar cartera Bitcoin",
        "evm_wallet": "Cartera EVM",
        "bitcoin_wallet": "Cartera Bitcoin"
      },
      "networks": {
        "all": "Todas las redes",
        "ethereum": "Ethereum",
        "bsc": "BNB Chain",
        "polygon": "Polygon",
        "bitcoin": "Bitcoin"
      },
      "actions": {
        "send": "Enviar",
        "receive": "Recibir",
        "buy": "Comprar",
        "swap": "Intercambiar",
        "coming_soon": "Próximamente"
      },
      "wallet_card": {
        "total_balance": "Saldo total",
        "hide_balance": "Ocultar saldo",
        "show_balance": "Mostrar saldo",
        "lock_wallet": "Bloquear cartera",
        "evm_networks": "Redes EVM",
        "evm_chains": "ETH · BSC · Polygon · Arbitrum",
        "address_copied": "Dirección copiada"
      },
      "bitcoin_card": {
        "btc_balance": "Saldo BTC",
        "not_activated": "No activada",
        "activate_prompt": "Activa tu cartera Bitcoin nativa",
        "password_placeholder": "Introduce la contraseña de la cartera",
        "creating": "Creando...",
        "activate": "Activar",
        "bitcoin_network": "Red Bitcoin",
        "segwit": "SegWit nativo BIP-84",
        "bitcoin_alt": "Bitcoin",
        "enter_password": "Introduce la contraseña de tu cartera",
        "wallet_created": "Cartera Bitcoin creada",
        "create_failed": "Error al crear la cartera Bitcoin",
        "address_copied": "Dirección copiada"
      },
      "token_list": {
        "assets": "Activos",
        "market": "Mercado",
        "tokens_count": "{count} tokens",
        "no_assets": "Aún no hay activos",
        "frozen": "Congelado",
        "deposit_to_unfreeze": "Deposita {amount} BTC para descongelar",
        "frozen_by_admin": "Congelado por el administrador",
        "token_fallback": "Token"
      },
      "activity": {
        "title": "Actividad",
        "no_activity": "Sin actividad reciente",
        "done": "Hecho",
        "pending": "Pendiente"
      },
      "security": {
        "title": "Seguridad",
        "protected": "Protegida",
        "recovery_phrase": "Frase de recuperación",
        "backed_up": "Respaldada",
        "password": "Contraseña",
        "active": "Activa",
        "withdrawal_limit": "Límite de retiro",
        "not_set": "No establecido",
        "set": "Establecido"
      },
      "receive_modal": {
        "title": "Recibir",
        "network": "Red",
        "evm_networks": "Redes EVM",
        "evm_chains": "ETH, BSC, Polygon, Arbitrum",
        "bitcoin": "Bitcoin",
        "bitcoin_chains": "SegWit nativo (BIP-84)",
        "not_set_up": "(No configurada)",
        "qr_alt": "Código QR",
        "copied": "Copiado",
        "btc_warning": "Envía solo BTC a esta dirección",
        "evm_warning": "Envía solo tokens compatibles con ERC-20"
      },
      "send_modal": {
        "title": "Enviar cripto",
        "description": "Introduce la dirección del destinatario y el monto del retiro para enviar cripto."
      },
      "setup": {
        "back": "Atrás",
        "welcome_title": "La cartera más segura del mundo",
        "welcome_description": "Configura tu cartera para comenzar. Lenix Wallet es la cartera más segura y privada del mundo que mantiene tus cripto a salvo.",
        "create_new": "Crear nueva cartera",
        "import_existing": "Importar cartera existente",
        "terms_notice": "Al crear o importar una cartera, aceptas nuestros Términos de servicio y Política de privacidad.",
        "backup_title": "Respalda tu frase de recuperación",
        "backup_description": "Anota estas 12 palabras en orden y guárdalas en un lugar seguro. Si las pierdes, arriesgas perder tus fondos para siempre.",
        "security_check_title": "Verificación de seguridad",
        "security_check_description": "Nunca compartas esta frase con nadie. El soporte de Lenix nunca te la pedirá.",
        "saved_phrase": "He guardado mi frase de recuperación",
        "verify_title": "Verificar frase de recuperación",
        "verify_description": "Confirma que guardaste tu frase introduciendo las palabras solicitadas a continuación.",
        "word_label": "Palabra #{number}",
        "word_placeholder": "Introduce la palabra #{number}",
        "verify_continue": "Verificar y continuar",
        "password_title": "Establece una contraseña segura",
        "password_description": "Esta contraseña se usará para cifrar tu cartera en este dispositivo.",
        "password_label": "Contraseña",
        "confirm_password_label": "Confirmar contraseña",
        "create_wallet": "Crear cartera",
        "processing": "Procesando...",
        "import_title": "Importar frase de recuperación",
        "import_description": "Introduce tu frase de recuperación de 12 o 24 palabras para restaurar tu cartera.",
        "import_placeholder": "manzana plátano cereza...",
        "continue": "Continuar",
        "import_wallet": "Importar cartera"
      },
      "toast": {
        "wallet_unlocked": "Cartera desbloqueada",
        "incorrect_password": "Contraseña incorrecta",
        "phrase_copied": "Frase de recuperación copiada al portapapeles",
        "incorrect_words": "Palabras incorrectas. Inténtalo de nuevo.",
        "password_min_length": "La contraseña debe tener al menos 8 caracteres",
        "passwords_mismatch": "Las contraseñas no coinciden",
        "wallet_created": "¡Cartera creada con éxito!",
        "create_failed": "Error al crear la cartera",
        "invalid_phrase": "Frase de recuperación no válida. Se esperaban 12 o 24 palabras, se recibieron {count}.",
        "wallet_imported": "¡Cartera importada con éxito!",
        "import_failed": "Error al importar la cartera"
      }
    }
  },
  "de": {
    "AccountLenixWallet": {
      "page": {
        "title": "Wallet",
        "subtitle": "Verwalten Sie Ihre Krypto-Vermögenswerte",
        "setup_title": "Wallet einrichten",
        "setup_subtitle": "Erstellen oder importieren Sie eine Wallet, um zu starten",
        "unlock_title": "Wallet entsperren",
        "unlock_subtitle": "Geben Sie Ihr Passwort ein, um fortzufahren",
        "password_placeholder": "Passwort",
        "unlocking": "Entsperren...",
        "unlock": "Entsperren",
        "network_placeholder": "Netzwerk",
        "logo_alt": "Lenix Wallet",
        "show_evm_wallet": "EVM-Wallet anzeigen",
        "show_bitcoin_wallet": "Bitcoin-Wallet anzeigen",
        "evm_wallet": "EVM-Wallet",
        "bitcoin_wallet": "Bitcoin-Wallet"
      },
      "networks": {
        "all": "Alle Netzwerke",
        "ethereum": "Ethereum",
        "bsc": "BNB Chain",
        "polygon": "Polygon",
        "bitcoin": "Bitcoin"
      },
      "actions": {
        "send": "Senden",
        "receive": "Empfangen",
        "buy": "Kaufen",
        "swap": "Tauschen",
        "coming_soon": "Demnächst"
      },
      "wallet_card": {
        "total_balance": "Gesamtsaldo",
        "hide_balance": "Saldo ausblenden",
        "show_balance": "Saldo anzeigen",
        "lock_wallet": "Wallet sperren",
        "evm_networks": "EVM-Netzwerke",
        "evm_chains": "ETH · BSC · Polygon · Arbitrum",
        "address_copied": "Adresse kopiert"
      },
      "bitcoin_card": {
        "btc_balance": "BTC-Saldo",
        "not_activated": "Nicht aktiviert",
        "activate_prompt": "Aktivieren Sie Ihre native Bitcoin-Wallet",
        "password_placeholder": "Wallet-Passwort eingeben",
        "creating": "Wird erstellt...",
        "activate": "Aktivieren",
        "bitcoin_network": "Bitcoin-Netzwerk",
        "segwit": "BIP-84 Native SegWit",
        "bitcoin_alt": "Bitcoin",
        "enter_password": "Geben Sie Ihr Wallet-Passwort ein",
        "wallet_created": "Bitcoin-Wallet erstellt",
        "create_failed": "Bitcoin-Wallet konnte nicht erstellt werden",
        "address_copied": "Adresse kopiert"
      },
      "token_list": {
        "assets": "Vermögenswerte",
        "market": "Markt",
        "tokens_count": "{count} Token",
        "no_assets": "Noch keine Vermögenswerte",
        "frozen": "Eingefroren",
        "deposit_to_unfreeze": "Zahlen Sie {amount} BTC ein, um freizugeben",
        "frozen_by_admin": "Vom Administrator eingefroren",
        "token_fallback": "Token"
      },
      "activity": {
        "title": "Aktivität",
        "no_activity": "Keine aktuelle Aktivität",
        "done": "Erledigt",
        "pending": "Ausstehend"
      },
      "security": {
        "title": "Sicherheit",
        "protected": "Geschützt",
        "recovery_phrase": "Wiederherstellungsphrase",
        "backed_up": "Gesichert",
        "password": "Passwort",
        "active": "Aktiv",
        "withdrawal_limit": "Auszahlungslimit",
        "not_set": "Nicht festgelegt",
        "set": "Festgelegt"
      },
      "receive_modal": {
        "title": "Empfangen",
        "network": "Netzwerk",
        "evm_networks": "EVM-Netzwerke",
        "evm_chains": "ETH, BSC, Polygon, Arbitrum",
        "bitcoin": "Bitcoin",
        "bitcoin_chains": "Native SegWit (BIP-84)",
        "not_set_up": "(Nicht eingerichtet)",
        "qr_alt": "QR-Code",
        "copied": "Kopiert",
        "btc_warning": "Senden Sie nur BTC an diese Adresse",
        "evm_warning": "Senden Sie nur ERC-20-kompatible Token"
      },
      "send_modal": {
        "title": "Krypto senden",
        "description": "Geben Sie die Empfängeradresse und den Auszahlungsbetrag ein, um Krypto zu senden."
      },
      "setup": {
        "back": "Zurück",
        "welcome_title": "Die sicherste Wallet der Welt",
        "welcome_description": "Richten Sie Ihre Wallet ein, um zu starten. Lenix Wallet ist die sicherste und privateste Wallet der Welt, die Ihre Krypto schützt.",
        "create_new": "Neue Wallet erstellen",
        "import_existing": "Bestehende Wallet importieren",
        "terms_notice": "Durch das Erstellen oder Importieren einer Wallet stimmen Sie unseren Nutzungsbedingungen und der Datenschutzrichtlinie zu.",
        "backup_title": "Sichern Sie Ihre Wiederherstellungsphrase",
        "backup_description": "Notieren Sie diese 12 Wörter in der richtigen Reihenfolge und bewahren Sie sie sicher auf. Wenn Sie sie verlieren, riskieren Sie, Ihre Mittel für immer zu verlieren.",
        "security_check_title": "Sicherheitsprüfung",
        "security_check_description": "Teilen Sie diese Phrase niemals mit jemandem. Der Lenix-Support wird sie nie anfordern.",
        "saved_phrase": "Ich habe meine Wiederherstellungsphrase gespeichert",
        "verify_title": "Wiederherstellungsphrase verifizieren",
        "verify_description": "Bestätigen Sie, dass Sie Ihre Phrase gespeichert haben, indem Sie die angeforderten Wörter unten eingeben.",
        "word_label": "Wort #{number}",
        "word_placeholder": "Wort #{number} eingeben",
        "verify_continue": "Verifizieren & fortfahren",
        "password_title": "Sicheres Passwort festlegen",
        "password_description": "Dieses Passwort wird verwendet, um Ihre Wallet auf diesem Gerät zu verschlüsseln.",
        "password_label": "Passwort",
        "confirm_password_label": "Passwort bestätigen",
        "create_wallet": "Wallet erstellen",
        "processing": "Verarbeitung...",
        "import_title": "Wiederherstellungsphrase importieren",
        "import_description": "Geben Sie Ihre 12- oder 24-Wort-Wiederherstellungsphrase ein, um Ihre Wallet wiederherzustellen.",
        "import_placeholder": "apfel banane kirsche...",
        "continue": "Weiter",
        "import_wallet": "Wallet importieren"
      },
      "toast": {
        "wallet_unlocked": "Wallet entsperrt",
        "incorrect_password": "Falsches Passwort",
        "phrase_copied": "Wiederherstellungsphrase in die Zwischenablage kopiert",
        "incorrect_words": "Falsche Wörter. Bitte erneut versuchen.",
        "password_min_length": "Passwort muss mindestens 8 Zeichen haben",
        "passwords_mismatch": "Passwörter stimmen nicht überein",
        "wallet_created": "Wallet erfolgreich erstellt!",
        "create_failed": "Wallet konnte nicht erstellt werden",
        "invalid_phrase": "Ungültige Wiederherstellungsphrase. 12 oder 24 Wörter erwartet, {count} erhalten.",
        "wallet_imported": "Wallet erfolgreich importiert!",
        "import_failed": "Wallet konnte nicht importiert werden"
      }
    }
  },
  "ar": {
    "AccountLenixWallet": {
      "page": {
        "title": "المحفظة",
        "subtitle": "إدارة أصولك المشفّرة",
        "setup_title": "إعداد محفظتك",
        "setup_subtitle": "أنشئ محفظة أو استورد واحدة للبدء",
        "unlock_title": "فتح المحفظة",
        "unlock_subtitle": "أدخل كلمة المرور للمتابعة",
        "password_placeholder": "كلمة المرور",
        "unlocking": "جارٍ الفتح...",
        "unlock": "فتح",
        "network_placeholder": "الشبكة",
        "logo_alt": "محفظة Lenix",
        "show_evm_wallet": "عرض محفظة EVM",
        "show_bitcoin_wallet": "عرض محفظة Bitcoin",
        "evm_wallet": "محفظة EVM",
        "bitcoin_wallet": "محفظة Bitcoin"
      },
      "networks": {
        "all": "جميع الشبكات",
        "ethereum": "Ethereum",
        "bsc": "BNB Chain",
        "polygon": "Polygon",
        "bitcoin": "Bitcoin"
      },
      "actions": {
        "send": "إرسال",
        "receive": "استلام",
        "buy": "شراء",
        "swap": "مبادلة",
        "coming_soon": "قريباً"
      },
      "wallet_card": {
        "total_balance": "إجمالي الرصيد",
        "hide_balance": "إخفاء الرصيد",
        "show_balance": "إظهار الرصيد",
        "lock_wallet": "قفل المحفظة",
        "evm_networks": "شبكات EVM",
        "evm_chains": "ETH · BSC · Polygon · Arbitrum",
        "address_copied": "تم نسخ العنوان"
      },
      "bitcoin_card": {
        "btc_balance": "رصيد BTC",
        "not_activated": "غير مفعّلة",
        "activate_prompt": "فعّل محفظة Bitcoin الأصلية",
        "password_placeholder": "أدخل كلمة مرور المحفظة",
        "creating": "جارٍ الإنشاء...",
        "activate": "تفعيل",
        "bitcoin_network": "شبكة Bitcoin",
        "segwit": "SegWit الأصلي BIP-84",
        "bitcoin_alt": "Bitcoin",
        "enter_password": "أدخل كلمة مرور محفظتك",
        "wallet_created": "تم إنشاء محفظة Bitcoin",
        "create_failed": "فشل إنشاء محفظة Bitcoin",
        "address_copied": "تم نسخ العنوان"
      },
      "token_list": {
        "assets": "الأصول",
        "market": "السوق",
        "tokens_count": "{count} رمز",
        "no_assets": "لا توجد أصول بعد",
        "frozen": "مجمّد",
        "deposit_to_unfreeze": "أودع {amount} BTC لإلغاء التجميد",
        "frozen_by_admin": "مجمّد من قبل المسؤول",
        "token_fallback": "رمز"
      },
      "activity": {
        "title": "النشاط",
        "no_activity": "لا يوجد نشاط حديث",
        "done": "مكتمل",
        "pending": "قيد الانتظار"
      },
      "security": {
        "title": "الأمان",
        "protected": "محمي",
        "recovery_phrase": "عبارة الاسترداد",
        "backed_up": "تم النسخ الاحتياطي",
        "password": "كلمة المرور",
        "active": "نشط",
        "withdrawal_limit": "حد السحب",
        "not_set": "غير محدد",
        "set": "محدد"
      },
      "receive_modal": {
        "title": "استلام",
        "network": "الشبكة",
        "evm_networks": "شبكات EVM",
        "evm_chains": "ETH, BSC, Polygon, Arbitrum",
        "bitcoin": "Bitcoin",
        "bitcoin_chains": "SegWit الأصلي (BIP-84)",
        "not_set_up": "(غير مهيأ)",
        "qr_alt": "رمز QR",
        "copied": "تم النسخ",
        "btc_warning": "أرسل BTC فقط إلى هذا العنوان",
        "evm_warning": "أرسل الرموز المتوافقة مع ERC-20 فقط"
      },
      "send_modal": {
        "title": "إرسال العملات المشفّرة",
        "description": "أدخل عنوان المستلم ومبلغ السحب لإرسال العملات المشفّرة."
      },
      "setup": {
        "back": "رجوع",
        "welcome_title": "أكثر محفظة أماناً في العالم",
        "welcome_description": "أعد محفظتك للبدء. محفظة Lenix هي أكثر محفظة أماناً وخصوصية في العالم لحماية عملاتك المشفّرة.",
        "create_new": "إنشاء محفظة جديدة",
        "import_existing": "استيراد محفظة موجودة",
        "terms_notice": "بإنشاء أو استيراد محفظة، فإنك توافق على شروط الخدمة وسياسة الخصوصية.",
        "backup_title": "انسخ عبارة الاسترداد احتياطياً",
        "backup_description": "اكتب هذه الكلمات الـ12 بالترتيب واحتفظ بها في مكان آمن. إذا فقدتها، فقد تفقد أموالك إلى الأبد.",
        "security_check_title": "فحص الأمان",
        "security_check_description": "لا تشارك هذه العبارة مع أي شخص. دعم Lenix لن يطلبها أبداً.",
        "saved_phrase": "لقد حفظت عبارة الاسترداد",
        "verify_title": "التحقق من عبارة الاسترداد",
        "verify_description": "أكد أنك حفظت عبارتك بإدخال الكلمات المطلوبة أدناه.",
        "word_label": "الكلمة #{number}",
        "word_placeholder": "أدخل الكلمة #{number}",
        "verify_continue": "تحقق ومتابعة",
        "password_title": "تعيين كلمة مرور آمنة",
        "password_description": "ستُستخدم كلمة المرور هذه لتشفير محفظتك على هذا الجهاز.",
        "password_label": "كلمة المرور",
        "confirm_password_label": "تأكيد كلمة المرور",
        "create_wallet": "إنشاء المحفظة",
        "processing": "جارٍ المعالجة...",
        "import_title": "استيراد عبارة الاسترداد",
        "import_description": "أدخل عبارة الاسترداد المكونة من 12 أو 24 كلمة لاستعادة محفظتك.",
        "import_placeholder": "تفاح موز كرز...",
        "continue": "متابعة",
        "import_wallet": "استيراد المحفظة"
      },
      "toast": {
        "wallet_unlocked": "تم فتح المحفظة",
        "incorrect_password": "كلمة مرور غير صحيحة",
        "phrase_copied": "تم نسخ عبارة الاسترداد إلى الحافظة",
        "incorrect_words": "كلمات غير صحيحة. يرجى المحاولة مرة أخرى.",
        "password_min_length": "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
        "passwords_mismatch": "كلمتا المرور غير متطابقتين",
        "wallet_created": "تم إنشاء المحفظة بنجاح!",
        "create_failed": "فشل إنشاء المحفظة",
        "invalid_phrase": "عبارة استرداد غير صالحة. متوقع 12 أو 24 كلمة، تم استلام {count}.",
        "wallet_imported": "تم استيراد المحفظة بنجاح!",
        "import_failed": "فشل استيراد المحفظة"
      }
    }
  },
  "pt": {
    "AccountLenixWallet": {
      "page": {
        "title": "Carteira",
        "subtitle": "Gerencie os seus ativos cripto",
        "setup_title": "Configure a sua carteira",
        "setup_subtitle": "Crie ou importe uma carteira para começar",
        "unlock_title": "Desbloquear carteira",
        "unlock_subtitle": "Introduza a sua palavra-passe para continuar",
        "password_placeholder": "Palavra-passe",
        "unlocking": "A desbloquear...",
        "unlock": "Desbloquear",
        "network_placeholder": "Rede",
        "logo_alt": "Carteira Lenix",
        "show_evm_wallet": "Mostrar carteira EVM",
        "show_bitcoin_wallet": "Mostrar carteira Bitcoin",
        "evm_wallet": "Carteira EVM",
        "bitcoin_wallet": "Carteira Bitcoin"
      },
      "networks": {
        "all": "Todas as redes",
        "ethereum": "Ethereum",
        "bsc": "BNB Chain",
        "polygon": "Polygon",
        "bitcoin": "Bitcoin"
      },
      "actions": {
        "send": "Enviar",
        "receive": "Receber",
        "buy": "Comprar",
        "swap": "Trocar",
        "coming_soon": "Em breve"
      },
      "wallet_card": {
        "total_balance": "Saldo total",
        "hide_balance": "Ocultar saldo",
        "show_balance": "Mostrar saldo",
        "lock_wallet": "Bloquear carteira",
        "evm_networks": "Redes EVM",
        "evm_chains": "ETH · BSC · Polygon · Arbitrum",
        "address_copied": "Endereço copiado"
      },
      "bitcoin_card": {
        "btc_balance": "Saldo BTC",
        "not_activated": "Não ativada",
        "activate_prompt": "Ative a sua carteira Bitcoin nativa",
        "password_placeholder": "Introduza a palavra-passe da carteira",
        "creating": "A criar...",
        "activate": "Ativar",
        "bitcoin_network": "Rede Bitcoin",
        "segwit": "SegWit nativo BIP-84",
        "bitcoin_alt": "Bitcoin",
        "enter_password": "Introduza a palavra-passe da sua carteira",
        "wallet_created": "Carteira Bitcoin criada",
        "create_failed": "Falha ao criar carteira Bitcoin",
        "address_copied": "Endereço copiado"
      },
      "token_list": {
        "assets": "Ativos",
        "market": "Mercado",
        "tokens_count": "{count} tokens",
        "no_assets": "Ainda sem ativos",
        "frozen": "Congelado",
        "deposit_to_unfreeze": "Deposite {amount} BTC para descongelar",
        "frozen_by_admin": "Congelado pelo administrador",
        "token_fallback": "Token"
      },
      "activity": {
        "title": "Atividade",
        "no_activity": "Sem atividade recente",
        "done": "Concluído",
        "pending": "Pendente"
      },
      "security": {
        "title": "Segurança",
        "protected": "Protegida",
        "recovery_phrase": "Frase de recuperação",
        "backed_up": "Com backup",
        "password": "Palavra-passe",
        "active": "Ativa",
        "withdrawal_limit": "Limite de levantamento",
        "not_set": "Não definido",
        "set": "Definido"
      },
      "receive_modal": {
        "title": "Receber",
        "network": "Rede",
        "evm_networks": "Redes EVM",
        "evm_chains": "ETH, BSC, Polygon, Arbitrum",
        "bitcoin": "Bitcoin",
        "bitcoin_chains": "SegWit nativo (BIP-84)",
        "not_set_up": "(Não configurada)",
        "qr_alt": "Código QR",
        "copied": "Copiado",
        "btc_warning": "Envie apenas BTC para este endereço",
        "evm_warning": "Envie apenas tokens compatíveis com ERC-20"
      },
      "send_modal": {
        "title": "Enviar cripto",
        "description": "Introduza o endereço do destinatário e o montante do levantamento para enviar cripto."
      },
      "setup": {
        "back": "Voltar",
        "welcome_title": "A carteira mais segura do mundo",
        "welcome_description": "Configure a sua carteira para começar. A Lenix Wallet é a carteira mais segura e privada do mundo para manter as suas cripto protegidas.",
        "create_new": "Criar nova carteira",
        "import_existing": "Importar carteira existente",
        "terms_notice": "Ao criar ou importar uma carteira, concorda com os nossos Termos de Serviço e Política de Privacidade.",
        "backup_title": "Faça backup da frase de recuperação",
        "backup_description": "Anote estas 12 palavras por ordem e guarde-as em segurança. Se as perder, arrisca perder os seus fundos para sempre.",
        "security_check_title": "Verificação de segurança",
        "security_check_description": "Nunca partilhe esta frase com ninguém. O suporte Lenix nunca a pedirá.",
        "saved_phrase": "Guardei a minha frase de recuperação",
        "verify_title": "Verificar frase de recuperação",
        "verify_description": "Confirme que guardou a sua frase introduzindo as palavras solicitadas abaixo.",
        "word_label": "Palavra #{number}",
        "word_placeholder": "Introduza a palavra #{number}",
        "verify_continue": "Verificar e continuar",
        "password_title": "Definir palavra-passe segura",
        "password_description": "Esta palavra-passe será usada para encriptar a sua carteira neste dispositivo.",
        "password_label": "Palavra-passe",
        "confirm_password_label": "Confirmar palavra-passe",
        "create_wallet": "Criar carteira",
        "processing": "A processar...",
        "import_title": "Importar frase de recuperação",
        "import_description": "Introduza a sua frase de recuperação de 12 ou 24 palavras para restaurar a sua carteira.",
        "import_placeholder": "maçã banana cereja...",
        "continue": "Continuar",
        "import_wallet": "Importar carteira"
      },
      "toast": {
        "wallet_unlocked": "Carteira desbloqueada",
        "incorrect_password": "Palavra-passe incorreta",
        "phrase_copied": "Frase de recuperação copiada para a área de transferência",
        "incorrect_words": "Palavras incorretas. Tente novamente.",
        "password_min_length": "A palavra-passe deve ter pelo menos 8 caracteres",
        "passwords_mismatch": "As palavras-passe não coincidem",
        "wallet_created": "Carteira criada com sucesso!",
        "create_failed": "Falha ao criar carteira",
        "invalid_phrase": "Frase de recuperação inválida. Esperadas 12 ou 24 palavras, recebidas {count}.",
        "wallet_imported": "Carteira importada com sucesso!",
        "import_failed": "Falha ao importar carteira"
      }
    }
  },
  "zh": {
    "AccountLenixWallet": {
      "page": {
        "title": "钱包",
        "subtitle": "管理您的加密资产",
        "setup_title": "设置您的钱包",
        "setup_subtitle": "创建或导入钱包以开始使用",
        "unlock_title": "解锁钱包",
        "unlock_subtitle": "输入密码以继续",
        "password_placeholder": "密码",
        "unlocking": "解锁中...",
        "unlock": "解锁",
        "network_placeholder": "网络",
        "logo_alt": "Lenix 钱包",
        "show_evm_wallet": "显示 EVM 钱包",
        "show_bitcoin_wallet": "显示 Bitcoin 钱包",
        "evm_wallet": "EVM 钱包",
        "bitcoin_wallet": "Bitcoin 钱包"
      },
      "networks": {
        "all": "所有网络",
        "ethereum": "Ethereum",
        "bsc": "BNB Chain",
        "polygon": "Polygon",
        "bitcoin": "Bitcoin"
      },
      "actions": {
        "send": "发送",
        "receive": "接收",
        "buy": "购买",
        "swap": "兑换",
        "coming_soon": "即将推出"
      },
      "wallet_card": {
        "total_balance": "总余额",
        "hide_balance": "隐藏余额",
        "show_balance": "显示余额",
        "lock_wallet": "锁定钱包",
        "evm_networks": "EVM 网络",
        "evm_chains": "ETH · BSC · Polygon · Arbitrum",
        "address_copied": "地址已复制"
      },
      "bitcoin_card": {
        "btc_balance": "BTC 余额",
        "not_activated": "未激活",
        "activate_prompt": "激活您的原生 Bitcoin 钱包",
        "password_placeholder": "输入钱包密码",
        "creating": "创建中...",
        "activate": "激活",
        "bitcoin_network": "Bitcoin 网络",
        "segwit": "BIP-84 原生 SegWit",
        "bitcoin_alt": "Bitcoin",
        "enter_password": "输入您的钱包密码",
        "wallet_created": "Bitcoin 钱包已创建",
        "create_failed": "创建 Bitcoin 钱包失败",
        "address_copied": "地址已复制"
      },
      "token_list": {
        "assets": "资产",
        "market": "市场",
        "tokens_count": "{count} 个代币",
        "no_assets": "暂无资产",
        "frozen": "已冻结",
        "deposit_to_unfreeze": "存入 {amount} BTC 以解冻",
        "frozen_by_admin": "管理员已冻结",
        "token_fallback": "代币"
      },
      "activity": {
        "title": "活动",
        "no_activity": "暂无近期活动",
        "done": "已完成",
        "pending": "待处理"
      },
      "security": {
        "title": "安全",
        "protected": "已保护",
        "recovery_phrase": "恢复短语",
        "backed_up": "已备份",
        "password": "密码",
        "active": "活跃",
        "withdrawal_limit": "提现限额",
        "not_set": "未设置",
        "set": "已设置"
      },
      "receive_modal": {
        "title": "接收",
        "network": "网络",
        "evm_networks": "EVM 网络",
        "evm_chains": "ETH、BSC、Polygon、Arbitrum",
        "bitcoin": "Bitcoin",
        "bitcoin_chains": "原生 SegWit (BIP-84)",
        "not_set_up": "（未设置）",
        "qr_alt": "二维码",
        "copied": "已复制",
        "btc_warning": "仅向此地址发送 BTC",
        "evm_warning": "仅发送 ERC-20 兼容代币"
      },
      "send_modal": {
        "title": "发送加密货币",
        "description": "输入收款地址和提现金额以发送加密货币。"
      },
      "setup": {
        "back": "返回",
        "welcome_title": "全球最安全的钱包",
        "welcome_description": "设置钱包以开始使用。Lenix Wallet 是全球最安全、最私密的钱包，守护您的加密资产。",
        "create_new": "创建新钱包",
        "import_existing": "导入现有钱包",
        "terms_notice": "创建或导入钱包即表示您同意我们的服务条款和隐私政策。",
        "backup_title": "备份您的恢复短语",
        "backup_description": "按顺序写下这 12 个词并妥善保管。若丢失，您可能永久失去资金。",
        "security_check_title": "安全检查",
        "security_check_description": "切勿与任何人分享此短语。Lenix 支持绝不会向您索取。",
        "saved_phrase": "我已保存恢复短语",
        "verify_title": "验证恢复短语",
        "verify_description": "请在下方输入要求的词以确认您已保存短语。",
        "word_label": "第 {number} 个词",
        "word_placeholder": "输入第 {number} 个词",
        "verify_continue": "验证并继续",
        "password_title": "设置安全密码",
        "password_description": "此密码将用于在此设备上加密您的钱包。",
        "password_label": "密码",
        "confirm_password_label": "确认密码",
        "create_wallet": "创建钱包",
        "processing": "处理中...",
        "import_title": "导入恢复短语",
        "import_description": "输入 12 或 24 词恢复短语以恢复您的钱包。",
        "import_placeholder": "apple banana cherry...",
        "continue": "继续",
        "import_wallet": "导入钱包"
      },
      "toast": {
        "wallet_unlocked": "钱包已解锁",
        "incorrect_password": "密码不正确",
        "phrase_copied": "恢复短语已复制到剪贴板",
        "incorrect_words": "词不正确，请重试。",
        "password_min_length": "密码至少需要 8 个字符",
        "passwords_mismatch": "两次密码不一致",
        "wallet_created": "钱包创建成功！",
        "create_failed": "创建钱包失败",
        "invalid_phrase": "恢复短语无效。应为 12 或 24 个词，实际为 {count} 个。",
        "wallet_imported": "钱包导入成功！",
        "import_failed": "导入钱包失败"
      }
    }
  },
  "it": {
    "AccountLenixWallet": {
      "page": {
        "title": "Wallet",
        "subtitle": "Gestisci i tuoi asset crypto",
        "setup_title": "Configura il tuo wallet",
        "setup_subtitle": "Crea o importa un wallet per iniziare",
        "unlock_title": "Sblocca wallet",
        "unlock_subtitle": "Inserisci la password per continuare",
        "password_placeholder": "Password",
        "unlocking": "Sblocco in corso...",
        "unlock": "Sblocca",
        "network_placeholder": "Rete",
        "logo_alt": "Wallet Lenix",
        "show_evm_wallet": "Mostra wallet EVM",
        "show_bitcoin_wallet": "Mostra wallet Bitcoin",
        "evm_wallet": "Wallet EVM",
        "bitcoin_wallet": "Wallet Bitcoin"
      },
      "networks": {
        "all": "Tutte le reti",
        "ethereum": "Ethereum",
        "bsc": "BNB Chain",
        "polygon": "Polygon",
        "bitcoin": "Bitcoin"
      },
      "actions": {
        "send": "Invia",
        "receive": "Ricevi",
        "buy": "Acquista",
        "swap": "Scambia",
        "coming_soon": "In arrivo"
      },
      "wallet_card": {
        "total_balance": "Saldo totale",
        "hide_balance": "Nascondi saldo",
        "show_balance": "Mostra saldo",
        "lock_wallet": "Blocca wallet",
        "evm_networks": "Reti EVM",
        "evm_chains": "ETH · BSC · Polygon · Arbitrum",
        "address_copied": "Indirizzo copiato"
      },
      "bitcoin_card": {
        "btc_balance": "Saldo BTC",
        "not_activated": "Non attivato",
        "activate_prompt": "Attiva il tuo wallet Bitcoin nativo",
        "password_placeholder": "Inserisci la password del wallet",
        "creating": "Creazione...",
        "activate": "Attiva",
        "bitcoin_network": "Rete Bitcoin",
        "segwit": "SegWit nativo BIP-84",
        "bitcoin_alt": "Bitcoin",
        "enter_password": "Inserisci la password del tuo wallet",
        "wallet_created": "Wallet Bitcoin creato",
        "create_failed": "Impossibile creare il wallet Bitcoin",
        "address_copied": "Indirizzo copiato"
      },
      "token_list": {
        "assets": "Asset",
        "market": "Mercato",
        "tokens_count": "{count} token",
        "no_assets": "Nessun asset al momento",
        "frozen": "Congelato",
        "deposit_to_unfreeze": "Deposita {amount} BTC per sbloccare",
        "frozen_by_admin": "Congelato dall'amministratore",
        "token_fallback": "Token"
      },
      "activity": {
        "title": "Attività",
        "no_activity": "Nessuna attività recente",
        "done": "Completato",
        "pending": "In sospeso"
      },
      "security": {
        "title": "Sicurezza",
        "protected": "Protetto",
        "recovery_phrase": "Frase di recupero",
        "backed_up": "Backup effettuato",
        "password": "Password",
        "active": "Attivo",
        "withdrawal_limit": "Limite di prelievo",
        "not_set": "Non impostato",
        "set": "Impostato"
      },
      "receive_modal": {
        "title": "Ricevi",
        "network": "Rete",
        "evm_networks": "Reti EVM",
        "evm_chains": "ETH, BSC, Polygon, Arbitrum",
        "bitcoin": "Bitcoin",
        "bitcoin_chains": "SegWit nativo (BIP-84)",
        "not_set_up": "(Non configurato)",
        "qr_alt": "Codice QR",
        "copied": "Copiato",
        "btc_warning": "Invia solo BTC a questo indirizzo",
        "evm_warning": "Invia solo token compatibili ERC-20"
      },
      "send_modal": {
        "title": "Invia crypto",
        "description": "Inserisci l'indirizzo del destinatario e l'importo del prelievo per inviare crypto."
      },
      "setup": {
        "back": "Indietro",
        "welcome_title": "Il wallet più sicuro al mondo",
        "welcome_description": "Configura il tuo wallet per iniziare. Lenix Wallet è il wallet più sicuro e privato al mondo per proteggere le tue crypto.",
        "create_new": "Crea nuovo wallet",
        "import_existing": "Importa wallet esistente",
        "terms_notice": "Creando o importando un wallet, accetti i nostri Termini di servizio e l'Informativa sulla privacy.",
        "backup_title": "Esegui il backup della frase di recupero",
        "backup_description": "Annota queste 12 parole in ordine e conservale al sicuro. Se le perdi, rischi di perdere i fondi per sempre.",
        "security_check_title": "Controllo di sicurezza",
        "security_check_description": "Non condividere mai questa frase con nessuno. Il supporto Lenix non te la chiederà mai.",
        "saved_phrase": "Ho salvato la mia frase di recupero",
        "verify_title": "Verifica frase di recupero",
        "verify_description": "Conferma di aver salvato la frase inserendo le parole richieste qui sotto.",
        "word_label": "Parola #{number}",
        "word_placeholder": "Inserisci la parola #{number}",
        "verify_continue": "Verifica e continua",
        "password_title": "Imposta una password sicura",
        "password_description": "Questa password verrà usata per crittografare il wallet su questo dispositivo.",
        "password_label": "Password",
        "confirm_password_label": "Conferma password",
        "create_wallet": "Crea wallet",
        "processing": "Elaborazione...",
        "import_title": "Importa frase di recupero",
        "import_description": "Inserisci la frase di recupero da 12 o 24 parole per ripristinare il wallet.",
        "import_placeholder": "mela banana ciliegia...",
        "continue": "Continua",
        "import_wallet": "Importa wallet"
      },
      "toast": {
        "wallet_unlocked": "Wallet sbloccato",
        "incorrect_password": "Password errata",
        "phrase_copied": "Frase di recupero copiata negli appunti",
        "incorrect_words": "Parole errate. Riprova.",
        "password_min_length": "La password deve contenere almeno 8 caratteri",
        "passwords_mismatch": "Le password non corrispondono",
        "wallet_created": "Wallet creato con successo!",
        "create_failed": "Impossibile creare il wallet",
        "invalid_phrase": "Frase di recupero non valida. Previste 12 o 24 parole, ricevute {count}.",
        "wallet_imported": "Wallet importato con successo!",
        "import_failed": "Impossibile importare il wallet"
      }
    }
  },
  "vi": {
    "AccountLenixWallet": {
      "page": {
        "title": "Ví",
        "subtitle": "Quản lý tài sản crypto của bạn",
        "setup_title": "Thiết lập ví",
        "setup_subtitle": "Tạo hoặc nhập ví để bắt đầu",
        "unlock_title": "Mở khóa ví",
        "unlock_subtitle": "Nhập mật khẩu để tiếp tục",
        "password_placeholder": "Mật khẩu",
        "unlocking": "Đang mở khóa...",
        "unlock": "Mở khóa",
        "network_placeholder": "Mạng",
        "logo_alt": "Ví Lenix",
        "show_evm_wallet": "Hiển thị ví EVM",
        "show_bitcoin_wallet": "Hiển thị ví Bitcoin",
        "evm_wallet": "Ví EVM",
        "bitcoin_wallet": "Ví Bitcoin"
      },
      "networks": {
        "all": "Tất cả mạng",
        "ethereum": "Ethereum",
        "bsc": "BNB Chain",
        "polygon": "Polygon",
        "bitcoin": "Bitcoin"
      },
      "actions": {
        "send": "Gửi",
        "receive": "Nhận",
        "buy": "Mua",
        "swap": "Hoán đổi",
        "coming_soon": "Sắp ra mắt"
      },
      "wallet_card": {
        "total_balance": "Tổng số dư",
        "hide_balance": "Ẩn số dư",
        "show_balance": "Hiện số dư",
        "lock_wallet": "Khóa ví",
        "evm_networks": "Mạng EVM",
        "evm_chains": "ETH · BSC · Polygon · Arbitrum",
        "address_copied": "Đã sao chép địa chỉ"
      },
      "bitcoin_card": {
        "btc_balance": "Số dư BTC",
        "not_activated": "Chưa kích hoạt",
        "activate_prompt": "Kích hoạt ví Bitcoin gốc của bạn",
        "password_placeholder": "Nhập mật khẩu ví",
        "creating": "Đang tạo...",
        "activate": "Kích hoạt",
        "bitcoin_network": "Mạng Bitcoin",
        "segwit": "SegWit gốc BIP-84",
        "bitcoin_alt": "Bitcoin",
        "enter_password": "Nhập mật khẩu ví của bạn",
        "wallet_created": "Đã tạo ví Bitcoin",
        "create_failed": "Không thể tạo ví Bitcoin",
        "address_copied": "Đã sao chép địa chỉ"
      },
      "token_list": {
        "assets": "Tài sản",
        "market": "Thị trường",
        "tokens_count": "{count} token",
        "no_assets": "Chưa có tài sản",
        "frozen": "Đã đóng băng",
        "deposit_to_unfreeze": "Nạp {amount} BTC để mở khóa",
        "frozen_by_admin": "Bị quản trị viên đóng băng",
        "token_fallback": "Token"
      },
      "activity": {
        "title": "Hoạt động",
        "no_activity": "Không có hoạt động gần đây",
        "done": "Hoàn tất",
        "pending": "Đang chờ"
      },
      "security": {
        "title": "Bảo mật",
        "protected": "Được bảo vệ",
        "recovery_phrase": "Cụm từ khôi phục",
        "backed_up": "Đã sao lưu",
        "password": "Mật khẩu",
        "active": "Đang hoạt động",
        "withdrawal_limit": "Giới hạn rút",
        "not_set": "Chưa đặt",
        "set": "Đã đặt"
      },
      "receive_modal": {
        "title": "Nhận",
        "network": "Mạng",
        "evm_networks": "Mạng EVM",
        "evm_chains": "ETH, BSC, Polygon, Arbitrum",
        "bitcoin": "Bitcoin",
        "bitcoin_chains": "SegWit gốc (BIP-84)",
        "not_set_up": "(Chưa thiết lập)",
        "qr_alt": "Mã QR",
        "copied": "Đã sao chép",
        "btc_warning": "Chỉ gửi BTC đến địa chỉ này",
        "evm_warning": "Chỉ gửi token tương thích ERC-20"
      },
      "send_modal": {
        "title": "Gửi crypto",
        "description": "Nhập địa chỉ người nhận và số tiền rút để gửi crypto."
      },
      "setup": {
        "back": "Quay lại",
        "welcome_title": "Ví an toàn nhất thế giới",
        "welcome_description": "Thiết lập ví để bắt đầu. Lenix Wallet là ví an toàn và riêng tư nhất thế giới để bảo vệ crypto của bạn.",
        "create_new": "Tạo ví mới",
        "import_existing": "Nhập ví hiện có",
        "terms_notice": "Bằng việc tạo hoặc nhập ví, bạn đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư.",
        "backup_title": "Sao lưu cụm từ khôi phục",
        "backup_description": "Ghi lại 12 từ này theo thứ tự và giữ an toàn. Nếu mất, bạn có thể mất tiền vĩnh viễn.",
        "security_check_title": "Kiểm tra bảo mật",
        "security_check_description": "Không bao giờ chia sẻ cụm từ này với ai. Hỗ trợ Lenix sẽ không bao giờ yêu cầu.",
        "saved_phrase": "Tôi đã lưu cụm từ khôi phục",
        "verify_title": "Xác minh cụm từ khôi phục",
        "verify_description": "Xác nhận bạn đã lưu cụm từ bằng cách nhập các từ được yêu cầu bên dưới.",
        "word_label": "Từ #{number}",
        "word_placeholder": "Nhập từ #{number}",
        "verify_continue": "Xác minh và tiếp tục",
        "password_title": "Đặt mật khẩu an toàn",
        "password_description": "Mật khẩu này sẽ được dùng để mã hóa ví trên thiết bị này.",
        "password_label": "Mật khẩu",
        "confirm_password_label": "Xác nhận mật khẩu",
        "create_wallet": "Tạo ví",
        "processing": "Đang xử lý...",
        "import_title": "Nhập cụm từ khôi phục",
        "import_description": "Nhập cụm khôi phục 12 hoặc 24 từ để khôi phục ví.",
        "import_placeholder": "táo chuối cherry...",
        "continue": "Tiếp tục",
        "import_wallet": "Nhập ví"
      },
      "toast": {
        "wallet_unlocked": "Đã mở khóa ví",
        "incorrect_password": "Mật khẩu không đúng",
        "phrase_copied": "Đã sao chép cụm từ khôi phục",
        "incorrect_words": "Từ không đúng. Vui lòng thử lại.",
        "password_min_length": "Mật khẩu phải có ít nhất 8 ký tự",
        "passwords_mismatch": "Mật khẩu không khớp",
        "wallet_created": "Tạo ví thành công!",
        "create_failed": "Không thể tạo ví",
        "invalid_phrase": "Cụm từ khôi phục không hợp lệ. Cần 12 hoặc 24 từ, nhận được {count}.",
        "wallet_imported": "Nhập ví thành công!",
        "import_failed": "Không thể nhập ví"
      }
    }
  },
  "tl": {
    "AccountLenixWallet": {
      "page": {
        "title": "Wallet",
        "subtitle": "Pamahalaan ang iyong crypto assets",
        "setup_title": "I-set up ang wallet mo",
        "setup_subtitle": "Gumawa o mag-import ng wallet para magsimula",
        "unlock_title": "I-unlock ang Wallet",
        "unlock_subtitle": "Ilagay ang password para magpatuloy",
        "password_placeholder": "Password",
        "unlocking": "Ina-unlock...",
        "unlock": "I-unlock",
        "network_placeholder": "Network",
        "logo_alt": "Lenix Wallet",
        "show_evm_wallet": "Ipakita ang EVM wallet",
        "show_bitcoin_wallet": "Ipakita ang Bitcoin wallet",
        "evm_wallet": "EVM wallet",
        "bitcoin_wallet": "Bitcoin wallet"
      },
      "networks": {
        "all": "Lahat ng Network",
        "ethereum": "Ethereum",
        "bsc": "BNB Chain",
        "polygon": "Polygon",
        "bitcoin": "Bitcoin"
      },
      "actions": {
        "send": "Magpadala",
        "receive": "Tumanggap",
        "buy": "Bumili",
        "swap": "Mag-swap",
        "coming_soon": "Malapit na"
      },
      "wallet_card": {
        "total_balance": "Kabuuang Balanse",
        "hide_balance": "Itago ang balanse",
        "show_balance": "Ipakita ang balanse",
        "lock_wallet": "I-lock ang Wallet",
        "evm_networks": "EVM Networks",
        "evm_chains": "ETH · BSC · Polygon · Arbitrum",
        "address_copied": "Nakopya ang address"
      },
      "bitcoin_card": {
        "btc_balance": "BTC Balance",
        "not_activated": "Hindi pa activated",
        "activate_prompt": "I-activate ang native Bitcoin wallet mo",
        "password_placeholder": "Ilagay ang wallet password",
        "creating": "Ginagawa...",
        "activate": "I-activate",
        "bitcoin_network": "Bitcoin Network",
        "segwit": "BIP-84 Native SegWit",
        "bitcoin_alt": "Bitcoin",
        "enter_password": "Ilagay ang wallet password mo",
        "wallet_created": "Nagawa ang Bitcoin wallet",
        "create_failed": "Hindi nagawa ang Bitcoin wallet",
        "address_copied": "Nakopya ang address"
      },
      "token_list": {
        "assets": "Assets",
        "market": "Market",
        "tokens_count": "{count} tokens",
        "no_assets": "Wala pang assets",
        "frozen": "Naka-freeze",
        "deposit_to_unfreeze": "Mag-deposit ng {amount} BTC para i-unfreeze",
        "frozen_by_admin": "Na-freeze ng admin",
        "token_fallback": "Token"
      },
      "activity": {
        "title": "Aktibidad",
        "no_activity": "Walang kamakailang aktibidad",
        "done": "Tapos na",
        "pending": "Naghihintay"
      },
      "security": {
        "title": "Security",
        "protected": "Protected",
        "recovery_phrase": "Recovery phrase",
        "backed_up": "Na-back up",
        "password": "Password",
        "active": "Active",
        "withdrawal_limit": "Withdrawal limit",
        "not_set": "Hindi pa naka-set",
        "set": "Naka-set"
      },
      "receive_modal": {
        "title": "Tumanggap",
        "network": "Network",
        "evm_networks": "EVM Networks",
        "evm_chains": "ETH, BSC, Polygon, Arbitrum",
        "bitcoin": "Bitcoin",
        "bitcoin_chains": "Native SegWit (BIP-84)",
        "not_set_up": "(Hindi pa naka-set up)",
        "qr_alt": "QR Code",
        "copied": "Nakopya",
        "btc_warning": "Magpadala lang ng BTC sa address na ito",
        "evm_warning": "Magpadala lang ng ERC-20 compatible tokens"
      },
      "send_modal": {
        "title": "Magpadala ng Crypto",
        "description": "Ilagay ang address ng tatanggap at halaga ng withdrawal para magpadala ng crypto."
      },
      "setup": {
        "back": "Bumalik",
        "welcome_title": "Pinaka-secured na Wallet sa Mundo",
        "welcome_description": "I-set up ang wallet mo para magsimula. Ang Lenix Wallet ay ang pinaka-secured at private na wallet sa mundo para panatilihing ligtas ang crypto mo.",
        "create_new": "Gumawa ng Bagong Wallet",
        "import_existing": "Mag-import ng Existing Wallet",
        "terms_notice": "Sa paggawa o pag-import ng wallet, sumasang-ayon ka sa aming Terms of Service at Privacy Policy.",
        "backup_title": "I-back up ang recovery phrase mo",
        "backup_description": "Isulat ang 12 salitang ito nang sunod-sunod at itago nang ligtas. Kapag nawala, maaaring mawala ang pondo mo magpakailanman.",
        "security_check_title": "Security Check",
        "security_check_description": "Huwag ibahagi ang phrase na ito sa kahit sino. Hindi hihingi ng Lenix support nito.",
        "saved_phrase": "Na-save ko na ang recovery phrase ko",
        "verify_title": "I-verify ang recovery phrase",
        "verify_description": "Kumpirmahin na na-save mo ang phrase sa pamamagitan ng paglalagay ng hinihinging salita sa ibaba.",
        "word_label": "Salita #{number}",
        "word_placeholder": "Ilagay ang salita #{number}",
        "verify_continue": "I-verify at Magpatuloy",
        "password_title": "Mag-set ng secure password",
        "password_description": "Gagamitin ang password na ito para i-encrypt ang wallet mo sa device na ito.",
        "password_label": "Password",
        "confirm_password_label": "Kumpirmahin ang Password",
        "create_wallet": "Gumawa ng Wallet",
        "processing": "Pinoproseso...",
        "import_title": "Mag-import ng Recovery Phrase",
        "import_description": "Ilagay ang 12 o 24-word recovery phrase para i-restore ang wallet mo.",
        "import_placeholder": "apple banana cherry...",
        "continue": "Magpatuloy",
        "import_wallet": "Mag-import ng Wallet"
      },
      "toast": {
        "wallet_unlocked": "Na-unlock ang wallet",
        "incorrect_password": "Maling password",
        "phrase_copied": "Nakopya ang recovery phrase sa clipboard",
        "incorrect_words": "Maling salita. Subukan muli.",
        "password_min_length": "Dapat hindi bababa sa 8 characters ang password",
        "passwords_mismatch": "Hindi magkatugma ang mga password",
        "wallet_created": "Matagumpay na nagawa ang wallet!",
        "create_failed": "Hindi nagawa ang wallet",
        "invalid_phrase": "Invalid recovery phrase. Inaasahan ang 12 o 24 salita, nakuha ang {count}.",
        "wallet_imported": "Matagumpay na na-import ang wallet!",
        "import_failed": "Hindi na-import ang wallet"
      }
    }
  },
  "tr": {
    "AccountLenixWallet": {
      "page": {
        "title": "Cüzdan",
        "subtitle": "Kripto varlıklarınızı yönetin",
        "setup_title": "Cüzdanınızı kurun",
        "setup_subtitle": "Başlamak için cüzdan oluşturun veya içe aktarın",
        "unlock_title": "Cüzdanın kilidini aç",
        "unlock_subtitle": "Devam etmek için şifrenizi girin",
        "password_placeholder": "Şifre",
        "unlocking": "Kilit açılıyor...",
        "unlock": "Kilidi aç",
        "network_placeholder": "Ağ",
        "logo_alt": "Lenix Cüzdan",
        "show_evm_wallet": "EVM cüzdanını göster",
        "show_bitcoin_wallet": "Bitcoin cüzdanını göster",
        "evm_wallet": "EVM cüzdanı",
        "bitcoin_wallet": "Bitcoin cüzdanı"
      },
      "networks": {
        "all": "Tüm ağlar",
        "ethereum": "Ethereum",
        "bsc": "BNB Chain",
        "polygon": "Polygon",
        "bitcoin": "Bitcoin"
      },
      "actions": {
        "send": "Gönder",
        "receive": "Al",
        "buy": "Satın al",
        "swap": "Takas",
        "coming_soon": "Yakında"
      },
      "wallet_card": {
        "total_balance": "Toplam bakiye",
        "hide_balance": "Bakiyeyi gizle",
        "show_balance": "Bakiyeyi göster",
        "lock_wallet": "Cüzdanı kilitle",
        "evm_networks": "EVM ağları",
        "evm_chains": "ETH · BSC · Polygon · Arbitrum",
        "address_copied": "Adres kopyalandı"
      },
      "bitcoin_card": {
        "btc_balance": "BTC bakiyesi",
        "not_activated": "Etkin değil",
        "activate_prompt": "Yerel Bitcoin cüzdanınızı etkinleştirin",
        "password_placeholder": "Cüzdan şifresini girin",
        "creating": "Oluşturuluyor...",
        "activate": "Etkinleştir",
        "bitcoin_network": "Bitcoin ağı",
        "segwit": "BIP-84 Native SegWit",
        "bitcoin_alt": "Bitcoin",
        "enter_password": "Cüzdan şifrenizi girin",
        "wallet_created": "Bitcoin cüzdanı oluşturuldu",
        "create_failed": "Bitcoin cüzdanı oluşturulamadı",
        "address_copied": "Adres kopyalandı"
      },
      "token_list": {
        "assets": "Varlıklar",
        "market": "Piyasa",
        "tokens_count": "{count} token",
        "no_assets": "Henüz varlık yok",
        "frozen": "Donduruldu",
        "deposit_to_unfreeze": "Çözmek için {amount} BTC yatırın",
        "frozen_by_admin": "Yönetici tarafından donduruldu",
        "token_fallback": "Token"
      },
      "activity": {
        "title": "Aktivite",
        "no_activity": "Son aktivite yok",
        "done": "Tamamlandı",
        "pending": "Beklemede"
      },
      "security": {
        "title": "Güvenlik",
        "protected": "Korumalı",
        "recovery_phrase": "Kurtarma ifadesi",
        "backed_up": "Yedeklendi",
        "password": "Şifre",
        "active": "Aktif",
        "withdrawal_limit": "Çekim limiti",
        "not_set": "Ayarlanmadı",
        "set": "Ayarlandı"
      },
      "receive_modal": {
        "title": "Al",
        "network": "Ağ",
        "evm_networks": "EVM ağları",
        "evm_chains": "ETH, BSC, Polygon, Arbitrum",
        "bitcoin": "Bitcoin",
        "bitcoin_chains": "Native SegWit (BIP-84)",
        "not_set_up": "(Kurulmadı)",
        "qr_alt": "QR Kodu",
        "copied": "Kopyalandı",
        "btc_warning": "Bu adrese yalnızca BTC gönderin",
        "evm_warning": "Yalnızca ERC-20 uyumlu token gönderin"
      },
      "send_modal": {
        "title": "Kripto gönder",
        "description": "Kripto göndermek için alıcı adresini ve çekim tutarını girin."
      },
      "setup": {
        "back": "Geri",
        "welcome_title": "Dünyanın en güvenli cüzdanı",
        "welcome_description": "Başlamak için cüzdanınızı kurun. Lenix Wallet, kriptonuzu güvende tutan dünyanın en güvenli ve özel cüzdanıdır.",
        "create_new": "Yeni cüzdan oluştur",
        "import_existing": "Mevcut cüzdanı içe aktar",
        "terms_notice": "Cüzdan oluşturarak veya içe aktararak Hizmet Şartlarımızı ve Gizlilik Politikamızı kabul etmiş olursunuz.",
        "backup_title": "Kurtarma ifadenizi yedekleyin",
        "backup_description": "Bu 12 kelimeyi sırayla yazın ve güvenli bir yerde saklayın. Kaybederseniz fonlarınızı sonsuza dek kaybedebilirsiniz.",
        "security_check_title": "Güvenlik kontrolü",
        "security_check_description": "Bu ifadeyi asla kimseyle paylaşmayın. Lenix desteği bunu asla istemez.",
        "saved_phrase": "Kurtarma ifademi kaydettim",
        "verify_title": "Kurtarma ifadesini doğrula",
        "verify_description": "Aşağıda istenen kelimeleri girerek ifadenizi kaydettiğinizi onaylayın.",
        "word_label": "Kelime #{number}",
        "word_placeholder": "#{number}. kelimeyi girin",
        "verify_continue": "Doğrula ve devam et",
        "password_title": "Güvenli şifre belirle",
        "password_description": "Bu şifre, cüzdanınızı bu cihazda şifrelemek için kullanılacaktır.",
        "password_label": "Şifre",
        "confirm_password_label": "Şifreyi onayla",
        "create_wallet": "Cüzdan oluştur",
        "processing": "İşleniyor...",
        "import_title": "Kurtarma ifadesini içe aktar",
        "import_description": "Cüzdanınızı geri yüklemek için 12 veya 24 kelimelik kurtarma ifadesini girin.",
        "import_placeholder": "elma muz kiraz...",
        "continue": "Devam",
        "import_wallet": "Cüzdanı içe aktar"
      },
      "toast": {
        "wallet_unlocked": "Cüzdan kilidi açıldı",
        "incorrect_password": "Yanlış şifre",
        "phrase_copied": "Kurtarma ifadesi panoya kopyalandı",
        "incorrect_words": "Yanlış kelimeler. Lütfen tekrar deneyin.",
        "password_min_length": "Şifre en az 8 karakter olmalıdır",
        "passwords_mismatch": "Şifreler eşleşmiyor",
        "wallet_created": "Cüzdan başarıyla oluşturuldu!",
        "create_failed": "Cüzdan oluşturulamadı",
        "invalid_phrase": "Geçersiz kurtarma ifadesi. 12 veya 24 kelime bekleniyor, {count} alındı.",
        "wallet_imported": "Cüzdan başarıyla içe aktarıldı!",
        "import_failed": "Cüzdan içe aktarılamadı"
      }
    }
  },
  "hi": {
    "AccountLenixWallet": {
      "page": {
        "title": "वॉलेट",
        "subtitle": "अपनी क्रिप्टो संपत्तियों का प्रबंधन करें",
        "setup_title": "अपना वॉलेट सेट अप करें",
        "setup_subtitle": "शुरू करने के लिए वॉलेट बनाएं या इмпोर्ट करें",
        "unlock_title": "वॉलेट अनलॉक करें",
        "unlock_subtitle": "जारी रखने के लिए पासवर्ड दर्ज करें",
        "password_placeholder": "पासवर्ड",
        "unlocking": "अनलॉक हो रहा है...",
        "unlock": "अनलॉक करें",
        "network_placeholder": "नेटवर्क",
        "logo_alt": "Lenix वॉलेट",
        "show_evm_wallet": "EVM वॉलेट दिखाएं",
        "show_bitcoin_wallet": "Bitcoin वॉलेट दिखाएं",
        "evm_wallet": "EVM वॉलेट",
        "bitcoin_wallet": "Bitcoin वॉलेट"
      },
      "networks": {
        "all": "सभी नेटवर्क",
        "ethereum": "Ethereum",
        "bsc": "BNB Chain",
        "polygon": "Polygon",
        "bitcoin": "Bitcoin"
      },
      "actions": {
        "send": "भेजें",
        "receive": "प्राप्त करें",
        "buy": "खरीदें",
        "swap": "स्वैप",
        "coming_soon": "जल्द आ रहा है"
      },
      "wallet_card": {
        "total_balance": "कुल बैलेंस",
        "hide_balance": "बैलेंस छिपाएं",
        "show_balance": "बैलेंस दिखाएं",
        "lock_wallet": "वॉलेट लॉक करें",
        "evm_networks": "EVM नेटवर्क",
        "evm_chains": "ETH · BSC · Polygon · Arbitrum",
        "address_copied": "पता कॉपी किया गया"
      },
      "bitcoin_card": {
        "btc_balance": "BTC बैलेंस",
        "not_activated": "सक्रिय नहीं",
        "activate_prompt": "अपना नेटिव Bitcoin वॉलेट सक्रिय करें",
        "password_placeholder": "वॉलेट पासवर्ड दर्ज करें",
        "creating": "बनाया जा रहा है...",
        "activate": "सक्रिय करें",
        "bitcoin_network": "Bitcoin नेटवर्क",
        "segwit": "BIP-84 Native SegWit",
        "bitcoin_alt": "Bitcoin",
        "enter_password": "अपना वॉलेट पासवर्ड दर्ज करें",
        "wallet_created": "Bitcoin वॉलेट बनाया गया",
        "create_failed": "Bitcoin वॉलेट बनाने में विफल",
        "address_copied": "पता कॉपी किया गया"
      },
      "token_list": {
        "assets": "संपत्तियाँ",
        "market": "बाज़ार",
        "tokens_count": "{count} टोकन",
        "no_assets": "अभी कोई संपत्ति नहीं",
        "frozen": "फ्रोज़न",
        "deposit_to_unfreeze": "अनफ्रोज़ करने के लिए {amount} BTC जमा करें",
        "frozen_by_admin": "एडमिन द्वारा फ्रोज़न",
        "token_fallback": "टोकन"
      },
      "activity": {
        "title": "गतिविधि",
        "no_activity": "कोई हालिया गतिविधि नहीं",
        "done": "पूर्ण",
        "pending": "लंबित"
      },
      "security": {
        "title": "सुरक्षा",
        "protected": "सुरक्षित",
        "recovery_phrase": "रिकवरी फ्रेज",
        "backed_up": "बैकअप किया गया",
        "password": "पासवर्ड",
        "active": "सक्रिय",
        "withdrawal_limit": "निकासी सीमा",
        "not_set": "सेट नहीं",
        "set": "सेट"
      },
      "receive_modal": {
        "title": "प्राप्त करें",
        "network": "नेटवर्क",
        "evm_networks": "EVM नेटवर्क",
        "evm_chains": "ETH, BSC, Polygon, Arbitrum",
        "bitcoin": "Bitcoin",
        "bitcoin_chains": "Native SegWit (BIP-84)",
        "not_set_up": "(सेट अप नहीं)",
        "qr_alt": "QR कोड",
        "copied": "कॉपी किया गया",
        "btc_warning": "इस पते पर केवल BTC भेजें",
        "evm_warning": "केवल ERC-20 संगत टोकन भेजें"
      },
      "send_modal": {
        "title": "क्रिप्टो भेजें",
        "description": "क्रिप्टो भेजने के लिए प्राप्तकर्ता का पता और निकासी राशि दर्ज करें।"
      },
      "setup": {
        "back": "वापस",
        "welcome_title": "दुनिया का सबसे सुरक्षित वॉलेट",
        "welcome_description": "शुरू करने के लिए अपना वॉलेट सेट अप करें। Lenix Wallet दुनिया का सबसे सुरक्षित, निजी वॉलेट है जो आपकी क्रिप्टो को सुरक्षित रखता है।",
        "create_new": "नया वॉलेट बनाएं",
        "import_existing": "मौजूदा वॉलेट इмпोर्ट करें",
        "terms_notice": "वॉलेट बनाकर या इмпोर्ट करके, आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत होते हैं।",
        "backup_title": "अपनी रिकवरी फ्रेज का बैकअप लें",
        "backup_description": "इन 12 शब्दों को क्रम में लिखें और सुरक्षित रखें। खोने पर आप अपने फंड हमेशा के लिए गंवा सकते हैं।",
        "security_check_title": "सुरक्षा जाँच",
        "security_check_description": "इस फ्रेज को कभी किसी के साथ साझा न करें। Lenix सपोर्ट इसे कभी नहीं माँगेगा।",
        "saved_phrase": "मैंने अपनी रिकवरी फ्रेज सहेज ली है",
        "verify_title": "रिकवरी फ्रेज सत्यापित करें",
        "verify_description": "नीचे अनुरोधित शब्द दर्ज करके पुष्टि करें कि आपने फ्रेज सहेजी है।",
        "word_label": "शब्द #{number}",
        "word_placeholder": "शब्द #{number} दर्ज करें",
        "verify_continue": "सत्यापित करें और जारी रखें",
        "password_title": "सुरक्षित पासवर्ड सेट करें",
        "password_description": "यह पासवर्ड इस डिवाइस पर आपके वॉलेट को एन्क्रिप्ट करने के लिए उपयोग होगा।",
        "password_label": "पासवर्ड",
        "confirm_password_label": "पासवर्ड की पुष्टि करें",
        "create_wallet": "वॉलेट बनाएं",
        "processing": "प्रसंस्करण...",
        "import_title": "रिकवरी फ्रेज इмпोर्ट करें",
        "import_description": "वॉलेट पुनर्स्थापित करने के लिए 12 या 24 शब्दों की रिकवरी फ्रेज दर्ज करें।",
        "import_placeholder": "apple banana cherry...",
        "continue": "जारी रखें",
        "import_wallet": "वॉलेट इмпोर्ट करें"
      },
      "toast": {
        "wallet_unlocked": "वॉलेट अनलॉक हो गया",
        "incorrect_password": "गलत पासवर्ड",
        "phrase_copied": "रिकवरी फ्रेज क्लिपबोर्ड पर कॉपी की गई",
        "incorrect_words": "गलत शब्द। कृपया पुनः प्रयास करें।",
        "password_min_length": "पासवर्ड कम से कम 8 अक्षर का होना चाहिए",
        "passwords_mismatch": "पासवर्ड मेल नहीं खाते",
        "wallet_created": "वॉलेट सफलतापूर्वक बनाया गया!",
        "create_failed": "वॉलेट बनाने में विफल",
        "invalid_phrase": "अमान्य रिकवरी फ्रेज। 12 या 24 शब्द अपेक्षित, {count} प्राप्त।",
        "wallet_imported": "वॉलेट सफलतापूर्वक इмпोर्ट हुआ!",
        "import_failed": "वॉलेट इмпोर्ट विफल"
      }
    }
  },
  "id": {
    "AccountLenixWallet": {
      "page": {
        "title": "Dompet",
        "subtitle": "Kelola aset kripto Anda",
        "setup_title": "Siapkan dompet Anda",
        "setup_subtitle": "Buat atau impor dompet untuk memulai",
        "unlock_title": "Buka kunci dompet",
        "unlock_subtitle": "Masukkan kata sandi untuk melanjutkan",
        "password_placeholder": "Kata sandi",
        "unlocking": "Membuka kunci...",
        "unlock": "Buka kunci",
        "network_placeholder": "Jaringan",
        "logo_alt": "Dompet Lenix",
        "show_evm_wallet": "Tampilkan dompet EVM",
        "show_bitcoin_wallet": "Tampilkan dompet Bitcoin",
        "evm_wallet": "Dompet EVM",
        "bitcoin_wallet": "Dompet Bitcoin"
      },
      "networks": {
        "all": "Semua jaringan",
        "ethereum": "Ethereum",
        "bsc": "BNB Chain",
        "polygon": "Polygon",
        "bitcoin": "Bitcoin"
      },
      "actions": {
        "send": "Kirim",
        "receive": "Terima",
        "buy": "Beli",
        "swap": "Tukar",
        "coming_soon": "Segera hadir"
      },
      "wallet_card": {
        "total_balance": "Saldo total",
        "hide_balance": "Sembunyikan saldo",
        "show_balance": "Tampilkan saldo",
        "lock_wallet": "Kunci dompet",
        "evm_networks": "Jaringan EVM",
        "evm_chains": "ETH · BSC · Polygon · Arbitrum",
        "address_copied": "Alamat disalin"
      },
      "bitcoin_card": {
        "btc_balance": "Saldo BTC",
        "not_activated": "Belum diaktifkan",
        "activate_prompt": "Aktifkan dompet Bitcoin native Anda",
        "password_placeholder": "Masukkan kata sandi dompet",
        "creating": "Membuat...",
        "activate": "Aktifkan",
        "bitcoin_network": "Jaringan Bitcoin",
        "segwit": "SegWit native BIP-84",
        "bitcoin_alt": "Bitcoin",
        "enter_password": "Masukkan kata sandi dompet Anda",
        "wallet_created": "Dompet Bitcoin dibuat",
        "create_failed": "Gagal membuat dompet Bitcoin",
        "address_copied": "Alamat disalin"
      },
      "token_list": {
        "assets": "Aset",
        "market": "Pasar",
        "tokens_count": "{count} token",
        "no_assets": "Belum ada aset",
        "frozen": "Dibekukan",
        "deposit_to_unfreeze": "Deposit {amount} BTC untuk membuka",
        "frozen_by_admin": "Dibekukan oleh admin",
        "token_fallback": "Token"
      },
      "activity": {
        "title": "Aktivitas",
        "no_activity": "Tidak ada aktivitas terbaru",
        "done": "Selesai",
        "pending": "Menunggu"
      },
      "security": {
        "title": "Keamanan",
        "protected": "Terlindungi",
        "recovery_phrase": "Frase pemulihan",
        "backed_up": "Sudah dicadangkan",
        "password": "Kata sandi",
        "active": "Aktif",
        "withdrawal_limit": "Batas penarikan",
        "not_set": "Belum diatur",
        "set": "Diatur"
      },
      "receive_modal": {
        "title": "Terima",
        "network": "Jaringan",
        "evm_networks": "Jaringan EVM",
        "evm_chains": "ETH, BSC, Polygon, Arbitrum",
        "bitcoin": "Bitcoin",
        "bitcoin_chains": "SegWit native (BIP-84)",
        "not_set_up": "(Belum disetel)",
        "qr_alt": "Kode QR",
        "copied": "Disalin",
        "btc_warning": "Hanya kirim BTC ke alamat ini",
        "evm_warning": "Hanya kirim token kompatibel ERC-20"
      },
      "send_modal": {
        "title": "Kirim kripto",
        "description": "Masukkan alamat penerima dan jumlah penarikan untuk mengirim kripto."
      },
      "setup": {
        "back": "Kembali",
        "welcome_title": "Dompet paling aman di dunia",
        "welcome_description": "Siapkan dompet Anda untuk memulai. Lenix Wallet adalah dompet paling aman dan privat di dunia untuk menjaga kripto Anda.",
        "create_new": "Buat dompet baru",
        "import_existing": "Impor dompet yang ada",
        "terms_notice": "Dengan membuat atau mengimpor dompet, Anda setuju dengan Ketentuan Layanan dan Kebijakan Privasi kami.",
        "backup_title": "Cadangkan frase pemulihan Anda",
        "backup_description": "Tuliskan 12 kata ini secara berurutan dan simpan dengan aman. Jika hilang, Anda bisa kehilangan dana selamanya.",
        "security_check_title": "Pemeriksaan keamanan",
        "security_check_description": "Jangan pernah bagikan frase ini kepada siapa pun. Dukungan Lenix tidak akan pernah memintanya.",
        "saved_phrase": "Saya sudah menyimpan frase pemulihan",
        "verify_title": "Verifikasi frase pemulihan",
        "verify_description": "Konfirmasi bahwa Anda menyimpan frase dengan memasukkan kata yang diminta di bawah.",
        "word_label": "Kata #{number}",
        "word_placeholder": "Masukkan kata #{number}",
        "verify_continue": "Verifikasi & lanjutkan",
        "password_title": "Atur kata sandi aman",
        "password_description": "Kata sandi ini akan digunakan untuk mengenkripsi dompet Anda di perangkat ini.",
        "password_label": "Kata sandi",
        "confirm_password_label": "Konfirmasi kata sandi",
        "create_wallet": "Buat dompet",
        "processing": "Memproses...",
        "import_title": "Impor frase pemulihan",
        "import_description": "Masukkan frase pemulihan 12 atau 24 kata untuk memulihkan dompet Anda.",
        "import_placeholder": "apel pisang ceri...",
        "continue": "Lanjutkan",
        "import_wallet": "Impor dompet"
      },
      "toast": {
        "wallet_unlocked": "Dompet terbuka",
        "incorrect_password": "Kata sandi salah",
        "phrase_copied": "Frase pemulihan disalin ke clipboard",
        "incorrect_words": "Kata salah. Silakan coba lagi.",
        "password_min_length": "Kata sandi minimal 8 karakter",
        "passwords_mismatch": "Kata sandi tidak cocok",
        "wallet_created": "Dompet berhasil dibuat!",
        "create_failed": "Gagal membuat dompet",
        "invalid_phrase": "Frase pemulihan tidak valid. Diharapkan 12 atau 24 kata, diterima {count}.",
        "wallet_imported": "Dompet berhasil diimpor!",
        "import_failed": "Gagal mengimpor dompet"
      }
    }
  }
};

for (const locale of locales) {
  const filePath = path.join(root, "messages", locale, "common.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const patch = translations[locale];
  if (!patch) continue;
  Object.assign(data, patch);
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Updated ${locale}/common.json`);
}
