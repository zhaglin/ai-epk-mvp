import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ArtistData } from '@/types';

// Регистрируем шрифты (можно заменить на кастомные)
// Font.register({
//   family: 'Roboto',
//   src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
// });

// Стили для PDF
const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 3,
    borderBottomColor: '#2563EB',
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  brandText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 5,
  },
  text: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 1.6,
    marginBottom: 8,
  },
  highlight: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 6,
    paddingLeft: 15,
  },
  highlightBullet: {
    fontSize: 14,
    color: '#2563EB',
    marginRight: 8,
  },
  linksContainer: {
    marginTop: 10,
  },
  link: {
    fontSize: 10,
    color: '#2563EB',
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 9,
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  genreChip: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
    borderRadius: 12,
  },
});

interface PDFTemplateProps {
  data: ArtistData;
}

export const EPKDocument: React.FC<PDFTemplateProps> = ({ data }) => {
  const { name, city, genres, generated, links } = data;
  const generatedDate = new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>
            {city} • {genres.join(', ')}
          </Text>
          <Text style={styles.brandText}>Electronic Press Kit (EPK)</Text>
        </View>

        {/* Elevator Pitch */}
        {generated?.pitch && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Elevator Pitch</Text>
            <Text style={styles.text}>{generated.pitch}</Text>
          </View>
        )}

        {/* Full Bio */}
        {generated?.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Biography</Text>
            <Text style={styles.text}>{generated.bio}</Text>
          </View>
        )}

        {/* Key Highlights */}
        {generated?.highlights && generated.highlights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Highlights</Text>
            {generated.highlights.map((highlight, index) => (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 6 }}>
                <Text style={styles.highlightBullet}>•</Text>
                <Text style={styles.highlight}>{highlight}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Links */}
        {links && Object.values(links).some((link) => link) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Links</Text>
            <View style={styles.linksContainer}>
              {links.instagram && <Text style={styles.link}>Instagram: {links.instagram}</Text>}
              {links.soundcloud && <Text style={styles.link}>SoundCloud: {links.soundcloud}</Text>}
              {links.mixcloud && <Text style={styles.link}>Mixcloud: {links.mixcloud}</Text>}
              {links.website && <Text style={styles.link}>Website: {links.website}</Text>}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            EPK сгенерирован {generatedDate} • Powered by AI EPK Generator
          </Text>
        </View>
      </Page>
    </Document>
  );
};

