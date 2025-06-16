import { useState } from "react";
import { ResultsScreen } from "./ResultsScreen";
import { QuizInterface } from "./QuizInterface";
import { LanguageSelection } from "./LanguageSelection";
// import useTheme from "./useTheme";

export default function Quiz() {
  const [quizState, setQuizState] = useState("language-selection");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [finalScore, setFinalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  // const { theme, toggleTheme } = useTheme();

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setQuizState("quiz");
  };

  const handleBackToLanguages = () => {
    setQuizState("language-selection");
    setSelectedLanguage("");
  };

  const handleQuizComplete = (score, total) => {
    setFinalScore(score);
    setTotalQuestions(total);
    setQuizState("results");
  };

  const handleRetakeQuiz = () => {
    setQuizState("quiz");
  };

  const handleSelectNewLanguage = () => {
    setQuizState("language-selection");
    setSelectedLanguage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <header className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-code text-white text-lg"></i>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quiz Camp
            </h1>
          </div>
          <button
            // onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          ></button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {quizState === "language-selection" && (
          <LanguageSelection onLanguageSelect={handleLanguageSelect} />
        )}

        {quizState === "quiz" && selectedLanguage && (
          <QuizInterface
            language={selectedLanguage}
            onBackToLanguages={handleBackToLanguages}
            onQuizComplete={handleQuizComplete}
          />
        )}

        {quizState === "results" && selectedLanguage && (
          <ResultsScreen
            language={selectedLanguage}
            score={finalScore}
            totalQuestions={totalQuestions}
            onRetakeQuiz={handleRetakeQuiz}
            onSelectNewLanguage={handleSelectNewLanguage}
          />
        )}
      </main>
    </div>
  );
}
