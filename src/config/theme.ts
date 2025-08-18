// Reown AppKit Theme Configuration
// This file contains all theme-related settings for the wallet connection interface

export const appkitTheme = {
  // Core theme settings
  themeMode: "dark" as const,
  
  // Primary brand colors
  primaryColor: "#000000FF", // Your yellow-400
  primaryColorHover: "#080808FF", // Slightly darker yellow for hover states
  primaryColorStrength: 25,
  
  // Background colors
  backgroundColor: "#111827", // gray-800 equivalent
  backgroundColorSecondary: "#1f2937", // gray-700 equivalent
  overlayBackgroundColor: "rgba(0, 0, 0, 0.8)",
  
  // Text colors
  textColor: "#ffffff",
  textColorSecondary: "#9ca3af", // gray-400
  textColorTertiary: "#6b7280", // gray-500
  
  // Border and divider colors
  borderColor: "#374151", // gray-600
  dividerColor: "#374151",
  
  // Border radius values
  borderRadius: {
    small: "8px",
    medium: "12px",
    large: "16px",
    xlarge: "20px",
  },
  
  // Button configuration
  button: {
    height: "48px",
    borderRadius: "8px",
    backgroundColor: "#f9ff38",
    backgroundColorHover: "#fbbf24",
    textColor: "#000000",
  },
  
  // Input configuration
  input: {
    borderRadius: "8px",
    backgroundColor: "#1f2937",
    borderColor: "#374151",
    textColor: "#ffffff",
  },
  
  // Card configuration
  card: {
    borderRadius: "16px",
    backgroundColor: "#1f2937",
    borderColor: "#374151",
  },
  
  // Modal configuration
  modal: {
    borderRadius: "20px",
    backgroundColor: "#111827",
  },
  
  // Wallet list configuration
  walletList: {
    backgroundColor: "#1f2937",
    itemBorderRadius: "12px",
    itemBorderColor: "#374151",
    itemBackgroundColor: "#1f2937",
    itemBackgroundColorHover: "#374151",
  },
  
  // Network list configuration
  networkList: {
    backgroundColor: "#1f2937",
    itemBorderRadius: "12px",
    itemBorderColor: "#374151",
    itemBackgroundColor: "#1f2937",
    itemBackgroundColorHover: "#374151",
  },
  
  // Typography
  typography: {
    fontFamily: "var(--font-onest), system-ui, -apple-system, sans-serif",
    fontSize: {
      small: "14px",
      medium: "16px",
      large: "18px",
      xlarge: "24px",
    },
  },
  
  // Spacing
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  
  // Shadows
  shadows: {
    color: "rgba(0, 0, 0, 0.3)",
    small: "0 2px 8px rgba(0, 0, 0, 0.3)",
    medium: "0 4px 16px rgba(0, 0, 0, 0.3)",
    large: "0 8px 32px rgba(0, 0, 0, 0.3)",
  },
  
  // Animation
  animation: {
    duration: "0.2s",
    timing: "ease-out",
  },
  
  // Focus states
  focus: {
    ringColor: "#f9ff38",
    ringWidth: "2px",
  },
  
  // Status colors
  status: {
    error: {
      color: "#ef4444",
      backgroundColor: "#7f1d1d",
    },
    success: {
      color: "#10b981",
      backgroundColor: "#064e3b",
    },
    warning: {
      color: "#f59e0b",
      backgroundColor: "#78350f",
    },
  },
  
  // Scrollbar configuration
  scrollbar: {
    width: "6px",
    trackColor: "#1f2937",
    thumbColor: "#374151",
    thumbColorHover: "#4b5563",
  },
  
  // Responsive breakpoints
  breakpoints: {
    mobile: "768px",
  },
  
  // Accessibility
  accessibility: {
    highContrast: {
      buttonBackgroundColor: "#ffffff",
      buttonTextColor: "#000000",
      buttonBorderColor: "#000000",
      cardBorderColor: "#ffffff",
    },
  },
};

