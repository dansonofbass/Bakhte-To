import React, { useState } from 'react';

const DiceGame = () => {
  const [dice1, setDice1] = useState(null);
  const [dice2, setDice2] = useState(null);
  const [result, setResult] = useState('');

  const rollDice = () => {
    // Generate two random numbers between 1 and 10
    const newDice1 = Math.floor(Math.random() * 10) + 1;
    const newDice2 = Math.floor(Math.random() * 10) + 1;
    
    setDice1(newDice1);
    setDice2(newDice2);

    // Check if the numbers are the same
    if (newDice1 === newDice2) {
      setResult('برنده شدید! 🎉');
    } else {
      setResult('دوباره تلاش کنید');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">بازی تاس</h1>
        
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{dice1 || '-'}</div>
            <div className="text-gray-600">تاس اول</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{dice2 || '-'}</div>
            <div className="text-gray-600">تاس دوم</div>
          </div>
        </div>

        <button
          onClick={rollDice}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
        >
          تاس بینداز
        </button>

        {result && (
          <div className="mt-4 text-center text-xl font-semibold">
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiceGame; 