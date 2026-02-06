# CSS Architecture

This document describes the CSS organization for the Insurance Services client application.

## Directory Structure

```
client/src/
├── assets/
│   └── styles/
│       ├── AdminLayout.css    # Admin layout container styles
│       ├── Sidebar.css        # Sidebar navigation styles
│       ├── Header.css         # Header component styles
│       ├── layout.css         # Common page layout patterns
│       ├── table.css          # Table and data list styles
│       └── modal.css          # Modal dialog styles
├── index.css                  # Global styles + imports
└── App.css                    # App-specific styles
```

## File Descriptions

### Component Styles

**`AdminLayout.css`**
- Main admin layout container
- Content area and main container
- Mobile overlay for sidebar
- Responsive breakpoints

**`Sidebar.css`**
- Sidebar navigation container
- Logo and header area
- Navigation sections and menu items
- User profile card
- Mobile slide-in animation

**`Header.css`**
- Header bar layout
- Search bar and mobile menu button
- Notification bell
- User info and avatar
- Responsive header adjustments

### Page Styles

**`layout.css`**
- Page headers with title and description
- Filter bars and search wrappers
- Stats grid and stat cards
- Chart containers and chart bars
- Activity feed and notifications
- Two-column grid layouts
- Loading states

**`table.css`**
- Table card wrapper
- User cells with avatars
- Category cells with icons
- Contact information cells
- Action button cells
- Empty state styling
- Responsive table adjustments

**`modal.css`**
- Modal dialog containers (sm, md, lg)
- Modal header, body, and footer
- Responsive modal behavior

## Usage

### In Components

Import specific CSS files as needed:

```tsx
import '../../assets/styles/layout.css';
import '../../assets/styles/table.css';
import '../../assets/styles/modal.css';
```

### Global Import

All styles are automatically imported in `index.css`:

```css
/* Import Component Styles */
@import './assets/styles/AdminLayout.css';
@import './assets/styles/Sidebar.css';
@import './assets/styles/Header.css';

/* Import Page Styles */
@import './assets/styles/layout.css';
@import './assets/styles/table.css';
@import './assets/styles/modal.css';
```

## CSS Classes Reference

### Layout Classes

- `.page-header` - Page header container
- `.page-header-content` - Header content wrapper
- `.filter-bar` - Filter controls container
- `.filter-controls` - Filter inputs wrapper
- `.search-wrapper` - Search input wrapper
- `.stats-grid` - Stats cards grid
- `.stat-card-*` - Stat card components
- `.chart-*` - Chart components
- `.activity-*` - Activity feed components
- `.two-column-grid` - Two-column layout
- `.loading-container` - Loading state

### Table Classes

- `.table-card` - Table wrapper card
- `.user-cell` - User information cell
- `.user-avatar` - User avatar circle
- `.user-info` - User name and ID
- `.category-cell` - Category cell
- `.category-icon` - Category icon
- `.contact-cell` - Contact information
- `.action-cell` - Action buttons
- `.text-muted` - Muted text color
- `.text-description` - Description text

### Modal Classes

- `.modal-dialog` - Modal container
- `.modal-sm` - Small modal (500px)
- `.modal-lg` - Large modal (800px)
- `.modal-header` - Modal header
- `.modal-title` - Modal title
- `.modal-body` - Modal content
- `.modal-footer` - Modal actions

## Responsive Breakpoints

- **Desktop**: > 1280px
- **Laptop**: 1024px - 1279px
- **Tablet**: 768px - 1023px
- **Mobile**: 481px - 767px
- **Small Mobile**: ≤ 480px

## Best Practices

1. **Use semantic class names** - Classes should describe purpose, not appearance
2. **Avoid inline styles** - Use CSS classes for all styling
3. **Keep specificity low** - Avoid deep nesting and !important
4. **Mobile-first** - Base styles for mobile, enhance for desktop
5. **Reuse classes** - Use existing classes before creating new ones
6. **Component isolation** - Each component has its own CSS file
7. **Shared patterns** - Common patterns in layout.css, table.css, modal.css

## Migration Notes

All inline styles have been extracted to CSS files for:
- ✅ Better maintainability
- ✅ Improved performance (CSS caching)
- ✅ Easier theming and customization
- ✅ Better IDE support and autocomplete
- ✅ Cleaner component code
- ✅ Consistent styling across pages
