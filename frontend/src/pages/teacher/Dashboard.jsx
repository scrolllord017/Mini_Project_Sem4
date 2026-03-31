import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Clock, Users, Copy, CheckCircle, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/useAuthStore';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const { teacher } = useAuthStore();
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    // Load locally stored quizzes for this teacher since backend doesn't provide GET ALL endpoint
    const stored = JSON.parse(localStorage.getItem(`quizzes_${teacher?.id}`) || '[]');
    setQuizzes(stored.reverse()); // Latest first
    setIsLoading(false);
  }, [teacher?.id]);

  const copyLink = (id) => {
    const link = `${window.location.origin}/quiz/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success('Quiz link copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading your quizzes...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your quizzes and view results.</p>
        </div>
        <Link to="/teacher/create-quiz">
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" /> Create New Quiz
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Quizzes</p>
              <h3 className="text-2xl font-bold text-gray-900">{quizzes.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Quizzes</h2>
        {quizzes.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
            <p className="mb-4">You haven't created any quizzes yet.</p>
            <Link to="/teacher/create-quiz">
              <Button variant="secondary">Create your first quiz</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {quizzes.map((q) => (
              <Card key={q._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{q.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {q.timeLimit ? `${q.timeLimit} mins` : 'No time limit'}
                        <span className="mx-2">•</span>
                        {q.questionsCount} questions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => copyLink(q._id)}
                      className="flex-1"
                    >
                      {copiedId === q._id ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copiedId === q._id ? 'Copied' : 'Copy'}
                    </Button>
                    <Link to={`/teacher/quiz/${q._id}/results`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full">
                        <Users className="w-4 h-4 mr-2" /> Results
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
