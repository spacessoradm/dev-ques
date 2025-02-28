import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../config/supabaseClient';
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import './index.css';
import SearchBar from '../../../components/SearchBarSection';
import Toast from '../../../components/Toast';
import Pagination from '../../../components/pagination';

const Testimonials = () => {
  const navigate = useNavigate();

  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "username", direction: "asc" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [toastInfo, setToastInfo] = useState({ visible: false, message: '', type: '' });

  const showToast = (message, type) => {
        setToastInfo({ visible: true, message, type });
        setTimeout(() => setToastInfo({ visible: false, message: '', type: '' }), 3000); // Auto-hide
  };

  const fetchTestimonials = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);
    try {
      const start = (pageNumber - 1) * limit;
      const end = start + limit - 1;

      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('id, displayname, subject, status, created_at')
        .range(start, end);

      if (testimonialsError) throw testimonialsError;

      setTestimonials(testimonialsData);
      setFilteredTestimonials(testimonialsData);
      setTotalPages(Math.ceil(testimonialsData.length / limit));
    } catch (error) {
      showToast("Failed to fetch testimonials.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term) {
      const filtered = testimonials.filter((testimonial) =>
        testimonial.username.toLowerCase().includes(term)
      );
      setFilteredTestimonials(filtered);
    } else {
      setFilteredTestimonials(categories);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    fetchTestimonials(page);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchTestimonials(newPage);
    }
  };

  useEffect(() => {
    fetchTestimonials(page);
  }, [page]);

  const handleRefresh = () => fetchTestimonials(page);

  const handleCreate = () => navigate("create");

  const deleteTestimonial = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTestimonials((prevTestimonials) => prevTestimonials.filter((testimonial) => testimonial.id !== id));
      setFilteredTestimonials((prevFilteredTestimonials) =>
        prevFilteredTestimonials.filter((testimonial) => testimonial.id !== id)
      );

      showToast("Testimonial deleted successfully.", "success");
    } catch (err) {
      showToast("Failed to delete testimonial.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='whole-page'>
      <p className='title-page'>Testimonial List Management</p>
      <p className='subtitle-page'>Manage your testimonial here.</p>

      <SearchBar
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onCreate={handleCreate}
      />

      {loading && <p>Loading testimonials...</p>}

      {toastInfo.visible && (
        <Toast message={toastInfo.message} type={toastInfo.type} />
      )}

      {!loading && !error && filteredTestimonials.length > 0 ? (
        <>
          <table className='table-container'>
            <thead>
              <tr className='header-row'>
                <th className='normal-header'>ID</th>
                <th
                  onClick={() => handleSort("displayname")}
                  className='sort-header'
                >
                  DisplayName {sortConfig.key === "displayname" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className='normal-header'> Subject</th>
                <th
                  onClick={() => handleSort("created_at")}
                  className='sort-header'
                >
                  Created At {sortConfig.key === "created_at" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className='normal-header'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestimonials.map((testimonial) => (
                <tr key={testimonial.id}>
                  <td className='normal-column'>{testimonial.id}</td>
                  <td className='normal-column'>{testimonial.displayname}</td>
                  <td className='normal-column'>{testimonial.subject}</td>
                  <td className='normal-column'>{testimonial.created_at}</td>
                  <td className='action-column'>
                    <FaEye
                      onClick={() => navigate(`/admin/testimonials/view/${testimonial.id}`)}
                      title='View'
                      className='view-button'
                    />
                    <FaEdit 
                      onClick={() => navigate(`/admin/testimonials/edit/${testimonial.id}`)}
                      title='Edit'
                      className='edit-button'
                    />
                    <FaTrashAlt 
                      onClick={() => deleteTestimonial(testimonial.id)}
                      title='Delete'
                      className='delete-button'
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        !loading && <p>No testimonials found.</p>
      )}
    </div>
  );
}; 

export default Testimonials;
