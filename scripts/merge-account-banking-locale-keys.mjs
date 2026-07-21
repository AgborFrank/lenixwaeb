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
const accountBankingEn = enSource.AccountBanking;

const translations = {
  fr: {
    AccountBanking: {
        meta: {
          title: "Banque entreprise | Lenix Protocol",
          description: "Déplacez des actifs numériques entre Spot, Funding et des comptes bancaires vérifiés."
        },
        error: {
          load_failed: "Impossible de charger l'espace bancaire",
          unavailable_title: "Espace bancaire indisponible",
          unavailable_description: "L'aperçu bancaire n'a pas pu être chargé.",
          try_again: "Réessayer"
        },
        tabs: {
          overview: "Aperçu",
          accounts: "Comptes bancaires",
          activity: "Activité"
        },
        empty_assets: {
          title: "Aucun actif de trésorerie pour le moment",
          description: "Déplacez des actifs vers votre portefeuille Spot ou Funding pour commencer.",
          cta: "Déplacer des fonds"
        },
        fiat_balance: {
          funding: "Funding {currency}",
          available: "{amount} disponible"
        },
        summary: {
          title: "Banque entreprise",
          verified: "Vérifié",
          verification_pending: "Vérification en attente",
          subtitle: "Déplacez des actifs numériques entre les portefeuilles de trésorerie et les comptes bancaires vérifiés.",
          transfer: "Transfert",
          withdraw_to_bank: "Retirer vers la banque",
          total_treasury: "Valeur totale de trésorerie",
          hide_balances: "Masquer les soldes",
          show_balances: "Afficher les soldes",
          account: "Compte",
          tier: "Niveau",
          relationship_manager: "Gestionnaire de relation",
          spot_wallet: "Portefeuille Spot",
          spot_available: "Disponible pour le trading",
          funding_wallet: "Portefeuille Funding",
          funding_available: "Disponible pour le règlement",
          in_settlement: "En cours de règlement",
          pending_payouts: "Sur les paiements bancaires actifs"
        },
        assets: {
          title: "Soldes des portefeuilles",
          subtitle: "Actifs Spot et Funding prêts pour le paiement",
          move_funds: "Déplacer des fonds",
          columns: {
            asset: "Actif",
            wallet: "Portefeuille",
            balance: "Solde",
            value: "Valeur",
            change_24h: "24 h"
          },
          location: {
            spot: "Spot",
            funding: "Funding"
          }
        },
        accounts: {
          linked_title: "Comptes bancaires liés",
          linked_subtitle: "Destinations de règlement pour les retraits bancaires",
          add_account: "Ajouter un compte",
          empty_title: "Aucun compte bancaire lié",
          empty_description: "Ajoutez un compte bancaire pour activer les retraits vers votre banque.",
          default: "Par défaut",
          status: {
            verified: "Vérifié",
            rejected: "Rejeté",
            pending: "En cours d'examen"
          },
          limits_title: "Limites de règlement",
          limits_subtitle: "Plafonds entreprise glissants",
          remaining: "{percent} % restant",
          limits_note: "Les limites de règlement plus élevées sont examinées par votre gestionnaire de relation et l'équipe conformité."
        },
        activity: {
          title: "Activité des transactions",
          subtitle: "Transferts internes et règlements bancaires",
          search_label: "Rechercher des transactions",
          search_placeholder: "Rechercher une référence ou un actif",
          filter_label: "Filtrer par statut de transaction",
          filter_all: "Tous les statuts",
          status: {
            completed: "Terminé",
            processing: "En cours",
            review: "Examen",
            under_review: "En cours d'examen",
            failed: "Échoué"
          },
          columns: {
            transaction: "Transaction",
            amount: "Montant",
            destination: "Destination",
            status: "Statut",
            date: "Date",
            view: "Voir"
          },
          direction: {
            spot_to_funding: "Spot vers Funding",
            funding_to_spot: "Funding vers Spot",
            funding_to_bank: "Funding vers banque",
            spot_to_bank: "Spot vers banque"
          },
          view_transaction: "Voir {reference}",
          empty_title: "Aucune transaction correspondante",
          empty_description: "Modifiez la recherche ou le filtre de statut."
        },
        add_account: {
          title: "Ajouter un compte bancaire",
          description: "Les comptes soumis sont examinés par notre équipe conformité avant de pouvoir recevoir des règlements. Cela prend généralement 1 à 2 jours ouvrables.",
          fields: {
            bank_name: "Nom de la banque",
            bank_name_placeholder: "ex. BNP Paribas",
            account_holder: "Nom du titulaire",
            account_holder_placeholder: "Nom légal complet",
            account_number: "Numéro de compte / IBAN",
            account_number_placeholder: "Numéro de compte",
            routing_number: "Numéro de routage (ACH/domestique)",
            swift_bic: "SWIFT / BIC (international)",
            optional: "Facultatif",
            account_type: "Type de compte",
            checking: "Compte courant",
            savings: "Compte épargne",
            currency: "Devise",
            country: "Pays",
            country_placeholder: "FR"
          },
          submitting: "Envoi en cours...",
          submit: "Soumettre pour vérification",
          required_fields: "Veuillez remplir tous les champs obligatoires",
          success: "Compte bancaire soumis pour vérification",
          failed: "Échec de l'ajout du compte bancaire"
        },
        transfer: {
          title_form: "Déplacer des fonds",
          title_review: "Examiner le transfert",
          title_success: "Statut du transfert",
          desc_form: "Déplacez des actifs entre portefeuilles ou règlez vers une banque liée.",
          desc_review: "Les taux sont réservés pendant cinq minutes.",
          desc_success: "Votre référence est prête pour le suivi.",
          back_label: "Retour aux détails du transfert",
          step_label: "Étape {step} sur 3",
          cancel: "Annuler",
          review_transfer: "Examiner le transfert",
          confirm_submit: "Confirmer et soumettre",
          done: "Terminé",
          quote_failed: "Impossible de créer un devis",
          transfer_failed: "Impossible de soumettre le transfert",
          type_legend: "Type de transfert",
          types: {
            spot_to_funding: {
              label: "Spot → Funding",
              description: "Préparer les actifs pour les paiements"
            },
            funding_to_spot: {
              label: "Funding → Spot",
              description: "Renvoyer les actifs pour le trading"
            },
            funding_to_bank: {
              label: "Funding → Banque",
              description: "Retirer les fonds disponibles"
            },
            spot_to_bank: {
              label: "Spot → Banque",
              description: "Convertir et retirer"
            }
          },
          from: "De",
          to: "Vers",
          spot_wallet: "Portefeuille Spot",
          funding_wallet: "Portefeuille Funding",
          bank_account: "Compte bancaire",
          asset: "Actif",
          amount: "Montant",
          max: "MAX",
          amount_placeholder: "0,00",
          payout_currency: "Devise de paiement",
          currencies: {
            USD: "USD · Dollar américain",
            EUR: "EUR · Euro",
            GBP: "GBP · Livre sterling"
          },
          select_account: "Sélectionner un compte",
          available: "Disponible"
        },
        review: {
          recipient_receives: "Le bénéficiaire reçoit",
          from_amount: "De {amount} {asset}",
          market_value: "Valeur de marché",
          exchange_rate: "Taux de change",
          exchange_rate_value: "1 USD = {rate} {currency}",
          platform_fee: "Frais de plateforme",
          banking_fee: "Frais bancaires",
          estimated_arrival: "Arrivée estimée",
          authorization: "En confirmant, vous autorisez la conversion d'actifs et les instructions de règlement ci-dessus.",
          withdrawal_submitted: "Retrait soumis",
          transfer_completed: "Transfert terminé",
          withdrawal_desc: "Votre règlement a passé la validation initiale et entre maintenant en contrôle conformité.",
          transfer_desc: "Vos soldes ont été mis à jour dans l'espace bancaire.",
          reference: "Référence",
          status: "Statut",
          destination: "Destination",
          processing: "En cours",
          completed: "Terminé"
        },
        detail: {
          title: "Détails du transfert",
          reference: "Référence {reference}",
          payout_amount: "Montant du paiement",
          destination: "Destination",
          estimated_arrival: "Arrivée estimée",
          fees: "Frais",
          requested: "Demandé",
          timeline_title: "Chronologie du règlement",
          pending: "En attente",
          download_receipt: "Télécharger le reçu",
          status: {
            completed: "Terminé",
            processing: "En cours",
            under_review: "En cours d'examen",
            failed: "Échoué"
          }
        },
        skeleton: {
          loading: "Chargement du tableau de bord bancaire"
        }
      },
  },
  es: {
    AccountBanking: {
        meta: {
          title: "Banca empresarial | Lenix Protocol",
          description: "Mueva activos digitales entre Spot, Funding y cuentas bancarias verificadas."
        },
        error: {
          load_failed: "No se pudo cargar el espacio bancario",
          unavailable_title: "Espacio bancario no disponible",
          unavailable_description: "No se pudo cargar la vista general bancaria.",
          try_again: "Intentar de nuevo"
        },
        tabs: {
          overview: "Resumen",
          accounts: "Cuentas bancarias",
          activity: "Actividad"
        },
        empty_assets: {
          title: "Aún no hay activos de tesorería",
          description: "Mueva activos a su billetera Spot o Funding para comenzar.",
          cta: "Mover fondos"
        },
        fiat_balance: {
          funding: "Funding {currency}",
          available: "{amount} disponible"
        },
        summary: {
          title: "Banca empresarial",
          verified: "Verificado",
          verification_pending: "Verificación pendiente",
          subtitle: "Mueva activos digitales entre billeteras de tesorería y cuentas bancarias verificadas.",
          transfer: "Transferir",
          withdraw_to_bank: "Retirar al banco",
          total_treasury: "Valor total de tesorería",
          hide_balances: "Ocultar saldos",
          show_balances: "Mostrar saldos",
          account: "Cuenta",
          tier: "Nivel",
          relationship_manager: "Gestor de relación",
          spot_wallet: "Billetera Spot",
          spot_available: "Disponible para trading",
          funding_wallet: "Billetera Funding",
          funding_available: "Disponible para liquidación",
          in_settlement: "En liquidación",
          pending_payouts: "En pagos bancarios activos"
        },
        assets: {
          title: "Saldos de billetera",
          subtitle: "Activos Spot y Funding listos para pago",
          move_funds: "Mover fondos",
          columns: {
            asset: "Activo",
            wallet: "Billetera",
            balance: "Saldo",
            value: "Valor",
            change_24h: "24 h"
          },
          location: {
            spot: "Spot",
            funding: "Funding"
          }
        },
        accounts: {
          linked_title: "Cuentas bancarias vinculadas",
          linked_subtitle: "Destinos de liquidación para retiros bancarios",
          add_account: "Agregar cuenta",
          empty_title: "No hay cuentas bancarias vinculadas",
          empty_description: "Agregue una cuenta bancaria para habilitar retiros a su banco.",
          default: "Predeterminada",
          status: {
            verified: "Verificada",
            rejected: "Rechazada",
            pending: "En revisión"
          },
          limits_title: "Límites de liquidación",
          limits_subtitle: "Límites empresariales acumulativos",
          remaining: "{percent}% restante",
          limits_note: "Los límites de liquidación más altos son revisados por su gestor de relación y el equipo de cumplimiento."
        },
        activity: {
          title: "Actividad de transacciones",
          subtitle: "Transferencias internas y liquidaciones bancarias",
          search_label: "Buscar transacciones",
          search_placeholder: "Buscar referencia o activo",
          filter_label: "Filtrar estado de transacción",
          filter_all: "Todos los estados",
          status: {
            completed: "Completada",
            processing: "Procesando",
            review: "Revisión",
            under_review: "En revisión",
            failed: "Fallida"
          },
          columns: {
            transaction: "Transacción",
            amount: "Monto",
            destination: "Destino",
            status: "Estado",
            date: "Fecha",
            view: "Ver"
          },
          direction: {
            spot_to_funding: "Spot a Funding",
            funding_to_spot: "Funding a Spot",
            funding_to_bank: "Funding a banco",
            spot_to_bank: "Spot a banco"
          },
          view_transaction: "Ver {reference}",
          empty_title: "No hay transacciones coincidentes",
          empty_description: "Cambie la búsqueda o el filtro de estado."
        },
        add_account: {
          title: "Agregar cuenta bancaria",
          description: "Las cuentas enviadas son revisadas por nuestro equipo de cumplimiento antes de recibir liquidaciones. Esto suele tardar 1–2 días hábiles.",
          fields: {
            bank_name: "Nombre del banco",
            bank_name_placeholder: "p. ej. BBVA",
            account_holder: "Nombre del titular",
            account_holder_placeholder: "Nombre legal completo",
            account_number: "Número de cuenta / IBAN",
            account_number_placeholder: "Número de cuenta",
            routing_number: "Número de ruta (ACH/nacional)",
            swift_bic: "SWIFT / BIC (internacional)",
            optional: "Opcional",
            account_type: "Tipo de cuenta",
            checking: "Corriente",
            savings: "Ahorros",
            currency: "Moneda",
            country: "País",
            country_placeholder: "ES"
          },
          submitting: "Enviando...",
          submit: "Enviar para verificación",
          required_fields: "Complete todos los campos obligatorios",
          success: "Cuenta bancaria enviada para verificación",
          failed: "No se pudo agregar la cuenta bancaria"
        },
        transfer: {
          title_form: "Mover fondos",
          title_review: "Revisar transferencia",
          title_success: "Estado de la transferencia",
          desc_form: "Mueva activos entre billeteras o liquide a un banco vinculado.",
          desc_review: "Las tasas se reservan por cinco minutos.",
          desc_success: "Su referencia está lista para seguimiento.",
          back_label: "Volver a los detalles de la transferencia",
          step_label: "Paso {step} de 3",
          cancel: "Cancelar",
          review_transfer: "Revisar transferencia",
          confirm_submit: "Confirmar y enviar",
          done: "Listo",
          quote_failed: "No se pudo crear la cotización",
          transfer_failed: "No se pudo enviar la transferencia",
          type_legend: "Tipo de transferencia",
          types: {
            spot_to_funding: {
              label: "Spot → Funding",
              description: "Preparar activos para pagos"
            },
            funding_to_spot: {
              label: "Funding → Spot",
              description: "Devolver activos para trading"
            },
            funding_to_bank: {
              label: "Funding → Banco",
              description: "Retirar fondos disponibles"
            },
            spot_to_bank: {
              label: "Spot → Banco",
              description: "Convertir y retirar"
            }
          },
          from: "Desde",
          to: "Hacia",
          spot_wallet: "Billetera Spot",
          funding_wallet: "Billetera Funding",
          bank_account: "Cuenta bancaria",
          asset: "Activo",
          amount: "Monto",
          max: "MÁX",
          amount_placeholder: "0,00",
          payout_currency: "Moneda de pago",
          currencies: {
            USD: "USD · Dólar estadounidense",
            EUR: "EUR · Euro",
            GBP: "GBP · Libra esterlina"
          },
          select_account: "Seleccionar cuenta",
          available: "Disponible"
        },
        review: {
          recipient_receives: "El destinatario recibe",
          from_amount: "De {amount} {asset}",
          market_value: "Valor de mercado",
          exchange_rate: "Tipo de cambio",
          exchange_rate_value: "1 USD = {rate} {currency}",
          platform_fee: "Comisión de plataforma",
          banking_fee: "Comisión bancaria",
          estimated_arrival: "Llegada estimada",
          authorization: "Al confirmar, autoriza la conversión de activos y las instrucciones de liquidación mostradas arriba.",
          withdrawal_submitted: "Retiro enviado",
          transfer_completed: "Transferencia completada",
          withdrawal_desc: "Su liquidación pasó la validación inicial y ahora entra en control de cumplimiento.",
          transfer_desc: "Sus saldos se actualizaron en el espacio bancario.",
          reference: "Referencia",
          status: "Estado",
          destination: "Destino",
          processing: "Procesando",
          completed: "Completada"
        },
        detail: {
          title: "Detalles de la transferencia",
          reference: "Referencia {reference}",
          payout_amount: "Monto del pago",
          destination: "Destino",
          estimated_arrival: "Llegada estimada",
          fees: "Comisiones",
          requested: "Solicitado",
          timeline_title: "Cronología de liquidación",
          pending: "Pendiente",
          download_receipt: "Descargar recibo",
          status: {
            completed: "Completada",
            processing: "Procesando",
            under_review: "En revisión",
            failed: "Fallida"
          }
        },
        skeleton: {
          loading: "Cargando panel bancario"
        }
      },
  },
  de: {
    AccountBanking: {
        meta: {
          title: "Enterprise Banking | Lenix Protocol",
          description: "Verschieben Sie digitale Assets zwischen Spot, Funding und verifizierten Bankkonten."
        },
        error: {
          load_failed: "Banking-Arbeitsbereich konnte nicht geladen werden",
          unavailable_title: "Banking-Arbeitsbereich nicht verfügbar",
          unavailable_description: "Die Banking-Übersicht konnte nicht geladen werden.",
          try_again: "Erneut versuchen"
        },
        tabs: {
          overview: "Übersicht",
          accounts: "Bankkonten",
          activity: "Aktivität"
        },
        empty_assets: {
          title: "Noch keine Treasury-Assets",
          description: "Verschieben Sie Assets in Ihre Spot- oder Funding-Wallet, um zu beginnen.",
          cta: "Gelder verschieben"
        },
        fiat_balance: {
          funding: "{currency}-Funding",
          available: "{amount} verfügbar"
        },
        summary: {
          title: "Enterprise Banking",
          verified: "Verifiziert",
          verification_pending: "Verifizierung ausstehend",
          subtitle: "Verschieben Sie digitale Assets zwischen Treasury-Wallets und verifizierten Bankkonten.",
          transfer: "Transfer",
          withdraw_to_bank: "Auf Bankkonto abheben",
          total_treasury: "Gesamtwert Treasury",
          hide_balances: "Salden ausblenden",
          show_balances: "Salden anzeigen",
          account: "Konto",
          tier: "Stufe",
          relationship_manager: "Relationship Manager",
          spot_wallet: "Spot-Wallet",
          spot_available: "Verfügbar für Trading",
          funding_wallet: "Funding-Wallet",
          funding_available: "Verfügbar für Abwicklung",
          in_settlement: "In Abwicklung",
          pending_payouts: "Bei aktiven Bankauszahlungen"
        },
        assets: {
          title: "Wallet-Salden",
          subtitle: "Spot- und auszahlungsbereite Funding-Assets",
          move_funds: "Gelder verschieben",
          columns: {
            asset: "Asset",
            wallet: "Wallet",
            balance: "Saldo",
            value: "Wert",
            change_24h: "24 h"
          },
          location: {
            spot: "Spot",
            funding: "Funding"
          }
        },
        accounts: {
          linked_title: "Verknüpfte Bankkonten",
          linked_subtitle: "Abwicklungsziele für Bankabhebungen",
          add_account: "Konto hinzufügen",
          empty_title: "Keine Bankkonten verknüpft",
          empty_description: "Fügen Sie ein Bankkonto hinzu, um Abhebungen auf Ihre Bank zu ermöglichen.",
          default: "Standard",
          status: {
            verified: "Verifiziert",
            rejected: "Abgelehnt",
            pending: "In Prüfung"
          },
          limits_title: "Abwicklungslimits",
          limits_subtitle: "Rollierende Enterprise-Limits",
          remaining: "{percent} % verbleibend",
          limits_note: "Höhere Abwicklungslimits werden von Ihrem Relationship Manager und dem Compliance-Team geprüft."
        },
        activity: {
          title: "Transaktionsaktivität",
          subtitle: "Interne Transfers und Bankabwicklungen",
          search_label: "Transaktionen suchen",
          search_placeholder: "Referenz oder Asset suchen",
          filter_label: "Transaktionsstatus filtern",
          filter_all: "Alle Status",
          status: {
            completed: "Abgeschlossen",
            processing: "In Bearbeitung",
            review: "Prüfung",
            under_review: "In Prüfung",
            failed: "Fehlgeschlagen"
          },
          columns: {
            transaction: "Transaktion",
            amount: "Betrag",
            destination: "Ziel",
            status: "Status",
            date: "Datum",
            view: "Ansehen"
          },
          direction: {
            spot_to_funding: "Spot zu Funding",
            funding_to_spot: "Funding zu Spot",
            funding_to_bank: "Funding zu Bank",
            spot_to_bank: "Spot zu Bank"
          },
          view_transaction: "{reference} ansehen",
          empty_title: "Keine passenden Transaktionen",
          empty_description: "Ändern Sie die Suche oder den Statusfilter."
        },
        add_account: {
          title: "Bankkonto hinzufügen",
          description: "Eingereichte Konten werden von unserem Compliance-Team geprüft, bevor sie Abwicklungen empfangen können. Dies dauert in der Regel 1–2 Werktage.",
          fields: {
            bank_name: "Bankname",
            bank_name_placeholder: "z. B. Deutsche Bank",
            account_holder: "Kontoinhaber",
            account_holder_placeholder: "Vollständiger rechtlicher Name",
            account_number: "Kontonummer / IBAN",
            account_number_placeholder: "Kontonummer",
            routing_number: "Bankleitzahl (ACH/inland)",
            swift_bic: "SWIFT / BIC (international)",
            optional: "Optional",
            account_type: "Kontotyp",
            checking: "Girokonto",
            savings: "Sparkonto",
            currency: "Währung",
            country: "Land",
            country_placeholder: "DE"
          },
          submitting: "Wird gesendet...",
          submit: "Zur Verifizierung einreichen",
          required_fields: "Bitte füllen Sie alle Pflichtfelder aus",
          success: "Bankkonto zur Verifizierung eingereicht",
          failed: "Bankkonto konnte nicht hinzugefügt werden"
        },
        transfer: {
          title_form: "Gelder verschieben",
          title_review: "Transfer prüfen",
          title_success: "Transferstatus",
          desc_form: "Verschieben Sie Assets zwischen Wallets oder zahlen Sie auf ein verknüpftes Bankkonto aus.",
          desc_review: "Kurse werden fünf Minuten reserviert.",
          desc_success: "Ihre Referenz ist bereit zur Nachverfolgung.",
          back_label: "Zurück zu Transferdetails",
          step_label: "Schritt {step} von 3",
          cancel: "Abbrechen",
          review_transfer: "Transfer prüfen",
          confirm_submit: "Bestätigen und senden",
          done: "Fertig",
          quote_failed: "Angebot konnte nicht erstellt werden",
          transfer_failed: "Transfer konnte nicht gesendet werden",
          type_legend: "Transfertyp",
          types: {
            spot_to_funding: {
              label: "Spot → Funding",
              description: "Assets für Zahlungen vorbereiten"
            },
            funding_to_spot: {
              label: "Funding → Spot",
              description: "Assets für Trading zurückführen"
            },
            funding_to_bank: {
              label: "Funding → Bank",
              description: "Verfügbare Gelder abheben"
            },
            spot_to_bank: {
              label: "Spot → Bank",
              description: "Umwandeln und abheben"
            }
          },
          from: "Von",
          to: "Nach",
          spot_wallet: "Spot-Wallet",
          funding_wallet: "Funding-Wallet",
          bank_account: "Bankkonto",
          asset: "Asset",
          amount: "Betrag",
          max: "MAX",
          amount_placeholder: "0,00",
          payout_currency: "Auszahlungswährung",
          currencies: {
            USD: "USD · US-Dollar",
            EUR: "EUR · Euro",
            GBP: "GBP · Britisches Pfund"
          },
          select_account: "Konto auswählen",
          available: "Verfügbar"
        },
        review: {
          recipient_receives: "Empfänger erhält",
          from_amount: "Von {amount} {asset}",
          market_value: "Marktwert",
          exchange_rate: "Wechselkurs",
          exchange_rate_value: "1 USD = {rate} {currency}",
          platform_fee: "Plattformgebühr",
          banking_fee: "Bankgebühr",
          estimated_arrival: "Voraussichtliche Ankunft",
          authorization: "Mit der Bestätigung autorisieren Sie die Asset-Umwandlung und die oben gezeigten Abwicklungsanweisungen.",
          withdrawal_submitted: "Abhebung eingereicht",
          transfer_completed: "Transfer abgeschlossen",
          withdrawal_desc: "Ihre Abwicklung hat die Erstvalidierung bestanden und durchläuft nun die Compliance-Prüfung.",
          transfer_desc: "Ihre Salden wurden im Banking-Arbeitsbereich aktualisiert.",
          reference: "Referenz",
          status: "Status",
          destination: "Ziel",
          processing: "In Bearbeitung",
          completed: "Abgeschlossen"
        },
        detail: {
          title: "Transferdetails",
          reference: "Referenz {reference}",
          payout_amount: "Auszahlungsbetrag",
          destination: "Ziel",
          estimated_arrival: "Voraussichtliche Ankunft",
          fees: "Gebühren",
          requested: "Angefordert",
          timeline_title: "Abwicklungszeitplan",
          pending: "Ausstehend",
          download_receipt: "Beleg herunterladen",
          status: {
            completed: "Abgeschlossen",
            processing: "In Bearbeitung",
            under_review: "In Prüfung",
            failed: "Fehlgeschlagen"
          }
        },
        skeleton: {
          loading: "Banking-Dashboard wird geladen"
        }
      },
  },
  ar: {
    AccountBanking: {
        meta: {
          title: "الخدمات المصرفية للمؤسسات | Lenix Protocol",
          description: "انقل الأصول الرقمية بين Spot وFunding والحسابات المصرفية الموثقة."
        },
        error: {
          load_failed: "تعذّر تحميل مساحة العمل المصرفية",
          unavailable_title: "مساحة العمل المصرفية غير متاحة",
          unavailable_description: "تعذّر تحميل نظرة عامة على الخدمات المصرفية.",
          try_again: "حاول مرة أخرى"
        },
        tabs: {
          overview: "نظرة عامة",
          accounts: "الحسابات المصرفية",
          activity: "النشاط"
        },
        empty_assets: {
          title: "لا توجد أصول خزينة بعد",
          description: "انقل الأصول إلى محفظة Spot أو Funding للبدء.",
          cta: "نقل الأموال"
        },
        fiat_balance: {
          funding: "Funding {currency}",
          available: "{amount} متاح"
        },
        summary: {
          title: "الخدمات المصرفية للمؤسسات",
          verified: "موثّق",
          verification_pending: "التحقق قيد الانتظار",
          subtitle: "انقل الأصول الرقمية بين محافظ الخزينة والحسابات المصرفية الموثقة.",
          transfer: "تحويل",
          withdraw_to_bank: "سحب إلى البنك",
          total_treasury: "إجمالي قيمة الخزينة",
          hide_balances: "إخفاء الأرصدة",
          show_balances: "إظهار الأرصدة",
          account: "الحساب",
          tier: "المستوى",
          relationship_manager: "مدير العلاقات",
          spot_wallet: "محفظة Spot",
          spot_available: "متاح للتداول",
          funding_wallet: "محفظة Funding",
          funding_available: "متاح للتسوية",
          in_settlement: "قيد التسوية",
          pending_payouts: "عبر المدفوعات المصرفية النشطة"
        },
        assets: {
          title: "أرصدة المحفظة",
          subtitle: "أصول Spot وFunding الجاهزة للدفع",
          move_funds: "نقل الأموال",
          columns: {
            asset: "الأصل",
            wallet: "المحفظة",
            balance: "الرصيد",
            value: "القيمة",
            change_24h: "24 س"
          },
          location: {
            spot: "Spot",
            funding: "Funding"
          }
        },
        accounts: {
          linked_title: "الحسابات المصرفية المرتبطة",
          linked_subtitle: "وجهات التسوية للسحب المصرفي",
          add_account: "إضافة حساب",
          empty_title: "لا توجد حسابات مصرفية مرتبطة",
          empty_description: "أضف حسابًا مصرفيًا لتمكين السحب إلى بنكك.",
          default: "افتراضي",
          status: {
            verified: "موثّق",
            rejected: "مرفوض",
            pending: "قيد المراجعة"
          },
          limits_title: "حدود التسوية",
          limits_subtitle: "حدود مؤسسية متجددة",
          remaining: "متبقٍ {percent}٪",
          limits_note: "تُراجع حدود التسوية الأعلى من قِبل مدير علاقاتك وفريق الامتثال."
        },
        activity: {
          title: "نشاط المعاملات",
          subtitle: "التحويلات الداخلية والتسويات المصرفية",
          search_label: "البحث في المعاملات",
          search_placeholder: "ابحث عن مرجع أو أصل",
          filter_label: "تصفية حالة المعاملة",
          filter_all: "جميع الحالات",
          status: {
            completed: "مكتمل",
            processing: "قيد المعالجة",
            review: "مراجعة",
            under_review: "قيد المراجعة",
            failed: "فشل"
          },
          columns: {
            transaction: "المعاملة",
            amount: "المبلغ",
            destination: "الوجهة",
            status: "الحالة",
            date: "التاريخ",
            view: "عرض"
          },
          direction: {
            spot_to_funding: "Spot إلى Funding",
            funding_to_spot: "Funding إلى Spot",
            funding_to_bank: "Funding إلى البنك",
            spot_to_bank: "Spot إلى البنك"
          },
          view_transaction: "عرض {reference}",
          empty_title: "لا توجد معاملات مطابقة",
          empty_description: "غيّر البحث أو مرشح الحالة."
        },
        add_account: {
          title: "إضافة حساب مصرفي",
          description: "تُراجع الحسابات المقدمة من قِبل فريق الامتثال قبل أن تتمكن من استلام التسويات. يستغرق ذلك عادةً 1–2 أيام عمل.",
          fields: {
            bank_name: "اسم البنك",
            bank_name_placeholder: "مثال: البنك الأهلي",
            account_holder: "اسم صاحب الحساب",
            account_holder_placeholder: "الاسم القانوني الكامل",
            account_number: "رقم الحساب / IBAN",
            account_number_placeholder: "رقم الحساب",
            routing_number: "رقم التوجيه (ACH/محلي)",
            swift_bic: "SWIFT / BIC (دولي)",
            optional: "اختياري",
            account_type: "نوع الحساب",
            checking: "جاري",
            savings: "توفير",
            currency: "العملة",
            country: "البلد",
            country_placeholder: "SA"
          },
          submitting: "جارٍ الإرسال...",
          submit: "إرسال للتحقق",
          required_fields: "يرجى ملء جميع الحقول المطلوبة",
          success: "تم إرسال الحساب المصرفي للتحقق",
          failed: "فشل إضافة الحساب المصرفي"
        },
        transfer: {
          title_form: "نقل الأموال",
          title_review: "مراجعة التحويل",
          title_success: "حالة التحويل",
          desc_form: "انقل الأصول بين المحافظ أو سوِّ إلى بنك مرتبط.",
          desc_review: "يتم حجز الأسعار لمدة خمس دقائق.",
          desc_success: "مرجعك جاهز للتتبع.",
          back_label: "العودة إلى تفاصيل التحويل",
          step_label: "الخطوة {step} من 3",
          cancel: "إلغاء",
          review_transfer: "مراجعة التحويل",
          confirm_submit: "تأكيد وإرسال",
          done: "تم",
          quote_failed: "تعذّر إنشاء عرض سعر",
          transfer_failed: "تعذّر إرسال التحويل",
          type_legend: "نوع التحويل",
          types: {
            spot_to_funding: {
              label: "Spot → Funding",
              description: "تحضير الأصول للمدفوعات"
            },
            funding_to_spot: {
              label: "Funding → Spot",
              description: "إعادة الأصول للتداول"
            },
            funding_to_bank: {
              label: "Funding → البنك",
              description: "سحب الأموال المتاحة"
            },
            spot_to_bank: {
              label: "Spot → البنك",
              description: "تحويل وسحب"
            }
          },
          from: "من",
          to: "إلى",
          spot_wallet: "محفظة Spot",
          funding_wallet: "محفظة Funding",
          bank_account: "حساب مصرفي",
          asset: "الأصل",
          amount: "المبلغ",
          max: "الحد الأقصى",
          amount_placeholder: "0.00",
          payout_currency: "عملة الدفع",
          currencies: {
            USD: "USD · دولار أمريكي",
            EUR: "EUR · يورو",
            GBP: "GBP · جنيه إسترليني"
          },
          select_account: "اختر حسابًا",
          available: "متاح"
        },
        review: {
          recipient_receives: "المستلم يحصل على",
          from_amount: "من {amount} {asset}",
          market_value: "القيمة السوقية",
          exchange_rate: "سعر الصرف",
          exchange_rate_value: "1 USD = {rate} {currency}",
          platform_fee: "رسوم المنصة",
          banking_fee: "رسوم مصرفية",
          estimated_arrival: "الوصول المتوقع",
          authorization: "بالتأكيد، فإنك تفوض تحويل الأصول وتعليمات التسوية الموضحة أعلاه.",
          withdrawal_submitted: "تم إرسال السحب",
          transfer_completed: "اكتمل التحويل",
          withdrawal_desc: "اجتازت تسويتك التحقق الأولي وهي الآن تدخل فحص الامتثال.",
          transfer_desc: "تم تحديث أرصدتك في مساحة العمل المصرفية.",
          reference: "المرجع",
          status: "الحالة",
          destination: "الوجهة",
          processing: "قيد المعالجة",
          completed: "مكتمل"
        },
        detail: {
          title: "تفاصيل التحويل",
          reference: "المرجع {reference}",
          payout_amount: "مبلغ الدفع",
          destination: "الوجهة",
          estimated_arrival: "الوصول المتوقع",
          fees: "الرسوم",
          requested: "مطلوب",
          timeline_title: "جدول التسوية",
          pending: "قيد الانتظار",
          download_receipt: "تنزيل الإيصال",
          status: {
            completed: "مكتمل",
            processing: "قيد المعالجة",
            under_review: "قيد المراجعة",
            failed: "فشل"
          }
        },
        skeleton: {
          loading: "جارٍ تحميل لوحة الخدمات المصرفية"
        }
      },
  },
  pt: {
    AccountBanking: {
        meta: {
          title: "Banca empresarial | Lenix Protocol",
          description: "Mova ativos digitais entre Spot, Funding e contas bancárias verificadas."
        },
        error: {
          load_failed: "Não foi possível carregar a área bancária",
          unavailable_title: "Área bancária indisponível",
          unavailable_description: "Não foi possível carregar a visão geral bancária.",
          try_again: "Tentar novamente"
        },
        tabs: {
          overview: "Visão geral",
          accounts: "Contas bancárias",
          activity: "Atividade"
        },
        empty_assets: {
          title: "Ainda não há ativos de tesouraria",
          description: "Mova ativos para a sua carteira Spot ou Funding para começar.",
          cta: "Mover fundos"
        },
        fiat_balance: {
          funding: "Funding {currency}",
          available: "{amount} disponível"
        },
        summary: {
          title: "Banca empresarial",
          verified: "Verificado",
          verification_pending: "Verificação pendente",
          subtitle: "Mova ativos digitais entre carteiras de tesouraria e contas bancárias verificadas.",
          transfer: "Transferir",
          withdraw_to_bank: "Levantar para o banco",
          total_treasury: "Valor total da tesouraria",
          hide_balances: "Ocultar saldos",
          show_balances: "Mostrar saldos",
          account: "Conta",
          tier: "Nível",
          relationship_manager: "Gestor de relação",
          spot_wallet: "Carteira Spot",
          spot_available: "Disponível para trading",
          funding_wallet: "Carteira Funding",
          funding_available: "Disponível para liquidação",
          in_settlement: "Em liquidação",
          pending_payouts: "Em pagamentos bancários ativos"
        },
        assets: {
          title: "Saldos da carteira",
          subtitle: "Ativos Spot e Funding prontos para pagamento",
          move_funds: "Mover fundos",
          columns: {
            asset: "Ativo",
            wallet: "Carteira",
            balance: "Saldo",
            value: "Valor",
            change_24h: "24 h"
          },
          location: {
            spot: "Spot",
            funding: "Funding"
          }
        },
        accounts: {
          linked_title: "Contas bancárias associadas",
          linked_subtitle: "Destinos de liquidação para levantamentos bancários",
          add_account: "Adicionar conta",
          empty_title: "Nenhuma conta bancária associada",
          empty_description: "Adicione uma conta bancária para permitir levantamentos para o seu banco.",
          default: "Predefinida",
          status: {
            verified: "Verificada",
            rejected: "Rejeitada",
            pending: "Em revisão"
          },
          limits_title: "Limites de liquidação",
          limits_subtitle: "Limites empresariais acumulados",
          remaining: "{percent}% restante",
          limits_note: "Limites de liquidação mais elevados são revistos pelo seu gestor de relação e pela equipa de conformidade."
        },
        activity: {
          title: "Atividade de transações",
          subtitle: "Transferências internas e liquidações bancárias",
          search_label: "Pesquisar transações",
          search_placeholder: "Pesquisar referência ou ativo",
          filter_label: "Filtrar estado da transação",
          filter_all: "Todos os estados",
          status: {
            completed: "Concluída",
            processing: "A processar",
            review: "Revisão",
            under_review: "Em revisão",
            failed: "Falhada"
          },
          columns: {
            transaction: "Transação",
            amount: "Montante",
            destination: "Destino",
            status: "Estado",
            date: "Data",
            view: "Ver"
          },
          direction: {
            spot_to_funding: "Spot para Funding",
            funding_to_spot: "Funding para Spot",
            funding_to_bank: "Funding para banco",
            spot_to_bank: "Spot para banco"
          },
          view_transaction: "Ver {reference}",
          empty_title: "Nenhuma transação correspondente",
          empty_description: "Altere a pesquisa ou o filtro de estado."
        },
        add_account: {
          title: "Adicionar conta bancária",
          description: "As contas submetidas são revistas pela nossa equipa de conformidade antes de receberem liquidações. Isto demora normalmente 1–2 dias úteis.",
          fields: {
            bank_name: "Nome do banco",
            bank_name_placeholder: "ex. Millennium BCP",
            account_holder: "Nome do titular",
            account_holder_placeholder: "Nome legal completo",
            account_number: "Número de conta / IBAN",
            account_number_placeholder: "Número de conta",
            routing_number: "Número de roteamento (ACH/nacional)",
            swift_bic: "SWIFT / BIC (internacional)",
            optional: "Opcional",
            account_type: "Tipo de conta",
            checking: "Conta à ordem",
            savings: "Conta poupança",
            currency: "Moeda",
            country: "País",
            country_placeholder: "PT"
          },
          submitting: "A enviar...",
          submit: "Submeter para verificação",
          required_fields: "Preencha todos os campos obrigatórios",
          success: "Conta bancária submetida para verificação",
          failed: "Falha ao adicionar conta bancária"
        },
        transfer: {
          title_form: "Mover fundos",
          title_review: "Rever transferência",
          title_success: "Estado da transferência",
          desc_form: "Mova ativos entre carteiras ou liquide para um banco associado.",
          desc_review: "As taxas ficam reservadas durante cinco minutos.",
          desc_success: "A sua referência está pronta para acompanhamento.",
          back_label: "Voltar aos detalhes da transferência",
          step_label: "Passo {step} de 3",
          cancel: "Cancelar",
          review_transfer: "Rever transferência",
          confirm_submit: "Confirmar e submeter",
          done: "Concluído",
          quote_failed: "Não foi possível criar cotação",
          transfer_failed: "Não foi possível submeter a transferência",
          type_legend: "Tipo de transferência",
          types: {
            spot_to_funding: {
              label: "Spot → Funding",
              description: "Preparar ativos para pagamentos"
            },
            funding_to_spot: {
              label: "Funding → Spot",
              description: "Devolver ativos para trading"
            },
            funding_to_bank: {
              label: "Funding → Banco",
              description: "Levantar fundos disponíveis"
            },
            spot_to_bank: {
              label: "Spot → Banco",
              description: "Converter e levantar"
            }
          },
          from: "De",
          to: "Para",
          spot_wallet: "Carteira Spot",
          funding_wallet: "Carteira Funding",
          bank_account: "Conta bancária",
          asset: "Ativo",
          amount: "Montante",
          max: "MÁX",
          amount_placeholder: "0,00",
          payout_currency: "Moeda de pagamento",
          currencies: {
            USD: "USD · Dólar americano",
            EUR: "EUR · Euro",
            GBP: "GBP · Libra esterlina"
          },
          select_account: "Selecionar conta",
          available: "Disponível"
        },
        review: {
          recipient_receives: "O destinatário recebe",
          from_amount: "De {amount} {asset}",
          market_value: "Valor de mercado",
          exchange_rate: "Taxa de câmbio",
          exchange_rate_value: "1 USD = {rate} {currency}",
          platform_fee: "Taxa da plataforma",
          banking_fee: "Taxa bancária",
          estimated_arrival: "Chegada estimada",
          authorization: "Ao confirmar, autoriza a conversão de ativos e as instruções de liquidação acima.",
          withdrawal_submitted: "Levantamento submetido",
          transfer_completed: "Transferência concluída",
          withdrawal_desc: "A sua liquidação passou a validação inicial e entra agora em verificação de conformidade.",
          transfer_desc: "Os seus saldos foram atualizados na área bancária.",
          reference: "Referência",
          status: "Estado",
          destination: "Destino",
          processing: "A processar",
          completed: "Concluída"
        },
        detail: {
          title: "Detalhes da transferência",
          reference: "Referência {reference}",
          payout_amount: "Montante do pagamento",
          destination: "Destino",
          estimated_arrival: "Chegada estimada",
          fees: "Taxas",
          requested: "Solicitado",
          timeline_title: "Cronologia de liquidação",
          pending: "Pendente",
          download_receipt: "Transferir recibo",
          status: {
            completed: "Concluída",
            processing: "A processar",
            under_review: "Em revisão",
            failed: "Falhada"
          }
        },
        skeleton: {
          loading: "A carregar painel bancário"
        }
      },
  },
  zh: {
    AccountBanking: {
        meta: {
          title: "企业银行 | Lenix Protocol",
          description: "在 Spot、Funding 和已验证银行账户之间转移数字资产。"
        },
        error: {
          load_failed: "无法加载银行工作区",
          unavailable_title: "银行工作区不可用",
          unavailable_description: "无法加载银行概览。",
          try_again: "重试"
        },
        tabs: {
          overview: "概览",
          accounts: "银行账户",
          activity: "活动"
        },
        empty_assets: {
          title: "暂无 treasury 资产",
          description: "将资产转入 Spot 或 Funding 钱包即可开始。",
          cta: "转移资金"
        },
        fiat_balance: {
          funding: "{currency} Funding",
          available: "可用 {amount}"
        },
        summary: {
          title: "企业银行",
          verified: "已验证",
          verification_pending: "待验证",
          subtitle: "在 treasury 钱包和已验证银行账户之间转移数字资产。",
          transfer: "转账",
          withdraw_to_bank: "提现至银行",
          total_treasury: "Treasury 总价值",
          hide_balances: "隐藏余额",
          show_balances: "显示余额",
          account: "账户",
          tier: "等级",
          relationship_manager: "客户经理",
          spot_wallet: "Spot 钱包",
          spot_available: "可用于交易",
          funding_wallet: "Funding 钱包",
          funding_available: "可用于结算",
          in_settlement: "结算中",
          pending_payouts: "在活跃的银行付款中"
        },
        assets: {
          title: "钱包余额",
          subtitle: "Spot 和可支付的 Funding 资产",
          move_funds: "转移资金",
          columns: {
            asset: "资产",
            wallet: "钱包",
            balance: "余额",
            value: "价值",
            change_24h: "24小时"
          },
          location: {
            spot: "Spot",
            funding: "Funding"
          }
        },
        accounts: {
          linked_title: "已关联银行账户",
          linked_subtitle: "银行提现的结算目的地",
          add_account: "添加账户",
          empty_title: "暂无关联银行账户",
          empty_description: "添加银行账户以启用提现至您的银行。",
          default: "默认",
          status: {
            verified: "已验证",
            rejected: "已拒绝",
            pending: "审核中"
          },
          limits_title: "结算限额",
          limits_subtitle: "滚动企业额度",
          remaining: "剩余 {percent}%",
          limits_note: "更高的结算限额由您的客户经理和合规团队审核。"
        },
        activity: {
          title: "交易活动",
          subtitle: "内部转账和银行结算",
          search_label: "搜索交易",
          search_placeholder: "搜索参考号或资产",
          filter_label: "筛选交易状态",
          filter_all: "全部状态",
          status: {
            completed: "已完成",
            processing: "处理中",
            review: "审核",
            under_review: "审核中",
            failed: "失败"
          },
          columns: {
            transaction: "交易",
            amount: "金额",
            destination: "目的地",
            status: "状态",
            date: "日期",
            view: "查看"
          },
          direction: {
            spot_to_funding: "Spot 至 Funding",
            funding_to_spot: "Funding 至 Spot",
            funding_to_bank: "Funding 至银行",
            spot_to_bank: "Spot 至银行"
          },
          view_transaction: "查看 {reference}",
          empty_title: "没有匹配的交易",
          empty_description: "更改搜索或状态筛选条件。"
        },
        add_account: {
          title: "添加银行账户",
          description: "提交的账户在接收结算前需经合规团队审核。通常需要 1–2 个工作日。",
          fields: {
            bank_name: "银行名称",
            bank_name_placeholder: "例如：工商银行",
            account_holder: "账户持有人姓名",
            account_holder_placeholder: "完整法定姓名",
            account_number: "账号 / IBAN",
            account_number_placeholder: "账号",
            routing_number: "路由号（ACH/国内）",
            swift_bic: "SWIFT / BIC（国际）",
            optional: "选填",
            account_type: "账户类型",
            checking: "支票账户",
            savings: "储蓄账户",
            currency: "货币",
            country: "国家",
            country_placeholder: "CN"
          },
          submitting: "提交中...",
          submit: "提交验证",
          required_fields: "请填写所有必填字段",
          success: "银行账户已提交验证",
          failed: "添加银行账户失败"
        },
        transfer: {
          title_form: "转移资金",
          title_review: "审核转账",
          title_success: "转账状态",
          desc_form: "在钱包之间转移资产或结算至已关联银行。",
          desc_review: "汇率保留五分钟。",
          desc_success: "您的参考号已可用于跟踪。",
          back_label: "返回转账详情",
          step_label: "第 {step} 步，共 3 步",
          cancel: "取消",
          review_transfer: "审核转账",
          confirm_submit: "确认并提交",
          done: "完成",
          quote_failed: "无法创建报价",
          transfer_failed: "无法提交转账",
          type_legend: "转账类型",
          types: {
            spot_to_funding: {
              label: "Spot → Funding",
              description: "准备资产用于支付"
            },
            funding_to_spot: {
              label: "Funding → Spot",
              description: "将资产返回用于交易"
            },
            funding_to_bank: {
              label: "Funding → 银行",
              description: "提取可用资金"
            },
            spot_to_bank: {
              label: "Spot → 银行",
              description: "转换并提现"
            }
          },
          from: "从",
          to: "至",
          spot_wallet: "Spot 钱包",
          funding_wallet: "Funding 钱包",
          bank_account: "银行账户",
          asset: "资产",
          amount: "金额",
          max: "最大",
          amount_placeholder: "0.00",
          payout_currency: "付款货币",
          currencies: {
            USD: "USD · 美元",
            EUR: "EUR · 欧元",
            GBP: "GBP · 英镑"
          },
          select_account: "选择账户",
          available: "可用"
        },
        review: {
          recipient_receives: "收款方收到",
          from_amount: "从 {amount} {asset}",
          market_value: "市场价值",
          exchange_rate: "汇率",
          exchange_rate_value: "1 USD = {rate} {currency}",
          platform_fee: "平台费用",
          banking_fee: "银行费用",
          estimated_arrival: "预计到账",
          authorization: "确认即表示您授权上述资产转换和结算指令。",
          withdrawal_submitted: "提现已提交",
          transfer_completed: "转账已完成",
          withdrawal_desc: "您的结算已通过初步验证，现进入合规审查。",
          transfer_desc: "您的余额已在银行工作区更新。",
          reference: "参考号",
          status: "状态",
          destination: "目的地",
          processing: "处理中",
          completed: "已完成"
        },
        detail: {
          title: "转账详情",
          reference: "参考号 {reference}",
          payout_amount: "付款金额",
          destination: "目的地",
          estimated_arrival: "预计到账",
          fees: "费用",
          requested: "已请求",
          timeline_title: "结算时间线",
          pending: "待处理",
          download_receipt: "下载收据",
          status: {
            completed: "已完成",
            processing: "处理中",
            under_review: "审核中",
            failed: "失败"
          }
        },
        skeleton: {
          loading: "正在加载银行仪表板"
        }
      },
  },
  it: {
    AccountBanking: {
        meta: {
          title: "Banking aziendale | Lenix Protocol",
          description: "Sposta asset digitali tra Spot, Funding e conti bancari verificati."
        },
        error: {
          load_failed: "Impossibile caricare l'area bancaria",
          unavailable_title: "Area bancaria non disponibile",
          unavailable_description: "Impossibile caricare la panoramica bancaria.",
          try_again: "Riprova"
        },
        tabs: {
          overview: "Panoramica",
          accounts: "Conti bancari",
          activity: "Attività"
        },
        empty_assets: {
          title: "Nessun asset di tesoreria",
          description: "Sposta asset nel wallet Spot o Funding per iniziare.",
          cta: "Sposta fondi"
        },
        fiat_balance: {
          funding: "Funding {currency}",
          available: "{amount} disponibile"
        },
        summary: {
          title: "Banking aziendale",
          verified: "Verificato",
          verification_pending: "Verifica in attesa",
          subtitle: "Sposta asset digitali tra wallet di tesoreria e conti bancari verificati.",
          transfer: "Trasferisci",
          withdraw_to_bank: "Preleva su banca",
          total_treasury: "Valore totale tesoreria",
          hide_balances: "Nascondi saldi",
          show_balances: "Mostra saldi",
          account: "Conto",
          tier: "Livello",
          relationship_manager: "Relationship manager",
          spot_wallet: "Wallet Spot",
          spot_available: "Disponibile per il trading",
          funding_wallet: "Wallet Funding",
          funding_available: "Disponibile per la liquidazione",
          in_settlement: "In liquidazione",
          pending_payouts: "Nei pagamenti bancari attivi"
        },
        assets: {
          title: "Saldi wallet",
          subtitle: "Asset Spot e Funding pronti per il pagamento",
          move_funds: "Sposta fondi",
          columns: {
            asset: "Asset",
            wallet: "Wallet",
            balance: "Saldo",
            value: "Valore",
            change_24h: "24 h"
          },
          location: {
            spot: "Spot",
            funding: "Funding"
          }
        },
        accounts: {
          linked_title: "Conti bancari collegati",
          linked_subtitle: "Destinazioni di liquidazione per prelievi bancari",
          add_account: "Aggiungi conto",
          empty_title: "Nessun conto bancario collegato",
          empty_description: "Aggiungi un conto bancario per abilitare i prelievi verso la tua banca.",
          default: "Predefinito",
          status: {
            verified: "Verificato",
            rejected: "Rifiutato",
            pending: "In revisione"
          },
          limits_title: "Limiti di liquidazione",
          limits_subtitle: "Limiti aziendali rolling",
          remaining: "{percent}% rimanente",
          limits_note: "Limiti di liquidazione più elevati sono revisionati dal relationship manager e dal team compliance."
        },
        activity: {
          title: "Attività transazioni",
          subtitle: "Trasferimenti interni e liquidazioni bancarie",
          search_label: "Cerca transazioni",
          search_placeholder: "Cerca riferimento o asset",
          filter_label: "Filtra stato transazione",
          filter_all: "Tutti gli stati",
          status: {
            completed: "Completata",
            processing: "In elaborazione",
            review: "Revisione",
            under_review: "In revisione",
            failed: "Non riuscita"
          },
          columns: {
            transaction: "Transazione",
            amount: "Importo",
            destination: "Destinazione",
            status: "Stato",
            date: "Data",
            view: "Visualizza"
          },
          direction: {
            spot_to_funding: "Spot a Funding",
            funding_to_spot: "Funding a Spot",
            funding_to_bank: "Funding a banca",
            spot_to_bank: "Spot a banca"
          },
          view_transaction: "Visualizza {reference}",
          empty_title: "Nessuna transazione corrispondente",
          empty_description: "Modifica la ricerca o il filtro stato."
        },
        add_account: {
          title: "Aggiungi conto bancario",
          description: "I conti inviati sono revisionati dal team compliance prima di ricevere liquidazioni. Di solito richiede 1–2 giorni lavorativi.",
          fields: {
            bank_name: "Nome banca",
            bank_name_placeholder: "es. Intesa Sanpaolo",
            account_holder: "Intestatario del conto",
            account_holder_placeholder: "Nome legale completo",
            account_number: "Numero conto / IBAN",
            account_number_placeholder: "Numero conto",
            routing_number: "Codice di instradamento (ACH/nazionale)",
            swift_bic: "SWIFT / BIC (internazionale)",
            optional: "Facoltativo",
            account_type: "Tipo di conto",
            checking: "Corrente",
            savings: "Risparmio",
            currency: "Valuta",
            country: "Paese",
            country_placeholder: "IT"
          },
          submitting: "Invio in corso...",
          submit: "Invia per verifica",
          required_fields: "Compila tutti i campi obbligatori",
          success: "Conto bancario inviato per verifica",
          failed: "Impossibile aggiungere il conto bancario"
        },
        transfer: {
          title_form: "Sposta fondi",
          title_review: "Rivedi trasferimento",
          title_success: "Stato trasferimento",
          desc_form: "Sposta asset tra wallet o liquida su una banca collegata.",
          desc_review: "I tassi sono riservati per cinque minuti.",
          desc_success: "Il tuo riferimento è pronto per il tracciamento.",
          back_label: "Torna ai dettagli del trasferimento",
          step_label: "Passo {step} di 3",
          cancel: "Annulla",
          review_transfer: "Rivedi trasferimento",
          confirm_submit: "Conferma e invia",
          done: "Fatto",
          quote_failed: "Impossibile creare il preventivo",
          transfer_failed: "Impossibile inviare il trasferimento",
          type_legend: "Tipo di trasferimento",
          types: {
            spot_to_funding: {
              label: "Spot → Funding",
              description: "Prepara asset per i pagamenti"
            },
            funding_to_spot: {
              label: "Funding → Spot",
              description: "Restituisci asset per il trading"
            },
            funding_to_bank: {
              label: "Funding → Banca",
              description: "Preleva fondi disponibili"
            },
            spot_to_bank: {
              label: "Spot → Banca",
              description: "Converti e preleva"
            }
          },
          from: "Da",
          to: "A",
          spot_wallet: "Wallet Spot",
          funding_wallet: "Wallet Funding",
          bank_account: "Conto bancario",
          asset: "Asset",
          amount: "Importo",
          max: "MAX",
          amount_placeholder: "0,00",
          payout_currency: "Valuta di pagamento",
          currencies: {
            USD: "USD · Dollaro USA",
            EUR: "EUR · Euro",
            GBP: "GBP · Sterlina britannica"
          },
          select_account: "Seleziona conto",
          available: "Disponibile"
        },
        review: {
          recipient_receives: "Il destinatario riceve",
          from_amount: "Da {amount} {asset}",
          market_value: "Valore di mercato",
          exchange_rate: "Tasso di cambio",
          exchange_rate_value: "1 USD = {rate} {currency}",
          platform_fee: "Commissione piattaforma",
          banking_fee: "Commissione bancaria",
          estimated_arrival: "Arrivo stimato",
          authorization: "Confermando, autorizzi la conversione degli asset e le istruzioni di liquidazione sopra indicate.",
          withdrawal_submitted: "Prelievo inviato",
          transfer_completed: "Trasferimento completato",
          withdrawal_desc: "La liquidazione ha superato la validazione iniziale ed entra ora nello screening compliance.",
          transfer_desc: "I saldi sono stati aggiornati nell'area bancaria.",
          reference: "Riferimento",
          status: "Stato",
          destination: "Destinazione",
          processing: "In elaborazione",
          completed: "Completata"
        },
        detail: {
          title: "Dettagli trasferimento",
          reference: "Riferimento {reference}",
          payout_amount: "Importo pagamento",
          destination: "Destinazione",
          estimated_arrival: "Arrivo stimato",
          fees: "Commissioni",
          requested: "Richiesto",
          timeline_title: "Cronologia liquidazione",
          pending: "In attesa",
          download_receipt: "Scarica ricevuta",
          status: {
            completed: "Completata",
            processing: "In elaborazione",
            under_review: "In revisione",
            failed: "Non riuscita"
          }
        },
        skeleton: {
          loading: "Caricamento dashboard bancaria"
        }
      },
  },
  vi: {
    AccountBanking: {
        meta: {
          title: "Ngân hàng doanh nghiệp | Lenix Protocol",
          description: "Chuyển tài sản số giữa Spot, Funding và tài khoản ngân hàng đã xác minh."
        },
        error: {
          load_failed: "Không thể tải không gian ngân hàng",
          unavailable_title: "Không gian ngân hàng không khả dụng",
          unavailable_description: "Không thể tải tổng quan ngân hàng.",
          try_again: "Thử lại"
        },
        tabs: {
          overview: "Tổng quan",
          accounts: "Tài khoản ngân hàng",
          activity: "Hoạt động"
        },
        empty_assets: {
          title: "Chưa có tài sản kho bạc",
          description: "Chuyển tài sản vào ví Spot hoặc Funding để bắt đầu.",
          cta: "Chuyển tiền"
        },
        fiat_balance: {
          funding: "Funding {currency}",
          available: "{amount} khả dụng"
        },
        summary: {
          title: "Ngân hàng doanh nghiệp",
          verified: "Đã xác minh",
          verification_pending: "Đang chờ xác minh",
          subtitle: "Chuyển tài sản số giữa ví kho bạc và tài khoản ngân hàng đã xác minh.",
          transfer: "Chuyển",
          withdraw_to_bank: "Rút về ngân hàng",
          total_treasury: "Tổng giá trị kho bạc",
          hide_balances: "Ẩn số dư",
          show_balances: "Hiện số dư",
          account: "Tài khoản",
          tier: "Hạng",
          relationship_manager: "Quản lý quan hệ",
          spot_wallet: "Ví Spot",
          spot_available: "Khả dụng để giao dịch",
          funding_wallet: "Ví Funding",
          funding_available: "Khả dụng để thanh toán",
          in_settlement: "Đang thanh toán",
          pending_payouts: "Trong các khoản chi trả ngân hàng đang hoạt động"
        },
        assets: {
          title: "Số dư ví",
          subtitle: "Tài sản Spot và Funding sẵn sàng chi trả",
          move_funds: "Chuyển tiền",
          columns: {
            asset: "Tài sản",
            wallet: "Ví",
            balance: "Số dư",
            value: "Giá trị",
            change_24h: "24 giờ"
          },
          location: {
            spot: "Spot",
            funding: "Funding"
          }
        },
        accounts: {
          linked_title: "Tài khoản ngân hàng đã liên kết",
          linked_subtitle: "Điểm đến thanh toán cho rút tiền ngân hàng",
          add_account: "Thêm tài khoản",
          empty_title: "Chưa liên kết tài khoản ngân hàng",
          empty_description: "Thêm tài khoản ngân hàng để bật rút tiền về ngân hàng của bạn.",
          default: "Mặc định",
          status: {
            verified: "Đã xác minh",
            rejected: "Đã từ chối",
            pending: "Đang xem xét"
          },
          limits_title: "Giới hạn thanh toán",
          limits_subtitle: "Hạn mức doanh nghiệp luân chuyển",
          remaining: "Còn lại {percent}%",
          limits_note: "Giới hạn thanh toán cao hơn được xem xét bởi quản lý quan hệ và nhóm tuân thủ."
        },
        activity: {
          title: "Hoạt động giao dịch",
          subtitle: "Chuyển nội bộ và thanh toán ngân hàng",
          search_label: "Tìm giao dịch",
          search_placeholder: "Tìm mã tham chiếu hoặc tài sản",
          filter_label: "Lọc trạng thái giao dịch",
          filter_all: "Tất cả trạng thái",
          status: {
            completed: "Hoàn tất",
            processing: "Đang xử lý",
            review: "Xem xét",
            under_review: "Đang xem xét",
            failed: "Thất bại"
          },
          columns: {
            transaction: "Giao dịch",
            amount: "Số tiền",
            destination: "Điểm đến",
            status: "Trạng thái",
            date: "Ngày",
            view: "Xem"
          },
          direction: {
            spot_to_funding: "Spot sang Funding",
            funding_to_spot: "Funding sang Spot",
            funding_to_bank: "Funding sang ngân hàng",
            spot_to_bank: "Spot sang ngân hàng"
          },
          view_transaction: "Xem {reference}",
          empty_title: "Không có giao dịch phù hợp",
          empty_description: "Thay đổi tìm kiếm hoặc bộ lọc trạng thái."
        },
        add_account: {
          title: "Thêm tài khoản ngân hàng",
          description: "Tài khoản đã gửi được nhóm tuân thủ xem xét trước khi nhận thanh toán. Thường mất 1–2 ngày làm việc.",
          fields: {
            bank_name: "Tên ngân hàng",
            bank_name_placeholder: "vd. Vietcombank",
            account_holder: "Tên chủ tài khoản",
            account_holder_placeholder: "Họ tên pháp lý đầy đủ",
            account_number: "Số tài khoản / IBAN",
            account_number_placeholder: "Số tài khoản",
            routing_number: "Mã định tuyến (ACH/nội địa)",
            swift_bic: "SWIFT / BIC (quốc tế)",
            optional: "Tùy chọn",
            account_type: "Loại tài khoản",
            checking: "Thanh toán",
            savings: "Tiết kiệm",
            currency: "Tiền tệ",
            country: "Quốc gia",
            country_placeholder: "VN"
          },
          submitting: "Đang gửi...",
          submit: "Gửi để xác minh",
          required_fields: "Vui lòng điền tất cả trường bắt buộc",
          success: "Tài khoản ngân hàng đã gửi để xác minh",
          failed: "Không thể thêm tài khoản ngân hàng"
        },
        transfer: {
          title_form: "Chuyển tiền",
          title_review: "Xem lại chuyển khoản",
          title_success: "Trạng thái chuyển khoản",
          desc_form: "Chuyển tài sản giữa các ví hoặc thanh toán về ngân hàng đã liên kết.",
          desc_review: "Tỷ giá được giữ trong năm phút.",
          desc_success: "Mã tham chiếu của bạn đã sẵn sàng để theo dõi.",
          back_label: "Quay lại chi tiết chuyển khoản",
          step_label: "Bước {step} / 3",
          cancel: "Hủy",
          review_transfer: "Xem lại chuyển khoản",
          confirm_submit: "Xác nhận và gửi",
          done: "Xong",
          quote_failed: "Không thể tạo báo giá",
          transfer_failed: "Không thể gửi chuyển khoản",
          type_legend: "Loại chuyển khoản",
          types: {
            spot_to_funding: {
              label: "Spot → Funding",
              description: "Chuẩn bị tài sản cho thanh toán"
            },
            funding_to_spot: {
              label: "Funding → Spot",
              description: "Trả tài sản để giao dịch"
            },
            funding_to_bank: {
              label: "Funding → Ngân hàng",
              description: "Rút tiền đã sẵn sàng"
            },
            spot_to_bank: {
              label: "Spot → Ngân hàng",
              description: "Quy đổi và rút"
            }
          },
          from: "Từ",
          to: "Đến",
          spot_wallet: "Ví Spot",
          funding_wallet: "Ví Funding",
          bank_account: "Tài khoản ngân hàng",
          asset: "Tài sản",
          amount: "Số tiền",
          max: "TỐI ĐA",
          amount_placeholder: "0,00",
          payout_currency: "Tiền tệ chi trả",
          currencies: {
            USD: "USD · Đô la Mỹ",
            EUR: "EUR · Euro",
            GBP: "GBP · Bảng Anh"
          },
          select_account: "Chọn tài khoản",
          available: "Khả dụng"
        },
        review: {
          recipient_receives: "Người nhận nhận",
          from_amount: "Từ {amount} {asset}",
          market_value: "Giá trị thị trường",
          exchange_rate: "Tỷ giá",
          exchange_rate_value: "1 USD = {rate} {currency}",
          platform_fee: "Phí nền tảng",
          banking_fee: "Phí ngân hàng",
          estimated_arrival: "Thời gian đến dự kiến",
          authorization: "Bằng việc xác nhận, bạn ủy quyền chuyển đổi tài sản và hướng dẫn thanh toán ở trên.",
          withdrawal_submitted: "Đã gửi yêu cầu rút",
          transfer_completed: "Chuyển khoản hoàn tất",
          withdrawal_desc: "Thanh toán của bạn đã qua xác thực ban đầu và đang vào kiểm tra tuân thủ.",
          transfer_desc: "Số dư của bạn đã được cập nhật trong không gian ngân hàng.",
          reference: "Mã tham chiếu",
          status: "Trạng thái",
          destination: "Điểm đến",
          processing: "Đang xử lý",
          completed: "Hoàn tất"
        },
        detail: {
          title: "Chi tiết chuyển khoản",
          reference: "Mã tham chiếu {reference}",
          payout_amount: "Số tiền chi trả",
          destination: "Điểm đến",
          estimated_arrival: "Thời gian đến dự kiến",
          fees: "Phí",
          requested: "Đã yêu cầu",
          timeline_title: "Tiến trình thanh toán",
          pending: "Đang chờ",
          download_receipt: "Tải biên lai",
          status: {
            completed: "Hoàn tất",
            processing: "Đang xử lý",
            under_review: "Đang xem xét",
            failed: "Thất bại"
          }
        },
        skeleton: {
          loading: "Đang tải bảng điều khiển ngân hàng"
        }
      },
  },
  tl: {
    AccountBanking: {
        meta: {
          title: "Enterprise Banking | Lenix Protocol",
          description: "Ilipat ang digital assets sa pagitan ng Spot, Funding, at verified na bank accounts."
        },
        error: {
          load_failed: "Hindi ma-load ang banking workspace",
          unavailable_title: "Hindi available ang banking workspace",
          unavailable_description: "Hindi ma-load ang banking overview.",
          try_again: "Subukan muli"
        },
        tabs: {
          overview: "Overview",
          accounts: "Mga bank account",
          activity: "Aktibidad"
        },
        empty_assets: {
          title: "Wala pang treasury assets",
          description: "Ilipat ang assets sa Spot o Funding wallet para magsimula.",
          cta: "Ilipat ang pondo"
        },
        fiat_balance: {
          funding: "Funding {currency}",
          available: "{amount} available"
        },
        summary: {
          title: "Enterprise Banking",
          verified: "Verified",
          verification_pending: "Naghihintay ng verification",
          subtitle: "Ilipat ang digital assets sa pagitan ng treasury wallets at verified na bank accounts.",
          transfer: "Transfer",
          withdraw_to_bank: "Mag-withdraw sa bangko",
          total_treasury: "Kabuuang halaga ng treasury",
          hide_balances: "Itago ang balances",
          show_balances: "Ipakita ang balances",
          account: "Account",
          tier: "Tier",
          relationship_manager: "Relationship manager",
          spot_wallet: "Spot wallet",
          spot_available: "Available para sa trading",
          funding_wallet: "Funding wallet",
          funding_available: "Available para sa settlement",
          in_settlement: "Sa settlement",
          pending_payouts: "Sa mga aktibong bank payout"
        },
        assets: {
          title: "Mga balance ng wallet",
          subtitle: "Spot at Funding assets na handa na para sa payout",
          move_funds: "Ilipat ang pondo",
          columns: {
            asset: "Asset",
            wallet: "Wallet",
            balance: "Balance",
            value: "Halaga",
            change_24h: "24 oras"
          },
          location: {
            spot: "Spot",
            funding: "Funding"
          }
        },
        accounts: {
          linked_title: "Mga naka-link na bank account",
          linked_subtitle: "Mga destinasyon ng settlement para sa bank withdrawal",
          add_account: "Magdagdag ng account",
          empty_title: "Walang naka-link na bank account",
          empty_description: "Magdagdag ng bank account para paganahin ang withdrawal sa bangko mo.",
          default: "Default",
          status: {
            verified: "Verified",
            rejected: "Tinanggihan",
            pending: "Sinusuri"
          },
          limits_title: "Mga limitasyon sa settlement",
          limits_subtitle: "Rolling enterprise allowances",
          remaining: "{percent}% natitira",
          limits_note: "Ang mas mataas na settlement limits ay sinusuri ng relationship manager at compliance team."
        },
        activity: {
          title: "Aktibidad ng transaksyon",
          subtitle: "Internal transfers at bank settlements",
          search_label: "Maghanap ng transaksyon",
          search_placeholder: "Hanapin ang reference o asset",
          filter_label: "I-filter ang status ng transaksyon",
          filter_all: "Lahat ng status",
          status: {
            completed: "Tapos na",
            processing: "Pinoproseso",
            review: "Review",
            under_review: "Sinusuri",
            failed: "Nabigo"
          },
          columns: {
            transaction: "Transaksyon",
            amount: "Halaga",
            destination: "Destinasyon",
            status: "Status",
            date: "Petsa",
            view: "Tingnan"
          },
          direction: {
            spot_to_funding: "Spot papuntang Funding",
            funding_to_spot: "Funding papuntang Spot",
            funding_to_bank: "Funding papuntang bangko",
            spot_to_bank: "Spot papuntang bangko"
          },
          view_transaction: "Tingnan ang {reference}",
          empty_title: "Walang tumutugmang transaksyon",
          empty_description: "Baguhin ang paghahanap o status filter."
        },
        add_account: {
          title: "Magdagdag ng bank account",
          description: "Ang mga isinumiteng account ay sinusuri ng compliance team bago makatanggap ng settlements. Karaniwang tumatagal ng 1–2 araw ng negosyo.",
          fields: {
            bank_name: "Pangalan ng bangko",
            bank_name_placeholder: "hal. BDO",
            account_holder: "Pangalan ng account holder",
            account_holder_placeholder: "Buong legal na pangalan",
            account_number: "Account number / IBAN",
            account_number_placeholder: "Account number",
            routing_number: "Routing number (ACH/domestic)",
            swift_bic: "SWIFT / BIC (international)",
            optional: "Opsyonal",
            account_type: "Uri ng account",
            checking: "Checking",
            savings: "Savings",
            currency: "Currency",
            country: "Bansa",
            country_placeholder: "PH"
          },
          submitting: "Isinusumite...",
          submit: "Isumite para sa verification",
          required_fields: "Pakipunan ang lahat ng kinakailangang field",
          success: "Na-submit ang bank account para sa verification",
          failed: "Hindi maidagdag ang bank account"
        },
        transfer: {
          title_form: "Ilipat ang pondo",
          title_review: "Suriin ang transfer",
          title_success: "Status ng transfer",
          desc_form: "Ilipat ang assets sa pagitan ng wallets o mag-settle sa naka-link na bangko.",
          desc_review: "Naka-reserve ang rates sa loob ng limang minuto.",
          desc_success: "Handa na ang reference mo para sa tracking.",
          back_label: "Bumalik sa detalye ng transfer",
          step_label: "Hakbang {step} ng 3",
          cancel: "Kanselahin",
          review_transfer: "Suriin ang transfer",
          confirm_submit: "Kumpirmahin at isumite",
          done: "Tapos",
          quote_failed: "Hindi makagawa ng quote",
          transfer_failed: "Hindi maisumite ang transfer",
          type_legend: "Uri ng transfer",
          types: {
            spot_to_funding: {
              label: "Spot → Funding",
              description: "Ihanda ang assets para sa payments"
            },
            funding_to_spot: {
              label: "Funding → Spot",
              description: "Ibalik ang assets para sa trading"
            },
            funding_to_bank: {
              label: "Funding → Bangko",
              description: "Mag-withdraw ng cleared funds"
            },
            spot_to_bank: {
              label: "Spot → Bangko",
              description: "I-convert at mag-withdraw"
            }
          },
          from: "Mula sa",
          to: "Papunta sa",
          spot_wallet: "Spot wallet",
          funding_wallet: "Funding wallet",
          bank_account: "Bank account",
          asset: "Asset",
          amount: "Halaga",
          max: "MAX",
          amount_placeholder: "0.00",
          payout_currency: "Payout currency",
          currencies: {
            USD: "USD · US Dollar",
            EUR: "EUR · Euro",
            GBP: "GBP · British Pound"
          },
          select_account: "Pumili ng account",
          available: "Available"
        },
        review: {
          recipient_receives: "Matatanggap ng recipient",
          from_amount: "Mula sa {amount} {asset}",
          market_value: "Market value",
          exchange_rate: "Exchange rate",
          exchange_rate_value: "1 USD = {rate} {currency}",
          platform_fee: "Platform fee",
          banking_fee: "Banking fee",
          estimated_arrival: "Tinatayang pagdating",
          authorization: "Sa pagkumpirma, pinahihintulutan mo ang asset conversion at settlement instructions sa itaas.",
          withdrawal_submitted: "Na-submit ang withdrawal",
          transfer_completed: "Tapos na ang transfer",
          withdrawal_desc: "Pumasa ang settlement mo sa initial validation at papasok na sa compliance screening.",
          transfer_desc: "Na-update ang balances mo sa banking workspace.",
          reference: "Reference",
          status: "Status",
          destination: "Destinasyon",
          processing: "Pinoproseso",
          completed: "Tapos na"
        },
        detail: {
          title: "Detalye ng transfer",
          reference: "Reference {reference}",
          payout_amount: "Halaga ng payout",
          destination: "Destinasyon",
          estimated_arrival: "Tinatayang pagdating",
          fees: "Mga bayarin",
          requested: "Hiniling",
          timeline_title: "Timeline ng settlement",
          pending: "Naghihintay",
          download_receipt: "I-download ang resibo",
          status: {
            completed: "Tapos na",
            processing: "Pinoproseso",
            under_review: "Sinusuri",
            failed: "Nabigo"
          }
        },
        skeleton: {
          loading: "Nilo-load ang banking dashboard"
        }
      },
  },
  tr: {
    AccountBanking: {
        meta: {
          title: "Kurumsal bankacılık | Lenix Protocol",
          description: "Spot, Funding ve doğrulanmış banka hesapları arasında dijital varlık taşıyın."
        },
        error: {
          load_failed: "Bankacılık çalışma alanı yüklenemedi",
          unavailable_title: "Bankacılık çalışma alanı kullanılamıyor",
          unavailable_description: "Bankacılık özeti yüklenemedi.",
          try_again: "Tekrar dene"
        },
        tabs: {
          overview: "Genel bakış",
          accounts: "Banka hesapları",
          activity: "Etkinlik"
        },
        empty_assets: {
          title: "Henüz hazine varlığı yok",
          description: "Başlamak için varlıkları Spot veya Funding cüzdanınıza taşıyın.",
          cta: "Fon taşı"
        },
        fiat_balance: {
          funding: "Funding {currency}",
          available: "{amount} kullanılabilir"
        },
        summary: {
          title: "Kurumsal bankacılık",
          verified: "Doğrulandı",
          verification_pending: "Doğrulama bekleniyor",
          subtitle: "Hazine cüzdanları ile doğrulanmış banka hesapları arasında dijital varlık taşıyın.",
          transfer: "Transfer",
          withdraw_to_bank: "Bankaya çek",
          total_treasury: "Toplam hazine değeri",
          hide_balances: "Bakiyeleri gizle",
          show_balances: "Bakiyeleri göster",
          account: "Hesap",
          tier: "Seviye",
          relationship_manager: "İlişki yöneticisi",
          spot_wallet: "Spot cüzdan",
          spot_available: "İşlem için kullanılabilir",
          funding_wallet: "Funding cüzdan",
          funding_available: "Mutabakat için kullanılabilir",
          in_settlement: "Mutabakatta",
          pending_payouts: "Aktif banka ödemelerinde"
        },
        assets: {
          title: "Cüzdan bakiyeleri",
          subtitle: "Spot ve ödemeye hazır Funding varlıkları",
          move_funds: "Fon taşı",
          columns: {
            asset: "Varlık",
            wallet: "Cüzdan",
            balance: "Bakiye",
            value: "Değer",
            change_24h: "24 sa"
          },
          location: {
            spot: "Spot",
            funding: "Funding"
          }
        },
        accounts: {
          linked_title: "Bağlı banka hesapları",
          linked_subtitle: "Banka çekimleri için mutabakat hedefleri",
          add_account: "Hesap ekle",
          empty_title: "Bağlı banka hesabı yok",
          empty_description: "Bankanıza çekim yapmak için bir banka hesabı ekleyin.",
          default: "Varsayılan",
          status: {
            verified: "Doğrulandı",
            rejected: "Reddedildi",
            pending: "İnceleniyor"
          },
          limits_title: "Mutabakat limitleri",
          limits_subtitle: "Yuvarlanan kurumsal limitler",
          remaining: "%{percent} kaldı",
          limits_note: "Daha yüksek mutabakat limitleri ilişki yöneticiniz ve uyum ekibi tarafından incelenir."
        },
        activity: {
          title: "İşlem etkinliği",
          subtitle: "Dahili transferler ve banka mutabakatları",
          search_label: "İşlem ara",
          search_placeholder: "Referans veya varlık ara",
          filter_label: "İşlem durumunu filtrele",
          filter_all: "Tüm durumlar",
          status: {
            completed: "Tamamlandı",
            processing: "İşleniyor",
            review: "İnceleme",
            under_review: "İnceleniyor",
            failed: "Başarısız"
          },
          columns: {
            transaction: "İşlem",
            amount: "Tutar",
            destination: "Hedef",
            status: "Durum",
            date: "Tarih",
            view: "Görüntüle"
          },
          direction: {
            spot_to_funding: "Spot'tan Funding'e",
            funding_to_spot: "Funding'den Spot'a",
            funding_to_bank: "Funding'den bankaya",
            spot_to_bank: "Spot'tan bankaya"
          },
          view_transaction: "{reference} görüntüle",
          empty_title: "Eşleşen işlem yok",
          empty_description: "Aramayı veya durum filtresini değiştirin."
        },
        add_account: {
          title: "Banka hesabı ekle",
          description: "Gönderilen hesaplar mutabakat almadan önce uyum ekibimiz tarafından incelenir. Bu genellikle 1–2 iş günü sürer.",
          fields: {
            bank_name: "Banka adı",
            bank_name_placeholder: "ör. Ziraat Bankası",
            account_holder: "Hesap sahibi adı",
            account_holder_placeholder: "Tam yasal ad",
            account_number: "Hesap numarası / IBAN",
            account_number_placeholder: "Hesap numarası",
            routing_number: "Yönlendirme numarası (ACH/yurtiçi)",
            swift_bic: "SWIFT / BIC (uluslararası)",
            optional: "İsteğe bağlı",
            account_type: "Hesap türü",
            checking: "Vadesiz",
            savings: "Tasarruf",
            currency: "Para birimi",
            country: "Ülke",
            country_placeholder: "TR"
          },
          submitting: "Gönderiliyor...",
          submit: "Doğrulama için gönder",
          required_fields: "Lütfen tüm zorunlu alanları doldurun",
          success: "Banka hesabı doğrulama için gönderildi",
          failed: "Banka hesabı eklenemedi"
        },
        transfer: {
          title_form: "Fon taşı",
          title_review: "Transferi incele",
          title_success: "Transfer durumu",
          desc_form: "Varlıkları cüzdanlar arasında taşıyın veya bağlı bir bankaya mutabakat yapın.",
          desc_review: "Kurlar beş dakika boyunca ayrılır.",
          desc_success: "Referansınız takip için hazır.",
          back_label: "Transfer detaylarına dön",
          step_label: "Adım {step} / 3",
          cancel: "İptal",
          review_transfer: "Transferi incele",
          confirm_submit: "Onayla ve gönder",
          done: "Tamam",
          quote_failed: "Teklif oluşturulamadı",
          transfer_failed: "Transfer gönderilemedi",
          type_legend: "Transfer türü",
          types: {
            spot_to_funding: {
              label: "Spot → Funding",
              description: "Varlıkları ödemeler için hazırla"
            },
            funding_to_spot: {
              label: "Funding → Spot",
              description: "Varlıkları işlem için geri al"
            },
            funding_to_bank: {
              label: "Funding → Banka",
              description: "Kullanılabilir fonları çek"
            },
            spot_to_bank: {
              label: "Spot → Banka",
              description: "Dönüştür ve çek"
            }
          },
          from: "Kaynak",
          to: "Hedef",
          spot_wallet: "Spot cüzdan",
          funding_wallet: "Funding cüzdan",
          bank_account: "Banka hesabı",
          asset: "Varlık",
          amount: "Tutar",
          max: "MAKS",
          amount_placeholder: "0,00",
          payout_currency: "Ödeme para birimi",
          currencies: {
            USD: "USD · ABD Doları",
            EUR: "EUR · Euro",
            GBP: "GBP · İngiliz Sterlini"
          },
          select_account: "Hesap seç",
          available: "Kullanılabilir"
        },
        review: {
          recipient_receives: "Alıcı alır",
          from_amount: "{amount} {asset} kaynağından",
          market_value: "Piyasa değeri",
          exchange_rate: "Döviz kuru",
          exchange_rate_value: "1 USD = {rate} {currency}",
          platform_fee: "Platform ücreti",
          banking_fee: "Bankacılık ücreti",
          estimated_arrival: "Tahmini varış",
          authorization: "Onaylayarak yukarıdaki varlık dönüşümünü ve mutabakat talimatlarını yetkilendirirsiniz.",
          withdrawal_submitted: "Çekim gönderildi",
          transfer_completed: "Transfer tamamlandı",
          withdrawal_desc: "Mutabakatınız ilk doğrulamayı geçti ve şimdi uyum taramasına giriyor.",
          transfer_desc: "Bakiyeleriniz bankacılık çalışma alanında güncellendi.",
          reference: "Referans",
          status: "Durum",
          destination: "Hedef",
          processing: "İşleniyor",
          completed: "Tamamlandı"
        },
        detail: {
          title: "Transfer detayları",
          reference: "Referans {reference}",
          payout_amount: "Ödeme tutarı",
          destination: "Hedef",
          estimated_arrival: "Tahmini varış",
          fees: "Ücretler",
          requested: "İstendi",
          timeline_title: "Mutabakat zaman çizelgesi",
          pending: "Beklemede",
          download_receipt: "Makbuz indir",
          status: {
            completed: "Tamamlandı",
            processing: "İşleniyor",
            under_review: "İnceleniyor",
            failed: "Başarısız"
          }
        },
        skeleton: {
          loading: "Bankacılık panosu yükleniyor"
        }
      },
  },
  hi: {
    AccountBanking: {
        meta: {
          title: "एंटरप्राइज़ बैंकिंग | Lenix Protocol",
          description: "Spot, Funding और सत्यापित बैंक खातों के बीच डिजिटल संपत्ति स्थानांतरित करें।"
        },
        error: {
          load_failed: "बैंकिंग वर्कस्पेस लोड नहीं हो सका",
          unavailable_title: "बैंकिंग वर्कस्पेस उपलब्ध नहीं",
          unavailable_description: "बैंकिंग अवलोकन लोड नहीं हो सका।",
          try_again: "पुनः प्रयास करें"
        },
        tabs: {
          overview: "अवलोकन",
          accounts: "बैंक खाते",
          activity: "गतिविधि"
        },
        empty_assets: {
          title: "अभी तक कोई ट्रेज़री संपत्ति नहीं",
          description: "शुरू करने के लिए संपत्ति अपने Spot या Funding वॉलेट में स्थानांतरित करें।",
          cta: "धन स्थानांतरित करें"
        },
        fiat_balance: {
          funding: "Funding {currency}",
          available: "{amount} उपलब्ध"
        },
        summary: {
          title: "एंटरप्राइज़ बैंकिंग",
          verified: "सत्यापित",
          verification_pending: "सत्यापन लंबित",
          subtitle: "ट्रेज़री वॉलेट और सत्यापित बैंक खातों के बीच डिजिटल संपत्ति स्थानांतरित करें।",
          transfer: "स्थानांतरण",
          withdraw_to_bank: "बैंक में निकासी",
          total_treasury: "कुल ट्रेज़री मूल्य",
          hide_balances: "शेष राशि छिपाएँ",
          show_balances: "शेष राशि दिखाएँ",
          account: "खाता",
          tier: "स्तर",
          relationship_manager: "संबंध प्रबंधक",
          spot_wallet: "Spot वॉलेट",
          spot_available: "ट्रेडिंग के लिए उपलब्ध",
          funding_wallet: "Funding वॉलेट",
          funding_available: "निपटान के लिए उपलब्ध",
          in_settlement: "निपटान में",
          pending_payouts: "सक्रिय बैंक भुगतानों में"
        },
        assets: {
          title: "वॉलेट शेष",
          subtitle: "Spot और भुगतान-तैयार Funding संपत्ति",
          move_funds: "धन स्थानांतरित करें",
          columns: {
            asset: "संपत्ति",
            wallet: "वॉलेट",
            balance: "शेष",
            value: "मूल्य",
            change_24h: "24 घं."
          },
          location: {
            spot: "Spot",
            funding: "Funding"
          }
        },
        accounts: {
          linked_title: "लिंक किए गए बैंक खाते",
          linked_subtitle: "बैंक निकासी के लिए निपटान गंतव्य",
          add_account: "खाता जोड़ें",
          empty_title: "कोई बैंक खाता लिंक नहीं",
          empty_description: "अपने बैंक में निकासी सक्षम करने के लिए बैंक खाता जोड़ें।",
          default: "डिफ़ॉल्ट",
          status: {
            verified: "सत्यापित",
            rejected: "अस्वीकृत",
            pending: "समीक्षाधीन"
          },
          limits_title: "निपटान सीमाएँ",
          limits_subtitle: "रोलिंग एंटरप्राइज़ भत्ते",
          remaining: "{percent}% शेष",
          limits_note: "उच्च निपटान सीमाओं की समीक्षा आपके संबंध प्रबंधक और अनुपालन टीम द्वारा की जाती है।"
        },
        activity: {
          title: "लेनदेन गतिविधि",
          subtitle: "आंतरिक स्थानांतरण और बैंक निपटान",
          search_label: "लेनदेन खोजें",
          search_placeholder: "संदर्भ या संपत्ति खोजें",
          filter_label: "लेनदेन स्थिति फ़िल्टर करें",
          filter_all: "सभी स्थिति",
          status: {
            completed: "पूर्ण",
            processing: "प्रसंस्करण",
            review: "समीक्षा",
            under_review: "समीक्षाधीन",
            failed: "विफल"
          },
          columns: {
            transaction: "लेनदेन",
            amount: "राशि",
            destination: "गंतव्य",
            status: "स्थिति",
            date: "तिथि",
            view: "देखें"
          },
          direction: {
            spot_to_funding: "Spot से Funding",
            funding_to_spot: "Funding से Spot",
            funding_to_bank: "Funding से बैंक",
            spot_to_bank: "Spot से बैंक"
          },
          view_transaction: "{reference} देखें",
          empty_title: "कोई मेल खाता लेनदेन नहीं",
          empty_description: "खोज या स्थिति फ़िल्टर बदलें।"
        },
        add_account: {
          title: "बैंक खाता जोड़ें",
          description: "जमा किए गए खातों की समीक्षा निपटान प्राप्त करने से पहले हमारी अनुपालन टीम द्वारा की जाती है। इसमें आमतौर पर 1–2 व्यावसायिक दिन लगते हैं।",
          fields: {
            bank_name: "बैंक का नाम",
            bank_name_placeholder: "उदा. SBI",
            account_holder: "खाताधारक का नाम",
            account_holder_placeholder: "पूरा कानूनी नाम",
            account_number: "खाता संख्या / IBAN",
            account_number_placeholder: "खाता संख्या",
            routing_number: "रूटिंग नंबर (ACH/घरेलू)",
            swift_bic: "SWIFT / BIC (अंतर्राष्ट्रीय)",
            optional: "वैकल्पिक",
            account_type: "खाता प्रकार",
            checking: "चालू",
            savings: "बचत",
            currency: "मुद्रा",
            country: "देश",
            country_placeholder: "IN"
          },
          submitting: "जमा हो रहा है...",
          submit: "सत्यापन के लिए जमा करें",
          required_fields: "कृपया सभी आवश्यक फ़ील्ड भरें",
          success: "बैंक खाता सत्यापन के लिए जमा किया गया",
          failed: "बैंक खाता जोड़ने में विफल"
        },
        transfer: {
          title_form: "धन स्थानांतरित करें",
          title_review: "स्थानांतरण की समीक्षा",
          title_success: "स्थानांतरण स्थिति",
          desc_form: "वॉलेट के बीच संपत्ति स्थानांतरित करें या लिंक किए गए बैंक में निपटान करें।",
          desc_review: "दरें पाँच मिनट के लिए आरक्षित हैं।",
          desc_success: "आपका संदर्भ ट्रैकिंग के लिए तैयार है।",
          back_label: "स्थानांतरण विवरण पर वापस",
          step_label: "चरण {step} / 3",
          cancel: "रद्द करें",
          review_transfer: "स्थानांतरण की समीक्षा",
          confirm_submit: "पुष्टि करें और जमा करें",
          done: "पूर्ण",
          quote_failed: "कोट बनाने में असमर्थ",
          transfer_failed: "स्थानांतरण जमा करने में असमर्थ",
          type_legend: "स्थानांतरण प्रकार",
          types: {
            spot_to_funding: {
              label: "Spot → Funding",
              description: "भुगतान के लिए संपत्ति तैयार करें"
            },
            funding_to_spot: {
              label: "Funding → Spot",
              description: "ट्रेडिंग के लिए संपत्ति वापस करें"
            },
            funding_to_bank: {
              label: "Funding → बैंक",
              description: "उपलब्ध धन निकालें"
            },
            spot_to_bank: {
              label: "Spot → बैंक",
              description: "रूपांतरित करें और निकालें"
            }
          },
          from: "से",
          to: "को",
          spot_wallet: "Spot वॉलेट",
          funding_wallet: "Funding वॉलेट",
          bank_account: "बैंक खाता",
          asset: "संपत्ति",
          amount: "राशि",
          max: "अधिकतम",
          amount_placeholder: "0.00",
          payout_currency: "भुगतान मुद्रा",
          currencies: {
            USD: "USD · अमेरिकी डॉलर",
            EUR: "EUR · यूरो",
            GBP: "GBP · ब्रिटिश पाउंड"
          },
          select_account: "खाता चुनें",
          available: "उपलब्ध"
        },
        review: {
          recipient_receives: "प्राप्तकर्ता को मिलता है",
          from_amount: "{amount} {asset} से",
          market_value: "बाज़ार मूल्य",
          exchange_rate: "विनिमय दर",
          exchange_rate_value: "1 USD = {rate} {currency}",
          platform_fee: "प्लेटफ़ॉर्म शुल्क",
          banking_fee: "बैंकिंग शुल्क",
          estimated_arrival: "अनुमानित आगमन",
          authorization: "पुष्टि करके, आप ऊपर दिखाए गए संपत्ति रूपांतरण और निपटान निर्देशों को अधिकृत करते हैं।",
          withdrawal_submitted: "निकासी जमा की गई",
          transfer_completed: "स्थानांतरण पूर्ण",
          withdrawal_desc: "आपका निपटान प्रारंभिक सत्यापन पास कर गया और अब अनुपालन जाँच में प्रवेश कर रहा है।",
          transfer_desc: "आपके शेष बैंकिंग वर्कस्पेस में अपडेट हो गए हैं।",
          reference: "संदर्भ",
          status: "स्थिति",
          destination: "गंतव्य",
          processing: "प्रसंस्करण",
          completed: "पूर्ण"
        },
        detail: {
          title: "स्थानांतरण विवरण",
          reference: "संदर्भ {reference}",
          payout_amount: "भुगतान राशि",
          destination: "गंतव्य",
          estimated_arrival: "अनुमानित आगमन",
          fees: "शुल्क",
          requested: "अनुरोधित",
          timeline_title: "निपटान समयरेखा",
          pending: "लंबित",
          download_receipt: "रसीद डाउनलोड करें",
          status: {
            completed: "पूर्ण",
            processing: "प्रसंस्करण",
            under_review: "समीक्षाधीन",
            failed: "विफल"
          }
        },
        skeleton: {
          loading: "बैंकिंग डैशबोर्ड लोड हो रहा है"
        }
      },
  },
  id: {
    AccountBanking: {
        meta: {
          title: "Perbankan perusahaan | Lenix Protocol",
          description: "Pindahkan aset digital antara Spot, Funding, dan rekening bank terverifikasi."
        },
        error: {
          load_failed: "Tidak dapat memuat ruang kerja perbankan",
          unavailable_title: "Ruang kerja perbankan tidak tersedia",
          unavailable_description: "Ringkasan perbankan tidak dapat dimuat.",
          try_again: "Coba lagi"
        },
        tabs: {
          overview: "Ringkasan",
          accounts: "Rekening bank",
          activity: "Aktivitas"
        },
        empty_assets: {
          title: "Belum ada aset treasury",
          description: "Pindahkan aset ke dompet Spot atau Funding untuk memulai.",
          cta: "Pindahkan dana"
        },
        fiat_balance: {
          funding: "Funding {currency}",
          available: "{amount} tersedia"
        },
        summary: {
          title: "Perbankan perusahaan",
          verified: "Terverifikasi",
          verification_pending: "Menunggu verifikasi",
          subtitle: "Pindahkan aset digital antara dompet treasury dan rekening bank terverifikasi.",
          transfer: "Transfer",
          withdraw_to_bank: "Tarik ke bank",
          total_treasury: "Total nilai treasury",
          hide_balances: "Sembunyikan saldo",
          show_balances: "Tampilkan saldo",
          account: "Rekening",
          tier: "Tingkat",
          relationship_manager: "Manajer hubungan",
          spot_wallet: "Dompet Spot",
          spot_available: "Tersedia untuk trading",
          funding_wallet: "Dompet Funding",
          funding_available: "Tersedia untuk penyelesaian",
          in_settlement: "Dalam penyelesaian",
          pending_payouts: "Pada pembayaran bank aktif"
        },
        assets: {
          title: "Saldo dompet",
          subtitle: "Aset Spot dan Funding siap dibayar",
          move_funds: "Pindahkan dana",
          columns: {
            asset: "Aset",
            wallet: "Dompet",
            balance: "Saldo",
            value: "Nilai",
            change_24h: "24 jam"
          },
          location: {
            spot: "Spot",
            funding: "Funding"
          }
        },
        accounts: {
          linked_title: "Rekening bank terhubung",
          linked_subtitle: "Tujuan penyelesaian untuk penarikan bank",
          add_account: "Tambah rekening",
          empty_title: "Tidak ada rekening bank terhubung",
          empty_description: "Tambahkan rekening bank untuk mengaktifkan penarikan ke bank Anda.",
          default: "Default",
          status: {
            verified: "Terverifikasi",
            rejected: "Ditolak",
            pending: "Sedang ditinjau"
          },
          limits_title: "Batas penyelesaian",
          limits_subtitle: "Kuota perusahaan bergulir",
          remaining: "{percent}% tersisa",
          limits_note: "Batas penyelesaian lebih tinggi ditinjau oleh manajer hubungan dan tim kepatuhan."
        },
        activity: {
          title: "Aktivitas transaksi",
          subtitle: "Transfer internal dan penyelesaian bank",
          search_label: "Cari transaksi",
          search_placeholder: "Cari referensi atau aset",
          filter_label: "Filter status transaksi",
          filter_all: "Semua status",
          status: {
            completed: "Selesai",
            processing: "Diproses",
            review: "Tinjauan",
            under_review: "Sedang ditinjau",
            failed: "Gagal"
          },
          columns: {
            transaction: "Transaksi",
            amount: "Jumlah",
            destination: "Tujuan",
            status: "Status",
            date: "Tanggal",
            view: "Lihat"
          },
          direction: {
            spot_to_funding: "Spot ke Funding",
            funding_to_spot: "Funding ke Spot",
            funding_to_bank: "Funding ke bank",
            spot_to_bank: "Spot ke bank"
          },
          view_transaction: "Lihat {reference}",
          empty_title: "Tidak ada transaksi yang cocok",
          empty_description: "Ubah pencarian atau filter status."
        },
        add_account: {
          title: "Tambah rekening bank",
          description: "Rekening yang diajukan ditinjau tim kepatuhan kami sebelum dapat menerima penyelesaian. Biasanya membutuhkan 1–2 hari kerja.",
          fields: {
            bank_name: "Nama bank",
            bank_name_placeholder: "mis. BCA",
            account_holder: "Nama pemegang rekening",
            account_holder_placeholder: "Nama legal lengkap",
            account_number: "Nomor rekening / IBAN",
            account_number_placeholder: "Nomor rekening",
            routing_number: "Nomor routing (ACH/domestik)",
            swift_bic: "SWIFT / BIC (internasional)",
            optional: "Opsional",
            account_type: "Jenis rekening",
            checking: "Giro",
            savings: "Tabungan",
            currency: "Mata uang",
            country: "Negara",
            country_placeholder: "ID"
          },
          submitting: "Mengirim...",
          submit: "Kirim untuk verifikasi",
          required_fields: "Harap isi semua field wajib",
          success: "Rekening bank dikirim untuk verifikasi",
          failed: "Gagal menambahkan rekening bank"
        },
        transfer: {
          title_form: "Pindahkan dana",
          title_review: "Tinjau transfer",
          title_success: "Status transfer",
          desc_form: "Pindahkan aset antar dompet atau selesaikan ke bank terhubung.",
          desc_review: "Kurs dicadangkan selama lima menit.",
          desc_success: "Referensi Anda siap untuk dilacak.",
          back_label: "Kembali ke detail transfer",
          step_label: "Langkah {step} dari 3",
          cancel: "Batal",
          review_transfer: "Tinjau transfer",
          confirm_submit: "Konfirmasi dan kirim",
          done: "Selesai",
          quote_failed: "Tidak dapat membuat penawaran",
          transfer_failed: "Tidak dapat mengirim transfer",
          type_legend: "Jenis transfer",
          types: {
            spot_to_funding: {
              label: "Spot → Funding",
              description: "Siapkan aset untuk pembayaran"
            },
            funding_to_spot: {
              label: "Funding → Spot",
              description: "Kembalikan aset untuk trading"
            },
            funding_to_bank: {
              label: "Funding → Bank",
              description: "Tarik dana yang tersedia"
            },
            spot_to_bank: {
              label: "Spot → Bank",
              description: "Konversi dan tarik"
            }
          },
          from: "Dari",
          to: "Ke",
          spot_wallet: "Dompet Spot",
          funding_wallet: "Dompet Funding",
          bank_account: "Rekening bank",
          asset: "Aset",
          amount: "Jumlah",
          max: "MAKS",
          amount_placeholder: "0,00",
          payout_currency: "Mata uang pembayaran",
          currencies: {
            USD: "USD · Dolar AS",
            EUR: "EUR · Euro",
            GBP: "GBP · Pound Inggris"
          },
          select_account: "Pilih rekening",
          available: "Tersedia"
        },
        review: {
          recipient_receives: "Penerima menerima",
          from_amount: "Dari {amount} {asset}",
          market_value: "Nilai pasar",
          exchange_rate: "Kurs",
          exchange_rate_value: "1 USD = {rate} {currency}",
          platform_fee: "Biaya platform",
          banking_fee: "Biaya perbankan",
          estimated_arrival: "Perkiraan tiba",
          authorization: "Dengan mengonfirmasi, Anda mengotorisasi konversi aset dan instruksi penyelesaian di atas.",
          withdrawal_submitted: "Penarikan dikirim",
          transfer_completed: "Transfer selesai",
          withdrawal_desc: "Penyelesaian Anda lulus validasi awal dan kini memasuki pemeriksaan kepatuhan.",
          transfer_desc: "Saldo Anda telah diperbarui di ruang kerja perbankan.",
          reference: "Referensi",
          status: "Status",
          destination: "Tujuan",
          processing: "Diproses",
          completed: "Selesai"
        },
        detail: {
          title: "Detail transfer",
          reference: "Referensi {reference}",
          payout_amount: "Jumlah pembayaran",
          destination: "Tujuan",
          estimated_arrival: "Perkiraan tiba",
          fees: "Biaya",
          requested: "Diminta",
          timeline_title: "Linimasa penyelesaian",
          pending: "Menunggu",
          download_receipt: "Unduh tanda terima",
          status: {
            completed: "Selesai",
            processing: "Diproses",
            under_review: "Sedang ditinjau",
            failed: "Gagal"
          }
        },
        skeleton: {
          loading: "Memuat dasbor perbankan"
        }
      },
  },
};

for (const locale of locales) {
  const filePath = path.join(root, "messages", locale, "common.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const patch = translations[locale];
  if (!patch?.AccountBanking) continue;
  data.AccountBanking = deepMerge(data.AccountBanking || {}, patch.AccountBanking);
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Updated ${locale}/common.json`);
}
