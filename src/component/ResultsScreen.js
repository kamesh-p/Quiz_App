export function ResultsScreen({
  language,
  score,
  totalQuestions,
  onRetakeQuiz,
  onSelectNewLanguage,
}) {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getPerformanceData = () => {
    if (percentage >= 90) {
      return {
        message: "Outstanding! You're a master!",
        iconClass: "fas fa-trophy text-yellow-500",
      };
    } else if (percentage >= 80) {
      return {
        message: "Excellent work!",
        iconClass: "fas fa-star text-blue-500",
      };
    } else if (percentage >= 70) {
      return {
        message: "Good job! Keep practicing!",
        iconClass: "fas fa-thumbs-up text-green-500",
      };
    } else if (percentage >= 60) {
      return {
        message: "Not bad! Room for improvement.",
        iconClass: "fas fa-chart-line text-orange-500",
      };
    } else {
      return {
        message: "Keep studying and try again!",
        iconClass: "fas fa-book text-purple-500",
      };
    }
  };

  const performanceData = getPerformanceData();

  return (
    <div className="animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
            <i className={`${performanceData.iconClass} text-3xl`}></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Quiz Complete!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            You've finished the{" "}
            <span className="font-semibold">
              {language.charAt(0).toUpperCase() + language.slice(1)}
            </span>{" "}
            quiz
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 rounded-xl p-6 mb-8">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {score}/{totalQuestions}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-300">
              {percentage}% Correct
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium text-green-600 dark:text-green-400">
                {performanceData.message}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetakeQuiz}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            <i className="fas fa-redo mr-2"></i>
            Retake Quiz
          </button>
          <button
            onClick={onSelectNewLanguage}
            className="px-8 py-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200"
          >
            <i className="fas fa-code mr-2"></i>
            Try Another Language
          </button>
        </div>
      </div>
    </div>
  );
}
