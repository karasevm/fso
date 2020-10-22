import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();

app.use(express.json());
app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  try {
    res.json({
      weight,
      height,
      bmi: calculateBmi(height, weight)
    });
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).json({ error: e.message });
    }
  }
});

interface ExerciseData {
  daily_exercises: Array<number>;
  target: number;
}

app.post('/exercises', (req, res) => {
  const body = req.body as ExerciseData;
  const { daily_exercises, target } = body;

  if (!daily_exercises || !target) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }
  const hours = daily_exercises.map(val => Number(val));
  try {
    res.json(calculateExercises(hours, target));
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).json({ error: e.message });
    }
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
