import React, { useState, useEffect, useRef } from 'react';
import { Quiz, QuizQuestion, AlertType } from '../types';
import { COINS_QUIZ_COMPLETION, COINS_QUIZ_PERFECT_SCORE_BONUS } from '../constants'; // Import coin constants
import LoadingSpinner from './LoadingSpinner'; // Assuming LoadingSpinner exists

interface SustainabilityQuizModalProps {
  quiz: Quiz;
  isOpen: boolean;
  onClose: () => void;
  onQuizComplete: (quizId: string, score: number, totalQuestions: number, coinsEarnedBase: number) => void;
  addCoins: (amount: number, reason: string, achievementKey?: string, context?: { quizId?: string }) => void;
}

const SustainabilityQuizModal: React.FC<SustainabilityQuizModalProps> = ({
  quiz,
  isOpen,
  onClose,
  onQuizComplete,
  addCoins,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); // { questionId: optionId }
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Record<string, { correct: boolean; explanation: string }>>({});

  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset state when quiz changes or modal opens for a new quiz
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
      setScore(0);
      setFeedback({});
    }
  }, [isOpen, quiz]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
    // Provide immediate feedback if desired, or wait until "Submit Answer"
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswers[currentQuestion.id]) {
        // Optionally, show an alert to select an answer
        alert("Please select an answer.");
        return;
    }

    const isCorrect = selectedAnswers[currentQuestion.id] === currentQuestion.correctOptionId;
    setFeedback(prev => ({
        ...prev,
        [currentQuestion.id]: {
            correct: isCorrect,
            explanation: currentQuestion.explanation,
        }
    }));

    if (isCorrect) {
        setScore(prevScore => prevScore + 1);
    }

    // Optional: Auto-advance or wait for "Next" button
    // setTimeout(() => {
    //   if (currentQuestionIndex < quiz.questions.length - 1) {
    //     setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    //   } else {
    //     handleShowResults();
    //   }
    // }, 1500); // Delay to show feedback
  };


  const handleNextQuestion = () => {
    // Ensure an answer was submitted and feedback shown before proceeding
    if (!feedback[currentQuestion.id]) {
        alert("Please submit your answer first.");
        return;
    }
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      handleShowResults();
    }
  };

  const handleShowResults = () => {
    setShowResults(true);
    let coinsEarned = 0;
    if (quiz.coinsOnCompletion > 0) {
        coinsEarned += quiz.coinsOnCompletion;
        addCoins(quiz.coinsOnCompletion, `Quiz Completion: ${quiz.title}`, undefined, { quizId: quiz.id });
    }
    // The perfect score bonus and first quiz bonus will be handled by the onQuizComplete callback in App.tsx
    onQuizComplete(quiz.id, score, quiz.questions.length, coinsEarned);
  };

  const renderOptions = (question: QuizQuestion) => {
    const questionFeedback = feedback[question.id];
    const selectedOptionId = selectedAnswers[question.id];

    return question.options.map(option => {
      let buttonStyle = "w-full text-left p-3 my-2 rounded-lg border-2 transition-colors duration-150 ";
      if (questionFeedback) { // Answer submitted
        if (option.id === question.correctOptionId) {
          buttonStyle += "bg-green-100 dark:bg-green-700 border-green-500 dark:border-green-400 text-green-700 dark:text-green-200";
        } else if (option.id === selectedOptionId) {
          buttonStyle += "bg-red-100 dark:bg-red-700 border-red-500 dark:border-red-400 text-red-700 dark:text-red-200";
        } else {
          buttonStyle += "bg-slate-50 dark:bg-slate-600 border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-200 opacity-70";
        }
      } else { // Answer not yet submitted
        if (option.id === selectedOptionId) {
          buttonStyle += "bg-sky-100 dark:bg-sky-700 border-sky-500 dark:border-sky-400";
        } else {
          buttonStyle += "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500 hover:border-sky-400 dark:hover:border-sky-300";
        }
      }

      return (
        <button
          key={option.id}
          onClick={() => !questionFeedback && handleOptionSelect(question.id, option.id)}
          className={buttonStyle}
          disabled={!!questionFeedback}
          aria-pressed={option.id === selectedOptionId}
        >
          {option.text}
        </button>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 backdrop-blur-md flex items-center justify-center z-[80] p-4">
      <div ref={modalContentRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            {quiz.title}
          </h2>
          <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-grow">
          {!showResults && currentQuestion ? (
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-4">{currentQuestion.questionText}</h3>
              <div>{renderOptions(currentQuestion)}</div>
              {feedback[currentQuestion.id] && (
                <div className={`mt-3 p-3 rounded-md text-sm ${feedback[currentQuestion.id].correct ? 'bg-green-50 dark:bg-green-800/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-600' : 'bg-red-50 dark:bg-red-800/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-600'}`}>
                  <strong>{feedback[currentQuestion.id].correct ? 'Correct!' : 'Incorrect.'}</strong> {feedback[currentQuestion.id].explanation}
                </div>
              )}
            </div>
          ) : showResults ? (
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Quiz Completed!</h3>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-2">
                Your Score: <span className="font-bold text-sky-600 dark:text-sky-400">{score}</span> / {quiz.questions.length}
              </p>
              <p className="text-lg text-green-600 dark:text-green-400 mb-4">
                You earned {quiz.coinsOnCompletion + (score === quiz.questions.length && quiz.coinsPerfectScoreBonus ? quiz.coinsPerfectScoreBonus : 0)} EcoCoins!
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Check your wallet for other bonuses like 'First Quiz Completed'!
              </p>
            </div>
          ) : (
            <LoadingSpinner text="Loading quiz..." />
          )}
        </div>

        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700">
          {!showResults && currentQuestion ? (
            <>
              {!feedback[currentQuestion.id] ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswers[currentQuestion.id]}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-150 disabled:opacity-60"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-150"
                >
                  {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Show Results'}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 font-medium py-2.5 px-4 rounded-lg transition duration-150"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SustainabilityQuizModal;
