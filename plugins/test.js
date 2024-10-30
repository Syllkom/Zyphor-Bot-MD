const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = (await import('@whiskeysockets/baileys')).default


const command = {
    command: ['test740'],
    categoria: ['main']
}

command.script = async (m, { conn }) => {

    const Message = {
        "header": {
            "hasMediaAttachment": true,
        },
        "nativeFlowMessage": {
            "buttons": [
                {
                    "name": "review_and_pay",
                    "buttonParamsJson": `{\"currency\":\"INR\",\"total_amount\":{\"value\":49981399788,\"offset\":100},\"reference_id\":\"4OON4PX3FFJ\",\"type\":\"physical-goods\",\"order\":{\"status\":\"payment_requested\",\"subtotal\":{\"value\":49069994400,\"offset\":100},\"tax\":{\"value\":490699944,\"offset\":100},\"discount\":{\"value\":485792999999,\"offset\":100},\"shipping\":{\"value\":48999999900,\"offset\":100},\"order_type\":\"ORDER\",\"items\":[{\"retailer_id\":\"7842674605763435\",\"product_id\":\"7842674605763435\",\"name\":\"🦄드림 가이 Xeon 🦄드림 가이 Xeon 🦄드림 가이 Xeon\",\"amount\":{\"value\":9999900,\"offset\":100},\"quantity\":7},{\"retailer_id\":\"custom-item-f22115f9-478a-487e-92c1-8e7b4bf16de8\",\"name\":\"\",\"amount\":{\"value\":999999900,\"offset\":100},\"quantity\":49}]},\"native_payment_methods\":[]}`
                }
            ]
        }
    }

    const getMessage = await generateWAMessageFromContent(m.chat.id, { viewOnceMessage: { message: { interactiveMessage: Message } } }, {})
    return await conn.relayMessage(m.chat.id, getMessage.message, {});
}

export default command