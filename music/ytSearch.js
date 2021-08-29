const { YTSearcher } = require('ytsearcher');
const {gApi} = require('../config.js')
const playlistSearcher = require('youtube-playlist')

const searcher = new YTSearcher(gApi);

async function searchVid(query) {
	const foundVid = await searcher.search(query, {type: 'video'})
	return foundVid
}

async function searchPlaylist(query) {
	console.log('\nHeyyyyyyyy\n')
	if (query.startsWith('https://')) {
		const vids = await playlistSearcher(query, 'url')
		return vids.data.playlist
	} else {
		const foundPlaylist = await searcher.search(query, {type: 'playlist'})

		console.log(foundPlaylist.first.url)
		const vids = await playlistSearcher(foundPlaylist.first.url, 'url')
		console.log(vids)
		return vids.data.playlist
	}
}

module.exports = {
	vid: searchVid,
	searchPlaylist: searchPlaylist
}