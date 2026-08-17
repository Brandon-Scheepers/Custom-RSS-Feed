const fs = require("fs");

// South Africa is UTC+2
const SA_TIMEZONE_OFFSET = 2;

// Read the Word of the Day data
const words = JSON.parse(
  fs.readFileSync("words.json", "utf8")
);

// Get today's date in South Africa
const now = new Date(
  Date.now() + SA_TIMEZONE_OFFSET * 60 * 60 * 1000
);

const year = now.getUTCFullYear();
const month = String(now.getUTCMonth() + 1).padStart(2, "0");
const day = String(now.getUTCDate()).padStart(2, "0");

const today = `${year}-${month}-${day}`;

// Find today's Word of the Day
const todayWord = words.find(item => item.date === today);

if (!todayWord) {
  throw new Error(`No Word of the Day found for ${today}`);
}

// Escape characters that could break XML
function escapeXml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const word = escapeXml(todayWord.word);
const meaning = escapeXml(todayWord.meaning);
const example = escapeXml(todayWord.example);

// Create RSS description
const description = `
<p><strong>${word}</strong></p>
<p><em>&ldquo;${example}&rdquo;</em></p>
`;

// Create the RSS feed
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Word of the Day</title>
    <description>Your daily Word of the Day.</description>
    <language>en</language>

    <item>
      <title>Word of the Day: ${word}</title>

      <description><![CDATA[
${description}
      ]]></description>

      <pubDate>${today}</pubDate>

      <guid isPermaLink="false">
        word-of-the-day-${today}
      </guid>
    </item>

  </channel>
</rss>
`;

// Write the RSS feed
fs.writeFileSync("feed.xml", rss, "utf8");

console.log(`RSS feed generated for ${today}: ${todayWord.word}`);
