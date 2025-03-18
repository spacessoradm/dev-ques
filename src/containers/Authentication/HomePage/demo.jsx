import React, { useState, useEffect } from "react";
import supabase from "../../../config/supabaseClient";
import "./index.css";


const QuestionDisplay = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0); // Only increase after submission
    const [correctQuestions, setCorrectQuestions] = useState([]);
    const [incorrectQuestions, setIncorrectQuestions] = useState([]);


    useEffect(() => {
        const fetchQuestions = async () => {
            let { data: questionsData, error: questionsError } = await supabase
                .from("questions")
                .select("*")
                .neq('question_type', 'subq');

            if (questionsError) {
                console.error("Error fetching questions:", questionsError);
                return;
            }

            setQuestions(shuffleArray(questionsData));
        };

        fetchQuestions();
    }, []);

    const shuffleArray = (array) => {
        let shuffled = [...array]; 
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; 
        }
        return shuffled;
    };

    const handleSelectAnswer = (value) => {
        const currentQuestion = questions[currentIndex];
        if (currentQuestion.question_type === "multiple") {
            setSelectedAnswers(prev => {
                const updated = prev[currentIndex] ? [...prev[currentIndex]] : [];
                return { ...prev, [currentIndex]: updated.includes(value) ? updated.filter(v => v !== value) : [...updated, value] };
            });
        } else {
            setSelectedAnswers({ ...selectedAnswers, [currentIndex]: [value] });
        }
    };

    const handleSubmit2 = () => {
        setSubmitted(true);
        setShowExplanation(true);

        const question = questions[currentIndex];
        const userAnswerRaw = selectedAnswers[currentIndex] || [];
        const userAnswer = Array.isArray(userAnswerRaw) ? userAnswerRaw : [userAnswerRaw];

        let correctAnswer;
        try {
            correctAnswer = typeof question.correct_answer === "string"
                ? question.correct_answer.includes(",")
                    ? question.correct_answer.split(",").map(a => a.trim()) 
                    : [question.correct_answer] 
                : question.correct_answer;
        } catch (error) {
            console.error("Error parsing correct_answer:", error);
            correctAnswer = [];
        }

        if (!Array.isArray(correctAnswer)) correctAnswer = [correctAnswer];

        const isCorrect = JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswer.sort());

        if (isCorrect) {
            setCorrectAnswersCount(prev => prev + 1);
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);
        setShowExplanation(true);
    
        const question = questions[currentIndex];
        const userAnswerRaw = selectedAnswers[currentIndex] || [];
        const userAnswer = Array.isArray(userAnswerRaw) ? userAnswerRaw : [userAnswerRaw];
    
        let correctAnswer;
        try {
            correctAnswer = typeof question.correct_answer === "string"
                ? question.correct_answer.includes(",")
                    ? question.correct_answer.split(",").map(a => a.trim()) 
                    : [question.correct_answer] 
                : question.correct_answer;
        } catch (error) {
            console.error("Error parsing correct_answer:", error);
            correctAnswer = [];
        }
    
        if (!Array.isArray(correctAnswer)) correctAnswer = [correctAnswer];
    
        const isCorrect = JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswer.sort());
    
        if (isCorrect) {
            setCorrectAnswersCount(prev => prev + 1);
            setCorrectQuestions(prev => [...prev, currentIndex]); // Store correct question index
        } else {
            setIncorrectQuestions(prev => [...prev, currentIndex]); // Store incorrect question index
        }
    };
    

    const handleNext = () => {
        setSubmitted(false);
        setShowExplanation(false);
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowResults(true);
        }
    };

    const handleShowExplanation = () => {
        setShowExplanation(true);
    };

    return (
        <div className="question-display-container" style={{ backgroundColor: "white", minHeight: "100vh", padding: "24px", display: "flex" }}>
            <div className="sidebar" style={{ flex: "30%", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px" }}>
                <div className="score-section" style={{ textAlign: "center", marginBottom: "16px" }}>
                    <h3>Score: {((correctAnswersCount / questions.length) * 100).toFixed(1)}%</h3>
                    <h4>Points: {correctAnswersCount} / {questions.length}</h4>
                </div>

                <ul className="progress-bar">
                    {questions.map((_, index) => {
                        let statusClass = "upcoming"; // Default: Gray

                        if (index === currentIndex) {
                            statusClass = "active"; // Blue for current question
                        } else if (correctQuestions.includes(index)) {
                            statusClass = "correct"; // Green if correctly answered
                        } else if (incorrectQuestions.includes(index)) {
                            statusClass = "wrong"; // Red if incorrectly answered
                        }

                        return (
                            <li key={index} className={`progress-item ${statusClass}`}>
                                Q{index + 1}
                            </li>
                        );
                    })}
                </ul>

            </div>

            <div className="question-content" style={{ flex: "70%", 
                paddingLeft: "16px", 
                maxWidth: "70%",  // Ensures it does not exceed 70% width
                alignSelf: "flex-start", // Prevents it from stretching
                flexShrink: 0, // Prevents shrinking when space is available
                flexGrow: 0, }}>
                {!showResults ? (
                    questions.length > 0 && (
                        <div>
                            <h2>{questions[currentIndex].question_text}</h2>

                            {(() => {
                                let correctAnswers = [];
                                try {
                                    if (Array.isArray(questions[currentIndex].correct_answer)) {
                                        // If already an array, use it directly
                                        correctAnswers = questions[currentIndex].correct_answer;
                                    } else if (typeof questions[currentIndex].correct_answer === "string") {
                                        // If it's a comma-separated string like "A,B", split it into an array
                                        correctAnswers = questions[currentIndex].correct_answer.includes(",")
                                            ? questions[currentIndex].correct_answer.split(",").map(a => a.trim()) 
                                            : [questions[currentIndex].correct_answer]; 
                                    }
                                } catch (error) {
                                    console.error("Invalid correct_answer format:", error);
                                }
                                
                                return JSON.parse(questions[currentIndex].options).map((optionText, index) => {
                                    const letter = String.fromCharCode(65 + index); // A, B, C, D
                                    const isCorrect = correctAnswers.includes(letter);
                                    const isSelected = selectedAnswers[currentIndex]?.includes(letter);
                                    const isIncorrect = isSelected && !isCorrect;

                                    return (
                                        <div key={index} 
                                            className={`option 
                                                ${submitted ? (isCorrect ? "correct" : isIncorrect ? "wrong" : "") : ""}`}>
                                            <input
                                                type={questions[currentIndex].question_type === "multiple" ? "checkbox" : "radio"}
                                                name="answer"
                                                value={letter}
                                                checked={isSelected}
                                                disabled={submitted} 
                                                onChange={() => handleSelectAnswer(letter)}
                                            />
                                            {letter}. {optionText}
                                        </div>
                                    );
                                });
                            })()}

                            {!submitted ? (
                                <button onClick={handleSubmit} disabled={!selectedAnswers[currentIndex]}>
                                    Submit
                                </button>
                            ) : (
                                <button disabled style={{ display: "none" }}>Submitted</button>
                            )}

                            {submitted && (
                                <button onClick={handleNext}>Next</button>
                            )}

                            {submitted && showExplanation && (
                                <div className="explanation">
                                    <h3>Explanation</h3>
                                    <div style={{padding: '12px'}} dangerouslySetInnerHTML={{ __html: questions[currentIndex].explanation }} />
                                </div>
                            )}

                        </div>
                    )
                ) : (
                    <div>
                        <h2>Results</h2>
                        <p>Correct Answers: {correctAnswersCount}/{questions.length}</p>
                        <button onClick={handleShowExplanation}>Show Explanations</button>
                        {showExplanation && (
                            <div className="explanation-container">
                                {questions.map((q, index) => (
                                    <div key={index} className="explanation-card">
                                        <h3>Q{index + 1}: {q.question_text}</h3>
                                        <p><strong>Correct Answer:</strong> {q.correct_answer}</p>
                                        <div dangerouslySetInnerHTML={{ __html: q.explanation }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionDisplay;
