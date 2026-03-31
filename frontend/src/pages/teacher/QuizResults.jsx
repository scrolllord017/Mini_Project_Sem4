import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import useQuizStore from '../../store/useQuizStore';
import { Card, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function QuizResults() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const branchFilter = searchParams.get('branch') || '';
  
  const { results, getQuizResults } = useQuizStore();
  const [isLoading, setIsLoading] = useState(true);
  const [branchInput, setBranchInput] = useState(branchFilter);

  useEffect(() => {
    fetchResults(branchFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, branchFilter]);

  const fetchResults = async (branch) => {
    try {
      setIsLoading(true);
      await getQuizResults(id, branch);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    if (branchInput.trim()) {
      setSearchParams({ branch: branchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link to="/teacher/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
         <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quiz Results</h1>
          <p className="text-gray-500 mt-1">View student submissions and scores.</p>
        </div>

        <form onSubmit={handleFilter} className="flex items-end gap-2">
          <Input 
            placeholder="Filter by branch (e.g. CSE)" 
            value={branchInput}
            onChange={(e) => setBranchInput(e.target.value)}
            className="w-48"
          />
          <Button type="submit" variant="secondary" className="px-3">
             <Filter className="w-4 h-4" />
          </Button>
        </form>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">Loading results...</div>
          ) : results.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No submissions found {branchFilter && `for branch "${branchFilter}"`}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Rank</th>
                    <th className="px-6 py-4 font-medium">Student Name</th>
                    <th className="px-6 py-4 font-medium">Roll No</th>
                    <th className="px-6 py-4 font-medium">Branch</th>
                    <th className="px-6 py-4 font-medium text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((sub, index) => (
                    <tr key={sub._id} className="bg-white hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {sub.studentName}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {sub.rollNo}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                          {sub.branch}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-primary-600">
                        {sub.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
