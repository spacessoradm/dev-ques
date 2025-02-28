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
        title: "Users Management",
        link: "/admin/user",
        icon: <FaUser />,
    },
    {
        title: "Manage Blogs",
        link: "/admin/blogs",
        icon: <FaUser />,
    },
    {
        title: "Settings",
        icon: <FaCog />,
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
