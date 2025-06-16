import { useState } from "react";
const quizData = {
  javascript: [
    {
      question:
        "What is the output of `console.log(typeof NaN)` in JavaScript?",
      options: ["number", "string", "undefined", "NaN"],
      correct: 0,
      explanation:
        "In JavaScript, NaN is considered a number type, despite standing for 'Not a Number'.",
    },
    {
      question:
        "Which method is used to add an element to the end of an array?",
      options: [
        "array.push()",
        "array.pop()",
        "array.shift()",
        "array.unshift()",
      ],
      correct: 0,
      explanation:
        "The push() method adds one or more elements to the end of an array.",
    },
    {
      question:
        "What does the 'this' keyword refer to in a JavaScript object method?",
      options: [
        "The object itself",
        "The window object",
        "The parent object",
        "It depends on the context",
      ],
      correct: 0,
      explanation:
        "In an object method, 'this' refers to the object that is calling the method.",
    },
  ],
  python: [
    {
      question:
        "What is the correct way to create a virtual environment in Python?",
      options: [
        "python -m venv myenv",
        "python create virtualenv myenv",
        "python setup-env myenv",
        "python virtual myenv",
      ],
      correct: 0,
      explanation:
        "The standard way is using the venv module: `python -m venv myenv`",
    },
    {
      question: "Which of these is NOT a built-in Python data structure?",
      options: ["array", "list", "tuple", "dictionary"],
      correct: 0,
      explanation:
        "Python has list, tuple, dictionary, and set as built-in data structures. 'array' is available via the array module.",
    },
  ],
  java: [
    {
      question: "Which keyword is used to inherit a class in Java?",
      options: ["extends", "implements", "inherits", "super"],
      correct: 0,
      explanation:
        "The 'extends' keyword is used to create a subclass that inherits from another class.",
    },
    {
      question: "What is the default value of a boolean variable in Java?",
      options: ["false", "true", "null", "undefined"],
      correct: 0,
      explanation:
        "In Java, primitive boolean variables default to false if not initialized.",
    },
  ],
  react: [
    {
      question:
        "What is the correct syntax to create a functional component in React?",
      options: [
        "const MyComponent = () => {}",
        "function MyComponent() {}",
        "class MyComponent extends React.Component {}",
        "Both A and B",
      ],
      correct: 3,
      explanation:
        "Both arrow functions and regular functions can be used to create functional components.",
    },
    {
      question:
        "Which hook is used to perform side effects in functional components?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correct: 1,
      explanation:
        "The useEffect hook lets you perform side effects in function components.",
    },
  ],
  css: [
    {
      question:
        "Which property is used to change the text color of an element?",
      options: ["text-color", "font-color", "color", "text-style"],
      correct: 2,
      explanation: "The 'color' property is used to set the color of the text.",
    },
    {
      question: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Creative Style Sheets",
        "Cascading Style Sheets",
        "Colorful Style Sheets",
      ],
      correct: 2,
      explanation: "CSS stands for Cascading Style Sheets.",
    },
  ],
  typescript: [
    {
      question: "What is TypeScript primarily used for?",
      options: [
        "Adding static typing to JavaScript",
        "Replacing JavaScript entirely",
        "Creating server-side applications",
        "Styling web pages",
      ],
      correct: 0,
      explanation: "TypeScript adds optional static typing to JavaScript.",
    },
    {
      question: "Which symbol is used for type assertions in TypeScript?",
      options: [":", "as", "!", "Both A and B"],
      correct: 3,
      explanation:
        "TypeScript supports both angle bracket syntax (<Type>) and 'as' syntax for type assertions.",
    },
  ],
  csharp: [
    {
      question: "What is the entry point of a C# program?",
      options: [
        "Main() method",
        "Start() method",
        "Initialize() method",
        "Program() constructor",
      ],
      correct: 0,
      explanation: "The Main method is the entry point of a C# application.",
    },
  ],
  php: [
    {
      question: "Which symbol is used to prefix all PHP variables?",
      options: ["!", "#", "$", "&"],
      correct: 2,
      explanation: "PHP variables must be prefixed with the dollar sign ($).",
    },
  ],
};

export function QuizInterface({ language, onBackToLanguages, onQuizComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const questions = quizData[language];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const selectAnswer = (optionIndex) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    setSelectedAnswer(optionIndex);
    const isCorrect = optionIndex === currentQuestion.correct;

    const newAnswer = {
      selected: optionIndex,
      correct: isCorrect,
    };

    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = newAnswer;
    setUserAnswers(newUserAnswers);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      onQuizComplete(score, questions.length);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      const prevAnswer = userAnswers[currentQuestionIndex - 1];
      setSelectedAnswer(prevAnswer?.selected ?? null);
      setShowFeedback(prevAnswer !== undefined);
    }
  };

  const getOptionClass = (index) => {
    let baseClass =
      "w-full text-left p-4 rounded-xl border-2 transition-all duration-200";

    if (selectedAnswer === null) {
      return `${baseClass} border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 bg-gray-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600`;
    }

    if (index === currentQuestion.correct) {
      return `${baseClass} border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900 animate-pulse-success`;
    } else if (
      index === selectedAnswer &&
      selectedAnswer !== currentQuestion.correct
    ) {
      return `${baseClass} border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900 animate-pulse-error`;
    } else {
      return `${baseClass} border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-700`;
    }
  };

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
              {score}/{currentQuestionIndex + (selectedAnswer !== null ? 1 : 0)}
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
              disabled={selectedAnswer !== null}
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
      </div>

      {/* Answer Feedback */}
      {showFeedback && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-4">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                selectedAnswer === currentQuestion.correct
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              <i
                className={`fas ${
                  selectedAnswer === currentQuestion.correct
                    ? "fa-check"
                    : "fa-times"
                } text-white`}
              ></i>
            </div>
            <div className="flex-1">
              <h4
                className={`text-lg font-semibold mb-2 ${
                  selectedAnswer === currentQuestion.correct
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {selectedAnswer === currentQuestion.correct
                  ? "Correct!"
                  : "Incorrect"}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>
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
          disabled={selectedAnswer === null}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {currentQuestionIndex === questions.length - 1 ? (
            <>
              Finish Quiz
              <i className="fas fa-flag-checkered ml-2"></i>
            </>
          ) : (
            <>
              Next
              <i className="fas fa-chevron-right ml-2"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
