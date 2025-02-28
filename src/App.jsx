import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Login from './containers/Authentication/Login/index';
import ForgetPassword from './containers/Authentication/ForgetPassword/index';
import ResetPassword from './containers/Authentication/ResetPassword/index';
import Signup from './containers/Authentication/Registration';
//import supabase from './config/supabaseClient';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth, AuthProvider } from './context/AuthContext';

// Client Components
/*import HorizontalNavbar from './containers/Client/Navigation/HorizontalNavBar';
import BottomNavBar from './containers/Client/Navigation/BottomNavBar';
import Dashboard from './containers/Client/Dashboard';*/

// Admin Components
import AdminLayout from './components/AdminLayout';
import SideNavBar from './containers/Admin/Admin_Navigation/SideNavBar';
import AdminDashboard from './containers/Admin/Admin_Dashboard';

//Ques

import Vibes from './containers/Admin/Vibe/index.jsx';
import CreateVibe from './containers/Admin/Vibe/CreateVibe';
import ViewVibe from './containers/Admin/Vibe/ViewVibe';
import EditVibe from './containers/Admin/Vibe/EditVibe';

import Venues from './containers/Admin/Venues/index.jsx';
import CreateVenue from './containers/Admin/Venues/CreateVenue';
//import ViewVenue from './containers/Admin/Venues/ViewVenue';
import EditVenue from './containers/Admin/Venues/EditVenue';
import CreateRandomGallery from './containers/Admin/Venues/CreateRandomGallery';
import CreateVenueGallery from './containers/Admin/Venues/CreateGallery';
import AddVenuePromotion from './containers/Admin/Venues/CreatePromotion';
import EditDamage from './containers/Admin/Venues/EditDamage';
import EditMenu from './containers/Admin/Venues/EditMenu';
import EditVenueRedeemItem from './containers/Admin/Venues/EditRedeemItem';

import Bookings from './containers/Admin/Bookings/index.jsx';
import CreateBooking from './containers/Admin/Bookings/CreateBooking';
import ViewBooking from './containers/Admin/Bookings/ViewBooking';
import EditBooking from './containers/Admin/Bookings/EditBooking';
import EditRedemption from './containers/Admin/Bookings/EditRedemption';

import Banners from './containers/Admin/Banners/index.jsx';
import CreateBanner from './containers/Admin/Banners/CreateBanner';
import EditBanner from './containers/Admin/Banners/EditBanner';

import Languages from './containers/Admin/Languages/index.jsx';
import CreateLanguage from './containers/Admin/Languages/CreateLanguage';
import ViewLanguage from './containers/Admin/Languages/ViewLanguage';
import EditLanguage from './containers/Admin/Languages/EditLanguage';

import User from './containers/Admin/Users/index.jsx';
import ViewUser from './containers/Admin/Users/ViewUser.jsx';
import EditUser from './containers/Admin/Users/EditUser.jsx';

import Roles from './containers/Admin/Roles/index.jsx';
import CreateRole from './containers/Admin/Roles/CreateRole';
import ViewRole from './containers/Admin/Roles/ViewRole';
import EditRole from './containers/Admin/Roles/EditRole';

import QuestionCategory from './containers/Admin/Question_Category/index.jsx';
import CreateQuestionCategory from './containers/Admin/Question_Category/CreateQuestionCategory.jsx';
import ViewQuestionCategory from './containers/Admin/Question_Category/ViewQuestionCategory.jsx';
import EditQuestionCategory from './containers/Admin/Question_Category/EditQuestionCategory.jsx';

import SubscriptionPlans from './containers/Admin/Subscription_Plans/index.jsx';
import CreatePlan from './containers/Admin/Subscription_Plans/CreatePlan.jsx';
import ViewPlan from './containers/Admin/Subscription_Plans/ViewPlan.jsx';
import EditPlan from './containers/Admin/Subscription_Plans/EditPlan.jsx';

