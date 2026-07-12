import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnnouncementBanner from "../components/AnnouncementBanner";
import VisitorCounter from "../components/VisitorCounter";

const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <AnnouncementBanner />
            <main className="flex-grow">
                <Outlet />
            </main>
            <VisitorCounter />
            <Footer />
        </div>
    );
};

export default PublicLayout;