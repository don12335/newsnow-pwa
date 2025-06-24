const API_KEY = "7bb77a292e5e076bc189b7e7a276810d";
const API_URL = "https://gnews.io/api/v4/top-headlines";

const newsList = document.getElementById("newsList");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("category");
const languageSelect = document.getElementById("language");
const toggleTheme = document.getElementById("toggleTheme");

window.addEventListener("load", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
  loadNews();
});

toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = searchInput.value.trim();
  if (keyword) loadNews(keyword);
});

categorySelect.addEventListener("change", () => loadNews());
languageSelect.addEventListener("change", () => loadNews());

function loadNews(keyword = "") {
  newsList.innerHTML = "<p>載入中...</p>";
  const category = categorySelect.value;
  const lang = languageSelect.value;
  const params = new URLSearchParams({
    token: API_KEY,
    lang,
    topic: category,
  });
  if (keyword) params.append("q", keyword);

  fetch(`${API_URL}?${params}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.articles || data.articles.length === 0) {
        newsList.innerHTML = "<p>找不到新聞。</p>";
        return;
      }
      newsList.innerHTML = data.articles.map(article => `
        <div class="card">
          <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
          <p>${article.source.name}｜${new Date(article.publishedAt).toLocaleString()}</p>
          <p>${article.description || ""}</p>
        </div>
      `).join("");
    })
    .catch(() => {
      newsList.innerHTML = "<p>❌ 載入失敗。</p>";
    });
}
