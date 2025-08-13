export default function handler(req, res) {
  // Sua lógica aqui
  if (req.method === 'GET') {
    res.json({ message: 'Hello from Vercel!' });
  }
}