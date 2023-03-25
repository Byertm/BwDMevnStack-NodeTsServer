// an email template that can be used with Nodemailer to send emails

export type ContactFormValues = { name: string; email: string; phone: string; subject: string; message: string };

export const BODY_TEMPLATE = ({ name, email, phone, subject, message }: ContactFormValues) => {
	return `
	<table class="styled-table">
		<thead>
			<tr>
				<th>Name</th>
				<th>E-Mail</th>
				<th>Phone</th>
				<th>Subject</th>
				<th>Message</th>
			</tr>
		</thead>
		<tbody>
			<tr class="-active-row">
				<td>${name}</td>
				<td>${email}</td>
				<td>${phone}</td>
				<td>${subject}</td>
				<td>${message}</td>
			</tr>
		</tbody>
	</table>
	`.replace(/\s+/g, ' ').trim();
};

export const HTML_TEMPLATE = (bodyMessage: string, header?: string, title?: string, ownerName?: string, footer?: string): string => {
	const getFullYear: string = new Date()?.getFullYear?.().toString?.() || '2023';
	if (!ownerName) ownerName = 'BwDServer';
	if (!header) header = `${ownerName} - Contact Form`;
	if (!title) title = `${ownerName} Contact Email Template`;
	if (!footer) footer = `${ownerName} - Copyright &copy; ${getFullYear}`;

	return `
		<!DOCTYPE html>
		<html>
			<head>
			<meta charset="utf-8">
			<title>${title}</title>
			<style>
				.container {
					width: 100%;
					height: 100%;
					padding: 20px;
					background-color: #f4f4f4;
				}
				.email {
					width: 80%;
					margin: 0 auto;
					background-color: #fff;
					padding: 20px;
				}
				.email-header {
					background-color: #333;
					color: #fff;
					padding: 20px;
					text-align: center;
				}
				.email-body {
					padding: 20px;
				}
				.email-footer {
					background-color: #333;
					color: #fff;
					padding: 20px;
					text-align: center;
				}
			</style>
			<style>
				.styled-table {
					border-collapse: collapse;
					margin: 25px 0;
					font-size: 0.9em;
					font-family: sans-serif;
					min-width: 400px;
					margin: 0 auto;
					box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
				}
				.styled-table thead tr {
					background-color: #009879;
					color: #ffffff;
					text-align: left;
				}
				.styled-table th,
				.styled-table td {
					padding: 12px 15px;
				}
				.styled-table tbody tr {
					border-bottom: 1px solid #dddddd;
				}
				.styled-table tbody tr:nth-of-type(even) {
					background-color: #f3f3f3;
				}
				.styled-table tbody tr:last-of-type {
					border-bottom: 2px solid #009879;
				}
				.styled-table tbody tr.active-row,
				.styled-table tbody tr:active,
				.styled-table tbody tr:focus,
				.styled-table tbody tr:hover {
					font-weight: bold;
					color: #009879;
				}
			</style>
			</head>
			<body>
			<div class="container">
				<div class="email">
				<div class="email-header">
					<h1>${header}</h1>
				</div>
				<div class="email-body">
					<p>${bodyMessage}</p>
				</div>
				<div class="email-footer">
					<p>${footer}</p>
				</div>
				</div>
			</div>
			</body>
		</html>
	`.replace(/\s+/g, ' ').trim();
};

export default HTML_TEMPLATE;
