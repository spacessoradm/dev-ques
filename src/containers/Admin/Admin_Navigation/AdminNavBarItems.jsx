import { 
    FaTachometerAlt, 
    FaUser, 
    FaCog, 
    FaClipboardList, 
    FaUtensils, 
    FaTags, 
    FaListAlt, 
    FaPlusCircle, 
    FaTools,
    FaThList,
} from "react-icons/fa";

const adminNavBarItems = [
    {
        title: "Admin Dashboard",
        link: "/admin/dashboard",
        icon: <FaTachometerAlt />,
    },
    {
        title: "Users",
        link: "/admin/user",
    },
    {
        title: "Blogs",
        link: "/admin/blogs",
    },
    {
        title: "Question Management 2",
        dropdown: true,
        items: [
            {
                title: "Part 2A",
                link: "/admin/questions/2A",
            },
            {
                title: "Physic",
                link: "/admin/questions/Physics",
            },
        ]
    },
    {
        title: "Testimonial",
        link: "/admin/testimonials",
    },
    {
        title: "Settings",
        dropdown: true, // Indicates dropdown
        items: [
            {
                title: "Manage Banner",
                link: "/admin/banners",
                icon: <FaListAlt />,
            },
            {
                title: "Manage Blog Tags",
                link: "/admin/blogtags",
                icon: <FaListAlt />,
            },
            {
                title: "Manage Footer Menu",
                link: "/admin/footermenu",
                icon: <FaListAlt />,
            },
            {
                title: "Question Category Management",
                link: "/admin/questioncategory",
                icon: <FaListAlt />,
            },
            {
                title: "Question Sub-Category Management",
                link: "/admin/questionsubcategory",
                icon: <FaListAlt />,
            },
            {
                title: "Subscription Plan Management",
                link: "/admin/subscriptionplans",
                icon: <FaListAlt />,
            },
            {
                title: "Role Management",
                link: "/admin/roles",
                icon: <FaListAlt />,
            },
        ]
    },
];

export default adminNavBarItems;
