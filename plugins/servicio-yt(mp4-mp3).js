import got from 'got'
import cheerio from 'cheerio'

const Regex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/

const command = {
    command: ['ytmp3', 'ytmp4', 'ytmp'],
    categoria: ['servicio']
}

const getFile = async (url) => (await got(url, { responseType: 'buffer', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36', 'Accept': '*/*', 'Connection': 'keep-alive', 'Range': 'bytes=0-' }, timeout: { response: 20000, read: 30000 }, http2: true, dnsCache: true })).body

const Tube = async (url) => JSON.parse((await got.get(`https://apizaryan.onrender.com/api/ytdl?url=${url}`)).body).result

command.script = async (m, { conn }) => {
    if (!m.text) return m.reply(`Ingrese el comando *\`.${m.command}\`* y seguido el enlace de un video de YouTube, ejemplo:\n#${m.command} https://youtu.be/CIVebMbKB_s?si=Yt8fV-IBSnsGNPWo`)
    if (!Regex.test(m.args[0])) return m.reply(`Link incorrecto`)

    try {
        if (m.command == 'ytmp') {
            await m.react('wait')
            try {
                const data = await Tube(m.args[0])
                await conn.sendButton(m.chat.id, [data.title, null, global.botName1], ['image-url', data.thumb], [
                    { name: 'reply', button: ['( Video •  🎥 )', `.ytmp4 ${m.args[0]}`] },
                    { name: 'reply', button: ['( Audio • 🎧 )', `.ytmp3 ${m.args[0]}`] },
                ], m)
                await m.react('done')
            } catch (e) { new Error('No result') }
        }
        else if (m.command == 'ytmp3') {
            const urls = YoutTube(m.text)
            for (let i = 0; i < urls.length; i++) {
                await m.react('wait')
                const data = await Tube(urls[i])
                await conn.sendMessage(m.chat.id, { audio: await getFile(data.audio), contextInfo: { externalAdReply: { title: data.title, body: '', previewType: "PHOTO", thumbnailUrl: data.thumb } }, mimetype: "audio/mp4", fileName: `.mp3` }, { quoted: m })
                await m.react('done');
            }
        }
        else if (m.command == 'ytmp4') {
            const urls = YoutTube(m.text)
            for (let i = 0; i < urls.length; i++) {
                await m.react('wait')
                const data = await Tube(urls[i])
                await conn.sendMessage(m.chat.id, { document: { url: data.video }, caption: '', mimetype: 'video/mp4', fileName: data.title + `.mp4` }, { quoted: m })
                await m.react('done')
            }
        }
    } catch (e) { m.react('error'), console.error(e) }
}

export default command

function YoutTube(texto) {
    var text = texto.split(' ')
    var enlaces = []
    var contador = 0

    for (var i = 0; i < text.length; i++) {
        if (Regex.test(text[i])) {
            enlaces.push(text[i]);
            contador++;
            if (contador === 5) { break }
        }
    }
    return enlaces
}
