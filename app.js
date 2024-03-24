const moment = require('moment');
const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 3030;

app.get('/sensors', (req, res) => {
  const command = 'sensors -j';

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const result = {
        stdout
    };

    res.json(result);
  });
});

app.get('/diskinfo', (req, res) => {
  exec('df -h', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: 'Erro ao obter informações do espaço em disco.' });
    }

    const lines = stdout.split('\n');
    const headers = lines[0].split(/\s+/);

    const diskInfo = lines.slice(1).map((line) => {
      const values = line.split(/\s+/);
      const entry = {};

      headers.forEach((header, index) => {
        entry[header] = values[index];
      });

      return entry;
    });

    res.json({ diskInfo });
  });
});

app.get('/uptime', (req, res) => {
  exec('uptime -s', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: 'Erro ao obter o tempo de atividade do sistema.' });
    }

    const startTime = moment(stdout.trim());
    const currentTime = moment();

    const uptimeDays = currentTime.diff(startTime, 'days');
    const remainingHours = currentTime.diff(startTime, 'hours') % 24;

    res.json({ uptimeDays, uptimeHours: remainingHours });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
