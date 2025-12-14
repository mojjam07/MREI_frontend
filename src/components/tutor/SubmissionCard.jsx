import React, { useState } from 'react';
import Button from '../ui/Button';
import { X } from 'lucide-react';

const SubmissionCard = ({ submission, onGrade, grading }) => {
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmitGrade = async () => {
    try {
      await onGrade(submission.id, grade, feedback);
      setShowGradeForm(false);
      setGrade('');
      setFeedback('');
    } catch (error) {
      console.error('Failed to submit grade:', error);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-medium text-gray-800">{submission.assignment?.title}</h4>
          <p className="text-sm text-gray-600">By {submission.student?.username}</p>
          <p className="text-xs text-gray-500">
            Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
          </p>
        </div>
        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
          Pending
        </span>
      </div>
      
      {submission.submission_text && (
        <div className="mb-3">
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-blue-200">
            {submission.submission_text.substring(0, 200)}
            {submission.submission_text.length > 200 && '...'}
          </p>
        </div>
      )}

      {submission.attachment && (
        <div className="mb-3">
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <span>📎</span>
            <span>Attachment: {submission.attachment}</span>
          </div>
        </div>
      )}

      {showGradeForm ? (
        <div className="mt-4 space-y-3 border-t pt-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter grade"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Provide feedback to the student"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleSubmitGrade}
              disabled={!grade || grading}
            >
              {grading ? 'Grading...' : 'Submit Grade'}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowGradeForm(false)}
              disabled={grading}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          size="sm" 
          onClick={() => setShowGradeForm(true)}
          className="w-full"
          disabled={grading}
        >
          {grading ? 'Grading...' : 'Grade Submission'}
        </Button>
      )}
    </div>
  );
};

export default SubmissionCard;
