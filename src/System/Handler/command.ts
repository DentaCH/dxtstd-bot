import { Commands } from '../command'
import { logger } from '../../Utils'

import * as util from 'util'

export async function CommandHandler (this: any, client, { data, database }) {
    try {
    const commands = new Commands()
    let command
    Object.keys(commands.uncategory).forEach(cmd => {
        if (commands.uncategory[cmd].use.test(data.text.command)) {
            command = commands.uncategory[cmd]
        }
    })
    
    Object.keys(commands.category).forEach(type => {
        Object.keys(commands.category[type]).forEach(cmd => {
            if (commands.category[type][cmd].use.test(data.text.command)) {
                command = commands.category[type][cmd]
            }
        })
    })
    
    if (!command) {
        const text = `Command *${data.text.command}* not found.`
        client.sendMessage(data.from, { text: text }, { quoted: data.chat })
        return
    }
    
    if (command.permission.owner && !data.user.is.owner) {
        const text = 'You are not the owner!'
        client.sendMessage(data.from, { text: text }, { quoted: data.chat })
        return
    }
    
    try {
        command.default.call(this, client, { data, database }, logger)
    } catch (error) {
        client.sendMessage(data.from, {
            text: util.format(error)
        }, { quoted: data.chat })
        logger.error(error)
    }
    } catch (error) {
        client.sendMessage(data.from, {
            text: util.format(error)
        }, { quoted: data.chat })
        logger.error(error)
    }
}