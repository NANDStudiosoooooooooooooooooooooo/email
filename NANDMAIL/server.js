// Importiere das Express-Modul
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Neu hinzugefügtes Modul für HTTP-Anfragen

// Erstelle eine neue Instanz der Express-App
const app = express();

// Middleware für das Parsen von JSON-Anfragen hinzufügen
app.use(bodyParser.json());

// Definiere eine Route für den Hauptendpunkt
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/mail.html'); // Lade die HTML-Datei für die Startseite
});

////test////
async function verifyEmail(targetEmail) {
  const accountIdentifier = "893d6dd7ddada994bdb6df5d5046b293"; // Hier den Account-Identifier einsetzen

  const options = {
    method: 'POST',
    url: `https://api.cloudflare.com/client/v4/accounts/893d6dd7ddada994bdb6df5d5046b293/email/routing/addresses`,
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Key': '8f2cb02cc259e05bf134a05448d15abe7f737',
      'X-Auth-Email': 'nand339@icloud.com'
    },
      // Hier deine Cloudflare-Konto-E-Mail-Adresse einsetzen
    data: {email: targetEmail}
  };

  await axios.request(options);
}
////test////



// Route für die Einrichtung der E-Mail-Weiterleitung
app.post('/setup-email-forwarding', async (req, res) => {
  const targetEmail = req.body.targetEmail; // Ziel-E-Mail-Adresse aus dem Anfragekörper extrahieren

  if (!targetEmail) {
    return res.status(400).send('Bitte geben Sie eine Ziel-E-Mail-Adresse ein.');
  }

  const emailName = generateRandomEmailName(); // Generiere einen zufälligen E-Mail-Namen

  try {
    


    // API-Anfrage zum Einrichten der E-Mail-Weiterleitung
    const response = await setupEmailForwarding(targetEmail, emailName);
    res.status(200).json({ message: 'E-Mail-Weiterleitung eingerichtet.', email: targetEmail, customEmail: `${emailName}@nand-studios.com` });
  } catch (error) {
    console.error('Fehler beim Einrichten der E-Mail-Weiterleitung:', error);
    res.status(500).send('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
  }

  ////test////
  // E-Mail-Adresse verifizieren //
  await verifyEmail(targetEmail);
  ////test//// 

});



// Funktion zum Generieren eines zufälligen E-Mail-Namens
function generateRandomEmailName() {
  const characters = 'abcdefghjkmnpqrstuvwxyz23456789';
  let emailName = '';
  for (let i = 0; i < 8; i++) {
    emailName += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return emailName;
}

// Funktion zum Einrichten der E-Mail-Weiterleitung mit der Cloudflare-API
async function setupEmailForwarding(targetEmail, emailName) {
  const zoneID = '7d1147f5713f519db2534c49bf4cc414'; // Ersetze durch deine Cloudflare-Zone-ID
  const apiKey = '8f2cb02cc259e05bf134a05448d15abe7f737'; // Ersetze durch deinen Cloudflare-API-Schlüssel
  const url = `https://api.cloudflare.com/client/v4/zones/${zoneID}/email/routing/rules`;

  const headers = {
    'Content-Type': 'application/json',
    'X-Auth-Key': apiKey,
    'X-Auth-Email': 'nand339@icloud.com'
  };

  const data = {
    priority: 1,
    actions: [
      {
        type: 'forward',
        value: [targetEmail]
      }
    ],
    matchers: [
      {
        field: 'to',
        type: 'literal',
        value: `${emailName}@nand-studios.com`
      }
    ],
    name: 'Email Forwarding Rule',
    enabled: true
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Fehler beim Einrichten der E-Mail-Weiterleitung:', error.response.data.errors);
    throw error;
  }
}

// Starte den Server und höre auf eingehende Verbindungen
const port = 3042;
app.listen(port, () => {
  console.log(`Express-App läuft auf http://localhost:${port}`);
});