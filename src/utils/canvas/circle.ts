import type { CanvasRenderingContext2D } from 'canvas';

export default (ctx: CanvasRenderingContext2D, height: number, width: number) => {
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, height / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    return ctx;
};
