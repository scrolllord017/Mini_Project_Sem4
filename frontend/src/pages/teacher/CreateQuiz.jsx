import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useQuizStore from '../../store/useQuizStore';
import useAuthStore from '../../store/useAuthStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';

export default function CreateQuiz() {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      timeLimit: '',
      questions: [
        { questionText: '', options: ['', '', '', ''], correctOptionIndex: '0' }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });

  const { createQuiz } = useQuizStore();
  const { teacher } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      // Format questions array properly
      const formattedQuestions = data.questions.map(q => ({
        ...q,
        correctOptionIndex: parseInt(q.correctOptionIndex, 10)
      }));

      const payload = {
        title: data.title,
        timeLimit: data.timeLimit ? parseInt(data.timeLimit, 10) : null,
        questions: formattedQuestions
      };

      const res = await createQuiz(payload);
      
      // Extract quiz ID from "quizLink": "/quiz/653..."
      const newQuizId = res.quizLink.split('/').pop();

      // Save to local storage for the dashboard
      const stored = JSON.parse(localStorage.getItem(`quizzes_${teacher.id}`) || '[]');
      stored.push({
        _id: newQuizId,
        title: payload.title,
        timeLimit: payload.timeLimit,
        questionsCount: payload.questions.length,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(`quizzes_${teacher.id}`, JSON.stringify(stored));

      toast.success('Quiz created successfully!');
      navigate('/teacher/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create quiz');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create Quiz</h1>
        <p className="text-gray-500 mt-1">Design your quiz with multiple choice questions.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Quiz Details */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Quiz Title"
                placeholder="e.g. Midterm Physics"
                error={errors.title?.message}
                {...register('title', { required: 'Title is required' })}
              />
              <Input
                label="Time Limit (minutes)"
                type="number"
                placeholder="e.g. 30 (Optional)"
                {...register('timeLimit', { min: 1 })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ questionText: '', options: ['', '', '', ''], correctOptionIndex: '0' })}
              className="gap-2"
            >
              <Plus className="w-4 h-4" /> Add Question
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="relative overflow-visible">
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute -right-3 -top-3 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors shadow-sm"
                  title="Remove question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Q{index + 1}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <Input
                    label="Question Text"
                    placeholder="Enter your question here..."
                    error={errors?.questions?.[index]?.questionText?.message}
                    {...register(`questions.${index}.questionText`, { required: 'Required' })}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {[0, 1, 2, 3].map((optIndex) => (
                      <div key={optIndex} className="relative">
                        <Input
                          label={`Option ${optIndex + 1}`}
                          className="pl-10"
                          error={errors?.questions?.[index]?.options?.[optIndex]?.message}
                          {...register(`questions.${index}.options.${optIndex}`, { required: 'Required' })}
                        />
                        <div className="absolute top-[34px] left-3">
                          <input
                            type="radio"
                            value={optIndex}
                            className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                            {...register(`questions.${index}.correctOptionIndex`)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Select the radio button next to the correct option.</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" size="lg" isLoading={isLoading} className="gap-2 px-8">
            <Save className="w-5 h-5" /> Save & Create
          </Button>
        </div>
      </form>
    </div>
  );
}
