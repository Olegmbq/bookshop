import axios from "axios";

const API_URL = "https://www.googleapis.com/books/v1/volumes";

export async function fetchBooks(category, startIndex = 0, maxResults = 6) {
  const res = await axios.get(API_URL, {
    params: { q: `subject:${category}`, startIndex, maxResults }
  });
  return res.data.items || [];
}
