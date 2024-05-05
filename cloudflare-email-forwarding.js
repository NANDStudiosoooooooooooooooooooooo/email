import axios from "axios";

const zoneID = '7d1147f5713f519db2534c49bf4cc414'; // Aktualisiere mit der bereitgestellten Zone-ID
const apiKey = '8f2cb02cc259e05bf134a05448d15abe7f737'; // Verwende den bereitgestellten API-Schlüssel
const email = 'nand339@icloud.com'; // Aktualisiere mit deiner Cloudflare-E-Mail

const options = {
  method: 'POST',
  url: `https://api.cloudflare.com/client/v4/zones/${zoneID}/email/routing/rules`,
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Email': email,
    'X-Auth-Key': apiKey
  },
  data: {
    actions: [{type: 'forward', value: ['destinationaddress@example.net']}],
    enabled: true,
    matchers: [{field: 'to', type: 'literal', value: 'test@example.com'}],
    name: 'Send to user@example.net rule.',
    priority: 0
  }
};

axios.request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });