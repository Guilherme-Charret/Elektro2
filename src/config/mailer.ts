import nodemailer from "nodemailer"

// const mailSender = process.env.MAIL_SENDER;
const mailSender = process.env.MAIL_SENDER 
// const clientSecret = process.env.CLIENT_SECRET;
// const clientId = process.env.CLIENT_ID
// const accessToken = process.env.ACCESS_TOKEN
// const refreshToken = process.env.REFRESH_TOKEN
const pass = process.env.PASSWORD


// Precisamos do Etheral, porque atualmente não é mais possível usar email e senha como forma de autenticação nos provedores de email tradicionais(Gmail, Outlook, etc) e tais provedores precisam cadastrar uma aplicação nova para obter um TOKEN de autenticação para tal. 

// Pra piorar, mesmo com isso, pode ser que ainda não funcione, principalmente se for o GMAIl
const transporter = nodemailer.createTransport({
	
	
	// O Etheral é um provedor de email para testes, ele cria um ambiente em que as simulações são feitas[aonde seus supostos emails estariam], mas não os faz de maneira real.
	
	
	// Passo 1: (Visite o site https://ethereal.email/create para saber mais)
	// Passo 2: Crie um novo email
	// Passo 3: Coloque as configurações recomandadas para nodemailer em seu código
	// Passo 4: Coloque a função sendEmail() aonde você gostaria de enviar um email
	// Passo 5: Proffit
	


	
	host: 'smtp.ethereal.email',
	port: 587,
	auth: {
		
		user: mailSender,
		// clientSecret: clientSecret,
		// clientId: clientId,
		// accessToken: accessToken,
		// refreshToken: refreshToken,
		pass:pass 
	},
});

export class Mailer {
	static createMessageObject(
		emailToBeSendedTo: string,
		subject: string,
		messageText: string
	) {
		const messageObject = {
			from: mailSender,
			to: emailToBeSendedTo,
			subject: subject,
			text: messageText,
		};

		return messageObject;
	}

	public static sendEmail(
		emailToBeSendedTo: string,
		subject: string,
		messageText: string
	) {

		const messageObject = Mailer.createMessageObject(
			emailToBeSendedTo,
			subject,
			messageText
		);

		transporter.sendMail(messageObject, (error) => {
			if (error != null) {
				throw error;
			}
		});
	}
}