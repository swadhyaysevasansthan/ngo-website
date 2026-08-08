import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnnouncementBanner from "../components/AnnouncementBanner";
import VisitorCounter from "../components/VisitorCounter";
import WhatsAppButton from "../components/WhatsAppButton";

const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <AnnouncementBanner />
            <main className="flex-grow">
                <Outlet />
            </main>
            <WhatsAppButton />
            <VisitorCounter />
            <Footer />
        </div>
    );
};

export default PublicLayout;