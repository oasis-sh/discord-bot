export default (attachment: string) => {
    const image = attachment.split('.');
    const type = image[image.length - 1];
    const img = /(jpg|jpeg|png|gif)/gi.test(type);

    if (!img) return '';

    return attachment;
};
