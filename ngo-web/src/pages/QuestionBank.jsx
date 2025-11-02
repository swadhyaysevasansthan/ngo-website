import React, { useEffect, useState, useRef } from "react";
import { BookOpen, Eye, Lock } from "lucide-react";
import Card from "../components/Card";
import SectionHeader from "../components/SectionHeader";
import { Document, Page, pdfjs } from "react-pdf";

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ACCESS_CODE = "SNEAC2025"; // ✅ change this to your secret code
const PDF_FILE = "/question-banks/paper-7-9th.pdf"; // ✅ your PDF file path

// ✅ Responsive PDF viewer
const PdfJsViewer = ({ src }) => {
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState("");
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = useRef(null);

  // Disable right-click + shortcuts
  useEffect(() => {
    const preventKeys = (e) => {
      const k = e.key?.toLowerCase();
      const meta = e.metaKey || e.ctrlKey;
      if (meta && ["s", "p", "o", "u"].includes(k)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const preventContext = (e) => e.preventDefault();
    document.addEventListener("keydown", preventKeys, true);
    document.addEventListener("contextmenu", preventContext, true);
    return () => {
      document.removeEventListener("keydown", preventKeys, true);
      document.removeEventListener("contextmenu", preventContext, true);
    };
  }, []);

  // ✅ Dynamically adjust width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth - 40; // padding
        setContainerWidth(Math.min(newWidth, 900)); // cap at 900px
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[78vh] overflow-auto rounded-xl bg-gray-100 p-4 select-none"
    >
      <Document
        file={src}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={(err) => setError(err?.message || "Failed to load PDF")}
        loading={<div className="text-gray-600">Loading PDF…</div>}
      >
        {error ? (
          <div className="text-red-600 text-sm">{error}</div>
        ) : (
          Array.from(new Array(numPages || 0), (_, idx) => (
            <div key={idx} className="mb-6 flex justify-center">
              <Page
                pageNumber={idx + 1}
                width={containerWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))
        )}
      </Document>
    </div>
  );
};

const QuestionBank = () => {

  useEffect(() => {
    document.title = 'Question Bank - Swadhyay Seva Foundation';
  }, []);

  const [code, setCode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim() === ACCESS_CODE) {
      setIsAuthorized(true);
      setError("");
    } else {
      setError("Invalid access code. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-14 h-14 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold">Question Bank Access</h1>
          <p className="text-blue-100 mt-2">
            Browse curated question banks and read them online
          </p>
        </div>
      </section>

      {/* Content */}
      {!isAuthorized ? (
        <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SectionHeader
            title="Environment Awareness – Question Bank"
            subtitle="Restricted access: code required to view content"
          />
          <Card>
            <div className="p-6 text-center">
              <Lock className="w-10 h-10 mx-auto mb-4 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Enter Access Code
              </h2>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-3"
              >
                <input
                  type="password"
                  placeholder="Enter access code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Unlock
                </button>
              </form>
              {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
            </div>
          </Card>
        </section>
      ) : (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SectionHeader
            title="Environment Awareness – Learn, Prepare, Excel"
            subtitle="Question Bank for Students (Class 7ᵗʰ – 9ᵗʰ)"
          />
          <Card className="mt-8">
            <div className="p-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary-600" />
                  Environment Awareness – Question Bank
                </h3>
              </div>
              <PdfJsViewer src={PDF_FILE} />
            </div>
          </Card>
        </section>
      )}
    </div>
  );
};

export default QuestionBank;