import FooterMenu from './containers/Admin/Footer_Menu/index.jsx';
import CreateFooterMenu from './containers/Admin/Footer_Menu/CreateFooterMenu';
import EditFooterMenu from './containers/Admin/Footer_Menu/EditFooterMenu';
import CreateSubFooterMenu from './containers/Admin/Footer_Menu/CreateSubFooterMenu';

import BlogTags from './containers/Admin/Blog_Tags/index.jsx';
import CreateBlogTag from './containers/Admin/Blog_Tags/CreateBlogTag';
import ViewBlogTag from './containers/Admin/Blog_Tags/ViewBlogTag';
import EditBlogTag from './containers/Admin/Blog_Tags/EditBlogTag';

import Blogs from './containers/Admin/Blogs/index.jsx';
import CreateBlog from './containers/Admin/Blogs/CreateBlog';
import ViewBlog from './containers/Admin/Blogs/ViewBlog';
import EditBlog from './containers/Admin/Blogs/EditBlog';

import { AuthClient } from '@supabase/supabase-js';

const App = () => {
    //const [userRole, setUserRole] = useState('');
    const uR = 'admin';
    const [loading, setLoading] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const uR = localStorage.getItem('role');
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`App ${uR === "admin" ? (isCollapsed ? "sidebar-collapsed" : "sidebar-expanded") : ""}`}>
            {/* Conditional Navigation Rendering */}

            {/* Main Content */}
            <main className={uR === "admin" ? "admin-main-content" : ""}>
                <Routes>
                    {/* Default Route */}

                    {/* Authentication Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgetpassword" element={<ForgetPassword />} />
                    <Route path="/resetpassword" element={<ResetPassword />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Admin Routes */}
                    {uR === "admin" && (
                        <>
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <AdminDashboard />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/user"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <User />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/users/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewUser />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/users/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditUser />
                                    </AdminLayout>
                                }
                            />
                            
                            <Route
                                path="/admin/questioncategory"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <QuestionCategory />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/questioncategory/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateQuestionCategory />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/questioncategory/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewQuestionCategory/>
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/questioncategory/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditQuestionCategory/>
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/vibe"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <Vibes />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/vibe/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateVibe />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/vibe/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewVibe />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/vibe/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditVibe />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/venues"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <Venues />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/venues/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateVenue />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/venues/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditVenue />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/venues/createrandom/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateRandomGallery />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/venues/create/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateVenueGallery />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/venues/addpromotion/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <AddVenuePromotion />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/venues/editdamage/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditDamage />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/venues/editmenu/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditMenu />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/venues/editredeemitem/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditVenueRedeemItem />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/blogs"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <Blogs />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/blogs/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateBlog />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/blogs/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewBlog />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/blogs/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditBlog />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/bookings"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <Bookings />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/bookings/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateBooking />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/bookings/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewBooking/>
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/bookings/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditBooking/>
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/bookings/editredemption/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditRedemption/>
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/banners"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <Banners />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/banners/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateBanner />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/banners/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditBanner />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/languages"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <Languages />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/languages/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateLanguage />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/languages/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewLanguage/>
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/languages/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditLanguage/>
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/blogtags"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <BlogTags />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/blogtags/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateBlogTag />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/blogtags/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewBlogTag/>
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/blogtags/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditBlogTag/>
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/footermenu"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <FooterMenu />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/footermenu/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateFooterMenu/>
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/footermenu/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditFooterMenu/>
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/footermenu/create/submenu/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateSubFooterMenu/>
                                    </AdminLayout>
                                }
                            />

                            <Route 
                                path="/admin/roles"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <Roles />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/roles/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateRole/>
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/roles/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewRole/>
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/roles/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditRole/>
                                    </AdminLayout>
                                }
                            />

                            <Route 
                                path="/admin/subscriptionplans"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <SubscriptionPlans />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/subscriptionplans/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreatePlan/>
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/subscriptionplans/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewPlan/>
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/subscriptionplans/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditPlan/>
                                    </AdminLayout>
                                }
                            />
                        </>
                    )}

                    {/* Fallback for unmatched routes */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
