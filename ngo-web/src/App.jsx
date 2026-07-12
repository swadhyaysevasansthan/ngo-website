import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";

import ScrollToTop from "./components/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";

import { trackVisitor } from "./utils/visitorTracker";

function App() {

    useEffect(() => {
        trackVisitor();
    }, []);

    return (
        <BrowserRouter>
            <ScrollToTop />
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;