const { YTSearcher } = require('ytsearcher');
const ytpl = require('ytpl')
const {gApi} = require('../config.js')

const searcher = new YTSearcher(gApi);

async function searchVid(query) {
	try {
		const foundVid = await searcher.search(query, {type: 'video'})
		return {title: foundVid.first.title, url: foundVid.first.url}
	} catch {
		return 'Thats not valid Youtube video'
	}

}

async function searchPlaylist(query) {
	try {
		const foundPlaylist = await searcher.search(query, {type: 'playlist'})
		
		const vids = await ytpl(foundPlaylist.first.id, {limit: 10})
		return vids.items
	} catch {
		return 'Thats not valid Youtube playlist'
	}
}

module.exports = {
	vid: searchVid,
	searchPlaylist: searchPlaylist
}