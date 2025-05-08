import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Button, Box, Typography, Stack } from "@mui/material";

// Set the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = "/node_modules/pdfjs-dist/build/pdf.worker.mjs";

const PdfViewer = ({ pdfUrl }) => {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const showToast = (message) => {
    alert(message);
  };

  const loadPdf = async () => {
    try {
      const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
    } catch (error) {
      console.error("Error loading PDF:", error);
      showToast(error.message || "Failed to load PDF.");
    }
  };

  const renderPage = async (pageNumber) => {
    if (!pdfDoc) return;

    try {
      const page = await pdfDoc.getPage(pageNumber);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Clear canvas before rendering
      context.clearRect(0, 0, canvas.width, canvas.height);

      const container = canvas.parentElement;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight || window.innerHeight;

      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(
        containerWidth / unscaledViewport.width,
        containerHeight / unscaledViewport.height
      );

      const viewport = page.getViewport({ scale });

      // Set canvas buffer size
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Set canvas *style* size to match buffer size exactly
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;
    } catch (error) {
      console.error("Error rendering page:", error);
      showToast("Failed to render PDF page.");
    }
  };

  useEffect(() => {
    loadPdf();
  }, [pdfUrl]);

  useEffect(() => {
    if (pdfDoc) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ textAlign: "center", mb: 1 }}>
        <Typography variant="h6" sx={{ color: '#fff' }}>PDF Preview</Typography>
      </Box>

      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
        <canvas
          ref={canvasRef}
          style={{
            border: "1px solid #ccc",
            display: "block",  // Prevents scrollbars and scaling
            margin: "0 auto"
          }}
        />
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <Typography sx={{ color: '#fff' }}>
          Page {currentPage} of {totalPages}
        </Typography>
        <Button variant="outlined" onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default PdfViewer;
