import Papa from 'papaparse';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportData {
  [key: string]: any;
}

export function exportToCSV(data: ExportData[], filename: string) {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  try {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('CSV export failed:', error);
    throw new Error('Failed to export CSV file');
  }
}

export function exportToPDF(data: ExportData[], filename: string, title: string) {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Add title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, pageWidth / 2, 20, { align: 'center' });
    
    // Add generation date
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const dateStr = `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    pdf.text(dateStr, pageWidth / 2, 30, { align: 'center' });
    
    // Prepare table data
    const headers = Object.keys(data[0]);
    const rows = data.map(item => headers.map(header => String(item[header] || '')));
    
    // Calculate column widths
    const colWidth = (pageWidth - 20) / headers.length;
    let yPosition = 45;
    
    // Add headers
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    headers.forEach((header, index) => {
      pdf.text(header, 10 + (index * colWidth), yPosition);
    });
    
    // Add horizontal line under headers
    pdf.line(10, yPosition + 2, pageWidth - 10, yPosition + 2);
    yPosition += 8;
    
    // Add data rows
    pdf.setFont('helvetica', 'normal');
    rows.forEach((row, rowIndex) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      
      row.forEach((cell, cellIndex) => {
        const cellText = String(cell).substring(0, 20); // Truncate long text
        pdf.text(cellText, 10 + (cellIndex * colWidth), yPosition);
      });
      
      yPosition += 6;
    });
    
    // Add footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.text(
        `Page ${i} of ${totalPages} - CryptoEdu Payment System`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }
    
    // Save the PDF
    pdf.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Failed to export PDF file');
  }
}

export async function exportTableToPDF(tableElement: HTMLElement, filename: string, title: string) {
  try {
    const canvas = await html2canvas(tableElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    // Add title
    pdf.setFontSize(16);
    pdf.text(title, 105, 15, { align: 'center' });
    position = 25;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Table PDF export failed:', error);
    throw new Error('Failed to export table as PDF');
  }
}