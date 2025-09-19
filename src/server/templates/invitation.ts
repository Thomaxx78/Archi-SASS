import type { MailTemplate } from '../services/mail';

export interface InvitationTemplateData {
	invitedUserName: string;
	inviterName: string;
	eventTitle: string;
	eventDate: string;
	eventLocation?: string;
	eventDescription?: string;
	invitationUrl: string;
}

export function getInvitationTemplate(data: InvitationTemplateData): MailTemplate {
	const { invitedUserName, inviterName, eventTitle, eventDate, eventLocation, eventDescription, invitationUrl } = data;

	return {
		subject: `Invitation : ${eventTitle}`,
		html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitation à un événement</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #10b981;
            margin: 0;
            font-size: 28px;
          }
          .event-card {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .event-title {
            font-size: 24px;
            font-weight: bold;
            color: #059669;
            margin-bottom: 10px;
          }
          .event-details {
            margin: 10px 0;
          }
          .event-details strong {
            color: #047857;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 10px 0;
            text-align: center;
            min-width: 200px;
            background-color: #10b981;
            color: white;
          }
          .buttons-container {
            text-align: center;
            margin: 30px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
          .description {
            background-color: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
            border-left: 4px solid #10b981;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Vous êtes invité(e) !</h1>
          </div>

          <div class="content">
            <p>Bonjour <strong>${invitedUserName}</strong>,</p>

            <p><strong>${inviterName}</strong> vous invite à participer à l'événement suivant :</p>

            <div class="event-card">
              <div class="event-title">${eventTitle}</div>

              <div class="event-details">
                <p><strong>📅 Date :</strong> ${eventDate}</p>
                ${eventLocation ? `<p><strong>📍 Lieu :</strong> ${eventLocation}</p>` : ''}
              </div>

              ${
					eventDescription
						? `
                <div class="description">
                  <strong>📝 Description :</strong>
                  <p>${eventDescription}</p>
                </div>
              `
						: ''
				}
            </div>

            <p>Nous espérons vous voir à cet événement !</p>

            <div class="buttons-container">
              <a href="${invitationUrl}" class="button">🎉 Voir l'invitation</a>
            </div>
          </div>

          <div class="footer">
            <p>Cette invitation a été envoyée par ${inviterName}</p>
            <p>Si vous avez des questions, contactez directement l'organisateur.</p>
          </div>
        </div>
      </body>
      </html>
    `,
		text: `
      Invitation : ${eventTitle}

      Bonjour ${invitedUserName},

      ${inviterName} vous invite à participer à l'événement suivant :

      Événement : ${eventTitle}
      Date : ${eventDate}
      ${eventLocation ? `Lieu : ${eventLocation}` : ''}

      ${eventDescription ? `Description : ${eventDescription}` : ''}

      Nous espérons vous voir à cet événement !

      Pour voir l'invitation complète : ${invitationUrl}

      Cette invitation a été envoyée par ${inviterName}
      Si vous avez des questions, contactez directement l'organisateur.
    `,
	};
}
