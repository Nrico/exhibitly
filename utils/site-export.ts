import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { createClient } from '@/utils/supabase/client'

export async function exportSiteData() {
    const supabase = createClient()
    const zip = new JSZip()

    // 1. Fetch Data
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const { data: settings } = await supabase.from('site_settings').select('*').eq('user_id', user.id).single()
    const { data: artists } = await supabase.from('artists').select('*').eq('user_id', user.id)
    const { data: exhibitions } = await supabase.from('exhibitions').select('*, exhibition_artworks(*)').eq('user_id', user.id)
    const { data: viewingRooms } = await supabase.from('viewing_rooms').select('*, room_items(*)').eq('gallery_id', user.id)
    const { data: artworks } = await supabase.from('artworks').select('*').eq('user_id', user.id).eq('status', 'available')

    if (!profile || !settings) throw new Error('Profile data not found')

    // 2. Generate HTML
    const theme = settings.theme || 'minimal'
    const htmlContent = generateStaticHtml(profile, settings, artworks || [], theme)
    zip.file('index.html', htmlContent)

    // 3. Add CSS (Dynamic styles matching user theme)
    const cssContent = generateStaticCss(theme)
    zip.file('styles.css', cssContent)

    // 4. Add Data JSONs (Portability)
    const dataFolder = zip.folder('data')
    if (dataFolder) {
        dataFolder.file('profile.json', JSON.stringify(profile, null, 2))
        dataFolder.file('settings.json', JSON.stringify(settings, null, 2))
        dataFolder.file('artworks.json', JSON.stringify(artworks, null, 2))
        if (artists) dataFolder.file('artists.json', JSON.stringify(artists, null, 2))
        if (exhibitions) dataFolder.file('exhibitions.json', JSON.stringify(exhibitions, null, 2))
        if (viewingRooms) dataFolder.file('viewing_rooms.json', JSON.stringify(viewingRooms, null, 2))
    }

    // 5. Fetch and Add Images
    const imgFolder = zip.folder('images')
    if (artworks && imgFolder) {
        for (const artwork of artworks) {
            if (artwork.image_url) {
                try {
                    // Use proxy to bypass CORS
                    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(artwork.image_url)}`
                    const response = await fetch(proxyUrl)

                    if (!response.ok) throw new Error(`Proxy fetch failed: ${response.statusText}`)

                    const blob = await response.blob()
                    // Extract filename from URL or use ID
                    const filename = `${artwork.title.replace(/[^a-z0-9]/gi, '_')}_${artwork.id}.jpg`
                    imgFolder.file(filename, blob)
                } catch (e) {
                    console.error('Failed to fetch image:', artwork.image_url)
                }
            }
        }
    }

    // 6. Generate Zip
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `${settings.site_title || 'portfolio'}_export.zip`)
}

import { Profile, SiteSettings, Artwork } from '@/types'

function generateStaticHtml(profile: Profile, settings: SiteSettings, artworks: Artwork[], theme: string) {
    const title = settings.site_title || profile.full_name || 'Portfolio'
    const subtitle = settings.site_subtitle || ''
    const bio = settings.site_bio || ''
    const contactEmail = settings.contact_email || profile.email || ''

    if (theme === 'dark') { // Cinema Theme
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <sidebar>
            <h1>${title}</h1>
            ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
            ${bio ? `<div class="bio">${bio}</div>` : ''}
            ${contactEmail ? `<a href="mailto:${contactEmail}" class="contact-btn">Contact</a>` : ''}
            <footer>
                &copy; ${new Date().getFullYear()} ${profile.full_name || 'Studio'}
            </footer>
        </sidebar>
        <main>
            <div class="gallery">
                ${artworks.map(art => {
                    const filename = `images/${art.title.replace(/[^a-z0-9]/gi, '_')}_${art.id}.jpg`
                    return `
                    <div class="artwork">
                        <div class="image-wrapper">
                            ${art.image_url ? `<img src="${filename}" alt="${art.title}">` : ''}
                        </div>
                        <div class="details">
                            <div class="artwork-title">${art.title}</div>
                            <div class="artwork-meta">
                                <span>${art.medium || ''}${art.medium && art.dimensions ? ', ' : ''}${art.dimensions || ''}</span>
                                <span class="artwork-status ${art.status === 'sold' ? 'sold' : 'available'}">
                                    ${art.status === 'sold' ? 'Sold' : (art.price ? `$${art.price.toLocaleString()}` : 'Available')}
                                </span>
                            </div>
                        </div>
                    </div>`
                }).join('')}
            </div>
        </main>
    </div>
</body>
</html>`
    }

    if (theme === 'archive') { // Archive Theme
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <div>
                <h1>${title}</h1>
                ${bio ? `<div class="bio">${bio}</div>` : ''}
            </div>
            ${contactEmail ? `<a href="mailto:${contactEmail}" class="contact-link">Contact</a>` : ''}
        </header>
        <div class="gallery">
            ${artworks.map(art => {
                const filename = `images/${art.title.replace(/[^a-z0-9]/gi, '_')}_${art.id}.jpg`
                return `
                <div class="artwork">
                    <div class="image-wrapper">
                        ${art.image_url ? `<img src="${filename}" alt="${art.title}">` : ''}
                    </div>
                    <div class="artwork-title">${art.title}</div>
                    <div class="artwork-meta">${art.medium || ''}${art.medium && art.dimensions ? ', ' : ''}${art.dimensions || ''}</div>
                    <div class="artwork-status ${art.status === 'sold' ? 'sold' : 'available'}">
                        ${art.status === 'sold' ? 'Sold' : (art.price ? `$${art.price.toLocaleString()}` : 'Available')}
                    </div>
                </div>`
            }).join('')}
        </div>
        <footer>
            &copy; ${new Date().getFullYear()} ${profile.full_name || 'Studio'}
        </footer>
    </div>
</body>
</html>`
    }

    // Default 'minimal' Theme (White Cube)
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>${title}</h1>
            ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
            ${bio ? `<div class="bio">${bio}</div>` : ''}
            ${contactEmail ? `<a href="mailto:${contactEmail}" class="contact-btn">Contact</a>` : ''}
        </header>
        <div class="gallery">
            ${artworks.map(art => {
                const filename = `images/${art.title.replace(/[^a-z0-9]/gi, '_')}_${art.id}.jpg`
                return `
                <div class="artwork">
                    ${art.image_url ? `<img src="${filename}" alt="${art.title}">` : ''}
                    <div class="artwork-title">${art.title}</div>
                    <div class="artwork-meta">${art.medium || ''}${art.medium && art.dimensions ? ', ' : ''}${art.dimensions || ''}</div>
                    <div class="artwork-status ${art.status === 'sold' ? 'sold' : 'available'}">
                        ${art.status === 'sold' ? 'Sold' : (art.price ? `$${art.price.toLocaleString()}` : 'Available')}
                    </div>
                </div>`
            }).join('')}
        </div>
        <footer>
            &copy; ${new Date().getFullYear()} ${profile.full_name || 'Studio'}. All Rights Reserved.
        </footer>
    </div>
</body>
</html>`
}

function generateStaticCss(theme: string) {
    if (theme === 'dark') { // Cinema Theme
        return `@import url('https://fonts.googleapis.com/css2?family=Fauna+One&family=Cinzel:wght@400;500;600;700&display=swap');
body { font-family: 'Fauna One', serif; background-color: #000000; color: #e0e0e0; margin: 0; padding: 0; line-height: 1.6; }
.container { display: flex; min-height: 100vh; }
@media (max-width: 768px) { .container { flex-direction: column; } }
sidebar { width: 35%; box-sizing: border-box; padding: 60px; border-right: 1px solid #333; display: flex; flex-direction: column; justify-content: center; position: fixed; height: 100vh; background-color: #000; }
@media (max-width: 768px) { sidebar { width: 100%; position: relative; height: auto; border-right: none; border-bottom: 1px solid #333; padding: 40px 20px; } }
h1 { font-family: 'Cinzel', serif; font-size: 3rem; font-weight: 400; line-height: 1.1; margin: 0 0 20px 0; letter-spacing: 2px; text-transform: uppercase; color: #fff; }
.subtitle { font-family: 'Cinzel', serif; color: #c5a059; text-transform: uppercase; letter-spacing: 3px; font-size: 0.8rem; margin-bottom: 40px; }
.bio { color: #8a8175; font-size: 0.85rem; margin-bottom: 40px; }
.contact-btn { display: inline-block; color: #c5a059; text-decoration: none; text-transform: uppercase; font-family: 'Cinzel', serif; font-size: 0.85rem; letter-spacing: 2px; border-bottom: 1px solid #c5a059; padding-bottom: 5px; }
.contact-btn:hover { color: #fff; border-color: #fff; }
main { width: 65%; margin-left: 35%; padding: 80px 60px; box-sizing: border-box; }
@media (max-width: 768px) { main { width: 100%; margin-left: 0; padding: 40px 20px; } }
.gallery { display: flex; flex-direction: column; gap: 40px; }
.artwork { break-inside: avoid; margin-bottom: 40px; }
.image-wrapper { background-color: #111; padding: 10px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
.image-wrapper img { width: 100%; height: auto; display: block; }
.details { margin-top: 15px; border-bottom: 1px solid #222; padding-bottom: 10px; }
.artwork-title { font-family: 'Cinzel', serif; font-size: 1.25rem; color: #eee; margin-bottom: 5px; }
.artwork-meta { font-size: 0.75rem; color: #8a8175; display: flex; justify-content: space-between; }
.artwork-status { color: #c5a059; }
.artwork-status.sold { color: #aa3a3a; }
footer { margin-top: auto; padding-top: 40px; font-size: 0.75rem; color: #8a8175; }
@media (max-width: 768px) { footer { display: none; } }`
    }

    if (theme === 'archive') { // Archive Theme
        return `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
body { font-family: 'Inter', sans-serif; background-color: #ffffff; color: #111111; margin: 0; padding: 20px; line-height: 1.6; }
.container { max-width: 1600px; margin: 0 auto; padding: 40px 20px; }
header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #eee; padding-bottom: 30px; margin-bottom: 60px; }
h1 { font-size: 1.5rem; font-weight: 600; letter-spacing: -0.02em; margin: 0; }
.bio { color: #777; font-size: 0.9rem; margin-top: 10px; }
.contact-link { text-decoration: none; color: #777; font-size: 0.9rem; border-bottom: 1px solid #777; padding-bottom: 2px; }
.contact-link:hover { color: #000; border-color: #000; }
.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 40px; margin-bottom: 60px; }
.artwork { display: flex; flex-direction: column; }
.image-wrapper { background-color: #bfbfbf; width: 100%; aspect-ratio: 1; display: flex; justify-content: center; align-items: center; margin-bottom: 15px; }
.image-wrapper img { max-width: 85%; max-height: 85%; object-fit: contain; filter: drop-shadow(0 20px 25px rgba(0,0,0,0.15)); }
.artwork-title { font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
.artwork-meta { font-size: 0.85rem; color: #777; margin-bottom: 8px; }
.artwork-status { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.artwork-status.available { color: #111; }
.artwork-status.sold { color: #d9534f; }
footer { text-align: center; margin-top: 60px; padding-top: 30px; border-top: 1px solid #eee; font-size: 0.75rem; color: #777; }`
    }

    // Default 'minimal' Theme (White Cube)
    return `@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');
body { font-family: 'Montserrat', sans-serif; background-color: #fdfdfd; color: #2a2a2a; margin: 0; padding: 20px; line-height: 1.6; }
.container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
header { text-align: center; margin-bottom: 60px; }
h1 { font-family: 'Cormorant Garamond', serif; font-size: 3.5rem; font-weight: normal; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 10px 0; }
.subtitle { text-transform: uppercase; letter-spacing: 3px; font-size: 0.8rem; color: #888; }
.bio { max-width: 600px; margin: 30px auto; color: #888; font-size: 0.9rem; }
.contact-btn { display: inline-block; margin-top: 20px; text-decoration: none; color: #c5a059; border: 1px solid #c5a059; padding: 10px 20px; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 2px; transition: all 0.3s; }
.contact-btn:hover { background-color: #c5a059; color: white; }
.gallery { column-count: 3; column-gap: 40px; margin-bottom: 60px; }
@media (max-width: 900px) { .gallery { column-count: 2; } }
@media (max-width: 600px) { .gallery { column-count: 1; } }
.artwork { break-inside: avoid; margin-bottom: 40px; text-align: center; }
.artwork img { width: 100%; height: auto; display: block; margin-bottom: 15px; }
.artwork-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: bold; margin: 0 0 5px 0; }
.artwork-meta { font-size: 0.75rem; color: #888; font-style: italic; margin-bottom: 8px; }
.artwork-status { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #c5a059; font-weight: bold; }
.artwork-status.sold { color: #c94c4c; }
footer { text-align: center; padding-top: 40px; border-top: 1px solid #eee; font-size: 0.75rem; color: #888; }`
}
