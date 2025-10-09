import { jsPDF } from 'jspdf';
import { ArtistData } from '@/types';

/**
 * Генерирует PDF EPK для артиста используя jsPDF
 * Работает на клиенте и сервере
 */
export function generateEPKPDF(data: ArtistData): jsPDF {
  // Создаем PDF документ (portrait, mm, A4)
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // ===== HEADER =====
  pdf.setFillColor(45, 55, 72); // темно-серый фон
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  // Имя артиста (белый, жирный)
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.text(data.name, margin, 20);
  
  // Город и жанры (светло-серый)
  pdf.setTextColor(203, 213, 225);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  const cityAndGenres = `${data.city} • ${data.genres.join(', ')}`;
  pdf.text(cityAndGenres, margin, 30);
  
  yPosition = 55;

  // ===== ELEVATOR PITCH =====
  if (data.generated?.pitch) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(59, 130, 246); // синий
    pdf.text('Elevator Pitch', margin, yPosition);
    yPosition += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(55, 65, 81); // темно-серый
    const pitchLines = pdf.splitTextToSize(data.generated.pitch, contentWidth);
    pdf.text(pitchLines, margin, yPosition);
    yPosition += (pitchLines.length * 6) + 10;
  }

  // ===== BIOGRAPHY =====
  if (data.generated?.bio) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Biography', margin, yPosition);
    yPosition += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(55, 65, 81);
    const bioLines = pdf.splitTextToSize(data.generated.bio, contentWidth);
    pdf.text(bioLines, margin, yPosition);
    yPosition += (bioLines.length * 6) + 10;
  }

  // ===== KEY HIGHLIGHTS =====
  if (data.generated?.highlights && data.generated.highlights.length > 0) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Key Highlights', margin, yPosition);
    yPosition += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(55, 65, 81);
    
    data.generated.highlights.forEach((highlight) => {
      // Проверяем, не выходим ли за границы страницы
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }
      
      // Синий маркер
      pdf.setFillColor(59, 130, 246);
      pdf.circle(margin + 2, yPosition - 1.5, 1.5, 'F');
      
      // Текст highlight с переносом строк
      const highlightLines = pdf.splitTextToSize(highlight, contentWidth - 8);
      pdf.text(highlightLines, margin + 6, yPosition);
      yPosition += (highlightLines.length * 5) + 3;
    });
    
    yPosition += 7;
  }

  // ===== VENUES & EXPERIENCE =====
  if (data.venues) {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Venues & Experience', margin, yPosition);
    yPosition += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(55, 65, 81);
    const venuesLines = pdf.splitTextToSize(data.venues, contentWidth);
    pdf.text(venuesLines, margin, yPosition);
    yPosition += (venuesLines.length * 5) + 10;
  }

  // ===== LINKS =====
  if (data.links && Object.values(data.links).some((link) => link)) {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Links', margin, yPosition);
    yPosition += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    
    // Instagram
    if (data.links.instagram) {
      pdf.setTextColor(75, 85, 99);
      pdf.text('Instagram:', margin, yPosition);
      pdf.setTextColor(59, 130, 246);
      pdf.textWithLink(data.links.instagram, margin + 25, yPosition, { url: data.links.instagram });
      yPosition += 6;
    }
    
    // SoundCloud
    if (data.links.soundcloud) {
      pdf.setTextColor(75, 85, 99);
      pdf.text('SoundCloud:', margin, yPosition);
      pdf.setTextColor(59, 130, 246);
      pdf.textWithLink(data.links.soundcloud, margin + 25, yPosition, { url: data.links.soundcloud });
      yPosition += 6;
    }
    
    // Mixcloud
    if (data.links.mixcloud) {
      pdf.setTextColor(75, 85, 99);
      pdf.text('Mixcloud:', margin, yPosition);
      pdf.setTextColor(59, 130, 246);
      pdf.textWithLink(data.links.mixcloud, margin + 25, yPosition, { url: data.links.mixcloud });
      yPosition += 6;
    }
    
    // Website
    if (data.links.website) {
      pdf.setTextColor(75, 85, 99);
      pdf.text('Website:', margin, yPosition);
      pdf.setTextColor(59, 130, 246);
      pdf.textWithLink(data.links.website, margin + 25, yPosition, { url: data.links.website });
      yPosition += 6;
    }
  }

  // ===== FOOTER =====
  const footerY = pageHeight - 15;
  pdf.setFontSize(8);
  pdf.setTextColor(156, 163, 175); // светло-серый
  pdf.setFont('helvetica', 'italic');
  const footerText = `Generated by AI-EPK on ${new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`;
  pdf.text(footerText, pageWidth / 2, footerY, { align: 'center' });

  return pdf;
}

