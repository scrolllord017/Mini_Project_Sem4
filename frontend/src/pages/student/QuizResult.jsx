import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Trophy, Home, Percent } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function QuizResult() {
  const location = useLocation();
  const state = location.state || { score: 0, total: 0 };
  
  const percentage = Math.round((state.score / state.total) * 100) || 0;

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="bg-primary-600 h-32 flex items-center justify-center relative">
          <div className="absolute -bottom-10 bg-white p-4 rounded-full border-4 border-white shadow-xl">
            <div className="bg-primary-100 p-4 rounded-full text-primary-600">
               <Trophy className="w-10 h-10" />
            </div>
          </div>
        </div>
        <CardContent className="pt-16 pb-8 px-6 text-center space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Quiz Completed!</h1>
            <p className="text-gray-500 mt-2">Your submission has been recorded successfully.</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Final Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-primary-600">{state.score}</span>
              <span className="text-2xl font-bold text-gray-400">/ {state.total}</span>
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
              <Percent className="w-4 h-4" /> {percentage}% Accuracy
            </div>
          </div>

          <div className="pt-4">
            <Link to="/">
              <Button className="w-full gap-2 text-primary-700 bg-primary-50 hover:bg-primary-100">
                <Home className="w-4 h-4" /> Return to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
