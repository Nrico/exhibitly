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
    const { data: artworks } = await supabase.from('artworks').select('*').eq('user_id', user.id).eq('status', 'available')

    if (!profile || !settings) throw new Error('Profile data not found')

    // 2. Generate HTML
    const htmlContent = generateStaticHtml(profile, settings, artworks || [])
    zip.file('index.html', htmlContent)

    // 3. Add CSS (Basic styles for the static site)
    const cssContent = `
        body { font-family: sans-serif; margin: 0; padding: 20px; color: #111; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; }
        header { margin-bottom: 40px; text-align: center; }
        h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .bio { max-width: 600px; margin: 0 auto 40px; color: #666; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 40px; }
        .artwork { break-inside: avoid; margin-bottom: 20px; }
        .artwork img { width: 100%; height: auto; display: block; margin-bottom: 10px; }
        .meta { font-size: 0.9rem; color: #666; }
        .title { font-weight: bold; color: #111; font-size: 1.1rem; }
    `
    zip.file('styles.css', cssContent)

    // 4. Fetch and Add Images
    const imgFolder = zip.folder('images')
    if (artworks && imgFolder) {
        for (const artwork of artworks) {
            if (artwork.image_url) {
                try {
                    const response = await fetch(artwork.image_url)
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

    // 5. Generate Zip
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `${settings.site_title || 'portfolio'}_export.zip`)
}

function generateStaticHtml(profile: any, settings: any, artworks: any[]) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${settings.site_title || 'Portfolio'}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>${settings.site_title || profile.full_name}</h1>
            <div class="bio">${settings.site_bio || ''}</div>
            ${settings.contact_email ? `<a href="mailto:${settings.contact_email}">Contact</a>` : ''}
        </header>

        <div class="grid">
            ${artworks.map(art => `
                <div class="artwork">
                    ${art.image_url ? `<img src="images/${art.title.replace(/[^a-z0-9]/gi, '_')}_${art.id}.jpg" alt="${art.title}">` : ''}
                    <div class="title">${art.title}</div>
                    <div class="meta">
                        ${art.medium ? `<span>${art.medium}</span>` : ''}
                        ${art.dimensions ? `<span> • ${art.dimensions}</span>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
    `
}
