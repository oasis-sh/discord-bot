import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { ApplyOptions } from '@sapphire/decorators';
import renderEmoji from '@utils/canvas/renderEmoji';
import type { Args } from '@sapphire/framework';
import discordTime from '@utils/discordTime';
import circle from '@utils/canvas/circle';
import type { Message } from 'discord.js';
import shorten from '@utils/shorten';
import GIFEncoder from 'gifencoder';
import { join } from 'path';

registerFont(join(__dirname, '..', '..', '..', 'fonts', 'whitneyMedium.otf'), {
    family: 'Whitney',
    weight: 'regular',
    style: 'normal',
});

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: 'Image Manipulation commands.',
    aliases: ['img'],
    subCommands: ['quote', 'triggered'],
})
export class ImageCommand extends SubCommandPluginCommand {
    public async quote(message: Message, args: Args) {
        const member = (await args.pickResult('member')).value;
        const msg = await args.rest('string');

        if (!member) return message.reply('You gave an invalid member.');

        message.channel.startTyping();

        const base = await loadImage(member.user.displayAvatarURL({ format: 'png' }));
        const imageCanvas = createCanvas(base.width, base.height);
        const imageCtx = imageCanvas.getContext('2d');

        imageCtx.drawImage(base, 0, 0);
        circle(imageCtx, imageCanvas.height, imageCanvas.width);

        const baseImage = imageCanvas.toBuffer();
        const image = await loadImage(baseImage);
        const canvas = createCanvas(1500, 300);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#36393E';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 75, 30, 130, 130);
        ctx.font = '40px Whitney';
        ctx.fillStyle = '#FFFFFF';

        await renderEmoji(ctx, shorten(msg, 66), 230, 150);

        ctx.font = '50px Whitney';
        ctx.fillStyle = member.displayHexColor;
        ctx.textAlign = 'start';
        ctx.fillText(shorten(member.displayName, 17), 230, 80);
        ctx.font = '40px Whitney';
        ctx.fillStyle = '#7D7D7D';
        ctx.textAlign = 'start';
        ctx.fillText(discordTime(), 240 + ctx.measureText(shorten(member.displayName, 17)).width + 110, 80);

        message.channel.stopTyping();
        message.reply({ files: [{ attachment: canvas.toBuffer(), name: 'quote.png' }] });
    }

    public async triggered(message: Message, args: Args) {
        const member = (await args.pickResult('member')).value;

        if (!member) return message.reply('You provided an invalid member.');

        message.channel.startTyping();

        const base = await loadImage(join(__dirname, '..', '..', '..', 'images', 'triggered.png'));
        const image = await loadImage(member.user.displayAvatarURL({ format: 'png' }));
        const gif = new GIFEncoder(256, 310);

        gif.start();
        gif.setRepeat(0);
        gif.setDelay(15);

        const canvas = createCanvas(256, 310);
        const ctx = canvas.getContext('2d');
        const BR = 30;
        const LR = 20;
        let i = 0;

        while (i < 9) {
            ctx.clearRect(0, 0, 256, 310);
            ctx.drawImage(
                image,
                Math.floor(Math.random() * BR) - BR,
                Math.floor(Math.random() * BR) - BR,
                256 + BR,
                310 - 54 + BR,
            );
            ctx.save();
            ctx.fillStyle = '#FF000033';
            ctx.fillRect(0, 0, 256, 310);
            ctx.restore();
            ctx.drawImage(
                base,
                Math.floor(Math.random() * LR) - LR,
                310 - 54 + Math.floor(Math.random() * LR) - LR,
                256 + LR,
                54 + LR,
            );
            gif.addFrame(ctx);

            i++;
        }

        gif.finish();
        message.channel.stopTyping();
        message.reply({ files: [{ attachment: gif.out.getData(), name: 'triggered.gif' }] });
    }
}
