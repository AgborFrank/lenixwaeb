// Font configuration and utilities
export const fontClasses = {
  // Primary font - Onest
  primary: "font-onest",
  primaryBold: "font-onest font-bold",
  primaryMedium: "font-onest font-medium",
  primaryLight: "font-onest font-light",
  
  // Display fonts for headings and large text
  display: "font-onest",
  displayBold: "font-onest font-bold",
  displayMedium: "font-onest font-medium",
  
  // Sans fonts for body text and UI
  sans: "font-onest font-normal",
  sansBold: "font-onest font-bold",
  sansMedium: "font-onest font-medium",
  
  // Alternative fonts
  lenixDisplay: "font-lenix-display",
  lenixDisplayBold: "font-lenix-display font-bold",
  lenixDisplayMedium: "font-lenix-display font-medium",
  
  lenixSans: "font-lenix-sans",
  lenixSansBold: "font-lenix-sans font-bold",
  lenixSansMedium: "font-lenix-sans font-medium",
  
  poppins: "font-poppins",
  poppinsBold: "font-poppins font-bold",
  poppinsMedium: "font-poppins font-medium",
  
  // Monospace for code and technical content
  mono: "font-roboto-mono",
  monoBold: "font-roboto-mono font-bold",
  
  // Fallback to Onest
  onest: "font-onest",
  onestBold: "font-onest font-bold",
  onestMedium: "font-onest font-medium",
} as const;

// Typography scale for consistent sizing
export const typography = {
  // Display sizes
  display1: "text-6xl md:text-7xl lg:text-6xl font-onest font-bold tracking-tight",
  display2: "text-5xl md:text-6xl lg:text-7xl font-onest font-bold tracking-tight",
  display3: "text-4xl md:text-5xl lg:text-6xl font-onest font-bold tracking-tight",
  
  // Heading sizes
  h1: "text-3xl md:text-4xl lg:text-5xl font-onest font-bold tracking-tight",
  h2: "text-2xl md:text-3xl lg:text-4xl font-onest font-bold tracking-tight",
  h3: "text-xl md:text-2xl lg:text-3xl font-onest font-semibold tracking-tight",
  h4: "text-lg md:text-xl lg:text-2xl font-onest font-semibold tracking-tight",
  h5: "text-base md:text-lg lg:text-xl font-onest font-semibold tracking-tight",
  h6: "text-sm md:text-base lg:text-lg font-onest font-semibold tracking-tight",
  
  // Body text
  bodyLarge: "text-lg md:text-xl font-onest leading-relaxed",
  body: "text-base md:text-lg font-onest leading-relaxed",
  bodySmall: "text-sm md:text-base font-onest leading-relaxed",
  
  // UI text
  ui: "text-sm font-onest",
  uiSmall: "text-xs font-onest",
  uiLarge: "text-base font-onest",
  
  // Code and technical
  code: "text-sm font-roboto-mono",
  codeLarge: "text-base font-roboto-mono",
} as const;

// Font weight utilities
export const fontWeights = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
} as const;

// Letter spacing utilities
export const letterSpacing = {
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
} as const;

// Line height utilities
export const lineHeight = {
  none: "leading-none",
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
} as const;

// Combined typography utilities
export const createTypographyClass = (
  variant: keyof typeof typography,
  fontClass?: keyof typeof fontClasses,
  weight?: keyof typeof fontWeights,
  spacing?: keyof typeof letterSpacing,
  height?: keyof typeof lineHeight
) => {
  const classes = [
    typography[variant],
    fontClass && fontClasses[fontClass],
    weight && fontWeights[weight],
    spacing && letterSpacing[spacing],
    height && lineHeight[height],
  ].filter(Boolean);
  
  return classes.join(" ");
};

// Common text combinations for the app
export const textStyles = {
  // Hero and main headings
  hero: createTypographyClass("h1", "display", "bold", "tight", "tight"),
  heroSubtitle: createTypographyClass("h2", "display", "medium", "normal", "relaxed"),
  
  // Section headings
  sectionTitle: createTypographyClass("h1", "display", "bold", "tight", "tight"),
  sectionSubtitle: createTypographyClass("h3", "display", "medium", "normal", "relaxed"),
  
  // Content headings
  contentTitle: createTypographyClass("h2", "display", "bold", "tight", "tight"),
  contentSubtitle: createTypographyClass("h4", "display", "medium", "normal", "relaxed"),
  
  // Body content
  body: createTypographyClass("body", "sans", "normal", "normal", "relaxed"),
  bodyBold: createTypographyClass("body", "sans", "bold", "normal", "relaxed"),
  
  // UI elements
  button: createTypographyClass("ui", "sans", "semibold", "normal", "normal"),
  label: createTypographyClass("ui", "sans", "medium", "normal", "normal"),
  caption: createTypographyClass("uiSmall", "sans", "normal", "normal", "normal"),
  
  // Code and technical
  code: createTypographyClass("code", "mono", "normal", "normal", "normal"),
  codeBold: createTypographyClass("code", "mono", "bold", "normal", "normal"),
} as const; 