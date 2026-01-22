# Reown AppKit Theme Customization

This document outlines the comprehensive theme customization system for the Lenix Protocol's Reown AppKit integration.

## Overview

The theme system provides a cohesive, brand-aligned appearance for the wallet connection interface while maintaining accessibility and user experience standards.

## Color Palette

### Primary Colors

- **Primary Yellow**: `#f9ff38` - Main brand color for buttons and accents
- **Primary Yellow Hover**: `#fbbf24` - Darker shade for hover states
- **Primary Strength**: `25` - Mix strength for color blending

### Background Colors

- **Main Background**: `#111827` - Dark gray-800 equivalent
- **Secondary Background**: `#1f2937` - Dark gray-700 equivalent
- **Overlay Background**: `rgba(0, 0, 0, 0.8)` - Modal overlay

### Text Colors

- **Primary Text**: `#ffffff` - White text
- **Secondary Text**: `#9ca3af` - Gray-400 for secondary information
- **Tertiary Text**: `#6b7280` - Gray-500 for tertiary information

### Border Colors

- **Border Color**: `#374151` - Gray-600 for borders and dividers
- **Divider Color**: `#374151` - Same as border for consistency

## Component Styling

### Buttons

- **Height**: `48px`
- **Border Radius**: `8px`
- **Background**: Primary yellow (`#f9ff38`)
- **Hover Background**: Darker yellow (`#fbbf24`)
- **Text Color**: Black (`#000000`)

### Input Fields

- **Border Radius**: `8px`
- **Background**: Secondary background (`#1f2937`)
- **Border**: Gray-600 (`#374151`)
- **Text**: White (`#ffffff`)

### Cards

- **Border Radius**: `16px`
- **Background**: Secondary background (`#1f2937`)
- **Border**: Gray-600 (`#374151`)

### Modals

- **Border Radius**: `20px`
- **Background**: Main background (`#111827`)

### Wallet/Network Lists

- **Item Border Radius**: `12px`
- **Item Background**: Secondary background (`#1f2937`)
- **Item Border**: Gray-600 (`#374151`)
- **Hover Background**: Gray-600 (`#374151`)

## Typography

### Font Family

- **Primary**: `Inter, system-ui, -apple-system, sans-serif`

### Font Sizes

- **Small**: `14px`
- **Medium**: `16px`
- **Large**: `18px`
- **XLarge**: `24px`

## Spacing System

- **XS**: `4px`
- **SM**: `8px`
- **MD**: `16px`
- **LG**: `24px`
- **XL**: `32px`

## Shadows

- **Small**: `0 2px 8px rgba(0, 0, 0, 0.3)`
- **Medium**: `0 4px 16px rgba(0, 0, 0, 0.3)`
- **Large**: `0 8px 32px rgba(0, 0, 0, 0.3)`

## Animation

- **Duration**: `0.2s`
- **Timing**: `ease-out`

## Status Colors

### Error States

- **Color**: `#ef4444` (Red-500)
- **Background**: `#7f1d1d` (Red-900)

### Success States

- **Color**: `#10b981` (Green-500)
- **Background**: `#064e3b` (Green-900)

### Warning States

- **Color**: `#f59e0b` (Yellow-500)
- **Background**: `#78350f` (Yellow-900)

## Accessibility Features

### Focus States

- **Ring Color**: Primary yellow (`#f9ff38`)
- **Ring Width**: `2px`

### High Contrast Mode

- **Button Background**: White (`#ffffff`)
- **Button Text**: Black (`#000000`)
- **Button Border**: Black (`#000000`)
- **Card Border**: White (`#ffffff`)

### Reduced Motion

- Disables animations for users with motion sensitivity

## Responsive Design

### Mobile Breakpoint

- **Breakpoint**: `768px`
- **Modal Border Radius**: `16px`
- **Card Border Radius**: `12px`
- **Button Height**: `44px`

## Theme Variants

### Light Theme

- Inverted color scheme for light backgrounds
- Maintains brand consistency
- Optimized for light mode users

### High Contrast Theme

- Enhanced contrast for accessibility
- White buttons with black text
- Clear borders for better visibility

### Minimal Theme

- Reduced border radius values
- Lighter shadows
- Cleaner, more minimal appearance

## File Structure

```
src/
├── config/
│   └── theme.ts          # Centralized theme configuration
├── context/
│   └── index.tsx         # AppKit provider with theme integration
└── app/
    └── globals.css       # CSS customizations and overrides
```

## Usage

### Basic Theme Usage

```typescript
import { appkitTheme } from "@/config/theme";

// Access theme values
const primaryColor = appkitTheme.primaryColor;
const buttonHeight = appkitTheme.button.height;
```

### Theme Variants

```typescript
import { themeVariants } from "@/config/theme";

// Use light theme
const lightTheme = themeVariants.light;

// Use high contrast theme
const highContrastTheme = themeVariants.highContrast;
```

### CSS Generation

```typescript
import { generateThemeCSS } from "@/config/theme";

// Generate CSS custom properties
const themeCSS = generateThemeCSS();
```

## Customization Guide

### Changing Primary Colors

1. Update `primaryColor` in `src/config/theme.ts`
2. Adjust `primaryColorHover` for hover states
3. Modify `primaryColorStrength` for color mixing

### Adding New Components

1. Add component configuration to `appkitTheme` object
2. Update CSS custom properties in `generateThemeCSS()`
3. Add component-specific styles in `globals.css`

### Creating New Variants

1. Add variant configuration to `themeVariants` object
2. Ensure all required properties are defined
3. Test with different use cases

## Best Practices

### Color Usage

- Use semantic color names for better maintainability
- Ensure sufficient contrast ratios (WCAG 2.1 AA)
- Test colors in both light and dark modes

### Typography

- Use consistent font sizes across components
- Maintain proper line heights for readability
- Consider font loading performance

### Spacing

- Use the defined spacing scale consistently
- Maintain visual hierarchy through spacing
- Consider mobile spacing requirements

### Accessibility

- Always include focus states
- Support high contrast mode
- Respect reduced motion preferences
- Test with screen readers

## Testing

### Visual Testing

- Test on different screen sizes
- Verify color contrast ratios
- Check animation smoothness
- Validate focus indicators

### Accessibility Testing

- Test with keyboard navigation
- Verify screen reader compatibility
- Check high contrast mode
- Test with reduced motion

### Browser Testing

- Test across different browsers
- Verify CSS custom properties support
- Check fallback behavior

## Maintenance

### Regular Updates

- Review and update color palette quarterly
- Check for accessibility improvements
- Update typography as needed
- Monitor performance impact

### Version Control

- Document theme changes in commit messages
- Use semantic versioning for theme updates
- Maintain changelog for breaking changes

## Troubleshooting

### Common Issues

1. **Colors not applying**: Check CSS specificity and `!important` usage
2. **Inconsistent appearance**: Verify theme variables are properly set
3. **Accessibility issues**: Test with accessibility tools
4. **Performance problems**: Optimize CSS and reduce complexity

### Debug Tools

- Browser developer tools for CSS inspection
- Accessibility testing tools
- Color contrast checkers
- Performance profiling tools

## Future Enhancements

### Planned Features

- Dynamic theme switching
- User preference storage
- Advanced color schemes
- Component-specific themes

### Considerations

- Performance optimization
- Bundle size impact
- Browser compatibility
- User experience consistency

---

For questions or issues with theme customization, refer to the Reown AppKit documentation or contact the development team.
