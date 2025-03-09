// This would typically connect to a news API or RSS feed
// For demonstration, we'll use static content

const latestNews = [
  {
    title: "VitaDAO Funds New Longevity Research Project",
    date: "2023-06-15",
    summary: "VitaDAO has allocated $2M to fund a promising research project on cellular reprogramming at Stanford University.",
    url: "https://vitadao.com/blog/new-funding-announcement"
  },
  {
    title: "DeSci Labs Launches New Open Research Platform",
    date: "2023-05-22",
    summary: "DeSci Labs has unveiled a new platform that allows researchers to publish and collaborate on projects with transparent peer review.",
    url: "https://desci.com/new-platform-launch"
  },
  {
    title: "Breakthrough in CRISPR Technology Enables More Precise Editing",
    date: "2023-04-10",
    summary: "Researchers have developed an enhanced CRISPR system that reduces off-target effects by 90%, opening new possibilities for gene therapy.",
    url: "https://bioaccjournal.com/crispr-breakthrough"
  }
];

function getLatestNews(count = 3) {
  return latestNews.slice(0, count);
}

function formatNewsForTelegram(news) {
  let message = "<b>📰 Latest DeSci & Bio/ACC News</b>\n\n";
  
  news.forEach((item, index) => {
    message += `<b>${index + 1}. ${item.title}</b>\n`;
    message += `<i>${item.date}</i>\n`;
    message += `${item.summary}\n`;
    message += `<a href="${item.url}">Read more</a>\n\n`;
  });
  
  return message;
}

module.exports = {
  getLatestNews,
  formatNewsForTelegram
}; 