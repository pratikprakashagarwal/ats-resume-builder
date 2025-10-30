import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Resume } from '../types/resume.types';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

/**
 * Strips HTML tags from a string
 */
export const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Exports resume data as JSON file
 */
export const exportToJSON = (resume: Resume) => {
  const cleanResume = {
    ...resume,
    workExperience:
      resume.workExperience?.map((exp) => ({
        ...exp,
        description: stripHtml(exp.description),
      })) || [],
    education:
      resume.education?.map((edu) => ({
        ...edu,
        description: edu.description ? stripHtml(edu.description) : '',
      })) || [],
  };

  const dataStr = JSON.stringify(cleanResume, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

  const exportFileDefaultName = `${resume.title || 'resume'}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

/**
 * Exports ALL pages of resume as a single multi-page PDF
 * @param resume - The resume object
 * @param filename - Desired filename (without extension)
 */
export const exportToPDF = async (
  resume: Resume,
  filename: string = 'resume'
): Promise<void> => {
  console.log('🔄 Starting PDF export for all pages...');

  // Trigger event to render all pages
  const renderEvent = new CustomEvent('pdf-export-start');
  window.dispatchEvent(renderEvent);

  // Wait for pages to render
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Get all resume pages
    const pages = document.querySelectorAll('.resume-page');

    if (pages.length === 0) {
      throw new Error('No resume pages found. Make sure the preview is visible.');
    }

    console.log(`📄 Found ${pages.length} page(s) to export`);

    // Create PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Capture each page
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      
      console.log(`📸 Capturing page ${i + 1}/${pages.length}...`);

      // Make sure page is visible
      const originalDisplay = page.style.display;
      const originalVisibility = page.style.visibility;
      page.style.display = 'block';
      page.style.visibility = 'visible';

      try {
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 794,
          windowHeight: 1123,
        });

        console.log(`  ✅ Captured: ${canvas.width}x${canvas.height}px`);

        const imgData = canvas.toDataURL('image/png', 1.0);
        const imgWidth = A4_WIDTH_MM;
        const imgHeight = (canvas.height * A4_WIDTH_MM) / canvas.width;

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
        console.log(`  ✅ Added to PDF`);

      } finally {
        // Restore original display
        page.style.display = originalDisplay;
        page.style.visibility = originalVisibility;
      }
    }

    const finalFilename = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    pdf.save(finalFilename);
    
    console.log(`✅ PDF exported successfully: ${finalFilename}`);
    console.log(`📦 Total pages: ${pages.length}`);

  } catch (error) {
    console.error('❌ PDF export failed:', error);
    throw error;
  } finally {
    // Trigger event to restore normal view
    const endEvent = new CustomEvent('pdf-export-end');
    window.dispatchEvent(endEvent);
  }
};
