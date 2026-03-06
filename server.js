const express = require('express');
const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

const MEMBERS = [
  { name: "HG Ārādhan Pr", team: "Yudhishthira" },
  { name: "Tanmay Pr", team: "Yudhishthira" },
  { name: "Rohit Pr", team: "Yudhishthira" },
  { name: "Amol Pr", team: "Yudhishthira" },
  { name: "Anish Pr", team: "Yudhishthira" },
  { name: "Abhishek Pr", team: "Bhima" },
  { name: "Hemant Pr", team: "Bhima" },
  { name: "Āditya M. Pr", team: "Bhima" },
  { name: "Shantanu Pr", team: "Bhima" },
  { name: "Vedānt S. Pr", team: "Bhima" },
  { name: "Chaitanya Pr", team: "Arjuna" },
  { name: "Achintya Pr", team: "Arjuna" },
  { name: "Adithya S. Pr", team: "Arjuna" },
  { name: "Shaurya Pr", team: "Arjuna" },
  { name: "Asmit Pr", team: "Arjuna" },
  { name: "Pranav I. Pr", team: "Arjuna" },
  { name: "Manan Pr", team: "Arjuna" },
  { name: "Mahesh Pr", team: "Arjuna" },
  { name: "Sanket Pr", team: "Arjuna" },
  { name: "Pranav B. Pr", team: "Arjuna" },
  { name: "Rushikesh Pr", team: "Arjuna" },
  { name: "Sumit Pr", team: "Arjuna" },
  { name: "Shriram Pr", team: "Nakula" },
  { name: "Rishit pr", team: "Nakula" },
  { name: "Vedant M. Pr", team: "Nakula" },
  { name: "Anurag pr", team: "Nakula" },
  { name: "Prithviraj Pr", team: "Nakula" },
  { name: "Shaunak pr", team: "Nakula" },
  { name: "Atul Pr", team: "Nakula" },
  { name: "Atharva pr", team: "Nakula" },
  { name: "Vipul pr", team: "Nakula" }
];

const SHEET_ID = process.env.SHEET_ID || "1PC7J0vn6rUtDyHouB7Q-iBcn_U85MH1Ypnv1uhVSmPg";

const auth = new google.auth.GoogleAuth({
  credentials: process.env.GOOGLE_CREDENTIALS ? JSON.parse(process.env.GOOGLE_CREDENTIALS) : require('./cred.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

const sheets = google.sheets({ version: 'v4', auth });

app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/devotees', async (req, res) => {
  try {
    const results = await Promise.all(
      MEMBERS.map(async (member) => {
        const teamMembers = MEMBERS.filter(m => m.team === member.team);
        const position = teamMembers.findIndex(m => m.name === member.name);
        const baseCol = 5 + (position * 5);
        
        const colLetter = (col) => {
          let letter = '';
          while (col > 0) {
            col--;
            letter = String.fromCharCode(65 + (col % 26)) + letter;
            col = Math.floor(col / 26);
          }
          return letter;
        };
        
        const range = `${member.team}!${colLetter(baseCol)}8:${colLetter(baseCol + 3)}38`;
        
        try {
          const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: range
          });
          
          const rows = response.data.values || [];
          let summary = { total: 0, p: [0,0,0], late: [0,0,0], a: [0,0,0], home: [0,0,0], health: [0,0,0], seva: [0,0,0], wr: [0,0,0], e: [0,0,0], pstar: [0,0,0], dk: 0 };
          
          for (let i = 0; i < 31; i++) {
            const row = rows[i] || [];
            const [sa, sb, ma, in_dk] = row;
            
            if (sa || sb || ma) summary.total++;
            if (in_dk && in_dk.toString().toUpperCase() === 'TRUE') summary.dk++;
            
            [sa, sb, ma].forEach((val, idx) => {
              if (!val) return;
              const v = val.toString().toUpperCase();
              if (v === 'P') summary.p[idx]++;
              else if (v.startsWith('L')) summary.late[idx]++;
              else if (v === 'A') summary.a[idx]++;
              else if (v === 'HOME') summary.home[idx]++;
              else if (v === 'HEALTH') summary.health[idx]++;
              else if (v === 'SEVA') summary.seva[idx]++;
              else if (v === 'WR') summary.wr[idx]++;
              else if (v === 'E') summary.e[idx]++;
              else if (v === 'P*') summary.pstar[idx]++;
            });
          }
          
          return { name: member.name, team: member.team, summary };
        } catch {
          return { name: member.name, team: member.team, summary: { total: 0, p: [0,0,0], late: [0,0,0], a: [0,0,0], home: [0,0,0], health: [0,0,0], seva: [0,0,0], wr: [0,0,0], e: [0,0,0], pstar: [0,0,0], dk: 0 } };
        }
      })
    );
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
