# Color and Typography Guide

## 🎨 Color System

### Primary Colors (Blue)
- **Primary-50** to **Primary-950**: Modern blue palette using OKLCH color space
- **Usage**: Main brand colors, buttons, links, primary actions
- **Example**: `bg-primary-600`, `text-primary-500`, `border-primary-200`

### Secondary Colors (Green)
- **Secondary-50** to **Secondary-950**: Modern green palette
- **Usage**: Secondary actions, success states, complementary elements
- **Example**: `bg-secondary-500`, `text-secondary-700`

### Accent Colors (Orange)
- **Accent-50** to **Accent-950**: Modern orange palette
- **Usage**: Highlights, calls-to-action, important information
- **Example**: `bg-accent-400`, `text-accent-600`

### Neutral Colors (Gray)
- **Neutral-50** to **Neutral-950**: Modern gray palette
- **Usage**: Text, backgrounds, borders, subtle elements
- **Example**: `bg-neutral-100`, `text-neutral-700`, `border-neutral-200`

### Semantic Colors
- **Success**: `bg-success-500`, `text-success-600`
- **Warning**: `bg-warning-500`, `text-warning-600`
- **Error**: `bg-error-500`, `text-error-600`
- **Info**: `bg-info-500`, `text-info-600`

### Color Utilities
- **Gradients**: `bg-gradient-primary`, `bg-gradient-secondary`, `bg-gradient-accent`
- **Text Gradients**: `text-gradient-primary`, `text-gradient-secondary`

## 🔤 Typography System

### Font Families
- **`font-sans`**: Inter (default body text)
- **`font-display`**: Poppins (headings, titles)
- **`font-mono`**: Monospace (code, technical content)
- **`font-serif`**: Serif (formal content)
- **`font-cursive`**: Sofia (decorative elements)

### Typography Utilities
- **`.text-display`**: Large display text with Poppins font
- **`.text-heading`**: Heading text with Poppins font
- **`.text-body`**: Body text with Inter font
- **`.text-caption`**: Caption text with Inter font

### Responsive Typography
- **H1**: `text-4xl md:text-5xl lg:text-6xl`
- **H2**: `text-3xl md:text-4xl lg:text-5xl`
- **H3**: `text-2xl md:text-3xl lg:text-4xl`
- **H4**: `text-xl md:text-2xl lg:text-3xl`
- **H5**: `text-lg md:text-xl lg:text-2xl`
- **H6**: `text-base md:text-lg lg:text-xl`

## 🎯 Usage Examples

### Buttons
```html
<!-- Primary Button -->
<button class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
  Primary Action
</button>

<!-- Secondary Button -->
<button class="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
  Secondary Action
</button>

<!-- Accent Button -->
<button class="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
  Accent Action
</button>
```

### Cards
```html
<div class="bg-card border border-neutral-200 rounded-lg p-6 shadow-sm">
  <h3 class="text-heading text-xl mb-4">Card Title</h3>
  <p class="text-body text-neutral-600">Card content goes here...</p>
</div>
```

### Typography
```html
<h1 class="text-display text-gradient-primary">Main Heading</h1>
<h2 class="text-heading text-neutral-800">Section Title</h2>
<p class="text-body text-neutral-600">Body text content...</p>
<span class="text-caption text-neutral-500">Caption text</span>
```

### Gradients
```html
<div class="bg-gradient-primary text-white p-8 rounded-xl">
  <h2 class="text-display text-2xl">Gradient Background</h2>
</div>

<h1 class="text-gradient-primary text-4xl font-bold">Gradient Text</h1>
```

## 🌙 Dark Mode Support

The color system automatically adapts to dark mode using CSS custom properties. Dark mode colors are optimized for better contrast and readability.

### Dark Mode Colors
- **Background**: Dark neutral colors
- **Text**: Light neutral colors
- **Primary/Secondary/Accent**: Lighter variants for better contrast
- **Borders**: Darker variants for subtle separation

## 📱 Mobile Responsiveness

All typography and spacing automatically scales for mobile devices:
- **Mobile-first approach**: Base sizes are mobile-optimized
- **Responsive scaling**: Larger screens get proportionally larger text
- **Touch-friendly**: Button sizes and spacing optimized for touch interfaces

## 🚀 Best Practices

1. **Use semantic colors**: Prefer `success`, `warning`, `error` over specific color values
2. **Maintain contrast**: Ensure text has sufficient contrast with backgrounds
3. **Consistent spacing**: Use the established spacing scale
4. **Typography hierarchy**: Use appropriate heading levels for content structure
5. **Accessibility**: Ensure color isn't the only way to convey information

## 🔧 Customization

To add new colors or modify existing ones, edit the `@theme` section in `app/globals.css`:

```css
@theme {
  --color-custom-500: oklch(0.7 0.12 180);
  --color-custom-600: oklch(0.64 0.144 180);
}
```

Then use them as: `bg-custom-500`, `text-custom-600`, etc.
