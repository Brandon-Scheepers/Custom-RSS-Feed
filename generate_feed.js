const fs = require("fs");

const words = JSON.parse(
  fs.readFileSync("words.json", "utf8")
);

// Get today's date in South Africa
const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Africa/Johannesburg",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(new Date());

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
const example = escapeXml(todayWord.example);

// Only the example goes into the RSS title
const title = example;

// Create the RSS feed
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Word of the Day</title>
    <description>Your daily Word of the Day.</description>
    <language>en</language>

    <item>
      <title>${title}</title>
      <description></description>
      <pubDate>${today}</pubDate>
      <guid isPermaLink="false">word-of-the-day-${today}</guid>
    </item>

  </channel>
</rss>
`;

// Write the RSS feed
fs.writeFileSync("feed.xml", rss, "utf8");

console.log(`RSS feed generated for ${today}: ${todayWord.word}`);
