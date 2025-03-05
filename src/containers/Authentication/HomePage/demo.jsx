import React, { useState, useEffect } from "react";
import supabase from "../../../config/supabaseClient";
import "./index.css";
import BackButton from "../../../components/Button/BackArrowButton";
import Toast from "../../../components/Toast";
import SingleSelect from "../../../components/Input/SingleSelect";

const QuestionDisplay = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            // Fetch all sequence data
            let { data: sequenceData, error: sequenceError } = await supabase
                .from("tbl_sequence")
                .select("*");
    
            if (sequenceError) {
                console.error("Error fetching sequence:", sequenceError);
                return;
            }
    
            // Extract all question IDs from `sequence` array in each object
            const questionIds = sequenceData.flatMap(item => item.sequence.map(seq => seq.id));
    
            // Fetch questions based on extracted IDs
            let { data: questionsData, error: questionsError } = await supabase
                .from("questions")
                .select("*")
                .in("id", questionIds);
    
            if (questionsError) {
                console.error("Error fetching questions:", questionsError);
                return;
            }
    
            // Shuffle the questions
            const shuffledQuestions = shuffleArray(questionsData);
    
            // Set state with shuffled questions
            setQuestions(shuffledQuestions);
        };
    
        fetchQuestions();
    }, []);
    
    
    // Fisher-Yates Shuffle Algorithm
    const shuffleArray = (array) => {
        let shuffled = [...array]; // Copy array to avoid mutating the original
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
        }
        return shuffled;
    };
    

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowResults(true);
        }
    };

    const handleSelectAnswer = (value) => {
        const currentQuestion = questions[currentIndex];
        if (currentQuestion.question_type === "multiple") {
            setSelectedAnswers(prev => {
                const updated = prev[currentIndex] ? [...prev[currentIndex]] : [];
                if (updated.includes(value)) {
                    return { ...prev, [currentIndex]: updated.filter(v => v !== value) };
                } else {
                    return { ...prev, [currentIndex]: [...updated, value] };
                }
            });
        } else {
            setSelectedAnswers({ ...selectedAnswers, [currentIndex]: [value] });
        }
    };

    const handleShowExplanation = () => {
        setShowExplanation(true);
    };

    const correctAnswersCount = Object.keys(selectedAnswers).reduce((count, index) => {
        const question = questions[index];
        const userAnswerRaw = selectedAnswers[index] || [];

        // Convert userAnswer to an array if it's not already
        const userAnswer = Array.isArray(userAnswerRaw) ? userAnswerRaw : [userAnswerRaw];

        // Convert correct_answer into an array if it's a string
        let correctAnswer;
        try {
            correctAnswer = typeof question.correct_answer === "string"
                ? question.correct_answer.includes(",")
                    ? question.correct_answer.split(",").map(a => a.trim())  // Convert comma-separated string to array
                    : [question.correct_answer]  // Convert single value to array
                : question.correct_answer;
        } catch (error) {
            console.error("Error parsing correct_answer:", error);
            correctAnswer = [];
        }

        // Ensure correctAnswer is always an array
        if (!Array.isArray(correctAnswer)) correctAnswer = [correctAnswer];

        // Compare sorted arrays
        const isCorrect = JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswer.sort());

        return isCorrect ? count + 1 : count;

        
    }, 0);

    return (
        <div className="question-display-container" style={{ backgroundColor: "white", minHeight: "100vh", padding: "24px" }}>
            <BackButton to="/admin/bookings" />
            <div className="question-progress">
                <ul className="progress-bar">
                    {questions.map((_, index) => {
                        let className = "progress-item";
                        if (index < currentIndex) className += " completed"; // Previous questions
                        else if (index === currentIndex) className += " active"; // Current question
                        else className += " upcoming"; // Future questions

                        return <li key={index} className={className}>Q{index + 1}</li>;
                    })}
                </ul>
            </div>


            <div className="question-content" style={{ marginLeft: "24px", marginRight: "24px" }}>
                {!showResults ? (
                    questions.length > 0 && (
                        <div>
                            <h2>{questions[currentIndex].question_text}</h2>
                            {questions[currentIndex].question_type === "single" || questions[currentIndex].question_type === "multiple" ? (
                                <div>
                                    {JSON.parse(questions[currentIndex].options).map((optionText, index) => {
                                        const letter = String.fromCharCode(65 + index);
                                        return (
                                            <div key={index} className={`option ${showResults && JSON.parse(questions[currentIndex].correct_answer).includes(letter) ? "correct" : ""} ${showResults && selectedAnswers[currentIndex] && !JSON.parse(questions[currentIndex].correct_answer).includes(selectedAnswers[currentIndex]) ? "wrong" : ""}`}>
                                                <input
                                                    type={questions[currentIndex].question_type === "multiple" ? "checkbox" : "radio"}
                                                    name="answer"
                                                    value={letter}
                                                    checked={questions[currentIndex].question_type === "multiple" ? selectedAnswers[currentIndex]?.includes(letter) : selectedAnswers[currentIndex]?.[0] === letter}
                                                    onChange={() => handleSelectAnswer(letter)}
                                                />
                                                {letter}. {optionText}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : questions[currentIndex].question_type === "trueFalse" ? (
                                <div>
                                    {["True", "False"].map((option, index) => (
                                        <div key={index} className="option">
                                            <input
                                                type="radio"
                                                name="answer"
                                                value={option}
                                                checked={selectedAnswers[currentIndex]?.[0] === option}
                                                onChange={() => handleSelectAnswer(option)}
                                            />
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            <button onClick={handleNext} disabled={!selectedAnswers[currentIndex]}>
                                {currentIndex < questions.length - 1 ? "Next" : "Submit"}
                            </button>
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
