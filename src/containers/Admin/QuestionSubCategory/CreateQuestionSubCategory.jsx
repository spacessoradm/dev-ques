import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../config/supabaseClient';

import './index.css';
import BackButton from '../../../components/Button/BackArrowButton';
import Toast from '../../../components/Toast';
import PlainInput from '../../../components/Input/PlainInput';
import TextArea from '../../../components/Input/TextArea';

const CreateQuestionSubCategory = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        subCategoryName: '',
        categoryDescription: '',
        parent: '',
        seqInMenu: '',
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toastInfo, setToastInfo] = useState({ visible: false, message: '', type: '' });

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('question_category').select('id, category_name');
            if (error) {
                console.error('Error fetching categories:', error);
            } else {
                setCategories(data);
            }
        };

        fetchCategories();
    }, []);

    const showToast = (message, type) => {
        setToastInfo({ visible: true, message, type });
        setTimeout(() => setToastInfo({ visible: false, message: '', type: '' }), 3000);
    };

    const handleChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: categoryError } = await supabase
                .from('question_subcategory')
                .insert([
                    {
                        subcategory_name: formData.subCategoryName,
                        description: formData.categoryDescription,
                        parent: formData.parent,
                        seq_in_menu: Number(formData.seqInMenu),
                    },
                ]);

            if (categoryError) throw categoryError;

            showToast('Question subcategory created successfully.', 'success');

            navigate('/admin/questionsubcategory');
        } catch (error) {
            showToast('Failed to create question subcategory.', 'error');
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: "Courier New" }}>
            <BackButton to="/admin/questionsubcategory" />   
            <h2>Create New Question Subcategory</h2> 

            {toastInfo.visible && <Toast message={toastInfo.message} type={toastInfo.type} />}
            
            <form onSubmit={handleSubmit} className="outsider">
                <div className="insider">
                    <PlainInput 
                        label="SubCategory Name"
                        value={formData.subCategoryName}
                        onChange={(e) => handleChange('subCategoryName', e.target.value)}
                        required
                    />

                    <TextArea 
                        label="Category Description"
                        value={formData.categoryDescription}
                        onChange={(e) => handleChange('categoryDescription', e.target.value)}
                    />

                    <div className='field-container'>
                        <label>Parent Category</label>
                        <select
                            className='enhanced-input' 
                            value={formData.parent} 
                            onChange={(e) => handleChange('parent', e.target.value)}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.category_name}</option>
                            ))}
                        </select>
                    </div>

                    <PlainInput 
                        label="Sequence in Menu"
                        value={formData.seqInMenu}
                        onChange={(e) => handleChange('seqInMenu', e.target.value)}
                    />

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuestionSubCategory;
