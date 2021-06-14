import bindings from 'bindings';

const { prompt } = bindings('prompt');

export default (message: string) => {
    const response = prompt(`${message}\n> `);

    return response as string;
};
