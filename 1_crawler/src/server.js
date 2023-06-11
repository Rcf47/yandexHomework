const express = require('express');
const { fetcher } = require('../fetcher.js');
const app = express();

app.use(express.json());

app.post('/parse', async (req, res) => {
  const { domainName } = req.body;
  const visited = new Set();
  const initialUrlArray = [`${domainName}`];

  while (initialUrlArray.length > 0) {
    const currentUrl = initialUrlArray.pop();

    if (visited.has(currentUrl)) {
      continue;
    }

    visited.add(currentUrl);

    try {
      const html = await fetcher(currentUrl);
      const linkPattern = /href="([^"]*)"/gi;
      const htmlText = await html.text()
      const links = htmlText.match(linkPattern).map(link => link.replace('href="', '').replace('"', ''));

      initialUrlArray.push(...links.filter(link => {
        try {
          const { hostname } = new URL(link);
          return `https://${hostname}` === domainName;
        } catch (error) {
          return false;
        }
      }).filter(link => !visited.has(link)));

    } catch (error) {
      console.error(`Error crawling ${currentUrl}: ${error.message}`);
    }
  }

  res.json([...visited]);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
