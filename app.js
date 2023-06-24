const {Telegraf} = require("telegraf");
const {message} = require("telegraf/filters");
const dotenv = require("dotenv");
const { default: axios } = require("axios");

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const cryptoToken = process.env.CRYPTO_TOKEN;

bot.start(ctx => {
    ctx.reply(`
        /crypto - برای دیدن رمز ارزها
    `)
});




bot.command('crypto',ctx => {
    bot.telegram.sendMessage(ctx.chat.id,"منوی اصلی",{
        reply_markup: {
            inline_keyboard: [
                [
                    {text: "قیمت رمز ارزها" , callback_data: "pricing"},
                    
                ],
                [
                    {text: "CoinList(cryptoCompare)" , url:"https://www.cryptocompare.com"},
                ]
            ]
        }
    });
});
bot.on(message(),ctx => {
    ctx.reply("لطفا از دستور /crypto استفاده کنید")
})
bot.action("pricing",ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id,"لطفا یکی از ارزهای زیر را انتخاب کنید:",{
        reply_markup: {
            inline_keyboard: [
                [
                    {text: "BTC (بیت کوین)" , callback_data: "BTC"},
                    {text: "ETH (اتریوم)" , callback_data: "ETH"},
                    
                ],
                [
                    {text: "USDT (تتر)" , callback_data: "USDT"},
                    {text: "BUSD (بایننس)" , callback_data: "BUSD"},
                ],
                [
                    {text:"منوی اصلی",callback_data:"mainMenu"}
                ]
            ]
        }
    });
});
bot.action(["BTC","ETH","USDT","BUSD"], async ctx => {
    ctx.answerCbQuery();

    try {
        const apiUrl = `https://min-api.cryptocompare.com/data/price?fsym=${ctx.match}&tsyms=USD&api_key=${cryptoToken}`;
        
        const data = (await axios.get(apiUrl)).data;

        ctx.reply(`${Object.keys(data)[0]} : ${Object.values(data)[0]}`)
        
    } catch (err) {
        ctx.reply(err.message)
    }


})
bot.action("mainMenu",ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id,"منوی اصلی",{
        reply_markup: {
            inline_keyboard: [
                [
                    {text: "قیمت رمز ارزها" , callback_data: "pricing"},
                    
                ],
                [
                    {text: "CoinList(cryptoCompare)" , url:"https://www.cryptocompare.com"},
                ]
            ]
        }
    });
});


bot.launch();
