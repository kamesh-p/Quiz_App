import { useState, useEffect } from 'react';

export function LanguageSelection({ onLanguageSelect }) {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8082/api/language');
      
      if (!response.ok) {
        throw new Error('Failed to fetch languages');
      }
      
      const data = await response.json();
      setLanguages(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching languages:', err);
      setError('Failed to load languages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in text-center py-12">
        <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading languages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in text-center py-12">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl p-6 max-w-md mx-auto">
          <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
          <p className="text-red-700 dark:text-red-200 mb-4">{error}</p>
          <button
            onClick={fetchLanguages}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <i className="fas fa-redo mr-2"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Choose Your Programming Language
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Test your knowledge with our comprehensive quiz. Each language has challenging questions to help you assess your skills.
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
            Each quiz contains multiple questions with immediate feedback
          </span>
        </div>
      </div>
    </div>
  );
}