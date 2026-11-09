/* =========================================================================
 * The games registry. This is the single source of truth for the hub.
 *
 * To add a game: append an entry here AND create games/<slug>/index.html.
 * The hub (root index.html) renders one card per entry, linking to
 * games/<slug>/index.html.
 *
 * Fields:
 *   slug     - folder name under games/ (kebab-case, also the card link)
 *   title    - display name
 *   emoji    - big icon on the card
 *   tagline  - one short kid-friendly line
 *   skills   - array of short skill tags shown on the card
 *   age      - suggested age range string
 *   color    - card accent color (hex string)
 *   ready    - false hides/greys the card as "coming soon"
 * ====================================================================== */
window.GAMES = [
  {
    slug: 'make-ten',
    title: 'Make Ten!',
    emoji: '🔟',
    tagline: 'Find the number that makes ten',
    skills: ['Number bonds', 'Add to 10', 'Counting'],
    age: '4-6',
    color: '#4cc36b',
    ready: true
  },
  {
    slug: 'doubles',
    title: 'Doubles!',
    emoji: '🐞',
    tagline: 'Count the ladybug spots on both wings',
    skills: ['Doubles', 'Near doubles', 'Adding'],
    age: '5-7',
    color: '#ff6b9d',
    ready: true
  },
  {
    slug: 'bridge-ten',
    title: 'Bridge to Ten!',
    emoji: '🌉',
    tagline: 'Make ten first, then add the rest',
    skills: ['Make a ten', 'Add past 10', 'Strategy'],
    age: '5-7',
    color: '#6c8cff',
    ready: true
  }
];
