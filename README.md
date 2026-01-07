# ExpenseWallet - Expense Tracker Application

A single-page application for employees to easily report and track expenses.

## Features

- Add new expenses with date, description, and amount
- View all expenses in a table with running total
- Search/filter expenses by description
- View total expenses by week for the entire year
- Mobile-friendly responsive design
- Data persistence using localStorage

## Tech Stack

- **Frontend:** React.js (JavaScript, no TypeScript)
- **Styling:** Custom CSS with modern design principles
- **Storage:** localStorage for data persistence

## Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Clone the Repository

```bash
git clone https://github.com/Jeamko23590/Expense-Tracking.git
cd Expense-Tracker
```

### Install Dependencies

```bash
npm install
```

### Run the Application

```bash
npm start
```

The app will open automatically in your browser at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
expense-tracker/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.js
│   │   │   ├── Dashboard.css
│   │   │   └── index.js
│   │   └── Navbar/
│   │       ├── Navbar.js
│   │       ├── Navbar.css
│   │       └── index.js
│   ├── styles/
│   │   ├── App.css
│   │   └── index.css
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## License

This project is for demonstration purposes.
