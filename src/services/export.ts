import type { Resume } from '@/types'

/**
 * Export resume as JSON
 */
export function exportToJSON(resume: Resume): string {
  return JSON.stringify(resume, null, 2)
}

/**
 * Get computed styles as inline CSS string for an element
 */
function getComputedStylesCSS(element: Element): string {
  const styles = window.getComputedStyle(element)
  const cssText: string[] = []

  // Important properties to capture
  const importantProps = [
    'font-family', 'font-size', 'font-weight', 'font-style', 'line-height',
    'color', 'background-color', 'background',
    'margin', 'padding', 'border', 'border-radius',
    'display', 'flex-direction', 'justify-content', 'align-items', 'gap',
    'width', 'max-width', 'min-width', 'height', 'max-height', 'min-height',
    'text-align', 'text-decoration', 'text-transform', 'letter-spacing',
    'white-space', 'word-wrap', 'overflow-wrap',
    'position', 'top', 'right', 'bottom', 'left',
    'grid-template-columns', 'grid-gap',
    'box-sizing', 'opacity',
  ]

  importantProps.forEach(prop => {
    const value = styles.getPropertyValue(prop)
    if (value && value !== 'none' && value !== 'auto' && value !== 'normal') {
      cssText.push(`${prop}: ${value}`)
    }
  })

  return cssText.join('; ')
}

/**
 * Clone element with inline styles for printing
 */
function cloneWithStyles(element: Element): Element {
  const clone = element.cloneNode(true) as Element

  // Apply computed styles to clone
  const applyStyles = (original: Element, cloned: Element) => {
    if (original instanceof HTMLElement && cloned instanceof HTMLElement) {
      const styles = getComputedStylesCSS(original)
      if (styles) {
        cloned.setAttribute('style', (cloned.getAttribute('style') || '') + '; ' + styles)
      }
    }

    const originalChildren = original.children
    const clonedChildren = cloned.children

    for (let i = 0; i < originalChildren.length; i++) {
      const origChild = originalChildren[i]
      const clonedChild = clonedChildren[i]
      if (origChild && clonedChild) {
        applyStyles(origChild, clonedChild)
      }
    }
  }

  applyStyles(element, clone)
  return clone
}

/**
 * Export resume as PDF
 */
