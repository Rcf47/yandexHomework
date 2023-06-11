const express = require('express')
const fetcher = require('fetcher')

const app = express();

app.use(express.json());

app.post('/parse', async (req, res) => {
  const { domainName } = req.body;
  const visited = new Set();
  const links = [];
  const initialUrlArray = [`http://${domainName}`];

  while (initialUrlArray.length > 0) {
    const currentUrl = initialUrlArray.pop();

    if (visited.has(currentUrl)) {
      continue;
    }

    visited.add(currentUrl);

    try {
      const html = await fetcher.fetch(currentUrl);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const anchorTags = doc.getElementsByTagName('a');

      for (let i = 0; i < anchorTags.length; i++) {
        const link = anchorTags[i].getAttribute('href');

        if (link.startsWith('/')) {
          links.push(`http://${domainName}${link}`);
        } else if (link.startsWith('http')) {
          const { hostname } = new URL(link);

          if (hostname === domainName) {
            links.push(link);
          }
        }
      }

      initialUrlArray.push(...links.filter(link => !visited.has(link)));
      links.length = 0;
    } catch (error) {
      console.error(`Error crawling ${currentUrl}: ${error.message}`);
    }
  }

  res.json([...new Set(links)]);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
