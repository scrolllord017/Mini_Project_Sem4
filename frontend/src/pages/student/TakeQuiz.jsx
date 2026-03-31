import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Clock, Play, CheckCircle } from 'lucide-react';
import useQuizStore from '../../store/useQuizStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentQuiz, getQuizById, submitQuiz } = useQuizStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form for student info
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        await getQuizById(id);
      } catch (error) {
        toast.error('Quiz not found or link is invalid.');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [id, getQuizById, navigate]);

  // Timer logic
  useEffect(() => {
    if (hasStarted && timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinalSubmit(answers, studentInfo); // Auto submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [hasStarted, timeLeft]);

  const onStart = (data) => {
    setStudentInfo(data);
    setAnswers(new Array(currentQuiz.questions.length).fill(-1));
    if (currentQuiz.timeLimit) {
      setTimeLeft(currentQuiz.timeLimit * 60); // Convert mins to seconds
    }
    setHasStarted(true);
  };

  const handleOptionSelect = (qIndex, optIndex) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optIndex;
    setAnswers(newAnswers);
  };

  const handleFinalSubmit = async (finalAnswers, info) => {
    // Check if all answered
    if (finalAnswers.includes(-1) && timeLeft > 0) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        studentName: info.name,
        rollNo: info.rollNo,
        branch: info.branch,
        answers: finalAnswers
      };
      const res = await submitQuiz(id, payload);
      toast.success('Quiz submitted!');
      navigate(`/quiz/${id}/result`, { state: { score: res.score, total: currentQuiz.questions.length }});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Quiz...</div>;
  if (!currentQuiz) return <div className="p-8 text-center text-red-500">Quiz not found.</div>;

  if (!hasStarted) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{currentQuiz.title}</CardTitle>
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2 mt-2">
              <Clock className="w-4 h-4" /> 
              {currentQuiz.timeLimit ? `${currentQuiz.timeLimit} Minutes` : 'No time limit'}
              <span className="mx-1">•</span>
              {currentQuiz.questions.length} Questions
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onStart)} className="space-y-4 pt-4">
              <Input
                label="Full Name"
                placeholder="e.g. Alice Smith"
                error={errors.name?.message}
                {...register('name', { required: 'Name is required' })}
              />
              <Input
                label="Roll Number"
                placeholder="e.g. CS2201"
                error={errors.rollNo?.message}
                {...register('rollNo', { required: 'Roll Number is required' })}
              />
              <Input
                label="Branch"
                placeholder="e.g. Computer Science"
                error={errors.branch?.message}
                {...register('branch', { required: 'Branch is required' })}
              />
              <Button type="submit" className="w-full mt-6 gap-2" size="lg">
                <Play className="w-4 h-4" /> Start Quiz
              </Button>
              <p className="text-xs text-center text-gray-400 mt-2">
                Clicking start will begin the timer immediately.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz Interface
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 w-full">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm sticky top-20 z-10 mb-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{currentQuiz.title}</h2>
          <p className="text-sm text-gray-500">{studentInfo.name} ({studentInfo.rollNo})</p>
        </div>
        {timeLeft !== null && (
          <div className={`font-mono text-xl font-bold flex items-center gap-2 ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-primary-600'}`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {currentQuiz.questions.map((q, qIndex) => (
          <Card key={qIndex} className="overflow-visible">
            <CardContent className="p-6">
              <div className="flex gap-4 mb-6">
                <div className="bg-primary-100 text-primary-700 min-w-[32px] h-[32px] flex items-center justify-center rounded-full text-sm font-bold">
                  {qIndex + 1}
                </div>
                <h3 className="text-lg font-medium text-gray-900 pt-1">{q.questionText}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                {q.options.map((opt, optIndex) => {
                  const isSelected = answers[qIndex] === optIndex;
                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleOptionSelect(qIndex, optIndex)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-50 text-primary-900 shadow-sm' 
                          : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-primary-500 bg-primary-500 text-white' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="font-medium">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button 
          size="lg" 
          className="px-10 gap-2" 
          onClick={() => handleFinalSubmit(answers, studentInfo)}
          isLoading={isSubmitting}
        >
          <CheckCircle className="w-5 h-5" /> Submit Quiz
        </Button>
      </div>
    </div>
  );
}
