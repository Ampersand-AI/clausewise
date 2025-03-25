import express from 'express';
import cors from 'cors';
import { analyzeDocument } from '../src/api/ai';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    const result = await analyzeDocument(text);
    res.json(result);
  } catch (error) {
    console.error('Error analyzing document:', error);
    res.status(500).json({ error: 'Failed to analyze document' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 