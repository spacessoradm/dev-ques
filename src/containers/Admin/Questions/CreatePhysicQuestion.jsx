import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import supabase from '../../../config/supabaseClient';
import { FaMinusCircle, FaPlusCircle, FaTimes } from "react-icons/fa";
import './CreateBooking.css';
import "katex/dist/katex.min.css";
import katex from "katex";
import JoditEditor from "jodit-react";

import BackButton from '../../../components/Button/BackArrowButton';
import Toast from '../../../components/Toast';
import PlainInput from "../../../components/Input/PlainInput";
import TextArea from "../../../components/Input/TextArea";
import SingleSelect from "../../../components/Input/SingleSelect";


const CreatePhysicQuestion = () => {
    const navigate = useNavigate();
    const { subCategoryName } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({
        question_text: '',
        question_type: '',
        options: '',
        correct_answer: '',
        explanation: '',
        category: '',
        sub_category: '',
        subquestion: [
            {
                subquestion_title: "",
                subquestion_answer: "",
                subquestion_explanation: "",
            },
        ],
    });

    const [question, setQuestion] = useState("");

    const [toastInfo, setToastInfo] = useState({ visible: false, message: '', type: '' });

    const showToast = (message, type) => {
        setToastInfo({ visible: true, message, type });
        setTimeout(() => setToastInfo({ visible: false, message: '', type: '' }), 3000); // Auto-hide
    };

    const editor = useRef(null)
    const [content, setContent] = useState('')

    const renderMath = (content) => {
        return content.replace(/\$\$(.*?)\$\$/g, (_, formula) => {
            try {
                return katex.renderToString(formula, { throwOnError: false });
            } catch (error) {
                console.error("KaTeX Error:", error);
                return formula; // Return original text if KaTeX fails
            }
        });
    };    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
    
            const { data: questionData, error: questionError } = await supabase
                .from('questions')
                .insert({
                    question_text: question,
                    question_type: 'subq',
                    options: [], // Store options as a JSON string
                    correct_answer: '', 
                    explanation: content,
                    category: 'Physics',
                    sub_category: subCategoryName,
                    created_at: new Date().toISOString(),
                    modified_at: new Date().toISOString(),
                })
                .select()
                .single();
    
            if (questionError) throw questionError;

            const questionId = questionData.id;
    
          await Promise.all([
            handleSaveSubQuestion(questionId, formData.subquestion),
          ]);
    
            showToast("Question created successfully!", "success");
            navigate('/admin/bookings/Physics');
        } catch (error) {
            setError(error.message);
            showToast(`Error creating question: ${error.message}`, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSubQuestion = async (questionId, subquestion) => {
        try {
            console.log(subquestion);
          if (subquestion.length > 0) {
            const subQ = subquestion.map((group) => ({
              parent_id: questionId,
              subquestion_text: group.subquestion_title,
              subquestion_answer: group.subquestion_answer,
              subquestion_explanation: group.subquestion_explanation,
              created_at: new Date().toISOString(),
              modified_at: new Date().toISOString(),  
            }));
    
            const { error } = await supabase.from("subquestions").insert(subQ);
            if (error) throw error;
          }
        } catch (error) {
            showToast('Error saving sub questions', 'error');
        }
    };
    
    const handleContentChange = (value) => {
        setFormData((prev) => ({ ...prev, explanation: value }));
    };

    const handleSubContentChange = (value) => {
        setFormData((prev) => ({ ...prev, subquestion_explanation: value }));
    };

    const handleTabChange = (index) => setActiveTab(index);

    const handleSubQuestionChange = (index, field, value) => {
        setFormData((prev) => {
            const updatedSubQuestion = [...prev.subquestion];
            updatedSubQuestion[index] = {
                ...updatedSubQuestion[index],
                [field]: value, // Properly updating the field
            };
            return { ...prev, subquestion: updatedSubQuestion };
        });
    };
      
    const addSubQuestionGroup = () => {
        setFormData((prev) => ({
          ...prev,
          subquestion: [
            ...prev.subquestion,
            {
              subquestion_title: "",
              subquestion_answer: "",
              subquestion_explanation: "",
            },
          ],
        }));
    };
    
    const removeSubQuestionGroup = (index) => {
        setFormData((prev) => ({
          ...prev,
          subquestion: prev.subquestion.filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="create-venue-category-container">
            <BackButton to="/admin/questions/Physics" />   
            <h2 style={{fontFamily: 'Poppins', paddingLeft: '50px', paddingRight: '50px'}}>Physics Question</h2> 

            <div className="container">
                {/* Sidebar */}
            <div className="sidebar">
            <h3>Sections</h3>
            <ul className="subcategory-list">
                <li
                className={`main-details ${ question ? "active" : ""}`}
                style={{marginTop: '12px'}}
                >
                Main Details
                </li>
                <li>
                <FaPlusCircle
                    size={50}  
                    onClick={addSubQuestionGroup}
                    style={{
                        cursor: "pointer",
                        color: "#4CAF50",
                        margin: "15px",
                        }}
                />
                </li>
                <li
                className={`main-details ${content? "active" : ""}`}
                style={{marginTop: '12px'}}
                >
                Explanation
                </li>
            </ul>
            </div>

            <div className="question-tab" style={{ padding: "12px", width: "75%" }}>
                {toastInfo.visible && (
                    <Toast message={toastInfo.message} type={toastInfo.type} />
                )}

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="" style={{fontFamily: 'Poppins', paddingLeft: '50px', paddingRight: '50px'}}>
                    <div className="">

                    <div style={{paddingTop: '20px'}}>
                        <label>Sub-Category*</label>
                        <input
                            type="text"
                            value={subCategoryName}
                            required
                            disabled
                            className="enhanced-input"
                        />
                    </div>

                    <div style={{paddingTop: '20px'}}>
                        <label>Title*</label>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                            className="enhanced-input"
                        />
                    </div>

                    {/* Tabs Navigation */}
                    <div style={{ display: "flex", marginBottom: "20px", marginTop: '20px' }}>
                        {["Sub-Question"].map((tab, index) => (
                        <div
                            key={index}
                            onClick={() => handleTabChange(index)}
                            style={{
                            backgroundColor: activeTab === index ? "#004c4c" : "#f0f0f0",
                            color: activeTab === index ? "white" : "black",
                            }}
                            className="tab-navigation"
                        >
                            {tab}
                        </div>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 0 && (
                        <div>
                        {formData.subquestion.map((group, index) => (
                        <div
                            key={index}
                            className="enhanced-input"
                            style={{marginTop: '20px'}}
                            >
                            <div style={{ justifyContent: "flex-end", display: "flex"}}>
                                <FaTimes
                                    size={25}  
                                    onClick={() => removeSubQuestionGroup(index)}
                                    style={{
                                    cursor: "pointer",
                                    margin: "15px",
                                    }}
                                />
                            </div>
                            
                            <div className=''>
                                <label>Question*</label>
                                <input
                                    type="text"
                                    value={group.subquestion_title}
                                    onChange={(e) =>
                                    handleSubQuestionChange(index, "subquestion_title", e.target.value)
                                    }
                                    className="enhanced-input"
                                />
                            </div>

                            <div style={{paddingTop: '20px'}}>
                                <label>Answer*</label>
                                <input
                                    type="text"
                                    value={group.subquestion_answer}
                                    onChange={(e) =>
                                    handleSubQuestionChange(index, "subquestion_answer", e.target.value)
                                    }
                                    className="enhanced-input"
                                />
                            </div>

                            <div style={{paddingTop: '20px'}}>
                                <label>Explanation*</label>
                                <JoditEditor 
                                ref={editor} 
                                value={formData.subquestion[index].subquestion_explanation} 
                                onChange={(value) => handleSubQuestionChange(index, "subquestion_explanation", value)} 
                                className="enhanced-input"
                                />
                            </div>
                        </div>
                            ))
                        }
                            <FaPlusCircle
                            size={50}  
                            onClick={addSubQuestionGroup}
                            style={{
                                cursor: "pointer",
                                color: "#4CAF50",
                                margin: "15px",
                                }}
                            />
                        </div>
                    )}

                    <div style={{paddingTop: '20px'}}>
                        <label>Explanation*</label>
                        <JoditEditor 
                            value={content} 
                            onChange={newContent => setContent(renderMath(newContent))} 
                            className="enhanced-input"
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
};

export default CreatePhysicQuestion;
