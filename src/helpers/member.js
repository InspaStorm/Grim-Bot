export async function fetchMember(msg, refer) {
	let notFound;
	let foundMember;

	if  (!isNaN(refer)) {
		try {
			foundMember = await msg.guild.members.fetch(refer)
		} catch {
			notFound = `No user with id ${refer}`
		}
	} else if (refer.startsWith('<@!')){
		try {
			const editedMention = refer.substr(3, refer.length - 4)
			foundMember = await msg.guild.members.fetch(editedMention)
		} catch (err){
			notFound = `No user Found as ${refer}`
		}

	} else {
		try {
			const response = await msg.guild.members.fetch({query: refer, limit: 1})
			foundMember = response.first()
		} catch {
			notFound = `No user named ${refer}`
		}

	}
	if (typeof notFound == 'undefined') {
		return foundMember
	} else {
		return notFound
	}
}

export async function inputMemberCheck(msg, author, args, isInteraction) {
	if (isInteraction) {
		const user = args.getUser('user')
		if (user) {
			return user
		} else {
			return author
		}
	} else if (args.length > 0) {
		const member = await fetchMember(msg, args[0])

		if (typeof member != 'string' && typeof member != 'undefined') {
			return member.user
		} else if (typeof member == 'undefined') {
			return `No user found with name: \`${args[0]}\``
		} else {
			return member
		}
	} else {
		return author
	}
}
