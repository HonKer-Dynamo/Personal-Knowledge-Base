# Design Guidelines: Personal Knowledge Base Website

## Design Approach
**System-Based Approach** inspired by GitHub Docs, Dev.to, and Medium's reading experiences. Focus on readability, code presentation, and content hierarchy. The design prioritizes utility and information density while maintaining visual clarity.

## Core Design Principles
1. **Content-First**: Maximum readability with optimal line length and spacing
2. **Code Excellence**: Premium treatment of code blocks with professional syntax highlighting
3. **Scannable Structure**: Clear visual hierarchy for quick navigation
4. **Performance**: Fast loading, smooth transitions, minimal animations

---

## Typography System

**Primary Font Stack:**
- Body/Content: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Code: `'JetBrains Mono', 'Fira Code', 'Consolas', monospace`
- Chinese Support: Ensure proper fallback with `'PingFang SC', 'Microsoft YaHei'`

**Type Scale:**
- Article Titles: `text-4xl md:text-5xl font-bold` (36-48px)
- Section Headings (H2): `text-3xl font-semibold` (30px)
- Subheadings (H3): `text-2xl font-semibold` (24px)
- Body Text: `text-lg leading-relaxed` (18px, 1.75 line-height)
- Code Inline: `text-base` (16px)
- Metadata/Tags: `text-sm` (14px)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **4, 6, 8, 12, 16, 20**
- Component padding: `p-4, p-6, p-8`
- Section spacing: `py-12, py-16, py-20`
- Element gaps: `gap-4, gap-6, gap-8`

**Container Strategy:**
- Navigation: Full-width with inner `max-w-7xl`
- Article content: `max-w-3xl mx-auto` (optimal reading width ~65-75 characters)
- Code blocks: `max-w-4xl` (allow wider for code)
- Article grid: `max-w-6xl`

**Grid Layouts:**
- Article cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Sidebar + Content: `grid-cols-1 lg:grid-cols-4` (1 col sidebar, 3 cols content)

---

## Component Library

### Navigation Header
- Sticky header with subtle shadow on scroll
- Logo/site name on left
- Search bar (prominent, centered)
- Categories dropdown, Theme switcher, Profile/Login on right
- Height: `h-16`

### Article List Page
- Hero section with site tagline and featured post (include large hero image showcasing code/technology theme)
- Filter bar: Categories, Tags, Sort options
- Article cards with: thumbnail image, title, excerpt (2 lines), metadata (date, read time, tags), hover lift effect

### Article Detail Page
**Layout:**
- Breadcrumb navigation
- Article header: Title, author info, publish date, reading time, tags
- Table of contents (sticky sidebar on desktop)
- Main content area with generous margins
- Related articles footer
- Comment section

**Markdown Elements:**
- Headings: Progressive size reduction with consistent spacing
- Paragraphs: `mb-6` between paragraphs
- Lists: `ml-6 space-y-2` with custom bullets
- Blockquotes: Left border accent, italic text, subtle background
- Images: Full-width with captions, lazy loading
- Tables: Bordered, striped rows, responsive scroll on mobile
- Links: Underline on hover with smooth transition

### Code Block Component (Critical)
**Structure:**
```
- Header bar: Language tag (left), Copy button (right)
- Line numbers column (optional toggle)
- Code content area with horizontal scroll
- Padding: p-4 to p-6
```

**Features:**
- Syntax highlighting themes: VS Code Dark (default), Dracula, Monokai, GitHub Light, Nord
- Theme switcher in article toolbar
- Line numbers: `text-gray-500 select-none pr-4`
- Copy button: Absolute positioned, hover state with tooltip
- Font size: `text-sm` (14px) for better density
- Horizontal scroll bar (styled to match theme)

**Code Color Themes to Implement:**
1. **VS Code Dark** (Default): Deep background `#1E1E1E`, warm syntax colors
2. **Dracula**: Purple/pink accent scheme `#282A36` background
3. **Monokai**: Classic with `#272822` background
4. **GitHub Light**: Clean white background for light mode
5. **Nord**: Cool blue-gray palette `#2E3440` background

### Category/Tag Pills
- Rounded full `rounded-full px-3 py-1`
- Subtle backgrounds with text contrast
- Hover: Slight scale `hover:scale-105`

### Search Component
- Prominent search bar with icon
- Instant search results dropdown
- Keyboard navigation support (↑↓ Enter, Esc)

### Footer
- Multi-column layout: About, Categories, Recent Posts, Social links
- Newsletter subscription form
- Copyright and tech stack info

---

## Responsive Behavior

**Breakpoints:**
- Mobile: Single column, hamburger menu, hide TOC
- Tablet (md:): Two-column article grid, show reduced nav
- Desktop (lg:): Three-column grid, sticky TOC sidebar, full navigation

**Mobile Optimizations:**
- Code blocks: Reduce font to `text-xs`, ensure touch-friendly copy button
- Tables: Horizontal scroll wrapper
- Navigation: Slide-in mobile menu
- Images: Responsive sizing with `w-full h-auto`

---

## Images

**Hero Image:**
- Large, full-width hero image on article list homepage
- Theme: Abstract technology/code visualization, developer workspace, or digital grid patterns
- Overlay with gradient for text readability
- Height: `h-96 md:h-[500px]`

**Article Thumbnails:**
- Aspect ratio: 16:9
- Placeholder for articles without images: Gradient with article icon
- Object-fit: cover

**In-Article Images:**
- Full-width within content container
- Captions below in smaller, muted text
- Lightbox on click for detailed view

---

## Interactions

**Minimal Animations:**
- Card hover: `transform hover:scale-102 transition-transform`
- Button states: Subtle opacity/background changes
- Code copy: Brief success checkmark animation
- Theme switch: Smooth color transitions `transition-colors duration-300`

**No Animations For:**
- Page navigation
- Text rendering
- Scroll-triggered effects (keep it fast)

---

This design creates a professional, developer-focused knowledge base that prioritizes code readability and content consumption while maintaining visual appeal.