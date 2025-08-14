const API_URL = "https://todo-list-pedro354-pedros-projects-32c0bb0a.vercel.app/"

export default async function getAll() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
}

