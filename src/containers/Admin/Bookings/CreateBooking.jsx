import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../config/supabaseClient';
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import './CreateBooking.css';

import BackButton from '../../../components/Button/BackArrowButton';
import Toast from '../../../components/Toast';
import PlainInput from "../../../components/Input/PlainInput";
import TextArea from "../../../components/Input/TextArea";
import SingleSelect from "../../../components/Input/SingleSelect";


const CreateBooking = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        question_text: '',
        question_type: '',
        options: '',
        correct_answer: '',
        explanation: '',
    });

    const [question, setQuestion] = useState("");
    const [questionType, setQuestionType] = useState("");
    const [options, setOptions] = useState([""]);
    const [answer, setAnswer] = useState("");

    const [toastInfo, setToastInfo] = useState({ visible: false, message: '', type: '' });

    const showToast = (message, type) => {
        setToastInfo({ visible: true, message, type });
        setTimeout(() => setToastInfo({ visible: false, message: '', type: '' }), 3000); // Auto-hide
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
            const formattedOptions = JSON.stringify(options.map(opt => opt.value)); // Convert array of objects to array of values
    
            const { data: questionData, error: questionError } = await supabase
                .from('questions')
                .insert({
                    question_text: question,
                    question_type: questionType,
                    options: formattedOptions, // Store options as a JSON string
                    correct_answer: answer, 
                    explanation: formData.content,
                    created_at: new Date().toISOString(),
                    modified_at: new Date().toISOString(),
                })
                .select()
                .single();
    
            if (questionError) throw questionError;
    
            showToast("Question created successfully!", "success");
            navigate('/admin/bookings');
        } catch (error) {
            setError(error.message);
            showToast(`Error creating question: ${error.message}`, "error");
        } finally {
            setLoading(false);
        }
    };
    

    const handleQuestionTypeChange = (value) => {
        setQuestionType(value);
        setOptions([{ label: "A", value: "" }]); // Reset options
        setAnswer("");
    };

    const handleOptionChange = (index, value) => {
        setOptions((prevOptions) => {
            const updatedOptions = [...prevOptions];
            updatedOptions[index] = { ...updatedOptions[index], value };
            return updatedOptions;
        });
    };
    

    const addOption = () => {
        const newLabel = String.fromCharCode(65 + options.length); // Generate A, B, C, ...
        setOptions([...options, { label: newLabel, value: "" }]);
    };

    const removeOption = (index) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        updatedOptions.forEach((option, i) => {
            option.label = String.fromCharCode(65 + i); // Recalculate labels (A, B, C...)
        });
        setOptions(updatedOptions);
    };

    const handleContentChange = (value) => {
        setFormData((prev) => ({ ...prev, content: value }));
    };

    const handleImageUpload = async () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `blogcontent/${fileName}`;

            let { error } = await supabase.storage.from('blogcontent').upload(filePath, file);

            if (error) {
                showToast(`Image upload failed: ${error.message}`, 'error');
                return;
            }

            const { data } = supabase.storage.from('blogcontent').getPublicUrl(filePath);
            if (data) {
                const url = data.publicUrl;
                const quill = document.querySelector('.ql-editor');
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', url);
            }
        };
    };

    const quillModules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image'],  // Image upload button
                ['clean']
            ],
            handlers: {
                image: handleImageUpload
            }
        }
    };

    return (
        <div className="create-venue-category-container">
            <BackButton to="/admin/bookings" />   
            <h2>Create New Booking</h2> 

            {toastInfo.visible && (
                <Toast message={toastInfo.message} type={toastInfo.type} />
            )}

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="outsider">
                <div className="insider">

                <PlainInput
                    label="Question"
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                />

                <SingleSelect
                    label="Question Type"
                    value={questionType}
                    onChange={handleQuestionTypeChange}
                    options={[
                        { label: "Subjective", value: "subjective" },
                        { label: "Single Option", value: "single" },
                        { label: "True/False", value: "trueFalse" },
                        { label: "Multiple Choice", value: "multiple" }
                    ]}
                    required
                />

                {questionType === "subjective" && (
                    <></>
                )}

                {(questionType === "single" || questionType === "multiple") && (
                    <div>
                        <label>Options</label>
                        {options.map((option, index) => (
                            <div key={index} className="option-field">
                                <span>{option.label}.</span>
                                <PlainInput
                                    type="text"
                                    value={option.value}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    required
                                />
                                {options.length > 1 && (
                                    <button type="button" className='removebtn' onClick={() => removeOption(index)}> x </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className='addbtn' onClick={addOption}> + </button>
                    </div>
                )}

                {questionType === "trueFalse" && (
                    <></>
                )}

                <PlainInput
                    label="Correct Answer"
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                />

                <div className="field-container">
                        <label>Explanation:</label>
                        <ReactQuill
                            theme="snow"
                            value={formData.content}  // Controlled component
                            onChange={handleContentChange}
                            modules={{
                                toolbar: [
                                    [{ header: [1, 2, false] }],
                                    ["bold", "italic", "underline"],
                                    [{ list: "ordered" }, { list: "bullet" }],
                                    ["link", "image"],
                                ],
                            }}
                            formats={[
                                "header",
                                "bold",
                                "italic",
                                "underline",
                                "list",
                                "bullet",
                                "link",
                                "image",
                            ]}
                            className="enhanced-input"
                        />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Creating...' : 'Create'}
                </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBooking;
