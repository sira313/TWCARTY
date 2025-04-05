// Fetch the search data
async function fetchSearchData() {
  try {
    const response = await fetch('/search-data.json');
    const searchData = await response.json();
    return searchData;
  } catch (error) {
    console.error('Error loading search data:', error);
    return null;
  }
}

// Generic search function to filter data across multiple categories
function searchDataAcrossCategories(searchData, query, categories) {
  const results = [];

  categories.forEach((category) => {
    if (searchData[category] && Array.isArray(searchData[category])) {
      searchData[category].forEach((item) => {
        if (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        ) {
          results.push(item);
        }
      });
    }
  });

  return results;
}

// Event listener for the search input
document.getElementById('search-input').addEventListener('input', async function () {
  const query = this.value.toLowerCase();
  const resultsContainer = document.getElementById('search-results');
  
  // Display message when input is empty
  if (query.length === 0) {
    resultsContainer.innerHTML = '<p class="text-center text-base-conten">All content will show here</p>';
    resultsContainer.classList.remove('hidden');
    return;
  }

  // Remove hidden class when query length is sufficient
  if (query.length >= 3) {
    const searchData = await fetchSearchData();
    if (searchData) {
      const categories = ['blog', 'photos', 'unduhan', 'personil', 'visiMisi', 'profil']; // Categories to search
      const results = searchDataAcrossCategories(searchData, query, categories);
      
      if (results.length > 0) {
        displaySearchResults(results);
        resultsContainer.classList.remove('hidden'); // Show results container when there are results
      } else {
        resultsContainer.innerHTML = '<p class="text-error text-center">Did not found any</p>';
        resultsContainer.classList.remove('hidden'); // Show the container with no results message
      }
    } else {
      resultsContainer.innerHTML = '<p class="text-red-500 text-center">Error loading search data</p>';
      resultsContainer.classList.remove('hidden'); // Show error message
    }
  } else {
    // Show the default message when query is too short
    resultsContainer.innerHTML = '<p class="text-center text-base-content">All content will show here</p>';
    resultsContainer.classList.remove('hidden');
  } 
});

// Function to display the search results
function displaySearchResults(results) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = ''; // Clear previous results

  results.forEach((result) => {
    const resultItem = document.createElement('div');
    resultItem.classList.add('the-result');

    resultItem.innerHTML = `
      <p class="text-md sm:text-lg font-bold mb-2 text-primary">
        <a class="link link-hover" href="${result.url}">${result.title}</a>
      </p>
      <p class="text-sm sm:text-md mb-2">${result.description}</p>
      <p class="text-sm"><span class="badge badge-accent">${result.category}</span> - ${result.date}</p>
    `;

    resultsContainer.appendChild(resultItem);
  });
}

// Initialize the results container with the initial message
document.addEventListener('DOMContentLoaded', () => {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = '<p class="text-center text-base-content">All content will show here</p>';
  resultsContainer.classList.remove('hidden'); // Show the message initially
});

// Clear search input when clicking outside the search results
document.addEventListener('click', function (event) {
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');

  // Check if the click is outside the search input and results container
  if (!searchInput.contains(event.target) && !resultsContainer.contains(event.target)) {
    searchInput.value = ''; // Clear search input
    resultsContainer.innerHTML = '<p class="text-center text-base-content">All content will show here</p>';
    resultsContainer.classList.remove('hidden'); // Reset to the initial message
  }
});
