import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import HTML_TEMPLATE from '@/middlewares/mail-template';
import { NODEMAILER_AUTH_EMAIL, NODEMAILER_AUTH_PASSWORD } from '@/config/config';

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: NODEMAILER_AUTH_EMAIL,
		pass: NODEMAILER_AUTH_PASSWORD,
	},
});

/** create reusable sendmail function
@params {object} options - mail options (to, subject, text, html)
@params {function} callback - callback function to handle response
*/
const SENDMAIL = async <T>(mailDetails: Mail.Options, callback: (err: Error | null, info: T | null) => void) => {
	try {
		const info = await (<T>transporter.sendMail(mailDetails));
		callback(null, info);
	} catch (error) {
		callback(error, null);
		console.log(error);
	}
};

// Example Mail Send
const EXAMPLE_SENDMAIL = async () => {
	const message = 'Hi there, you were emailed me through nodemailer';
	const options: Mail.Options = {
		from: 'NodeJS API TESTING <byertm.webdesing@gmail.com>', // sender address
		to: 'byertm.webdesing@gmail.com', // receiver email
		subject: 'Send email in Node.JS with Nodemailer using Gmail account', // Subject line
		text: message,
		html: HTML_TEMPLATE(message),
	};

	await SENDMAIL(options, (info) => {
		console.log(options);
		console.log('Email sent successfully');
		console.log('info', JSON.stringify(info));
		// console.log('MESSAGE ID: ', info?.messageId);
	});
};

export { SENDMAIL, EXAMPLE_SENDMAIL };

export default SENDMAIL;