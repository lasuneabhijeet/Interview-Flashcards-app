import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shuffle, Check, RotateCcw } from 'lucide-react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface FlashcardData {
  [key: string]: Flashcard[];
}

const flashcardData: FlashcardData = {
  Java: [
    {
      id: 'java-1',
      question: 'What is the difference between JDK, JRE, and JVM?',
      answer: 'JDK (Java Development Kit) is a complete software development kit for Java, including JRE and development tools. JRE (Java Runtime Environment) provides libraries and JVM to run Java applications. JVM (Java Virtual Machine) is an abstract machine that executes Java bytecode.',
    },
    {
      id: 'java-2',
      question: 'Explain the concept of Object-Oriented Programming in Java.',
      answer: 'OOP in Java is based on four main principles: Encapsulation (bundling data and methods), Inheritance (creating new classes from existing ones), Polymorphism (objects taking many forms), and Abstraction (hiding complex implementation details).',
    },
    {
      id: 'java-3',
      question: 'What is the difference between == and equals() in Java?',
      answer: '== compares object references (memory addresses) for equality, while equals() compares the actual content/values of objects. For primitives, == compares values. equals() is a method that can be overridden to define custom equality logic.',
    },
    {
      id: 'java-4',
      question: 'What is a Java Stream and why is it useful?',
      answer: 'Java Stream is a sequence of elements supporting sequential and parallel aggregate operations. It provides a functional approach to process collections of objects, enabling operations like filter, map, reduce without modifying the original data source.',
    },
    {
      id: 'java-5',
      question: 'Explain the difference between ArrayList and LinkedList.',
      answer: 'ArrayList uses a dynamic array internally, providing fast random access (O(1)) but slower insertions/deletions in the middle (O(n)). LinkedList uses a doubly-linked list, providing faster insertions/deletions (O(1)) but slower random access (O(n)).',
    },
  ],
  SQL: [
    {
      id: 'sql-1',
      question: 'What is the difference between WHERE and HAVING clauses?',
      answer: 'WHERE filters rows before grouping and cannot use aggregate functions. HAVING filters groups after GROUP BY and can use aggregate functions. WHERE is applied to individual rows, HAVING is applied to grouped results.',
    },
    {
      id: 'sql-2',
      question: 'Explain the different types of JOINs in SQL.',
      answer: 'INNER JOIN returns matching rows from both tables. LEFT JOIN returns all rows from left table and matching rows from right. RIGHT JOIN returns all rows from right table and matching rows from left. FULL OUTER JOIN returns all rows from both tables. CROSS JOIN returns Cartesian product.',
    },
    {
      id: 'sql-3',
      question: 'What is database normalization and why is it important?',
      answer: 'Normalization is the process of organizing data to reduce redundancy and improve data integrity. It involves dividing large tables into smaller ones and defining relationships. Common forms are 1NF (atomic values), 2NF (no partial dependencies), and 3NF (no transitive dependencies).',
    },
    {
      id: 'sql-4',
      question: 'What is the difference between DELETE and TRUNCATE?',
      answer: 'DELETE removes rows one by one, can use WHERE clause, triggers fire, can be rolled back, and is slower. TRUNCATE removes all rows at once, cannot use WHERE, triggers do not fire, cannot be rolled back (in some databases), and is faster.',
    },
    {
      id: 'sql-5',
      question: 'Explain what a database index is and its benefits.',
      answer: 'An index is a data structure that improves the speed of data retrieval operations on a table. It works like a book index, allowing the database to find data without scanning the entire table. Benefits include faster SELECT queries, but drawbacks include slower INSERT/UPDATE/DELETE operations and additional storage space.',
    },
  ],
  DSA: [
    {
      id: 'dsa-1',
      question: 'What is the time complexity of Binary Search?',
      answer: 'Binary Search has a time complexity of O(log n) for searching in a sorted array. It works by repeatedly dividing the search interval in half. Space complexity is O(1) for iterative implementation and O(log n) for recursive implementation due to call stack.',
    },
    {
      id: 'dsa-2',
      question: 'Explain the difference between Stack and Queue.',
      answer: 'Stack follows LIFO (Last In First Out) principle - the last element added is the first to be removed. Queue follows FIFO (First In First Out) principle - the first element added is the first to be removed. Stack uses push/pop operations, Queue uses enqueue/dequeue.',
    },
    {
      id: 'dsa-3',
      question: 'What is a Hash Table and how does it work?',
      answer: 'A Hash Table is a data structure that implements an associative array, mapping keys to values. It uses a hash function to compute an index into an array of buckets. Average time complexity for search, insert, and delete is O(1). Collisions are handled using chaining or open addressing.',
    },
    {
      id: 'dsa-4',
      question: 'Explain the difference between BFS and DFS.',
      answer: 'BFS (Breadth-First Search) explores nodes level by level using a queue. It finds the shortest path in unweighted graphs. DFS (Depth-First Search) explores as far as possible along each branch using a stack/recursion. BFS uses more memory but guarantees shortest path.',
    },
    {
      id: 'dsa-5',
      question: 'What is the time complexity of QuickSort?',
      answer: 'QuickSort has an average time complexity of O(n log n) and worst-case of O(n²) when the pivot is poorly chosen (e.g., already sorted array). Space complexity is O(log n) due to recursion stack. It is generally faster than other O(n log n) algorithms due to good cache locality.',
    },
  ],
};

