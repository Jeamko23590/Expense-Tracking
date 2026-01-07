# Source Code Structure

```
src/
├── components/           # Reusable UI components
│   ├── Dashboard/        # Dashboard summary cards
│   │   ├── Dashboard.js
│   │   ├── Dashboard.css
│   │   └── index.js
│   └── Navbar/           # Navigation bar
│       ├── Navbar.js
│       ├── Navbar.css
│       └── index.js
├── styles/               # Global styles
│   ├── App.css           # App container styles
│   └── index.css         # CSS reset and base styles
├── App.js                # Main app component
└── index.js              # React entry point
```

## Component Structure

Each component follows a folder-based structure:
- `ComponentName.js` - Component logic and JSX
- `ComponentName.css` - Component-specific styles
- `index.js` - Clean export for easier imports
