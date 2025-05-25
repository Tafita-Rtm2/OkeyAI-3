// New API endpoint and parameters
const API_BASE_URL = "https://kaiz-apis.gleeze.com/api/gpt-4o-pro";
const API_KEY = "793fcf57-8820-40ea-b34e-7addd227e2e6";
const UID = "1"; // Static UID

async function runChat(prompt, imageUrl = "") {
  // Construct the API URL with query parameters
  const apiUrl = `${API_BASE_URL}?ask=${encodeURIComponent(prompt)}&uid=${UID}&imageUrl=${encodeURIComponent(imageUrl)}&apikey=${API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    // The API returns a JSON like: { "author": "Kaizenji", "response": "Hello! 😊 \nকেমন আছো? ..." }
    // Return the 'response' field.
    return data.response;
  } catch (error) {
    console.error("Failed to fetch from API:", error);
    // Return a generic error message or rethrow, depending on desired error handling
    return "Sorry, I couldn't get a response. Please try again.";
  }
}

export default runChat;
