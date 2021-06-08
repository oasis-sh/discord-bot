export default (time = new Date()) => {
    const date = time instanceof Date ? time : new Date();
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

    return `Today at ${hours}:${minutes}`;
};
