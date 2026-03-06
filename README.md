# DesparateSeva - Email Report System

React + Node.js system to generate email drafts for devotee attendance reports.

## Features
- 📧 Generate email drafts with attendance tables
- 📱 Mobile-responsive card interface
- 🔄 Real-time Google Sheets integration
- 👥 Support for 4 teams: Yudhishthira, Bhima, Arjuna, Nakula
- 📊 View attendance across 3 sessions (SA, SB, MA)
- ✉️ Opens Gmail compose with pre-filled data

## Quick Start

### Development
```bash
# Install dependencies
npm install

# Run React frontend (Terminal 1)
npm start

# Run Node.js backend (Terminal 2)
npm run server
```

### Production Build
```bash
npm install
npm run build
npm run server
```

### Environment Variables
- `GOOGLE_CREDENTIALS`: JSON string of service account credentials
- `SHEET_ID`: Google Sheet ID (optional, defaults to hardcoded)
- `PORT`: Port number (optional, defaults to 5000)

## Deployment

### Render
1. Push to GitHub
2. Create Web Service on Render
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run server`
5. Set environment variable: `GOOGLE_CREDENTIALS` = content of cred.json
6. Deploy

### Heroku
```bash
heroku create your-app-name
heroku config:set GOOGLE_CREDENTIALS="$(cat cred.json)"
git push heroku main
```

## File Structure
```
DesparateSeva/
├── src/
│   ├── App.js          # React main component
│   ├── App.css         # Styles
│   └── index.js        # React entry
├── public/
│   └── index.html      # HTML template
├── server.js           # Node.js Express API
├── package.json        # Dependencies
└── .gitignore
```

## Tech Stack
- React 18
- Node.js + Express
- Google Sheets API
- Gmail compose integration
