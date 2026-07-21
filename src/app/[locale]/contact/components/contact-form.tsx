"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { home } from "@/lib/home-styles";

interface FormData {
  name: string;
  email: string;
  phone: string;
  whatsappOrTelegram: string;
  subject: string;
  message: string;
  inquiryType: string;
}

interface ContactFormProps {
  compact?: boolean;
}

const INQUIRY_KEYS = [
  "general",
  "recovery",
  "crypto_loan",
  "support",
  "partnership",
  "business",
  "press",
  "other",
] as const;

export default function ContactForm({ compact = false }: ContactFormProps) {
  const t = useTranslations("Contact.Form");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    whatsappOrTelegram: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const labelClass = "block text-sm font-medium text-neutral-300 mb-1.5";

  const fieldClass = (hasError: boolean) =>
    `h-11 w-full rounded-md border bg-neutral-950 px-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-neutral-700 transition-colors ${
      hasError ? "border-red-500/80" : "border-neutral-800"
    }`;

  const textareaClass = (hasError: boolean) =>
    `${fieldClass(hasError)} min-h-[140px] py-3 h-auto resize-none`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          whatsappOrTelegram: formData.whatsappOrTelegram || undefined,
          subject: formData.subject,
          message: formData.message,
          inquiryType: formData.inquiryType,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error || "Failed to send message");
        return;
      }

      toast.success("Message sent successfully");
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        whatsappOrTelegram: "",
        subject: "",
        message: "",
        inquiryType: "general",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const wrapperClass = `${home.card} ${home.cardBody}`;

  if (isSubmitted) {
    return (
      <div className={`${wrapperClass} text-center`}>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15 text-green-400">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{t("success_title")}</h3>
        <p className="text-sm text-neutral-400 mb-6">{t("success_description")}</p>
        <button type="button" onClick={() => setIsSubmitted(false)} className={home.btnSecondary}>
          {t("success_cta")}
        </button>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">{t("title")}</h2>
        <p className="mt-1.5 text-sm text-neutral-500">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              {t("name")}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={fieldClass(Boolean(errors.name))}
              placeholder={t("placeholder_name")}
            />
            {errors.name ? <p className="text-red-400 text-xs mt-1">{errors.name}</p> : null}
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              {t("email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={fieldClass(Boolean(errors.email))}
              placeholder={t("placeholder_email")}
            />
            {errors.email ? <p className="text-red-400 text-xs mt-1">{errors.email}</p> : null}
          </div>
        </div>

        {!compact ? (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className={labelClass}>
                  {t("phone")}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={fieldClass(false)}
                  placeholder={t("placeholder_phone")}
                />
              </div>
              <div>
                <label htmlFor="whatsappOrTelegram" className={labelClass}>
                  {t("whatsapp")}
                </label>
                <input
                  type="text"
                  id="whatsappOrTelegram"
                  name="whatsappOrTelegram"
                  value={formData.whatsappOrTelegram}
                  onChange={handleChange}
                  className={fieldClass(false)}
                  placeholder={t("placeholder_whatsapp")}
                />
              </div>
            </div>

            <div>
              <label htmlFor="inquiryType" className={labelClass}>
                {t("inquiry_type")}
              </label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                className={fieldClass(false)}
              >
                {INQUIRY_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {t(`inquiry_options.${key}`)}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : null}

        <div>
          <label htmlFor="subject" className={labelClass}>
            {t("subject")}
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={fieldClass(Boolean(errors.subject))}
            placeholder={t("placeholder_subject")}
          />
          {errors.subject ? <p className="text-red-400 text-xs mt-1">{errors.subject}</p> : null}
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>
            {t("message")}
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={compact ? 5 : 6}
            className={textareaClass(Boolean(errors.message))}
            placeholder={t("placeholder_message")}
          />
          {errors.message ? <p className="text-red-400 text-xs mt-1">{errors.message}</p> : null}
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed">{t("privacy")}</p>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${home.btnPrimary} w-full gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t("sending")}</span>
            </>
          ) : (
            <span>{t("submit")}</span>
          )}
        </button>
      </form>
    </div>
  );
}
