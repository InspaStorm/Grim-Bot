export async function fetchMember(guild, refer) {
    let notFound;
    let foundMember;
    if (!isNaN(refer)) {
        try {
            foundMember = await guild.members.fetch(refer);
        }
        catch {
            notFound = `No user with id ${refer}`;
        }
    }
    else if (refer.startsWith('<@!')) {
        try {
            const editedMention = refer.substr(3, refer.length - 4);
            foundMember = await guild.members.fetch(editedMention);
        }
        catch (err) {
            notFound = `No user Found as ${refer}`;
        }
    }
    else {
        try {
            const response = await guild.members.fetch({ query: refer, limit: 1 });
            foundMember = response.first();
        }
        catch {
            notFound = `No user named ${refer}`;
        }
    }
    if (typeof notFound == 'undefined') {
        return foundMember;
    }
    else {
        return notFound;
    }
}
export async function inputMemberCheck(guild, author, args, isInteraction) {
    if (isInteraction) {
        const user = args.getUser('user');
        if (user) {
            return user;
        }
        else {
            return author;
        }
    }
    else if (args.length > 0) {
        const member = await fetchMember(guild, args[0]);
        if (typeof member != 'string' && typeof member != 'undefined') {
            return member.user;
        }
        else if (typeof member == 'undefined') {
            return `No user found with name: \`${args[0]}\``;
        }
        else {
            return member;
        }
    }
    else {
        return author;
    }
}
