async function memberCheck(msg, refer) {
	let notFound;
	let foundMember;

	if  (!isNaN(refer)) {
		try {
			foundMember = await msg.guild.members.fetch(refer)
		} catch {
			notFound = `No user with id ${args[0]}`
		}
	} else if (refer.startsWith('<@!')){
		try {
			const editedMention = refer.substr(3, refer.length - 4)
			const foundMember = await msg.guild.members.fetch(editedMention)
		} catch (err){
			notFound = `No user Found as ${args[0]}`
		}

	} else {
		try {
			const response = await msg.guild.members.fetch({query: refer, limit: 1})
			foundMember =  response.first()
		} catch {
			notFound = `No user named ${args[0]}`
		}

	}

	if (notFound == undefined) {
		return foundMember
	}
	return notFound
}

module.exports = {
	memberCheck: memberCheck
}