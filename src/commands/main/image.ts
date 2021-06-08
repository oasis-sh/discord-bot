import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { ApplyOptions } from '@sapphire/decorators';
import renderEmoji from '@utils/canvas/renderEmoji';
import type { Args } from '@sapphire/framework';
import discordTime from '@utils/discordTime';
import circle from '@utils/canvas/circle';
import type { Message } from 'discord.js';
import shorten from '@utils/shorten';
import { join } from 'path';

registerFont(join(__dirname, '..', '..', '..', 'fonts', 'manropeRegular.ttf'), {
    family: 'Whitney',
    weight: 'regular',
    style: 'normal',
});
registerFont(join(__dirname, '..', '..', '..', 'fonts', 'whitneyMedium.otf'), {
    family: 'Manrope',
    weight: 'regular',
    style: 'normal',
});

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: 'Image Manipulation commands.',
    aliases: ['img'],
    subCommands: ['quote'],
})
export class ImageCommand extends SubCommandPluginCommand {
    public async quote(message: Message, args: Args) {
        const member = (await args.pickResult('member')).value;
        const msg = await args.rest('string');

        if (!member) return message.reply('You gave an invalid member.');

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
        ctx.font = '40px Manrope';
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

        message.reply({ files: [{ attachment: canvas.toBuffer(), name: 'quote.png' }] });
    }
}