interface Progress {
  [cardId: string]: 'known' | 'revise' | null;
}

function App() {
  const [selectedTopic, setSelectedTopic] = useState<string>('Java');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState<Progress>({});

  const currentCards = flashcardData[selectedTopic] || [];
  const currentCard = currentCards[currentIndex];

  useEffect(() => {
    const savedProgress = localStorage.getItem('flashcard-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flashcard-progress', JSON.stringify(progress));
  }, [progress]);

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const handleNext = () => {
    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * currentCards.length);
    setCurrentIndex(randomIndex);
    setShowAnswer(false);
  };

  const handleMarkKnown = () => {
    setProgress({
      ...progress,
      [currentCard.id]: 'known',
    });
  };

  const handleMarkRevise = () => {
    setProgress({
      ...progress,
      [currentCard.id]: 'revise',
    });
  };

  const stats = currentCards.reduce(
    (acc, card) => {
      if (progress[card.id] === 'known') acc.known++;
      if (progress[card.id] === 'revise') acc.revise++;
      return acc;
    },
    { known: 0, revise: 0 }
  );

  const currentStatus = progress[currentCard?.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Interview Flashcards
          </h1>
          <p className="text-gray-400">Master your technical interview preparation</p>
        </header>

        <div className="mb-6">
          <label htmlFor="topic-select" className="block text-sm font-medium mb-2 text-gray-300">
            Select Topic
          </label>
          <select
            id="topic-select"
            value={selectedTopic}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="Java">Java</option>
            <option value="SQL">SQL</option>
            <option value="DSA">Data Structures & Algorithms</option>
          </select>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 mb-6 border border-gray-700">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-400">
                Card {currentIndex + 1} of {currentCards.length}
              </span>
              {currentStatus && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentStatus === 'known'
                      ? 'bg-green-900/50 text-green-300 border border-green-700'
                      : 'bg-orange-900/50 text-orange-300 border border-orange-700'
                  }`}
                >
                  {currentStatus === 'known' ? 'Known' : 'Revise Later'}
                </span>
              )}
            </div>

            <div className="min-h-[200px] flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white leading-relaxed">
                {currentCard?.question}
              </h2>

              {showAnswer && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 animate-fadeIn">
                  <p className="text-gray-300 leading-relaxed text-lg">{currentCard?.answer}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex-1 min-w-[100px] bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <button
              onClick={handleShuffle}
              className="flex-1 min-w-[100px] bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Shuffle size={20} />
              Shuffle
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === currentCards.length - 1}
              className="flex-1 min-w-[100px] bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleMarkKnown}
              className={`font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                currentStatus === 'known'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 hover:bg-green-600 text-white'
              }`}
            >
              <Check size={20} />
              Know it
            </button>

            <button
              onClick={handleMarkRevise}
              className={`font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                currentStatus === 'revise'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700 hover:bg-orange-600 text-white'
              }`}
            >
              <RotateCcw size={20} />
              Revise later
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-white">Progress Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-1">{stats.known}</div>
              <div className="text-sm text-gray-400">Known</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="text-3xl font-bold text-orange-400 mb-1">{stats.revise}</div>
              <div className="text-sm text-gray-400">Revise Later</div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Your progress is automatically saved in your browser</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
