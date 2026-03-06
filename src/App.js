import React, { useState } from 'react';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);

  const sendAllReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/devotees');
      const data = await res.json();
      
      let html = '<div style="font-family: Arial, sans-serif;">';
      data.forEach(devotee => {
        html += `<h3 style="color: #667eea;">${devotee.name} (${devotee.team})</h3>`;
        const s = devotee.summary;
        html += '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; margin: 15px 0; width: 400px;">';
        html += '<thead><tr style="background: #f0f0f0;"><th>Category</th><th>SA</th><th>SB</th><th>MA</th></tr></thead><tbody>';
        html += `<tr><td><b>Total</b></td><td colspan="3" style="text-align: center;"><b>${s.total}</b></td></tr>`;
        html += `<tr><td>P</td><td>${s.p[0]}</td><td>${s.p[1]}</td><td>${s.p[2]}</td></tr>`;
        html += `<tr><td>Late</td><td>${s.late[0]}</td><td>${s.late[1]}</td><td>${s.late[2]}</td></tr>`;
        html += `<tr><td>A</td><td>${s.a[0]}</td><td>${s.a[1]}</td><td>${s.a[2]}</td></tr>`;
        html += `<tr><td>Home</td><td>${s.home[0]}</td><td>${s.home[1]}</td><td>${s.home[2]}</td></tr>`;
        html += `<tr><td>Health</td><td>${s.health[0]}</td><td>${s.health[1]}</td><td>${s.health[2]}</td></tr>`;
        html += `<tr><td>Seva</td><td>${s.seva[0]}</td><td>${s.seva[1]}</td><td>${s.seva[2]}</td></tr>`;
        html += `<tr><td>WR</td><td>${s.wr[0]}</td><td>${s.wr[1]}</td><td>${s.wr[2]}</td></tr>`;
        html += `<tr><td>E</td><td>${s.e[0]}</td><td>${s.e[1]}</td><td>${s.e[2]}</td></tr>`;
        html += `<tr><td>P*</td><td>${s.pstar[0]}</td><td>${s.pstar[1]}</td><td>${s.pstar[2]}</td></tr>`;
        html += `<tr><td><b>DK</b></td><td colspan="3" style="text-align: center;"><b>${s.dk}</b></td></tr>`;
        html += '</tbody></table>';
        html += '<p style="font-size: 12px; color: #666; margin: 5px 0;">P = Present | L = Late | A = Absent</p>';
        html += '<p style="font-size: 12px; color: #666; margin: 5px 0;">SA = Sadhana A | SB = Sadhana B | MA = Mangala Arati</p><br/><br/>';
      });
      html += '</div>';
      
      await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }) })]);
      
      // Use mailto for better mobile compatibility
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = 'mailto:?subject=Attendance Report - All Devotees';
        alert('✅ Report copied!\n\n📱 Gmail will open. Long press in the email body and select "Paste" to insert the formatted report.');
      } else {
        window.open('https://mail.google.com/mail/?view=cm&fs=1&su=Attendance%20Report%20-%20All%20Devotees', '_blank');
        alert('✅ Report copied! Gmail opened. Press Ctrl+V to paste.');
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="App" style={{ backgroundImage: 'url(/SSRVC.jpg)' }}>
      <header>
        <h1>Morning Program Attendance - Email Reports</h1>
        <button className="draft-all-btn" onClick={sendAllReports} disabled={loading}>
          {loading ? '⏳ Loading...' : '📨 Copy Report & Open Gmail'}
        </button>
      </header>
    </div>
  );
}

export default App;
