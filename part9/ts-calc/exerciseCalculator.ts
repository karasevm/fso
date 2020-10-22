interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (hours: Array<number>, target: number): Result => {
  for (const v of hours) {
    if (isNaN(v)) {
      throw new Error('malformatted parameters');
    }
  }
  if (isNaN(target)) {
    throw new Error('malformatted parameters');
  }
  const average = hours.reduce((sum, val) => sum + val) / hours.length;
  const delta = average - target;

  let rating = 1;
  let ratingDescription = 'poor performance';

  if (delta > -1) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  }
  if (delta > 0) {
    rating = 3;
    ratingDescription = 'great performance, target achieved';
  }
  return {
    periodLength: hours.length,
    trainingDays: hours.filter(day => day).length,
    success: delta >= 0,
    rating,
    ratingDescription,
    target,
    average
  };
};

export { calculateExercises };
