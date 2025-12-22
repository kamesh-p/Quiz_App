import { useState, useEffect } from "react";

export function QuizInterface({ language, onBackToLanguages, onQuizComplete }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  useEffect(() => {
    fetchQuizzesByCategory();
  }, [language]);

  const fetchQuizzesByCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8082/api/quizzes/category/${language}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch quizzes for ${language}`);
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error(`No questions found for ${language}`);
      }
      
      setQuestions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError(err.message || 'Failed to load quiz questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    setShowFeedback(false);
    setApiResult(null);
  };

  const submitAnswer = async () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    const submission = {
      quizId: currentQuestion.id,
      selectedOption: selectedAnswer
    };

    try {
      setSubmitting(true);
      const response = await fetch('http://localhost:8082/api/quizzes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission)
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const result = await response.json();
      setApiResult(result);

      
      const newAnswer = {
        selected: selectedAnswer,
        correct: result.correct,
        explanation: result.explanation,
        correctOption: result.correctOption
      };

      const newUserAnswers = [...userAnswers];
      newUserAnswers[currentQuestionIndex] = newAnswer;
      setUserAnswers(newUserAnswers);

      if (result.correct) {
        setScore((prev) => prev + 1);
      }

      setShowFeedback(true);
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError(err.message || 'Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      onQuizComplete(score, questions.length);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setApiResult(null);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      const prevAnswer = userAnswers[currentQuestionIndex - 1];
      setSelectedAnswer(prevAnswer?.selected ?? null);
      setShowFeedback(prevAnswer !== undefined);
      setApiResult(prevAnswer ? {
        correct: prevAnswer.correct,
        correctOption: prevAnswer.correctOption,
        explanation: prevAnswer.explanation,
        quizId: questions[currentQuestionIndex - 1]?.id
      } : null);
    }
  };

  const getOptionClass = (index) => {
    let baseClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200";

    if (!showFeedback) {
      // Before submission
      if (selectedAnswer === index) {
        return `${baseClass} border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900`;
      } else {
        return `${baseClass} border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 bg-gray-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600`;
      }
    }

    // After submission (feedback shown)
    if (index === apiResult?.correctOption) {
      return `${baseClass} border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900`;
    } else if (index === selectedAnswer && !apiResult?.correct) {
      return `${baseClass} border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900`;
    } else {
      return `${baseClass} border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-700`;
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in text-center py-12">
        <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading quiz questions...</p>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="animate-fade-in text-center py-12">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl p-6 max-w-md mx-auto">
          <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
          <p className="text-red-700 dark:text-red-200 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchQuizzesByCategory}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <i className="fas fa-redo mr-2"></i>
              Retry
            </button>
            <button
              onClick={onBackToLanguages}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="animate-slide-up">
      {/* Quiz Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToLanguages}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <i className="fas fa-arrow-left text-gray-600 dark:text-gray-300"></i>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {language.charAt(0).toUpperCase() + language.slice(1)} Quiz
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Score
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {score}/{currentQuestionIndex + (showFeedback ? 1 : 0)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => selectAnswer(index)}
              disabled={showFeedback}
              className={getOptionClass(index)}
            >
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {String.fromCharCode(65 + index)})
              </span>
              <span className="ml-3 text-gray-800 dark:text-gray-100">
                {option}
              </span>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            onClick={submitAnswer}
            disabled={selectedAnswer === null || submitting || showFeedback}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
              selectedAnswer === null || submitting || showFeedback
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-700 dark:text-gray-300'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Checking Answer...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2"></i>
                Submit Answer
              </>
            )}
          </button>
        </div>
      </div>

      {/* Answer Feedback from API */}
      {showFeedback && apiResult && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
          <div className="flex items-start space-x-4">
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                apiResult.correct
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-red-500 to-rose-600"
              }`}
            >
              <i
                className={`fas ${
                  apiResult.correct ? "fa-check" : "fa-times"
                } text-white text-xl`}
              ></i>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h4
                  className={`text-xl font-bold ${
                    apiResult.correct
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {apiResult.correct ? "Correct Answer! 🎉" : "Incorrect Answer"}
                </h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Quiz ID: {apiResult.quizId}
                </span>
              </div>
              
              {!apiResult.correct && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                    <i className="fas fa-lightbulb mr-2"></i>
                    The correct answer was: <span className="font-semibold">
                      {String.fromCharCode(65 + apiResult.correctOption)})
                    </span>
                  </p>
                </div>
              )}
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Explanation:</span> {apiResult.explanation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-chevron-left mr-2"></i>
          Previous
        </button>

        <button
          onClick={nextQuestion}
          disabled={!showFeedback}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {currentQuestionIndex === questions.length - 1 ? (
            <>
              Finish Quiz
              <i className="fas fa-flag-checkered ml-2"></i>
            </>
          ) : (
            <>
              Next Question
              <i className="fas fa-chevron-right ml-2"></i>
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && questions.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl animate-fade-in">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-red-500 mr-3"></i>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}