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

//Chiongster
import AppUsers from './containers/Admin/App_Users/index.jsx';
import EditAppUser from './containers/Admin/App_Users/EditAppUser';
import ViewAppUser from './containers/Admin/App_Users/ViewAppUser';

import DrinkDollars from './containers/Admin/Drink_Dollars/index.jsx';
import ViewDrinkDollar from './containers/Admin/Drink_Dollars/ViewDrinkDollar';
import CreateDDTransaction from './containers/Admin/Drink_Dollars/CreateDDTransaction';

import VenueCategory from './containers/Admin/Venue_Category/index.jsx';
import CreateVenueCategory from './containers/Admin/Venue_Category/CreateVenueCategory';
import ViewVenueCategory from './containers/Admin/Venue_Category/ViewVenueCategory';
import EditVenueCategory from './containers/Admin/Venue_Category/EditVenueCategory';

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

import Blogs from './containers/Admin/Blogs/index.jsx';
import CreateBlog from './containers/Admin/Blogs/CreateBlog';
import ViewBlog from './containers/Admin/Blogs/ViewBlog';
import EditBlog from './containers/Admin/Blogs/EditBlog';

import Bookings from './containers/Admin/Bookings/index.jsx';
import CreateBooking from './containers/Admin/Bookings/CreateBooking';
import ViewBooking from './containers/Admin/Bookings/ViewBooking';
import EditBooking from './containers/Admin/Bookings/EditBooking';
import EditRedemption from './containers/Admin/Bookings/EditRedemption';

import Managers from './containers/Admin/Managers/index.jsx';
import CreateManager from './containers/Admin/Managers/CreateManager';
import ViewManager from './containers/Admin/Managers/ViewManager';
import EditManager from './containers/Admin/Managers/EditManager';

import RedeemItems from './containers/Admin/Redeem_Items/index.jsx';
import CreateRedeemItem from './containers/Admin/Redeem_Items/CreateRedeemItem';
import ViewRedeemItem from './containers/Admin/Redeem_Items/ViewRedeemItem';
import EditRedeemItem from './containers/Admin/Redeem_Items/EditRedeemItem';

import Banners from './containers/Admin/Banners/index.jsx';
import CreateBanner from './containers/Admin/Banners/CreateBanner';
import EditBanner from './containers/Admin/Banners/EditBanner';

import Languages from './containers/Admin/Languages/index.jsx';
import CreateLanguage from './containers/Admin/Languages/CreateLanguage';
import ViewLanguage from './containers/Admin/Languages/ViewLanguage';
import EditLanguage from './containers/Admin/Languages/EditLanguage';

import RecommendedTags from './containers/Admin/Recommended_Tags/index.jsx';
import CreateRecommendedTag from './containers/Admin/Recommended_Tags/CreateRecommendedTag';
import ViewRecommendedTag from './containers/Admin/Recommended_Tags/ViewRecommendedTag';
import EditRecommendedTag from './containers/Admin/Recommended_Tags/EditRecommendedTag';

import BlogTags from './containers/Admin/Blog_Tags/index.jsx';
import CreateBlogTag from './containers/Admin/Blog_Tags/CreateBlogTag';
import ViewBlogTag from './containers/Admin/Blog_Tags/ViewBlogTag';
import EditBlogTag from './containers/Admin/Blog_Tags/EditBlogTag';

import Notis from './containers/Admin/Notis/index.jsx';
import CreateNotis from './containers/Admin/Notis/CreateNotis';
import ViewNotis from './containers/Admin/Notis/ViewNotis';
import EditNotis from './containers/Admin/Notis/EditNotis';

import AlcoholBalance from './containers/Admin/Alcohol_Balance/index.jsx';
import CreateAlcoholBalance from './containers/Admin/Alcohol_Balance/CreateAlcoholBalance';
import ViewAlcoholBalance from './containers/Admin/Alcohol_Balance/ViewAlcoholBalance';
import EditAlcoholBalance from './containers/Admin/Alcohol_Balance/EditAlcoholBalance';

import FooterMenu from './containers/Admin/Footer_Menu/index.jsx';
import CreateFooterMenu from './containers/Admin/Footer_Menu/CreateFooterMenu';
//import ViewFooterMenu from './containers/Admin/Footer_Menu/ViewFooterMenu';
import EditFooterMenu from './containers/Admin/Footer_Menu/EditFooterMenu';
import CreateSubFooterMenu from './containers/Admin/Footer_Menu/CreateSubFooterMenu';

import Packages from './containers/Admin/Packages/index.jsx';
import CreatePackage from './containers/Admin/Packages/CreatePackage.jsx';
import ViewPackage from './containers/Admin/Packages/ViewPackage.jsx';
import EditPackage from './containers/Admin/Packages/EditPackage.jsx';

import Tiers from './containers/Admin/Tiers/index.jsx';
import CreateTier from './containers/Admin/Tiers/CreateTier.jsx';
import ViewTier from './containers/Admin/Tiers/ViewTier.jsx';
import EditTier from './containers/Admin/Tiers/EditTier.jsx';

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
                                path="/admin/appusers"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <AppUsers />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/appusers/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewAppUser />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/appusers/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditAppUser />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/drinkdollars"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <DrinkDollars />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/drinkdollars/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewDrinkDollar />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/drinkdollars/createtransaction/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateDDTransaction />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/venuecategory"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <VenueCategory />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/venuecategory/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateVenueCategory />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/venuecategory/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewVenueCategory/>
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/venuecategory/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditVenueCategory/>
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
                                path="/admin/managers"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <Managers />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/managers/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateManager />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/managers/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewManager/>
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/managers/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditManager />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/redeemitems"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <RedeemItems />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/redeemitems/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateRedeemItem />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/redeemitems/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewRedeemItem/>
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/redeemitems/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditRedeemItem/>
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
                                path="/admin/recommendedtags"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <RecommendedTags />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/recommendedtags/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateRecommendedTag />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/recommendedtags/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewRecommendedTag/>
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/recommendedtags/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditRecommendedTag/>
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
                                path="/admin/notis"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <Notis />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/notis/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateNotis />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/notis/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditNotis/>
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/notis/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewNotis/>
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/alcoholbalance"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <AlcoholBalance />
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/alcoholbalance/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateAlcoholBalance/>
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/alcoholbalance/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditAlcoholBalance/>
                                    </AdminLayout>
                                }
                            />
                            <Route
                                path="/admin/alcoholbalance/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewAlcoholBalance/>
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
                                path="/admin/packages"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <Packages />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/packages/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreatePackage/>
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/packages/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewPackage/>
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/packages/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditPackage/>
                                    </AdminLayout>
                                }
                            />

                            <Route 
                                path="/admin/tiers"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <Tiers />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/tiers/create"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <CreateTier />
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/tiers/view/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <ViewTier/>
                                    </AdminLayout>
                                }
                            />

                            <Route
                                path="/admin/tiers/edit/:id"
                                element={
                                    <AdminLayout isCollapsed={isCollapsed} toggleSidebar={toggleSidebar}>
                                        <EditTier/>
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
