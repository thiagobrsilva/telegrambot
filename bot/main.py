import os.path
import requests
import time
import logging
import sys
from telegram import InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Updater, CommandHandler, CallbackQueryHandler, MessageHandler, Filters


# Token
token = sys.argv[1]

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)

# Conversion Options
optDic = {'1': 'Video', '2': 'MP3'}
optName = ''


def start(bot, update):
    update.message.reply_text('Olá, eu posso converter alguns links do youtube pra você.')

    keyboard = [[InlineKeyboardButton("Video", callback_data='1'),
                 InlineKeyboardButton("MP3", callback_data='2')]]

    reply_markup = InlineKeyboardMarkup(keyboard)

    update.message.reply_text('Qual formato deseja receber?', reply_markup=reply_markup)

def getMsg(bot, update):

    # Receive user's message
    user_msg = update.message.text

    query = update.callback_query

    # Accept only messages with http - Youtube url: https://www.youtube.com/watch?v=VK6twHXYEBY
    if ("http" in user_msg.lower()):
        update.message.reply_text('Carregando...')

        print('xxx')
        print(optName) # PROBLEMA AQUI
        print('xxx')

        task = {"link": user_msg, "type": optName, "status":"0"}

        # Calling API - Request new file
        resp = requests.post("http://localhost:3000/api/Conversor", json=task)

        # Testing return code - If status code = 201 test if file exists
        if (resp.status_code == 201):
            while True:
               flag_file = os.path.isfile(resp.content.decode('utf-8'))

               if (flag_file):
                   break
               else:
                   time.sleep(2)

            # Send the file
            update.message.reply_document(document=open(resp.content.decode('utf-8'), 'rb'))
        else:
            update.message.reply_text('Houve algum erro no download!')

    else:
        update.message.reply_text('Link incorreto.')


# Send a message to user with available options
def button(bot, update):
    query = update.callback_query

    optName = optDic.get(query.data)

    bot.editMessageText(text='Você selecionou: %s' % optName,
                        chat_id=query.message.chat_id,
                        message_id=query.message.message_id)

    bot.sendMessage(chat_id=query.message.chat_id, text="Cole a url do video")



def help(bot, update):
    update.message.reply_text("Digite /start para iniciar.")


def error(bot, update, error):
    logging.warning('Update "%s" caused error "%s"' % (update, error))


updater = Updater(token)

updater.dispatcher.add_handler(CommandHandler('start', start))
updater.dispatcher.add_handler(CallbackQueryHandler(button))
updater.dispatcher.add_handler(CommandHandler('help', help))
updater.dispatcher.add_handler(MessageHandler(Filters.text, getMsg))
updater.dispatcher.add_error_handler(error)

# Start the Bot
updater.start_polling()

updater.idle()

