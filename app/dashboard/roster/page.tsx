import { getArtists } from './actions'
import { RosterClient } from './roster-client'

export default async function RosterPage() {
    const artists = await getArtists()

    return <RosterClient initialArtists={artists} />
}
