import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../../config/supabaseClient';
import './index.css';
import './PreviewQ.css';
import Toast from '../../../components/Toast';

const PreviewPhysicQuestion = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [subquestions, setSubquestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toastInfo, setToastInfo] = useState({ visible: false, message: '', type: '' });
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showExplanations, setShowExplanations] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const showToast = (message, type) => {
        setToastInfo({ visible: true, message, type });
        setTimeout(() => setToastInfo({ visible: false, message: '', type: '' }), 3000);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);

            // Fetch main question
            const { data: mainQuestion, error: questionError } = await supabase
                .from("questions")
                .select("*")
                .eq("id", id)
                .single();

            // Fetch subquestions related to the main question
            const { data: subquestionsData, error: subquestionsError } = await supabase
                .from("subquestions")
                .select("*")
                .eq("parent_id", id);

            if (questionError || subquestionsError) {
                console.error("Error fetching data:", questionError || subquestionsError);
                showToast("Error loading question", "error");
            } else {
                // Parse correct answers if stored as a string
                const parsedSubquestions = subquestionsData.map(sub => ({
                    ...sub,
                    correct_answer: sub.correct_answer === "true" ? "true" : "false"
                }));

                setQuestion(mainQuestion);
                setSubquestions(parsedSubquestions);
            }

            setLoading(false);
        };

        fetchData();
    }, [id]);

    const handleSelectAnswer = (subId, answer) => {
        if (submitted) return; // Prevent changes after submission
        setSelectedAnswers(prev => ({
            ...prev,
            [subId]: answer
        }));
    };

    const handleSubmit = () => {
        if (Object.keys(selectedAnswers).length === subquestions.length) {
            setShowExplanations(true);
            setSubmitted(true);
            showToast("All answers submitted!", "success");
        } else {
            showToast("Please answer all subquestions before submitting", "error");
        }
    };

    return (
        <div className="container">
            <div className='venue-container'>
                {loading && <p>Loading question...</p>}
                {toastInfo.visible && <Toast message={toastInfo.message} type={toastInfo.type} />}

                {question && (
                    <div className="card">
                        <div className="card-header">
                            <h3>Question Preview</h3>
                        </div>
                        <div className="card-body">
                            <h3>{question.question_text}</h3>

                            {/* Display subquestions */}
                            {subquestions.map((sub, index) => {
                                const userAnswer = selectedAnswers[sub.id];
                                const isCorrect = userAnswer === sub.correct_answer;
                                const highlightCorrect = submitted && sub.correct_answer;
                                const highlightUserWrong = submitted && userAnswer && !isCorrect;

                                return (
                                    <div key={sub.id} className="subquestion">
                                        <h4>{index + 1}. {sub.subquestion_text}</h4>

                                        <div className="options-group">
                                            <label className={`options ${highlightCorrect === "true" ? "correct-answer" : ""} ${highlightUserWrong && userAnswer === "true" ? "wrong-answer" : ""}`}>
                                                <input
                                                    type="radio"
                                                    name={`subquestion-${sub.id}`}
                                                    value="true"
                                                    checked={userAnswer === "true"}
                                                    onChange={() => handleSelectAnswer(sub.id, "true")}
                                                    disabled={submitted}
                                                />
                                                True
                                            </label>

                                            <label className={`options ${highlightCorrect === "false" ? "correct-answer" : ""} ${highlightUserWrong && userAnswer === "false" ? "wrong-answer" : ""}`}>
                                                <input
                                                    type="radio"
                                                    name={`subquestion-${sub.id}`}
                                                    value="false"
                                                    checked={userAnswer === "false"}
                                                    onChange={() => handleSelectAnswer(sub.id, "false")}
                                                    disabled={submitted}
                                                />
                                                False
                                            </label>
                                        </div>

                                        {/* Explanation (hidden until submitted) */}
                                        {showExplanations && (
                                            <div className="explanations-box">
                                                <h4>Explanation</h4>
                                                <p dangerouslySetInnerHTML={{ __html: sub.subquestion_explanation || "No explanation provided." }} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Main Question Explanation */}
                            {showExplanations && question.explanation && (
                                <div className="explanation-box">
                                    <h4>Question Explanation</h4>
                                    <p dangerouslySetInnerHTML={{ __html: question.explanation }} />
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={Object.keys(selectedAnswers).length !== subquestions.length || submitted}
                                className="submit-button"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviewPhysicQuestion;
