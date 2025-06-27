const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can, with what you have, where you are.", category: "Action" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');

function showRandomQuote(){
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `
        <blockquote>"${quote.text}"</blockquote>
        <p><strong>Category:</strong> ${quote.category}</p>
  `;
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

// Attach button functionality
newQuoteButton.addEventListener('click', showRandomQuote);

// Call this once when the page loads
createAddQuoteForm();

function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');

    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (text && category) {
        quotes.push ({text, category});

        textInput.value = '';
        categoryInput.value = '';

    }
}