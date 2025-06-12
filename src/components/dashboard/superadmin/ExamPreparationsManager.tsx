
import React from 'react';
import ImprovedExamPreparationsManager from './ImprovedExamPreparationsManager';

interface ExamPreparationsManagerProps {
  examId: string;
  onUpdate?: () => void;
}

const ExamPreparationsManager = ({ examId, onUpdate }: ExamPreparationsManagerProps) => {
  return <ImprovedExamPreparationsManager examId={examId} onUpdate={onUpdate} />;
};

export default ExamPreparationsManager;
