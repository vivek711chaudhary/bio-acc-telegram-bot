// Community features for the Bio/ACC Telegram bot

// Track active discussions (in a real app, use a database)
const activeDiscussions = [
  {
    id: "disc1",
    title: "The Future of Longevity Research",
    description: "Discussing the most promising approaches to extending healthy human lifespan.",
    participants: 24,
    url: "https://t.me/bioaccommunity/longevity"
  },
  {
    id: "disc2",
    title: "DeSci Funding Models",
    description: "Comparing different approaches to funding decentralized science projects.",
    participants: 18,
    url: "https://t.me/bioaccommunity/funding"
  },
  {
    id: "disc3",
    title: "Ethics of Human Enhancement",
    description: "Debating the ethical implications of cognitive and physical enhancement technologies.",
    participants: 32,
    url: "https://t.me/bioaccommunity/ethics"
  }
];

// Track upcoming events (in a real app, use a database)
const upcomingEvents = [
  {
    id: "evt1",
    title: "DeSci Summit 2023",
    date: "2023-09-15",
    description: "Annual gathering of decentralized science researchers and enthusiasts.",
    location: "Virtual",
    url: "https://desci-summit.com"
  },
  {
    id: "evt2",
    title: "Bio/ACC Hackathon",
    date: "2023-10-22",
    description: "48-hour hackathon focused on building tools for biological acceleration.",
    location: "San Francisco, CA",
    url: "https://bioacc.io/hackathon"
  }
];

function getActiveDiscussions() {
  return activeDiscussions;
}

function getUpcomingEvents() {
  return upcomingEvents;
}

function formatDiscussionsForTelegram(discussions) {
  let message = "<b>🗣️ Active Community Discussions</b>\n\n";
  
  discussions.forEach((disc, index) => {
    message += `<b>${index + 1}. ${disc.title}</b>\n`;
    message += `${disc.description}\n`;
    message += `👥 ${disc.participants} participants\n`;
    message += `<a href="${disc.url}">Join discussion</a>\n\n`;
  });
  
  return message;
}

function formatEventsForTelegram(events) {
  let message = "<b>📅 Upcoming Events</b>\n\n";
  
  events.forEach((evt, index) => {
    message += `<b>${index + 1}. ${evt.title}</b>\n`;
    message += `📆 ${evt.date}\n`;
    message += `📍 ${evt.location}\n`;
    message += `${evt.description}\n`;
    message += `<a href="${evt.url}">More info</a>\n\n`;
  });
  
  return message;
}

module.exports = {
  getActiveDiscussions,
  getUpcomingEvents,
  formatDiscussionsForTelegram,
  formatEventsForTelegram
}; 