// Generate CSS custom properties for the theme
export const generateThemeCSS = () => {
  return `
    :root {
      /* Primary brand colors */
      --w3m-color-mix: ${appkitTheme.primaryColor};
      --w3m-color-mix-strength: ${appkitTheme.primaryColorStrength};
      
      /* Background colors */
      --w3m-background-color: ${appkitTheme.backgroundColor};
      --w3m-background-color-secondary: ${appkitTheme.backgroundColorSecondary};
      --w3m-overlay-background-color: ${appkitTheme.overlayBackgroundColor};
      
      /* Text colors */
      --w3m-text-color: ${appkitTheme.textColor};
      --w3m-text-color-secondary: ${appkitTheme.textColorSecondary};
      --w3m-text-color-tertiary: ${appkitTheme.textColorTertiary};
      
      /* Border and divider colors */
      --w3m-border-color: ${appkitTheme.borderColor};
      --w3m-divider-color: ${appkitTheme.dividerColor};
      
      /* Border radius */
      --w3m-border-radius: ${appkitTheme.borderRadius.medium};
      
      /* Button colors */
      --w3m-button-border-radius: ${appkitTheme.button.borderRadius};
      --w3m-button-height: ${appkitTheme.button.height};
      --w3m-button-background-color: ${appkitTheme.button.backgroundColor};
      --w3m-button-background-color-hover: ${appkitTheme.button.backgroundColorHover};
      --w3m-button-text-color: ${appkitTheme.button.textColor};
      
      /* Input colors */
      --w3m-input-border-radius: ${appkitTheme.input.borderRadius};
      --w3m-input-background-color: ${appkitTheme.input.backgroundColor};
      --w3m-input-border-color: ${appkitTheme.input.borderColor};
      --w3m-input-text-color: ${appkitTheme.input.textColor};
      
      /* Card colors */
      --w3m-card-border-radius: ${appkitTheme.card.borderRadius};
      --w3m-card-background-color: ${appkitTheme.card.backgroundColor};
      --w3m-card-border-color: ${appkitTheme.card.borderColor};
      
      /* Modal colors */
      --w3m-modal-border-radius: ${appkitTheme.modal.borderRadius};
      --w3m-modal-background-color: ${appkitTheme.modal.backgroundColor};
      
      /* Wallet list colors */
      --w3m-wallet-icon-border-radius: ${appkitTheme.walletList.itemBorderRadius};
      --w3m-wallet-icon-background-color: ${appkitTheme.walletList.backgroundColor};
      --w3m-wallet-icon-border-color: ${appkitTheme.walletList.itemBorderColor};
      
      /* Network colors */
      --w3m-network-icon-border-radius: ${appkitTheme.networkList.itemBorderRadius};
      --w3m-network-icon-background-color: ${appkitTheme.networkList.backgroundColor};
      --w3m-network-icon-border-color: ${appkitTheme.networkList.itemBorderColor};
      
      /* Typography */
      --w3m-font-family: ${appkitTheme.typography.fontFamily};
      --w3m-font-size-small: ${appkitTheme.typography.fontSize.small};
      --w3m-font-size-medium: ${appkitTheme.typography.fontSize.medium};
      --w3m-font-size-large: ${appkitTheme.typography.fontSize.large};
      --w3m-font-size-xlarge: ${appkitTheme.typography.fontSize.xlarge};
      
      /* Spacing */
      --w3m-spacing-xs: ${appkitTheme.spacing.xs};
      --w3m-spacing-sm: ${appkitTheme.spacing.sm};
      --w3m-spacing-md: ${appkitTheme.spacing.md};
      --w3m-spacing-lg: ${appkitTheme.spacing.lg};
      --w3m-spacing-xl: ${appkitTheme.spacing.xl};
      
      /* Shadows */
      --w3m-shadow-color: ${appkitTheme.shadows.color};
      --w3m-shadow-small: ${appkitTheme.shadows.small};
      --w3m-shadow-medium: ${appkitTheme.shadows.medium};
      --w3m-shadow-large: ${appkitTheme.shadows.large};
      
      /* Animation */
      --w3m-animation-duration: ${appkitTheme.animation.duration};
      --w3m-animation-timing: ${appkitTheme.animation.timing};
      
      /* Focus states */
      --w3m-focus-ring-color: ${appkitTheme.focus.ringColor};
      --w3m-focus-ring-width: ${appkitTheme.focus.ringWidth};
      
      /* Error states */
      --w3m-error-color: ${appkitTheme.status.error.color};
      --w3m-error-background-color: ${appkitTheme.status.error.backgroundColor};
      
      /* Success states */
      --w3m-success-color: ${appkitTheme.status.success.color};
      --w3m-success-background-color: ${appkitTheme.status.success.backgroundColor};
      
      /* Warning states */
      --w3m-warning-color: ${appkitTheme.status.warning.color};
      --w3m-warning-background-color: ${appkitTheme.status.warning.backgroundColor};
    }
  `;
};

// Theme variants for different use cases
export const themeVariants = {
  // Light theme variant
  light: {
    ...appkitTheme,
    themeMode: "light" as const,
    backgroundColor: "#ffffff",
    backgroundColorSecondary: "#f9fafb",
    textColor: "#111827",
    textColorSecondary: "#6b7280",
    textColorTertiary: "#9ca3af",
    borderColor: "#e5e7eb",
    dividerColor: "#e5e7eb",
    card: {
      ...appkitTheme.card,
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
    },
    input: {
      ...appkitTheme.input,
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
      textColor: "#111827",
    },
  },
  
  // High contrast variant
  highContrast: {
    ...appkitTheme,
    primaryColor: "#ffffff",
    primaryColorHover: "#e5e7eb",
    button: {
      ...appkitTheme.button,
      backgroundColor: "#ffffff",
      backgroundColorHover: "#e5e7eb",
      textColor: "#000000",
    },
    card: {
      ...appkitTheme.card,
      borderColor: "#ffffff",
    },
  },
  
  // Minimal variant
  minimal: {
    ...appkitTheme,
    borderRadius: {
      small: "4px",
      medium: "6px",
      large: "8px",
      xlarge: "12px",
    },
    shadows: {
      color: "rgba(0, 0, 0, 0.1)",
      small: "0 1px 3px rgba(0, 0, 0, 0.1)",
      medium: "0 2px 6px rgba(0, 0, 0, 0.1)",
      large: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
  },
};

export default appkitTheme; 