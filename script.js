// Stock Class
class Stock {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    // Fetch stock market data
    async getStockData(symbol) {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;
        console.log(`Fetching stock data from: ${url}`);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch stock data');
            }
            const data = await response.json();
            return data['Global Quote'];
        } catch (error) {
            console.error('Error fetching stock data:', error);
            throw error;
        }
    }
}

// News Class
class News {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    // Fetch news articles about investing
    async getNews() {
        const url = `https://newsapi.org/v2/everything?q=investing&apiKey=${this.apiKey}`;
        console.log(`Fetching news data from: ${url}`);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch news data');
            }
            const data = await response.json();
            return data.articles;
        } catch (error) {
            console.error('Error fetching news data:', error);
            throw error;
        }
    }
}

// Initialize APIs
const stock = new Stock('your_alpha_vantage_api_key_here');
const news = new News('your_news_api_key_here');

// DOM Elements
const stockInput = document.getElementById('stockInput');
const getStockBtn = document.getElementById('getStockBtn');
const stockDetails = document.getElementById('stockDetails');
const newsArticles = document.getElementById('newsArticles');

// Event Listener for button click
getStockBtn.addEventListener('click', async () => {
    const stockSymbol = stockInput.value.trim().toUpperCase();

    if (!stockSymbol) {
        alert('Please enter a stock symbol');
        return;
    }

    console.log('Fetching data for stock symbol:', stockSymbol);

    try {
        // Fetch stock data and news articles
        const [stockData, newsData] = await Promise.all([
            stock.getStockData(stockSymbol),
            news.getNews()
        ]);

        // Display the data
        displayStockData(stockData);
        displayNews(newsData);
    } catch (error) {
        alert('Error fetching data. Check the console for more details.');
    }
});

// Display stock data
function displayStockData(data) {
    console.log('Displaying stock data:', data);
    if (data && Object.keys(data).length > 0) {
        stockDetails.innerHTML = `
            <p><strong>Symbol:</strong> ${data['01. symbol']}</p>
            <p><strong>Price:</strong> $${data['05. price']}</p>
            <p><strong>Change:</strong> ${data['09. change']} (${data['10. change percent']})</p>
        `;
    } else {
        stockDetails.innerHTML = '<p>No stock data available for the provided symbol.</p>';
    }
}

// Display news data
function displayNews(articles) {
    console.log('Displaying news articles:', articles);
    newsArticles.innerHTML = articles.map(article => `
        <div class="news-item">
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available'}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        </div>
    `).join('');
}
