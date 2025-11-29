/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { Exhibition, ExhibitionArtwork } from '@/types'

// Register fonts if needed (using standard fonts for now)
// Font.register({ family: 'Roboto', src: '...' });

const styles = StyleSheet.create({
    // Wall Labels (Avery 28878: 2" x 3.5", 10 per sheet)
    // Margins: Top 0.5", Side 0.75" -> approx 36pt, 54pt
    // Card: 3.5" x 2" -> 252pt x 144pt
    pageLabels: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 36, // 0.5 inch
        paddingLeft: 54, // 0.75 inch
        paddingRight: 54,
        alignContent: 'flex-start',
    },
    labelCard: {
        width: 252, // 3.5 inches
        height: 144, // 2 inches
        padding: 15,
        justifyContent: 'center',
        // border: '1pt solid #eee', // Uncomment for debugging alignment
    },
    labelArtist: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Helvetica-Bold',
    },
    labelTitle: {
        fontSize: 11,
        fontStyle: 'italic',
        marginBottom: 2,
        fontFamily: 'Helvetica',
    },
    labelMedium: {
        fontSize: 9,
        color: '#444',
        marginBottom: 1,
        fontFamily: 'Helvetica',
    },
    labelDimensions: {
        fontSize: 8,
        color: '#666',
        fontFamily: 'Helvetica',
    },

    // Price List
    pagePriceList: {
        padding: 40,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 30,
        borderBottom: '1pt solid #ccc',
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        marginBottom: 5,
        fontFamily: 'Helvetica-Bold',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#666',
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 20,
        paddingBottom: 20,
        borderBottom: '0.5pt solid #eee',
    },
    itemImage: {
        width: 100,
        height: 100,
        objectFit: 'contain',
        marginRight: 20,
        backgroundColor: '#f9f9f9',
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    itemArtist: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemTitle: {
        fontSize: 14,
        fontFamily: 'Helvetica',
        fontStyle: 'italic',
        marginBottom: 4,
    },
    itemMeta: {
        fontSize: 10,
        color: '#444',
        marginBottom: 2,
    },
    itemPrice: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        fontSize: 8,
        color: '#888',
        textAlign: 'center',
        borderTop: '1pt solid #eee',
        paddingTop: 10,
    },
})

interface PrintProps {
    exhibition: Exhibition
    items: ExhibitionArtwork[]
}

export const WallLabelsDocument: React.FC<PrintProps> = ({ items }) => (
    <Document>
        <Page size="LETTER" style={styles.pageLabels}>
            {items.map((item) => (
                <View key={item.artwork_id} style={styles.labelCard} wrap={false}>
                    <Text style={styles.labelArtist}>
                        {item.artwork?.artist?.full_name || 'Artist Name'}
                    </Text>
                    <Text style={styles.labelTitle}>
                        {item.artwork?.title || 'Untitled'}
                    </Text>
                    <Text style={styles.labelMedium}>
                        {item.artwork?.medium}
                    </Text>
                    <Text style={styles.labelDimensions}>
                        {item.artwork?.dimensions}
                    </Text>
                </View>
            ))}
        </Page>
    </Document>
)

export const PriceListDocument: React.FC<PrintProps> = ({ exhibition, items }) => (
    <Document>
        <Page size="LETTER" style={styles.pagePriceList}>
            <View style={styles.header} fixed>
                <Text style={styles.headerTitle}>{exhibition.title}</Text>
                <Text style={styles.headerSubtitle}>
                    {new Date(exhibition.start_date).toLocaleDateString()} - {new Date(exhibition.end_date).toLocaleDateString()}
                </Text>
            </View>

            {items.map((item) => (
                <View key={item.artwork_id} style={styles.itemRow} wrap={false}>
                    {item.artwork?.image_url && (
                        <Image
                            src={`/api/proxy-image?url=${encodeURIComponent(item.artwork.image_url)}`}
                            style={styles.itemImage}
                        />
                    )}
                    <View style={styles.itemDetails}>
                        <Text style={styles.itemArtist}>
                            {item.artwork?.artist?.full_name}
                        </Text>
                        <Text style={styles.itemTitle}>
                            {item.artwork?.title}
                        </Text>
                        <Text style={styles.itemMeta}>
                            {item.artwork?.medium}
                        </Text>
                        <Text style={styles.itemMeta}>
                            {item.artwork?.dimensions}
                        </Text>
                        <Text style={styles.itemPrice}>
                            {item.artwork?.price ? `$${item.artwork.price.toLocaleString()}` : 'Inquire'}
                        </Text>
                    </View>
                </View>
            ))}

            <Text style={styles.footer} fixed render={({ pageNumber, totalPages }) => (
                `${exhibition.title} - Page ${pageNumber} of ${totalPages}`
            )} />
        </Page>
    </Document>
)
