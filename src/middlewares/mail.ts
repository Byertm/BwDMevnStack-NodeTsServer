import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import HTML_TEMPLATE, { BODY_TEMPLATE, ContactFormValues } from '@/middlewares/mail-template';
import { NODEMAILER_AUTH_EMAIL, NODEMAILER_AUTH_PASSWORD } from '@/config/config';

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: NODEMAILER_AUTH_EMAIL,
		pass: NODEMAILER_AUTH_PASSWORD
	}
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

// Coctact Mail Send
const CONTACT_SENDMAIL = async (message: string) => {
	const subject = 'BwDServer - İletişim Formu';
	const text = 'Merhaba, bu e-posta BwDServer üzerinden gönderildi.';
	const options: Mail.Options = {
		from: 'BwDServer <byertm.webdesing@gmail.com>', // sender address
		to: 'byertm.webdesing@gmail.com', // receiver email
		subject, // Subject line
		text,
		html: HTML_TEMPLATE(message)
	};

	await SENDMAIL(options, (_err: Error, info: unknown) => {
		console.log(options);
		console.log('Email sent successfully');
		console.log('info', JSON.stringify(info));
		// console.log('MESSAGE ID: ', info?.messageId);
	});
};

export { SENDMAIL, CONTACT_SENDMAIL, BODY_TEMPLATE, ContactFormValues };

export default SENDMAIL;