CLIPcherry Graphics Standards Manual

Purpose

The manual defines the visual rules for CLIPcherry, ensuring every touchpoint reflects a unified, accessible, and premium experience for Creators and Supporters.
Core Brand Elements

Logo
Primary logo: Cherry icon integrated with the wordmark "CLIPcherry" in bold sans-serif.
Clear space: Maintain a space around the logo equal to the height of the letter "C" on all sides.
Minimum size: 24 px height for digital use, and 8 mm height for print.
Backgrounds: On light backgrounds, use the full-color logo. On dark backgrounds, use the white or single-color (monochrome) version of the logo.
Color Palette
Name	HEX	Usage
Cherry Red (Primary)	#e30052	Interactive elements, key highlights
White	#ffffff	Light theme surfaces
Mist Gray	#f5f5f7	Light theme backgrounds, borders
Black	#000000	Text on light surfaces
Charcoal	#121212	Dark theme surfaces
Accent Lime	#c2ff00	Calls to action, success moments
Success Green	#2ecc71	Positive feedback
Warning Yellow	#f1c40f	Caution messages
Error Red	#e74c3c	Error states
Ensure sufficient contrast: All text should have a contrast ratio of at least 4.5:1 against its background color (WCAG AA standard).
Typography
Headings: Use the "Inter" font in Bold; apply a slight negative letter-spacing (around -1%) and a line height of 1.2 for tight, clear headings.
Body text: Use "Inter" Regular for general content, with a comfortable line height of 1.6. The base font size is 16 px for body copy, to ensure readability.
Code snippets: Use "JetBrains Mono" Regular at 14 px for any inline code or code blocks, to clearly distinguish them from regular text.
Limit the number of font sizes in use to three (for example: one size for headings, one for subheadings, one for body text) per screen to maintain visual hierarchy.
Iconography
Use Lucide icon set for all icons, with a consistent stroke weight of 2 px to match the visual style.
All icons should be aligned to a 24 px grid, and use a 2 px corner radius on shapes to maintain a cohesive, slightly rounded look.
Icons are generally monochromatic (inheriting the text or foreground color), unless a specific accent color is needed for status indicators.
Imagery and Media
Creator Images: Profile pictures or content preview images are automatically blurred (approximately an 8 px blur) until the user has purchased access. This provides a sneak peek without giving away the content.
Video Thumbnails: When displaying video content before purchase, show 5–10 blurred thumbnail frames (at a 16:9 ratio) as a preview. Creators can choose up to three specific thumbnails to feature prominently as previews.
Avoid placing any important text directly inside images or video thumbnails. If necessary, use overlay text or graphical badges so that text remains accessible and translates well to different sizes.
Layout System
Use an 8-point grid for spacing and sizing. All paddings, margins, and positioning should ideally be multiples of 8 px, which creates visual harmony and consistency.
The maximum content width on large screens is 1440 px. Center the main content container within the viewport for desktop displays to keep line lengths readable.
Standard gutter (spacing between columns or content blocks) is 24 px on desktop screens and 16 px on mobile devices.
Card elements (such as content preview cards) have a consistent style: 12 px inner padding, a 12 px border radius for rounded corners, and a subtle shadow (e.g., box-shadow: 0 2px 4px rgba(0,0,0,0.08)) to elevate them from the background.
Light and Dark Themes
Light Theme: Primary surfaces (backgrounds) are White. Use Cherry Red for interactive highlights (like primary buttons or links). Body text is primarily black (#000000) but can be reduced to 87% opacity for a softer appearance on pure white.
Dark Theme: Primary surfaces are Charcoal. Cherry Red is still used for highlights (it stands out well against dark backgrounds). Body text and UI text should be pure white (#ffffff) at 100% opacity for maximum contrast on Charcoal.
For modals or overlays in either theme, apply a semi-transparent overlay behind the content (for example, a black overlay at 12% opacity) to focus the user’s attention on the foreground content.
Component Styling
Buttons:
Primary Buttons: Filled with Cherry Red, with white text in all-caps (Inter SemiBold 14 px). Corners are rounded with a 12 px radius. On hover or active, use a subtle darkening or shadow to indicate interactivity.
Secondary Buttons: Outlined style with a 2 px Cherry Red border and no fill (transparent background). Text is Cherry Red (Inter SemiBold 14 px, uppercase). Same 12 px border radius for consistency.
Form Inputs: Inputs (like text fields, dropdowns) have a base border of 2 px in Mist Gray. On focus, the border (or outline) changes to Cherry Red to clearly indicate the active field. Ensure sufficient padding inside inputs (e.g., 8–12 px) for comfortable clicking/tapping.
Badges/Labels: Use a Cherry Red background with white text for prominent labels (e.g., a “NEW” tag). Apply an 8 px border radius so badges have pill-shaped rounded ends. Keep their font small (Inter or system sans-serif, ~12 px) and uppercase for readability at a glance.
Motion Principles
Keep interface animations quick and light to maintain a snappy feel. Target 100 ms or less for most micro-interactions.
Button Press: When a button is clicked or tapped, use a quick scale-down animation (to about 96% of its size) over 120 ms, then return to normal. This provides tactile feedback that the press was registered.
Page Transitions: Use a fade and slight upward slide for page transitions. For example, when opening a new modal or page, fade it in over ~80 ms while moving it up 40 px from below. This creates a smooth transition without long waits.
Consistency: Use the same easing functions and timing for similar interactions across the app (e.g., all modals might use the same fade-up animation). This consistency makes the experience feel cohesive. Avoid heavy or lengthy animations that could frustrate users or slow down the experience.
Accessibility
All design choices must support accessibility. Ensure text meets contrast standards (WCAG AA at minimum, with AAA as a goal for important text). For example, avoid light gray text on white, or red text on dark gray, since they may fail contrast tests.
Provide alternative text for all images (alt attributes) and subtitles or transcripts for videos. This allows screen reader users and hearing-impaired users to engage with the content.
Keyboard Navigation: All interactive elements (links, buttons, form fields) should be reachable and operable via keyboard alone. When focused via keyboard, elements should have a visible focus outline (use a 2 px Cherry Red outline or similar highly visible indicator) so users know where focus is.
Motion & Preferences: Respect user preferences for reduced motion – if a user has this setting enabled in their OS/browser, minimize or disable non-essential animations to avoid discomfort.
File Formats and Naming
Use SVG format for logos and icons for clarity and scalability. Provide PNG fallbacks for older browsers that may not fully support SVG.
Save photographic images in WebP format (or high-quality JPEG/PNG if necessary) and compress them to keep file sizes low (each image should ideally be under 250 KB for performance).
Upload videos in MP4 (H.264 encoding) so that Cloudflare Stream can process them. Cloudflare Stream will handle creating different resolutions and formats for adaptive streaming delivery.
When naming files (images, videos, assets), use clear and consistent naming:
Use lowercase letters and hyphens (-) to separate words.
Avoid spaces, special characters, or uppercase in filenames, as these can cause issues or inconsistencies.
Example: creator-profile-hero.webp is a good filename, whereas Creator Profile HERO.PNG is not.
Do and Do Not
Do:
Use Cherry Red sparingly and purposefully – primarily for call-to-action buttons or highlights – so that it draws attention where needed.
Leave sufficient whitespace and adhere to the grid; a clean, uncluttered layout helps emphasize important content and looks more professional.
Test design changes in both light and dark modes to ensure consistency and usability in both themes.
Do Not:
Alter or distort the logo in any way (no changing colors, stretching, or adding effects). The logo should remain consistent everywhere.
Use low-contrast color combinations (for example, light gray text on white, or Cherry Red text on a black/dark background) for important text, as these fail accessibility guidelines.
Overuse shadows, glows, or other heavy effects that can make the interface look inconsistent with the flat, clean aesthetic of the brand.
Governance and Versioning
The design guidelines should be maintained under version control. Any updates or additions to the style guide require approval from the Brand Lead or design team leadership.
After changes are approved, increment the version number of the Graphics Standards Manual (e.g., v1.0 to v1.1) and note the change in a changelog or document history section. This helps the team track evolution of the brand standards over time.
