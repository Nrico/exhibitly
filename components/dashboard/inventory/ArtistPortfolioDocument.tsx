import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { Artwork } from '@/types'

const styles = StyleSheet.create({
    pageCover: {
        padding: 60,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
    },
    coverTitle: {
        fontSize: 36,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: '#0f172a',
    },
    coverSubtitle: {
        fontSize: 14,
        color: '#475569',
        marginBottom: 40,
        letterSpacing: 1.0,
    },
    coverDivider: {
        height: 2,
        backgroundColor: '#cbd5e1',
        width: 120,
        marginBottom: 40,
    },
    coverBio: {
        fontSize: 11,
        color: '#475569',
        lineHeight: 1.6,
        maxWidth: 420,
    },
    coverFooter: {
        position: 'absolute',
        bottom: 60,
        left: 60,
        fontSize: 9,
        color: '#94a3b8',
        fontFamily: 'Helvetica',
    },

    pageCatalog: {
        padding: 50,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
    },
    catalogHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1pt solid #e2e8f0',
        paddingBottom: 12,
        marginBottom: 30,
    },
    headerArtistName: {
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1.0,
        color: '#475569',
    },
    headerDocType: {
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1.0,
        color: '#94a3b8',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: '#f8fafc',
        border: '0.5pt solid #f1f5f9',
        padding: 20,
    },
    artworkImage: {
        maxHeight: 350,
        maxWidth: '100%',
        objectFit: 'contain',
    },
    labelContainer: {
        borderTop: '0.5pt solid #cbd5e1',
        paddingTop: 16,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    labelMain: {
        flexDirection: 'column',
        flex: 1,
    },
    artworkTitle: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    artworkMeta: {
        fontSize: 10,
        color: '#475569',
        marginBottom: 2,
    },
    labelPrice: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: '#0f172a',
        textAlign: 'right',
        marginLeft: 20,
    },
    artworkStatus: {
        fontSize: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        color: '#64748b',
        marginTop: 2,
    },
    catalogFooter: {
        fontSize: 8,
        color: '#94a3b8',
        textAlign: 'center',
        borderTop: '0.5pt solid #e2e8f0',
        paddingTop: 10,
        marginTop: 20,
    },
})

interface ArtistPortfolioProps {
    profile: {
        full_name: string | null
        email: string
    }
    settings: {
        site_title: string | null
        site_bio: string | null
        site_bio_long?: string | null
    }
    items: Artwork[]
}

export const ArtistPortfolioDocument: React.FC<ArtistPortfolioProps> = ({ profile, settings, items }) => {
    const artistName = settings?.site_title || profile?.full_name || 'Artist'
    const bioText = settings?.site_bio_long || settings?.site_bio || ''

    return (
        <Document>
            {/* Title Page */}
            <Page size="LETTER" style={styles.pageCover}>
                <Text style={styles.coverTitle}>{artistName}</Text>
                <Text style={styles.coverSubtitle}>Studio Portfolio & Catalog</Text>
                <View style={styles.coverDivider} />
                {bioText ? <Text style={styles.coverBio}>{bioText}</Text> : null}
                <Text style={styles.coverFooter}>Generated via Exhibitly Portfolio Exporter &bull; {profile?.email}</Text>
            </Page>

            {/* Catalog Pages */}
            {items.map((item, idx) => (
                <Page key={item.id} size="LETTER" style={styles.pageCatalog}>
                    <View style={styles.catalogHeader}>
                        <Text style={styles.headerArtistName}>{artistName}</Text>
                        <Text style={styles.headerDocType}>Selected Work</Text>
                    </View>

                    <View style={styles.imageContainer}>
                        {item.image_url ? (
                            <Image
                                src={`/api/proxy-image?url=${encodeURIComponent(item.image_url)}`}
                                style={styles.artworkImage}
                            />
                        ) : (
                            <Text style={{ fontSize: 10, color: '#94a3b8' }}>No Image Available</Text>
                        )}
                    </View>

                    <View style={styles.labelContainer} wrap={false}>
                        <View style={styles.labelMain}>
                            <Text style={styles.artworkTitle}>{item.title}</Text>
                            <Text style={styles.artworkMeta}>
                                {item.medium} &bull; {item.dimensions || 'n.d.'} &bull; {item.created_at ? new Date(item.created_at).getFullYear() : 'n.d.'}
                            </Text>
                            {item.description ? (
                                <Text style={{ fontSize: 9, color: '#64748b', marginTop: 4, lineHeight: 1.4 }}>
                                    {item.description}
                                </Text>
                            ) : null}
                        </View>
                        <View>
                            <Text style={styles.labelPrice}>
                                {item.price ? `$${item.price.toLocaleString()}` : 'Inquire'}
                            </Text>
                            <Text style={styles.artworkStatus}>
                                {item.status}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.catalogFooter} fixed render={({ pageNumber, totalPages }: any) => (
                        `${artistName} — Page ${pageNumber} of ${totalPages}`
                    )} />
                </Page>
            ))}
        </Document>
    )
}
