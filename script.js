const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatArea = document.getElementById("chatArea");
const plantingSuggestion = document.getElementById("plantingSuggestion");
const todayWeather = document.getElementById("todayWeather");

// --- Knowledge base for your plants ---
const botKnowledge = {
  
  "olive": {
    planting: "Olive trees prefer hot, dry climates and well-drained soil. Plant in full sun, spaced at least 6 meters apart.",
    pests: "Common pests include olive fruit fly and scale insects. Use pheromone traps or prune affected branches."
  },
  "carrot": {
    planting: "Carrots grow best in loose, sandy soil. Sow seeds directly, thin seedlings, and keep soil moist.",
    pests: "Carrot flies and nematodes are common. Use row covers and rotate crops to reduce damage."
  },
  "eggplant": {
    planting: "Eggplants need warm soil (>20°C) and full sun. Space plants 45–60 cm apart.",
    pests: "Flea beetles and spider mites attack leaves. Neem oil and row covers help protect young plants."
  },
  "corn": {
    planting: "Plant corn in blocks (not rows) for pollination. Needs full sun and nitrogen-rich soil.",
    pests: "Corn earworms and armyworms are common. Rotate crops and use Bacillus thuringiensis (Bt) sprays."
  },
  "calamansi": {
    planting: "Calamansi grows best in tropical climates with full sun. Plant in fertile, well-drained soil.",
    pests: "Citrus leafminer and aphids are common. Prune damaged leaves and use neem oil sprays."
  },
  "bitter melon": {
    planting: "Bitter melon thrives in warm, sunny conditions. Train vines on a trellis for better yield.",
    pests: "Fruit flies and aphids attack bitter melon. Use pheromone traps and neem-based sprays."
  },
  "chayote": {
    planting: "Chayote prefers warm climates and rich, moist soil. Plant whole fruit and train vines on supports.",
    pests: "Aphids and whiteflies can infest leaves. Spray with soap solution or neem oil."
  },
  "bottle gourd": {
    planting: "Bottle gourd grows well in tropical climates. Plant seeds in moist soil and provide trellises for climbing.",
  pests: "Fruit flies and beetles are common. Use sticky traps and crop rotation to control pests."
},
"tomatoes": {
  planting: "Tomatoes grow best in warm (21–27°C), sunny conditions. Start seeds indoors, transplant when seedlings are 15–20 cm tall. Space 45–60 cm apart, provide stakes or cages for support.",
  pests: "Common pests include aphids, whiteflies, cutworms, and tomato hornworms. Use neem oil, companion planting (basil, marigold), and regular pruning to reduce pests."
},
"lettuce": {
    planting: "Lettuce prefers cool weather and moist, fertile soil. Sow seeds directly or transplant seedlings. Space 20–30 cm apart and keep soil consistently moist.",
    pests: "Aphids, slugs, and snails are common. Use row covers, hand-pick pests, and apply diatomaceous earth around plants."
},
};

// --- General fallback advice ---
const generalPlantingAdvice = "Most plants need: well-drained soil, 6+ hrs of sunlight, regular watering, and spacing for airflow.";
const generalPestAdvice = "General pest control: rotate crops, encourage ladybugs and lacewings, remove weeds, and spray neem oil if needed.";

// --- Chat UI ---
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function getBotReply(input) {
  input = input.toLowerCase();

  for (let crop in botKnowledge) {
    if (input.includes(crop)) {
      if (input.includes("pest")) {
        return botKnowledge[crop].pests;
      } else if (input.includes("plant") || input.includes("grow")) {
        return botKnowledge[crop].planting;
      } else {
        return `${botKnowledge[crop].planting} Also, ${botKnowledge[crop].pests}`;
      }
    }
  }

  if (input.includes("pest")) return generalPestAdvice;
  if (input.includes("plant") || input.includes("grow")) return generalPlantingAdvice;

  return "I can help with olive trees, carrots, eggplant, corn, calamansi, bitter melon, chayote, and bottle gourd. Try asking like: 'How to plant carrots?' or 'Pests in eggplant?'.";
}

