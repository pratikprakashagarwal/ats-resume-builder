import React, { useEffect, useState, useRef } from 'react';
import { Box, Paper, Typography, IconButton, Button } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import type { Resume } from '../../types/resume.types';

interface PaginatedResumePreviewProps {
  resume: Resume;
}

/**
 * A4 page dimensions and content calculations
 */
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const PAGE_PADDING = 48;
const CONTENT_HEIGHT = A4_HEIGHT - PAGE_PADDING * 2; // 1027px
const SAFETY_MARGIN = 50; // Margin to prevent border overlap and ensure clean page breaks
const SAFE_CONTENT_HEIGHT = CONTENT_HEIGHT - SAFETY_MARGIN; // 977px - Content must fit within this
const RENDER_HEIGHT = CONTENT_HEIGHT - 10; // 1017px - Actual render box height (10px clearance from border)

export const SmartPaginatedPreview: React.FC<PaginatedResumePreviewProps> = ({
  resume,
}) => {
  const [pages, setPages] = useState<React.ReactNode[][]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [scale, setScale] = useState(1);
  const [showAllPages, setShowAllPages] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const { personalInfo, workExperience, education, skills } = resume;

  /**
   * Calculate scale to fill full width of container
   */
  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const availableWidth = containerWidth - 40; // 40px margin
        const scaleByWidth = availableWidth / A4_WIDTH;
        const newScale = Math.min(scaleByWidth, 1.2); // Max 120% zoom
        setScale(newScale);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    
    // Use ResizeObserver for responsive container size changes
    const resizeObserver = new ResizeObserver(calculateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', calculateScale);
      resizeObserver.disconnect();
    };
  }, []);

  /**
   * Listen for PDF export events to render all pages
   */
  useEffect(() => {
    const handleExportStart = () => {
      console.log('📋 PDF Export: Rendering all pages...');
      setShowAllPages(true);
    };

    const handleExportEnd = () => {
      console.log('📋 PDF Export: Restoring normal view...');
      setShowAllPages(false);
    };

    window.addEventListener('pdf-export-start', handleExportStart);
    window.addEventListener('pdf-export-end', handleExportEnd);

    return () => {
      window.removeEventListener('pdf-export-start', handleExportStart);
      window.removeEventListener('pdf-export-end', handleExportEnd);
    };
  }, []);

  /**
   * Format date for display
   */
  const formatDate = (dateString?: string, current?: boolean) => {
    if (current) return 'Present';
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  /**
   * Section Header Component
   */
  const SectionHeader = ({ title }: { title: string }) => (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          fontSize: '16px',
          color: '#1a1a1a',
          textTransform: 'uppercase',
          borderBottom: '2px solid #1a1a1a',
          pb: 0.5,
        }}
      >
        {title}
      </Typography>
    </Box>
  );

  /**
   * Personal Info Section Component
   */
  const PersonalInfoSection = () => (
    <Box sx={{ mb: 3, textAlign: 'center' }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 'bold', 
          mb: 1, 
          color: '#1a1a1a', 
          fontSize: '28px' 
        }}
      >
        {personalInfo?.fullName || 'Your Name'}
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: 1, 
          fontSize: '12px', 
          color: '#555' 
        }}
      >
        {personalInfo?.email && (
          <Typography variant="body2">{personalInfo.email}</Typography>
        )}
        {personalInfo?.phone && (
          <>
            <Typography variant="body2">•</Typography>
            <Typography variant="body2">{personalInfo.phone}</Typography>
          </>
        )}
        {personalInfo?.location && (
          <>
            <Typography variant="body2">•</Typography>
            <Typography variant="body2">{personalInfo.location}</Typography>
          </>
        )}
      </Box>
      
      {personalInfo?.summary && (
        <Box sx={{ mt: 2, textAlign: 'left' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '13px', 
              lineHeight: 1.6, 
              color: '#333' 
            }}
          >
            {personalInfo.summary}
          </Typography>
        </Box>
      )}
    </Box>
  );

  /**
   * Work Experience Item Component
   */
  const WorkExperienceItem = ({ exp }: { exp: any }) => (
    <Box sx={{ mb: 2 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'baseline', 
          flexWrap: 'wrap' 
        }}
      >
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 'bold', 
            fontSize: '14px', 
            flex: '1 1 auto' 
          }}
        >
          {exp.position}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '12px', 
            color: '#555', 
            whiteSpace: 'nowrap', 
            ml: 2 
          }}
        >
          {formatDate(exp.startDate)} - {formatDate(exp.endDate, exp.current)}
        </Typography>
      </Box>
      
      <Typography 
        variant="body2" 
        sx={{ 
          fontSize: '13px', 
          fontStyle: 'italic', 
          mb: 0.5 
        }}
      >
        {exp.companyName}
      </Typography>
      
      <Box
        sx={{
          fontSize: '12px',
          lineHeight: 1.6,
          color: '#333',
          '& ul, & ol': { margin: '8px 0', paddingLeft: '20px' },
          '& li': { marginBottom: '4px' },
          '& strong': { fontWeight: 600 },
          '& p': { margin: '4px 0' },
        }}
        dangerouslySetInnerHTML={{ __html: exp.description }}
      />
    </Box>
  );

  /**
   * Education Item Component
   */
  const EducationItem = ({ edu }: { edu: any }) => (
    <Box sx={{ mb: 2 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'baseline', 
          flexWrap: 'wrap' 
        }}
      >
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 'bold', 
            fontSize: '14px', 
            flex: '1 1 auto' 
          }}
        >
          {edu.degree}
          {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '12px', 
            color: '#555', 
            whiteSpace: 'nowrap', 
            ml: 2 
          }}
        >
          {formatDate(edu.startDate)} - {formatDate(edu.endDate, edu.current)}
        </Typography>
      </Box>
      
      <Typography 
        variant="body2" 
        sx={{ 
          fontSize: '13px', 
          fontStyle: 'italic' 
        }}
      >
        {edu.institution}
      </Typography>
      
      {edu.description && (
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '12px', 
            lineHeight: 1.6, 
            color: '#333', 
            mt: 0.5 
          }}
        >
          {edu.description}
        </Typography>
      )}
    </Box>
  );

  /**
   * Skills Section Component
   */
  const SkillsSection = () => (
    <Box>
      {Object.entries(
        skills?.reduce((acc, skill) => {
          const category = skill.category || 'Other';
          if (!acc[category]) acc[category] = [];
          acc[category].push(skill.name);
          return acc;
        }, {} as Record<string, string[]>) || {}
      ).map(([category, skillNames]) => (
        <Box key={category} sx={{ mb: 1 }}>
          <Typography 
            variant="body2" 
            component="span" 
            sx={{ 
              fontWeight: 'bold', 
              fontSize: '12px' 
            }}
          >
            {category}:{' '}
          </Typography>
          <Typography 
            variant="body2" 
            component="span" 
            sx={{ 
              fontSize: '12px', 
              color: '#333' 
            }}
          >
            {skillNames.join(', ')}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  /**
   * Generate pages with ATOMIC work items and proper height management
   * Each work experience/education item stays together (not split across pages)
   */
  const generatePages = () => {
    setTimeout(() => {
      if (!measureRef.current) return;

      const pageElements: React.ReactNode[][] = [];
      let currentPageElements: React.ReactNode[] = [];
      let currentHeight = 0;

      console.log('🔄 Pagination: Starting (Safe height:', SAFE_CONTENT_HEIGHT, 'px)');

      /**
       * Helper to start a new page
       */
      const startNewPage = () => {
        if (currentPageElements.length > 0) {
          console.log(`📄 Page saved: ${currentHeight}px used`);
          pageElements.push([...currentPageElements]);
        }
        currentPageElements = [];
        currentHeight = 0;
      };

      // ==================== Personal Info ====================
      if (personalInfo) {
        const el = measureRef.current.querySelector('.measure-personal-info');
        const height = el ? (el as HTMLElement).offsetHeight : 120;
        
        console.log(`Personal Info: ${height}px`);
        
        if (currentHeight + height > SAFE_CONTENT_HEIGHT) {
          startNewPage();
        }
        
        currentPageElements.push(<PersonalInfoSection key="personal-info" />);
        currentHeight += height;
      }

      // ==================== Work Experience ====================
      if (workExperience && workExperience.length > 0) {
        const headerEl = measureRef.current.querySelector('.measure-work-header');
        const headerHeight = headerEl ? (headerEl as HTMLElement).offsetHeight : 40;

        console.log(`Work Experience Header: ${headerHeight}px (Current: ${currentHeight}px)`);

        // Check if header fits on current page
        if (currentHeight + headerHeight > SAFE_CONTENT_HEIGHT) {
          console.log('⚠️ Header doesn\'t fit, new page');
          startNewPage();
        }

        // Add header ONCE (not repeated on subsequent pages)
        currentPageElements.push(<SectionHeader key="work-header" title="Work Experience" />);
        currentHeight += headerHeight;

        // Add each work item (ATOMIC - each stays together)
        workExperience.sort((a, b) => a.order - b.order).forEach((exp, idx) => {
          const itemEl = measureRef.current?.querySelector(`.measure-work-${idx}`);
          const itemHeight = itemEl ? (itemEl as HTMLElement).offsetHeight : 100;

          console.log(
            `Work #${idx}: ${itemHeight}px ` +
            `(Current: ${currentHeight}px, Available: ${SAFE_CONTENT_HEIGHT - currentHeight}px)`
          );

          // ATOMIC CHECK: If entire item doesn't fit, move to next page
          if (currentHeight + itemHeight > SAFE_CONTENT_HEIGHT) {
            console.log(`❌ Work #${idx} doesn't fit - moving entire item to next page (ATOMIC)`);
            startNewPage();
          }

          // Warning for oversized items
          if (itemHeight > SAFE_CONTENT_HEIGHT) {
            console.warn(
              `⚠️⚠️ Work #${idx} is TOO LARGE (${itemHeight}px) for one page! ` +
              `Consider shortening the description to fit within ${SAFE_CONTENT_HEIGHT}px.`
            );
          }

          currentPageElements.push(<WorkExperienceItem key={`work-${idx}`} exp={exp} />);
          currentHeight += itemHeight;
        });
      }

      // ==================== Education ====================
      if (education && education.length > 0) {
        const headerEl = measureRef.current.querySelector('.measure-edu-header');
        const headerHeight = headerEl ? (headerEl as HTMLElement).offsetHeight : 40;

        if (currentHeight + headerHeight > SAFE_CONTENT_HEIGHT) {
          startNewPage();
        }

        currentPageElements.push(<SectionHeader key="edu-header" title="Education" />);
        currentHeight += headerHeight;

        education.sort((a, b) => a.order - b.order).forEach((edu, idx) => {
          const itemEl = measureRef.current?.querySelector(`.measure-edu-${idx}`);
          const itemHeight = itemEl ? (itemEl as HTMLElement).offsetHeight : 80;

          console.log(`Education #${idx}: ${itemHeight}px (Current: ${currentHeight}px)`);

          if (currentHeight + itemHeight > SAFE_CONTENT_HEIGHT) {
            console.log(`❌ Education #${idx} doesn't fit - new page`);
            startNewPage();
          }

          currentPageElements.push(<EducationItem key={`edu-${idx}`} edu={edu} />);
          currentHeight += itemHeight;
        });
      }

      // ==================== Skills ====================
      if (skills && skills.length > 0) {
        const headerEl = measureRef.current.querySelector('.measure-skills-header');
        const skillsEl = measureRef.current.querySelector('.measure-skills-content');
        const headerHeight = headerEl ? (headerEl as HTMLElement).offsetHeight : 40;
        const skillsHeight = skillsEl ? (skillsEl as HTMLElement).offsetHeight : 100;
        const totalHeight = headerHeight + skillsHeight;

        console.log(`Skills: ${totalHeight}px (Header: ${headerHeight}px + Content: ${skillsHeight}px)`);

        if (currentHeight + totalHeight > SAFE_CONTENT_HEIGHT) {
          console.log('❌ Skills section doesn\'t fit - new page');
          startNewPage();
        }

        currentPageElements.push(<SectionHeader key="skills-header" title="Skills" />);
        currentPageElements.push(<SkillsSection key="skills-content" />);
        currentHeight += totalHeight;
      }

      // Save final page
      if (currentPageElements.length > 0) {
        console.log(`📄 Final page: ${currentHeight}px used`);
        pageElements.push(currentPageElements);
      }

      console.log(`✅ Pagination complete: ${pageElements.length} page(s) generated`);
      setPages(pageElements);
      
      // Reset to first page if current page is out of bounds
      if (currentPage >= pageElements.length && pageElements.length > 0) {
        setCurrentPage(0);
      }
    }, 100); // Small delay to ensure DOM is ready
  };

  useEffect(() => {
    generatePages();
  }, [resume]);

  return (
    <Box 
      ref={containerRef} 
      sx={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}
    >
      {/* ==================== Hidden Measurement Container ==================== */}
      <Box
        ref={measureRef}
        sx={{
          position: 'absolute',
          left: '-9999px',
          width: `${A4_WIDTH - PAGE_PADDING * 2}px`,
          visibility: 'hidden',
        }}
      >
        {personalInfo && (
          <Box className="measure-personal-info">
            <PersonalInfoSection />
          </Box>
        )}
        
        {workExperience && workExperience.length > 0 && (
          <>
            <Box className="measure-work-header">
              <SectionHeader title="Work Experience" />
            </Box>
            {workExperience.map((exp, idx) => (
              <Box key={idx} className={`measure-work-${idx}`}>
                <WorkExperienceItem exp={exp} />
              </Box>
            ))}
          </>
        )}
        
        {education && education.length > 0 && (
          <>
            <Box className="measure-edu-header">
              <SectionHeader title="Education" />
            </Box>
            {education.map((edu, idx) => (
              <Box key={idx} className={`measure-edu-${idx}`}>
                <EducationItem edu={edu} />
              </Box>
            ))}
          </>
        )}
        
        {skills && skills.length > 0 && (
          <>
            <Box className="measure-skills-header">
              <SectionHeader title="Skills" />
            </Box>
            <Box className="measure-skills-content">
              <SkillsSection />
            </Box>
          </>
        )}
      </Box>

      {/* ==================== Navigation Controls ==================== */}
      {pages.length > 1 && !showAllPages && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            mb: 2,
            p: 1.5,
            bgcolor: 'background.paper',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 1,
            width: '100%',
            maxWidth: `${A4_WIDTH * scale}px`,
          }}
        >
          <IconButton 
            onClick={() => setCurrentPage(0)} 
            disabled={currentPage === 0} 
            size="small"
            aria-label="First page"
          >
            <FirstPageIcon />
          </IconButton>
          
          <IconButton 
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))} 
            disabled={currentPage === 0} 
            size="small"
            aria-label="Previous page"
          >
            <NavigateBeforeIcon />
          </IconButton>
          
          <Typography 
            variant="body2" 
            sx={{ 
              minWidth: '120px', 
              textAlign: 'center', 
              fontWeight: 'bold' 
            }}
          >
            Page {currentPage + 1} of {pages.length}
          </Typography>
          
          <IconButton 
            onClick={() => setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1))} 
            disabled={currentPage === pages.length - 1} 
            size="small"
            aria-label="Next page"
          >
            <NavigateNextIcon />
          </IconButton>
          
          <IconButton 
            onClick={() => setCurrentPage(pages.length - 1)} 
            disabled={currentPage === pages.length - 1} 
            size="small"
            aria-label="Last page"
          >
            <LastPageIcon />
          </IconButton>
        </Box>
      )}

      {/* ==================== Page Display ==================== */}
      {pages.length > 0 && (
        <Box 
          sx={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 2 
          }}
        >
          {showAllPages ? (
            // ========== EXPORT MODE: Render ALL pages (hidden for PDF capture) ==========
            pages.map((pageContent, index) => (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  left: '-9999px',
                  transform: 'scale(1)',
                  transformOrigin: 'top left',
                }}
              >
                <Paper
                  className="resume-page"
                  data-page={index + 1}
                  elevation={3}
                  sx={{
                    width: `${A4_WIDTH}px`,
                    height: `${A4_HEIGHT}px`,
                    p: `${PAGE_PADDING}px`,
                    bgcolor: 'white',
                    fontFamily: 'Arial, sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '2px solid #d0d0d0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  <Box 
                    sx={{ 
                      height: `${RENDER_HEIGHT}px`, // Reduced height for border clearance
                      overflow: 'hidden',
                      pb: 1, // Extra padding for safety
                    }}
                  >
                    {pageContent}
                  </Box>
                  
                  {pages.length > 1 && (
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 24,
                        color: '#999',
                        fontSize: '10px',
                      }}
                    >
                      Page {index + 1} of {pages.length}
                    </Typography>
                  )}
                </Paper>
              </Box>
            ))
          ) : (
            // ========== NORMAL MODE: Show only current page (scaled) ==========
            <Box 
              sx={{ 
                transform: `scale(${scale})`, 
                transformOrigin: 'top center', 
                transition: 'transform 0.2s ease' 
              }}
            >
              <Paper
                className="resume-page"
                data-page={currentPage + 1}
                elevation={3}
                sx={{
                  width: `${A4_WIDTH}px`,
                  height: `${A4_HEIGHT}px`,
                  p: `${PAGE_PADDING}px`,
                  bgcolor: 'white',
                  fontFamily: 'Arial, sans-serif',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '2px solid #d0d0d0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <Box 
                  sx={{ 
                    height: `${RENDER_HEIGHT}px`, // Reduced height for border clearance
                    overflow: 'hidden',
                    pb: 1, // Extra padding for safety
                  }}
                >
                  {pages[currentPage]}
                </Box>
                
                {pages.length > 1 && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: 24,
                      color: '#999',
                      fontSize: '10px',
                    }}
                  >
                    Page {currentPage + 1} of {pages.length}
                  </Typography>
                )}
              </Paper>
            </Box>
          )}
        </Box>
      )}

      {/* ==================== Quick Jump Buttons ==================== */}
      {pages.length > 2 && !showAllPages && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 1, 
            flexWrap: 'wrap', 
            mt: 1, 
            width: '100%' 
          }}
        >
          {pages.map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setCurrentPage(index)}
              sx={{ minWidth: '36px', height: '36px' }}
            >
              {index + 1}
            </Button>
          ))}
        </Box>
      )}

      {/* ==================== Preview Info ==================== */}
      {!showAllPages && (
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ mt: 1 }}
        >
          Preview: {Math.round(scale * 100)}% • {pages.length} page{pages.length > 1 ? 's' : ''}
        </Typography>
      )}
    </Box>
  );
};