export async function exportToPDF(resume: Resume, elementId: string): Promise<Blob> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Resume preview element not found')
  }

  // Dynamic import to avoid build-time issues
  const html2pdf = (await import('html2pdf.js')).default

  const opt = {
    margin: [5, 5, 5, 5] as [number, number, number, number],
    filename: `${resume.title || 'resume'}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      letterRendering: true,
      backgroundColor: '#ffffff',
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait' as const,
      compress: true,
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  }

  return html2pdf().set(opt).from(element).outputPdf('blob') as Promise<Blob>
}

/**
 * Generate print-friendly HTML with all styles inlined
 */
function generatePrintHTML(element: HTMLElement): string {
  // Clone with computed styles
  const styledClone = cloneWithStyles(element)

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume - Print</title>
        <style>
          /* Reset and base styles */
          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          html, body {
            width: 100%;
            height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #111827;
            background: #ffffff;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            padding: 0;
            margin: 0;
          }

          /* Container */
          .print-container {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            padding: 10mm;
            background: #ffffff;
          }

          /* Typography */
          h1, h2, h3, h4, h5, h6 {
            margin: 0;
            font-weight: 600;
          }

          h1 { font-size: 28px; }
          h2 { font-size: 20px; }
          h3 { font-size: 16px; }

          p, li {
            margin: 0;
          }

          ul, ol {
            padding-left: 20px;
          }

          a {
            color: #2563eb;
            text-decoration: none;
          }

          /* Grid and Flex utilities */
          .flex { display: flex; }
          .flex-wrap { flex-wrap: wrap; }
          .gap-2 { gap: 8px; }
          .gap-3 { gap: 12px; }
          .gap-4 { gap: 16px; }
          .items-center { align-items: center; }
          .justify-between { justify-content: space-between; }

          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
          .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }

          /* Spacing utilities */
          .mb-1 { margin-bottom: 4px; }
          .mb-2 { margin-bottom: 8px; }
          .mb-3 { margin-bottom: 12px; }
          .mb-4 { margin-bottom: 16px; }
          .mb-6 { margin-bottom: 24px; }
          .mb-8 { margin-bottom: 32px; }

          .mt-1 { margin-top: 4px; }
          .mt-2 { margin-top: 8px; }

          .p-2 { padding: 8px; }
          .p-4 { padding: 16px; }
          .p-8 { padding: 32px; }

          .px-2 { padding-left: 8px; padding-right: 8px; }
          .px-3 { padding-left: 12px; padding-right: 12px; }
          .py-1 { padding-top: 4px; padding-bottom: 4px; }

          /* Text utilities */
          .text-sm { font-size: 12px; }
          .text-xs { font-size: 10px; }
          .text-lg { font-size: 18px; }
          .text-xl { font-size: 20px; }
          .text-2xl { font-size: 24px; }
          .text-3xl { font-size: 30px; }
          .text-4xl { font-size: 36px; }

          .font-bold { font-weight: 700; }
          .font-semibold { font-weight: 600; }
          .font-medium { font-weight: 500; }
          .font-light { font-weight: 300; }

          .text-center { text-align: center; }
          .text-left { text-align: left; }
          .text-right { text-align: right; }
          .text-justify { text-align: justify; }

          .uppercase { text-transform: uppercase; }
          .capitalize { text-transform: capitalize; }

          .whitespace-nowrap { white-space: nowrap; }
          .whitespace-pre-line { white-space: pre-line; }

          .tracking-tight { letter-spacing: -0.025em; }
          .tracking-widest { letter-spacing: 0.1em; }

          /* Colors - preserved for print */
          .text-gray-400 { color: #9ca3af; }
          .text-gray-500 { color: #6b7280; }
          .text-gray-600 { color: #4b5563; }
          .text-gray-700 { color: #374151; }
          .text-gray-800 { color: #1f2937; }
          .text-gray-900 { color: #111827; }

          .text-blue-600 { color: #2563eb; }
          .text-blue-700 { color: #1d4ed8; }

          .bg-gray-100 { background-color: #f3f4f6; }
          .bg-gray-200 { background-color: #e5e7eb; }
          .bg-white { background-color: #ffffff; }

          /* Border utilities */
          .border { border: 1px solid #e5e7eb; }
          .border-b { border-bottom: 1px solid #e5e7eb; }
          .border-b-2 { border-bottom: 2px solid #e5e7eb; }
          .border-l-4 { border-left: 4px solid #e5e7eb; }
          .border-gray-200 { border-color: #e5e7eb; }
          .border-gray-300 { border-color: #d1d5db; }

          .rounded { border-radius: 4px; }
          .rounded-lg { border-radius: 8px; }
          .rounded-full { border-radius: 9999px; }

          /* List styles */
          .list-disc { list-style-type: disc; }
          .list-inside { list-style-position: inside; }

          /* Inline display */
          .inline-block { display: inline-block; }
          .block { display: block; }

          /* Opacity */
          .opacity-50 { opacity: 0.5; }
          .opacity-70 { opacity: 0.7; }
          .opacity-90 { opacity: 0.9; }

          /* Width/Height */
          .w-full { width: 100%; }
          .h-full { height: 100%; }
          .h-2 { height: 8px; }
          .min-h-full { min-height: 100%; }

          /* Sections */
          section {
            break-inside: avoid;
          }

          /* Resume-specific styles */
          .resume-preview {
            background: #ffffff;
            color: #111827;
          }

          /* Print-specific rules */
          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
            }

            body {
              margin: 0;
              padding: 0;
            }

            .print-container {
              padding: 0;
              max-width: none;
            }

            @page {
              size: A4 portrait;
              margin: 10mm;
            }

            /* Avoid page breaks inside important elements */
            h1, h2, h3, h4, h5, h6 {
              break-after: avoid;
            }

            section, article, div {
              break-inside: avoid;
            }

            /* Hide elements not needed for print */
            .no-print,
            button,
            nav {
              display: none !important;
            }

            /* Ensure colors print */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${styledClone.outerHTML}
        </div>
        <script>
          // Auto-trigger print after load
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 250);
          };
        </script>
      </body>
    </html>
  `
}

/**
 * Export resume to print
 */
export function exportToPrint(elementId: string): void {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Resume preview element not found')
  }

  const printWindow = window.open('', '_blank', 'width=800,height=1000')
  if (!printWindow) {
    throw new Error('Failed to open print window. Please allow popups for this site.')
  }

  const printHTML = generatePrintHTML(element as HTMLElement)

  printWindow.document.write(printHTML)
  printWindow.document.close()
}
