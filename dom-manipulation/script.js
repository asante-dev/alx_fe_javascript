const quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can, with what you have, where you are.", category: "Action" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');



function showRandomQuote( filteredList = quotes){
    const randomIndex = Math.floor(Math.random() * filteredList.length);
    const quote = filteredList[randomIndex];
    quoteDisplay.innerHTML = `
        <blockquote>"${quote.text}"</blockquote>
        <p><strong>Category:</strong> ${quote.category}</p>
  `;
}

// Populate the dropdown menu with unique categories
function populateCategories(){
    const categories = [...new Set(quotes.map(q => q.category))];

 // Reset dropdown
 categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
 
 categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
});

  // Restore saved filter
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuotes(); // Trigger display after restoring filter
  }
}

// Filter quotes based on selected category
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem('selectedCategory', selected);

  if (selected === "all") {
    showRandomQuote(quotes);
  } else {
    const filtered = quotes.filter(q => q.category === selected);
    if (filtered.length === 0) {
      quoteDisplay.innerHTML = "<p>No quotes in this category.</p>";
    } else {
      showRandomQuote(filtered);
    }
  }
}

function createAddQuoteForm(){
    const form = document.createElement('form');
      form.innerHTML = `
    <h2>Add a New Quote</h2>
    <label>
      Quote Text:
      <input type="text" id="quoteText" required>
    </label>
    <br>
    <label>
      Category:
      <input type="text" id="quoteCategory" required>
    </label>
    <br>
    <button type="submit">Add Quote</button>
  `;

  form.addEventListener('submit',function (e) {
    e.preventDefault();
     const text = document.getElementById('quoteText').value.trim();
    const category = document.getElementById('quoteCategory').value.trim();

    if (text && category) {
      quotes.push({ text, category });
      alert("Quote added!");
      form.reset();
    }
  });

  document.body.appendChild(form);
}


// Call this once when the page loads
createAddQuoteForm();

function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');

    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (text && category) {
        quotes.push ({text, category});

         // Save updated quotes to localStorage 
        localStorage.setItem('quotes', JSON.stringify(quotes));


        textInput.value = '';
        categoryInput.value = '';

        populateCategories();
    }
    else {
        alert("Please fill in the fields.");
    }
}

newQuoteButton.addEventListener('click', () => {
  filterQuotes(); // So it shows quote based on selected filter
});

// Initial setup
populateCategories();

async function fetchFromServer() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!res.ok) throw new Error('Network response not ok');
    return await res.json();
  } catch (e) {
    console.error('Fetch error:', e);
    return null;
  }
}

async function sendToServer(quote) {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote),
    });
    if (!res.ok) throw new Error('Server error');
    return await res.json(); // mocked response
  } catch (e) {
    console.error('Send error:', e);
    return null;
  }
}

async function syncWithServer() {
  const serverData = await fetchFromServer();
  if (!serverData) return;

  const serverQuotes = serverData.map(item => ({
    text: item.title, category: item.body
  }));

  const localJson = JSON.stringify(quotes);
  const serverJson = JSON.stringify(serverQuotes);

  if (localJson !== serverJson) {
    quotes = serverQuotes;
    localStorage.setItem('quotes', JSON.stringify(quotes));
    alert('Quotes updated from server');
    populateCategories();
    filterQuotes();
  }
}

// Run sync every minute
setInterval(syncWithServer, 60000);

async function addQuote() {
  // existing input/validation logic...

  quotes.push({ text, category });
  localStorage.setItem('quotes', JSON.stringify(quotes));

  const serverResponse = await sendToServer({ title: text, body: category });
  if (serverResponse) {
    alert('Quote sent to server');
    await syncWithServer(); // ensure match
  }

  textInput.value = '';
  categoryInput.value = '';
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();

    // Simulate quotes by mapping JSONPlaceholder post data
    const serverQuotes = data.slice(0, 10).map(post => ({
      text: post.title,
      category: post.body || "General"
    }));

    return serverQuotes;
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
    return [];
  }
}

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  if (serverQuotes.length === 0) return;

  // Check if local and server data are different
  const localJson = JSON.stringify(quotes);
  const serverJson = JSON.stringify(serverQuotes);

  if (localJson !== serverJson) {
    // Conflict resolution strategy: server wins
    quotes = serverQuotes;
    localStorage.setItem('quotes', JSON.stringify(quotes));

    showSyncMessage("✅ Quotes synced with server!");
    populateCategories();
    filterQuotes();
  }
}

function showSyncMessage(message, duration = 3000) {
  const notice = document.getElementById('syncNotice');
  notice.textContent = message;
  notice.style.display = 'block';

  setTimeout(() => {
    notice.style.display = 'none';
  }, duration);
}

function exportQuotes() {
    // Convert quotes to JSON string
    const dataStr = JSON.stringify(quotes, null, 2);
    
    // Create a Blob with the JSON data
    const blob = new Blob([dataStr], { type: 'application/json' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Set the filename for the download
    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, '-');
    link.download = `quotes-${timestamp}.json`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
