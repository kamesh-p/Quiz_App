export function LanguageSelection({ onLanguageSelect }) {
  const languages = [
    {
      id: "javascript",
      name: "JavaScript",
      icon: "fab fa-js-square",
      color: "from-yellow-400 to-orange-500",
      iconColor: "text-yellow-500",
      description: "Test your JS fundamentals and ES6+ features",
    },
    {
      id: "python",
      name: "Python",
      icon: "fab fa-python",
      color: "from-blue-400 to-green-500",
      iconColor: "text-blue-500",
      description: "Explore Python syntax and core concepts",
    },
    {
      id: "java",
      name: "Java",
      icon: "fab fa-java",
      color: "from-red-400 to-orange-500",
      iconColor: "text-red-600",
      description: "Challenge your Java and OOP knowledge",
    },
    {
      id: "react",
      name: "React",
      icon: "fab fa-react",
      color: "from-cyan-400 to-blue-500",
      iconColor: "text-cyan-500",
      description: "Test your React hooks and component skills",
    },
    {
      id: "css",
      name: "CSS",
      icon: "fab fa-css3-alt",
      color: "from-purple-400 to-pink-500",
      iconColor: "text-purple-500",
      description: "Master CSS layouts and modern techniques",
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Choose Your Programming Language
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Test your knowledge with our comprehensive quiz. Each language has 10
          challenging questions to help you assess your skills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {languages.map((language) => (
          <button
            key={language.id}
            onClick={() => onLanguageSelect(language.id)}
            className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${language.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            ></div>
            <div className="relative z-10">
              <i
                className={`${language.icon} text-5xl ${language.iconColor} mb-4`}
              ></i>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {language.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <i className="fas fa-info-circle"></i>
          <span className="text-sm">
            Each quiz contains 10 questions with immediate feedback
          </span>
        </div>
      </div>
    </div>
  );
}