// --- Chat handling ---
sendBtn.addEventListener("click", () => {
  const text = userInput.value.trim();
  if (text) {
    addMessage(text, "user");
    const reply = getBotReply(text);
    setTimeout(() => addMessage(reply, "bot"), 500);
    userInput.value = "";
  }
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

// --- Seasonal Planting Calendar (Fallback Data) ---
const staticCalendar = {
  January: "Good for carrots, chayote, tomatoes, and bottle gourd.",
  February: "Start eggplant, tomatoes, and corn. Also good for calamansi planting.",
  March: "Great for bitter melon, chayote, and tomatoes.",
  April: "Hot season — best for eggplant, corn, bottle gourd, and tomatoes.",
  May: "Good for calamansi, olive trees, and tomatoes.",
  June: "Rainy season — carrots, leafy crops, and tomatoes thrive. Watch for fungal diseases.",
  July: "Keep an eye on pests. Plant bitter melon, corn, and tomatoes.",
  August: "Chayote, bottle gourd, and tomatoes grow well.",
  September: "Great for carrots, calamansi, and tomatoes.",
  October: "Eggplant, bitter melon, and tomatoes season.",
  November: "Plant corn, carrots, and tomatoes before heavy rains.",
  December: "Good for calamansi, chayote, and tomatoes. Avoid eggplant in cooler temps."
};

function showStaticCalendar() {
  const month = new Date().toLocaleString("en-US", { month: "long" });
  plantingSuggestion.textContent = `📅 This month (${month}): ${staticCalendar[month]}`;
}

// --- Planting Calendar Suggestion Function ---
// --- Weather + Planting Suggestion ---
async function fetchWeather() {
  const apiKey = "YOUR_API_KEY_HERE"; // <-- Replace with OpenWeatherMap key
  const city = "Surigao City,PH";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather data not found");
    const data = await res.json();

    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].main;

    todayWeather.textContent = `Today in ${city}: ${condition}, ${temp}°C`;
    plantingSuggestion.textContent = getPlantingSuggestion(condition, temp);

  } catch (err) {
    console.error("Weather error:", err);

    // If API fails → show fallback planting calendar
    todayWeather.textContent = "Weather unavailable";
    showStaticCalendar(); // ✅ Always show something useful
  }
}
// --- Run on page load ---
fetchWeather();

// --- Planting Calendar Logic ---
function getPlantingSuggestion(weather, temp) {
  weather = weather.toLowerCase();

  if (temp >= 28 && weather.includes("clear")) {
    return "🌞 Hot & sunny — Best for eggplant, bitter melon, chayote, bottle gourd, and corn.";
  } else if (temp >= 20 && temp < 28 && weather.includes("clear")) {
    return "🌤️ Warm but not too hot — Good for calamansi, olive trees, and corn.";
  } else if (weather.includes("rain")) {
    return "🌧️ Rainy weather — Carrots and leafy crops thrive. Watch for fungal pests.";
  } else if (temp < 20) {
    return "❄️ Cool weather — Carrots thrive. Avoid tropical crops like eggplant or chayote.";
  } else {
    return "Mixed conditions — check soil moisture and sunlight before planting.";
  }
}
// --- Fetch Weather for Surigao City ---
async function fetchWeather() {
  const apiKey = "8da6026eebe0d60d4c42e38b2ef0e6ad"; // <-- Replace with your OpenWeatherMap key
  const city = "Surigao City,PH";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather data not found");
    const data = await res.json();

    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].main;

    // Show weather info
    todayWeather.textContent = `Today in ${city}: ${condition}, ${temp}°C`;

    // Suggest planting advice
    plantingSuggestion.textContent = getPlantingSuggestion(condition, temp);

  } catch (err) {
    todayWeather.textContent = "Weather unavailable";
    plantingSuggestion.textContent = "Could not load planting suggestions.";
    console.error(err);
  }
}

fetchWeather();


