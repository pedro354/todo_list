const API_URL = "https://todo-list-gold-chi.vercel.app/"

export default async function getAll() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
}

