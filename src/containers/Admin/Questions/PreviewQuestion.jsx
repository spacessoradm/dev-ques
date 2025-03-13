import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../../config/supabaseClient';
import './index.css';
import './PreviewQ.css';
import Toast from '../../../components/Toast';

const PreviewQuestion = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toastInfo, setToastInfo] = useState({ visible: false, message: '', type: '' });
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showExplanation, setShowExplanation] = useState(false);
  
    const showToast = (message, type) => {
      setToastInfo({ visible: true, message, type });
      setTimeout(() => setToastInfo({ visible: false, message: '', type: '' }), 3000);
    };
  
    useEffect(() => {
      const fetchQuestion = async () => {
        if (!id) return;
  
        setLoading(true);
        const { data, error } = await supabase
          .from("questions")
          .select("*")
          .eq("id", id)
          .single();
  
        if (error) {
          console.error("Error fetching question:", error);
          showToast("Error loading question", "error");
        } else {
          let options = data.options;
          if (typeof options === "string") {
            try {
              options = JSON.parse(options); // If stored as JSON string
            } catch {
              options = options.split(",").map(opt => opt.trim()); // If stored as CSV string
            }
          }
          setQuestion({ ...data, options });
        }
        setLoading(false);
      };
  
      fetchQuestion();
    }, [id]);
  
    const handleSelectAnswer = (letter) => {
      if (!question) return;
      const { question_type } = question;
  
      setSelectedAnswers((prev) => {
        if (question_type === "multiple") {
          return {
            ...prev,
            [id]: prev[id]?.includes(letter) 
              ? prev[id].filter((l) => l !== letter) 
              : [...(prev[id] || []), letter],
          };
        } else {
          return { ...prev, [id]: [letter] };
        }
      });
    };
  
    const handleSubmit = () => {
      setShowExplanation(true);
      showToast("Answer Submitted", "success");
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
  
                {["single", "multiple"].includes(question.question_type) && (
                  <div>
                    {question.options.map((optionText, index) => {
                      const letter = String.fromCharCode(65 + index);
                      return (
                        <div key={index} className="option">
                          <input
                            type={question.question_type === "multiple" ? "checkbox" : "radio"}
                            name="answer"
                            value={letter}
                            checked={question.question_type === "multiple"
                              ? Array.isArray(selectedAnswers[id]) && selectedAnswers[id].includes(letter)
                              : selectedAnswers[id]?.[0] === letter}
                            onChange={() => handleSelectAnswer(letter)}
                          />
                          {letter}. {optionText}
                        </div>
                      );
                    })}
                  </div>
                )}
  
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswers[id]}
                  className="submit-button"
                >
                  Submit
                </button>
  
                {showExplanation && (
                  <div className="explanation-box">
                    <h4>Explanation</h4>
                    <p dangerouslySetInnerHTML={{ __html: question.explanation || "No explanation provided." }} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
export default PreviewQuestion;
  
