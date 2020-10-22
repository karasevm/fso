const calculateBmi = (height: number, weight: number): string => {
  if (isNaN(height) || isNaN(weight) || height < 0 || weight < 0) {
    throw new Error('malformatted parameters');
  }

  const bmi = (weight * 10000) / (height * height);

  if (bmi < 15) {
    return 'Very severely underweight';
  }
  if (bmi < 16) {
    return 'Severely underweight';
  }
  if (bmi < 18.5) {
    return 'Underweight';
  }
  if (bmi < 25) {
    return 'Normal (healthy weight)';
  }
  if (bmi < 30) {
    return 'Overweight';
  }
  if (bmi < 35) {
    return 'Obese Class I (Moderately obese)';
  }
  if (bmi < 30) {
    return 'Obese Class II (Severely obese)';
  }
  return 'Obese Class III (Very severely obese)';
};

export { calculateBmi };
