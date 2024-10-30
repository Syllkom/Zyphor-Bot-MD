const command = {
    command: ['allban'],
    categoria: ['grupos'],
}

const generarPin = () => Math.floor(1000 + Math.random() * 9000).toString();

command.script = async (m, { conn }) => {
    if (!m.chat.group) return m.sms('group')
    if (!m.sender.admin) return m.sms('admin')

    if (m.tag[0] == 'true') {
        if (!conn.actionscommands) return m.reply('ERROR:1')
        if (!conn.actionscommands[m.sender.id]) return m.reply('ERROR:2')
        if (m.tag[1] !== m.sender.id) return m.reply('ERROR:3')
        if (conn.actionscommands[m.sender.id] !== m.tag[2]) return m.reply('ERROR:4')
        const participants = m.chat.participants.filter(o => o.admin === null)
        for (const o of participants) {
            if (typeof o == 'object' && o.id) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await conn.groupParticipantsUpdate(m.chat.id, [o.id], 'remove').catch(() => { });
            }
        }
        delete conn.actionscommands[m.sender.id]
        delete conn.actionscommands[m.chat.id]
    }
    else if (m.tag[0] == 'false') {
        if (!conn.actionscommands) return m.reply('ERROR:1')
        if (!conn.actionscommands[m.sender.id]) return m.reply('ERROR:2')
        if (m.tag[1] !== m.sender.id) return m.reply('ERROR:3')
        if (conn.actionscommands[m.sender.id] !== m.tag[2]) return m.reply('ERROR:4')
        delete conn.actionscommands[m.sender.id]
        delete conn.actionscommands[m.chat.id]
    } else {
        if (!conn.actionscommands) conn.actionscommands = {}
        if (conn.actionscommands[m.chat.id] && Array.isArray(conn.actionscommands[m.chat.id])) { if (conn.actionscommands[m.chat.id].find(o => o === 'allban')) return m.reply('Este comando ya se está ejecutando.') }
        conn.actionscommands[m.sender.id] = generarPin()
        conn.actionscommands[m.chat.id] = ['allban']
        await conn.sendButton(m.chat.id, [null, '¿Estás seguro de que deseas eliminar a todos los participantes de este chat? Una vez iniciado, no se podrá cancelar.', '@KazeBot'], null, [{
            name: 'reply',
            button: ['Eliminar', `.allban tag=true tag=${m.sender.id} tag=${conn.actionscommands[m.sender.id]}`]
        },
        {
            name: 'reply',
            button: ['Cancelar', `.allban tag=false tag=${m.sender.id} tag=${conn.actionscommands[m.sender.id]}`]
        }], m)
    }
}

export default command