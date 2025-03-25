import React, { useState, useEffect } from "react";
import supabase from "../../../config/supabaseClient";
import "./index.css";

const PhysicQuestionExam = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [correctQuestions, setCorrectQuestions] = useState([]);
    const [incorrectQuestions, setIncorrectQuestions] = useState([]);
    const [profileId, setProfileId] = useState(null);
    const [examRecordId, setExamRecordId] = useState(null);
    const [attemptNumber, setAttemptNumber] = useState(1);
    const [resumeData, setResumeData] = useState(null);

    useEffect(() => {
        const initializeExam = async () => {
            const storedProfileId = localStorage.getItem('profileId');
            
            if (!storedProfileId) {
                console.error('No profile ID found');
                return;
            }

            setProfileId(parseInt(storedProfileId, 10));

            // Check for existing incomplete exam
            await checkIncompleteExam(parseInt(storedProfileId, 10));
        };

        initializeExam();
    }, []);

    const checkIncompleteExam = async (profileId) => {
        // Find the most recent incomplete exam record
        const { data: incompleteExam, error } = await supabase
            .from('exam_records')
            .select('*, user_answers(*)')
            .eq('user_id', profileId)
            .eq('exam_type', 'Physics')
            .is('end_time', null)
            .order('start_time', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            console.error('Error checking incomplete exam:', error);
            return;
        }

        if (incompleteExam) {
            // Determine attempt number
            const { count: completedAttempts, error: attemptsError } = await supabase
                .from('exam_records')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', profileId)
                .eq('exam_type', 'Physics')
                .not('end_time', 'is', null);

            if (!attemptsError) {
                setAttemptNumber(completedAttempts + 1);
            }

            // Prepare resume data
            setResumeData({
                examRecordId: incompleteExam.id,
                answeredQuestions: incompleteExam.user_answers,
                startedQuestions: incompleteExam.total_questions,
                lastAnsweredIndex: incompleteExam.last_answered_index || 0
            });
        } else {
            // If no incomplete exam, set attempt number based on completed exams
            const { count: completedAttempts, error: attemptsError } = await supabase
                .from('exam_records')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', profileId)
                .eq('exam_type', 'Physics')
                .not('end_time', 'is', null);

            if (!attemptsError) {
                setAttemptNumber(completedAttempts + 1);
            }
        }
    };

    const fetchQuestionsWithSubquestions = async () => {
        // Fetch main questions in a fixed order
        let { data: mainQuestions, error: mainQuestionsError } = await supabase
            .from("questions")
            .select("*")
            .eq('category', 'Physics')
            .order('id')  // Ensure consistent order
            .limit(50);  // Limit to 50 questions

        if (mainQuestionsError) {
            console.error("Error fetching main questions:", mainQuestionsError);
            return;
        }

        // Fetch subquestions for each main question
        const questionsWithSubquestions = await Promise.all(
            mainQuestions.map(async (mainQuestion) => {
                let { data: subQuestions, error: subQuestionsError } = await supabase
                    .from("subquestions")
                    .select("*")
                    .eq('parent_id', mainQuestion.id)
                    .order('id', { ascending: true });

                if (subQuestionsError) {
                    console.error(`Error fetching subquestions for main question ${mainQuestion.id}:`, subQuestionsError);
                    return mainQuestion;
                }

                return {
                    ...mainQuestion,
                    subQuestions: subQuestions || []
                };
            })
        );

        // If there's a resume data, set the initial state accordingly
        if (resumeData) {
            // Populate initial selected answers from previous attempt
            const initialSelectedAnswers = {};
            const lastAnsweredIndex = resumeData.lastAnsweredIndex;

            questionsWithSubquestions.forEach((question, questionIndex) => {
                if (questionIndex <= lastAnsweredIndex) {
                    question.subQuestions.forEach((subQuestion, subQuestionIndex) => {
                        const key = `${questionIndex}-${subQuestionIndex}`;
                        
                        // Check if this subquestion was previously answered
                        const previousAnswer = resumeData.answeredQuestions.find(
                            ans => ans.subquestion_id === subQuestion.id
                        );

                        if (previousAnswer) {
                            initialSelectedAnswers[key] = [previousAnswer.user_answer];
                        }
                    });
                }
            });

            setSelectedAnswers(initialSelectedAnswers);
            setExamRecordId(resumeData.examRecordId);
            setCurrentIndex(lastAnsweredIndex);
        } else {
            // Create a new exam record if no resume data
            if (profileId) {
                const { data, error } = await supabase
                    .from('exam_records')
                    .insert({
                        user_id: profileId,
                        exam_type: 'Physics',
                        start_time: new Date(),
                        total_questions: questionsWithSubquestions.length,
                        attempt_number: attemptNumber,
                        last_answered_index: 0
                    })
                    .select()
                    .single();

                if (error) {
                    console.error('Error creating exam record:', error);
                    return;
                }

                setExamRecordId(data.id);
            }
        }

        setQuestions(questionsWithSubquestions);
    };

    useEffect(() => {
        if (profileId) {
            fetchQuestionsWithSubquestions();
        }
    }, [profileId]);

    const handleSelectAnswer = (questionIndex, subQuestionIndex, value) => {
        const key = `${questionIndex}-${subQuestionIndex}`;
        setSelectedAnswers(prev => ({
            ...prev,
            [key]: [value]
        }));
    };

    const saveUserAnswer = async (subQuestionId, userAnswer, isCorrect) => {
        if (!examRecordId) return;

        const { error } = await supabase
            .from('user_answers')
            .upsert({
                exam_record_id: examRecordId,
                subquestion_id: subQuestionId,
                user_answer: userAnswer,
                is_correct: isCorrect
            }, {
                onConflict: 'exam_record_id,subquestion_id'
            });

        if (error) {
            console.error('Error saving user answer:', error);
        }
    };

    const handleSubmit = async () => {
        setSubmitted(true);

        const currentQuestion = questions[currentIndex];
        const subQuestionResults = await Promise.all(
            currentQuestion.subQuestions.map(async (subQuestion, subQuestionIndex) => {
                const key = `${currentIndex}-${subQuestionIndex}`;
                const userAnswer = selectedAnswers[key]?.[0];
                const correctAnswer = subQuestion.subquestion_answer;

                const isCorrect = userAnswer === correctAnswer;

                // Save each subquestion answer
                await saveUserAnswer(subQuestion.id, userAnswer, isCorrect);

                return isCorrect;
            })
        );

        // Update last answered index in exam record
        await updateLastAnsweredIndex(currentIndex);

        // Check if all sub-questions are correct
        const isQuestionFullyCorrect = subQuestionResults.every(result => result === true);

        if (isQuestionFullyCorrect) {
            setCorrectAnswersCount(prev => prev + 1);
            setCorrectQuestions(prev => [...prev, currentIndex]);
        } else {
            setIncorrectQuestions(prev => [...prev, currentIndex]);
        }
    };

    const updateLastAnsweredIndex = async (index) => {
        if (!examRecordId) return;

        const { error } = await supabase
            .from('exam_records')
            .update({ last_answered_index: index })
            .eq('id', examRecordId);

        if (error) {
            console.error('Error updating last answered index:', error);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setSubmitted(false);

            // Prepare selected answers for the new question
            const newSelectedAnswers = {...selectedAnswers};
            questions[nextIndex].subQuestions.forEach((_, subQuestionIndex) => {
                const key = `${nextIndex}-${subQuestionIndex}`;
                if (!newSelectedAnswers[key]) {
                    newSelectedAnswers[key] = null;
                }
            });
            setSelectedAnswers(newSelectedAnswers);
        } else {
            // Update exam record when exam is completed
            updateExamRecord();
            setShowResults(true);
        }
    };

    const updateExamRecord = async () => {
        if (!examRecordId) return;

        const { error } = await supabase
            .from('exam_records')
            .update({
                end_time: new Date(),
                correct_answers: correctAnswersCount,
                score: ((correctAnswersCount / questions.length) * 100).toFixed(1),
                last_answered_index: questions.length - 1
            })
            .eq('id', examRecordId);

        if (error) {
            console.error('Error updating exam record:', error);
        }
    };

    const areAllSubQuestionsAnswered = () => {
        const currentQuestion = questions[currentIndex];
        return currentQuestion.subQuestions.every((_, subQuestionIndex) => 
            selectedAnswers[`${currentIndex}-${subQuestionIndex}`] !== undefined &&
            selectedAnswers[`${currentIndex}-${subQuestionIndex}`] !== null
        );
    };

    return (
        <div className="question-display-container" style={{ 
            backgroundColor: "white", 
            minHeight: "100vh", 
            padding: "24px", 
            display: "flex", 
            fontFamily: "Poppins",
        }}>
            <div className="sidebar" style={{ 
                flex: "30%", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                padding: "16px" 
            }}>
                <div className="score-section" style={{ 
                    textAlign: "center", 
                    marginBottom: "16px" 
                }}>
                    <h3>Attempt Number: {attemptNumber}</h3>
                    <h3>Score: {((correctAnswersCount / questions.length) * 100).toFixed(1)}%</h3>
                    <h4>Points: {correctAnswersCount} / {questions.length}</h4>
                </div>

                <ul className="progress-bar">
                    {questions.map((_, index) => {
                        let statusClass = "upcoming";

                        if (index === currentIndex) {
                            statusClass = "active";
                        } else if (correctQuestions.includes(index)) {
                            statusClass = "correct";
                        } else if (incorrectQuestions.includes(index)) {
                            statusClass = "wrong";
                        }

                        return (
                            <li key={index} className={`progress-item ${statusClass}`}>
                                Q{index + 1}
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="question-content" style={{ 
                flex: "70%", 
                paddingLeft: "16px", 
                maxWidth: "70%", 
                alignSelf: "flex-start", 
                flexShrink: 0, 
                flexGrow: 0 
            }}>
                {!showResults ? (
                    questions.length > 0 && (
                        <div>
                            <h2>{questions[currentIndex].question_text}</h2>

                            {questions[currentIndex].subQuestions.map((subQuestion, subQuestionIndex) => {
                                const key = `${currentIndex}-${subQuestionIndex}`;
                                const userAnswer = selectedAnswers[key]?.[0];
                                const correctAnswer = subQuestion.subquestion_answer;  // Changed from correct_answer to subquestion_answer

                                let resultClass = "";
                                if (submitted) {
                                    resultClass = userAnswer === correctAnswer 
                                        ? "correct" 
                                        : "wrong";
                                }

                                return (
                                    <div key={subQuestionIndex} style={{ 
                                        marginBottom: '15px', 
                                        padding: '10px', 
                                        border: '1px solid #ddd',
                                        borderRadius: '5px'
                                    }}>
                                        <h3>{subQuestion.subquestion_text}</h3>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            {['True', 'False'].map((option) => (
                                                <div 
                                                    key={option} 
                                                    className={`option ${
                                                        submitted 
                                                            ? (option === correctAnswer 
                                                                ? "correct" 
                                                                : (userAnswer === option ? "wrong" : ""))
                                                            : ""
                                                    }`}
                                                    style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        padding: '10px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '5px'
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`answer-${subQuestionIndex}`}
                                                        value={option}
                                                        checked={userAnswer === option}
                                                        disabled={submitted}
                                                        onChange={() => handleSelectAnswer(currentIndex, subQuestionIndex, option)}
                                                    />
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {submitted && (
                                            <div style={{ marginTop: '10px' }}>
                                                <strong>Explanation:</strong>
                                                <div dangerouslySetInnerHTML={{ __html: subQuestion.subquestion_explanation }} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {!submitted ? (
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={!areAllSubQuestionsAnswered()}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: areAllSubQuestionsAnswered() ? '#4CAF50' : '#cccccc',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: areAllSubQuestionsAnswered() ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    Submit
                                </button>
                            ) : (
                                <button 
                                    onClick={handleNext}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#2196F3',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Next Question
                                </button>
                            )}

                            {/* Main question explanation (if any) */}
                            {submitted && questions[currentIndex].explanation && (
                                <div style={{ marginTop: '20px' }}>
                                    <h3>Main Question Explanation</h3>
                                    <div dangerouslySetInnerHTML={{ __html: questions[currentIndex].explanation }} />
                                </div>
                            )}
                        </div>
                    )
                ) : (
                    <div>
                        <h2>Results</h2>
                        <p>Correct Answers: {correctAnswersCount}/{questions.length}</p>
                        <div className="results-details">
                            {questions.map((q, index) => (
                                <div key={index} style={{ marginBottom: '15px' }}>
                                    <h3>Q{index + 1}: {q.question_text}</h3>
                                    {q.subQuestions.map((subQ, subIndex) => (
                                        <div key={subIndex}>
                                            <p><strong>Sub Q{subIndex + 1}:</strong> {subQ.question_text}</p>
                                            <p><strong>Correct Answer:</strong> {subQ.subquestion_answer}</p>
                                            <div dangerouslySetInnerHTML={{ __html: subQ.explanation }} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhysicQuestionExam;