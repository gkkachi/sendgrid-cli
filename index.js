const { env } = require('process');
const Configstore = require('configstore');
const inquirer = require('inquirer');
const sgMail = require('@sendgrid/mail');
const validator = require('email-validator');

const conf = new Configstore('sendgrid-cli');

const questions = [
    {
        name: 'apikey',
        type: 'password',
        message: 'API key?',
        default: env.SENDGRID_API_KEY || conf.get('apikey'),
        mask: '*',
        validate: x => !!x,
    },
    {
        name: 'from',
        type: 'input',
        message: 'from?',
        default: conf.get('from'),
        validate: validator.validate,
    },
    {
        name: 'to',
        type: 'input',
        message: 'to?',
        default: conf.get('to'),
        validate: validator.validate,
    },
    {
        name: 'subject',
        type: 'input',
        message: 'subject?',
    },
    {
        name: 'text',
        type: 'editor',
        message: 'input?',
    },
    {
        name: 'confirm',
        type: 'confirm',
        message: 'Send?',
        default: true,
    }
];

main = async () => {
    try {
        const result = await inquirer.prompt(questions);
        if(result.confirm) {
            sgMail.setApiKey(result.apikey);
            await sgMail.send(result);
            Object.entries(result).forEach(([k, v]) => conf.set(k, v));
            console.log('Ok.');
        } else {
            console.log('Abort.');
        }
    } catch (error) {
        console.error(error);
    }
};

main();
