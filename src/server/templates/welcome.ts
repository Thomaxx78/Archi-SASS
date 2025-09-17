import type { MailTemplate } from '../services/mail';

export interface WelcomeTemplateData {
  userName: string;
  appName: string;
  loginUrl?: string;
}

export function getWelcomeTemplate(data: WelcomeTemplateData): MailTemplate {
  const { userName, appName, loginUrl } = data;

  return {
    subject: `Bienvenue sur ${appName} !`,
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue</title>
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
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #3b82f6;
            margin: 0;
            font-size: 28px;
          }
          .content {
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
          .highlight {
            background-color: #eff6ff;
            padding: 15px;
            border-left: 4px solid #3b82f6;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienvenue sur ${appName}</h1>
          </div>

          <div class="content">
            <p>Bonjour <strong>${userName}</strong>,</p>

            <p>Nous sommes ravis de vous accueillir sur ${appName} ! Votre compte a été créé avec succès.</p>

            <div class="highlight">
              <p><strong>Félicitations !</strong> Vous faites maintenant partie de notre communauté.</p>
            </div>

            <p>Vous pouvez dès maintenant :</p>
            <ul>
              <li>Explorer toutes les fonctionnalités de l'application</li>
              <li>Personnaliser votre profil</li>
              <li>Commencer à utiliser nos services</li>
            </ul>

            ${loginUrl ? `
              <p>
                <a href="${loginUrl}" class="button">Se connecter maintenant</a>
              </p>
            ` : ''}
          </div>

          <div class="footer">
            <p>Merci de faire confiance à ${appName}</p>
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Bienvenue sur ${appName} !

      Bonjour ${userName},

      Nous sommes ravis de vous accueillir sur ${appName} ! Votre compte a été créé avec succès.

      Félicitations ! Vous faites maintenant partie de notre communauté.

      Vous pouvez dès maintenant :
      - Explorer toutes les fonctionnalités de l'application
      - Personnaliser votre profil
      - Commencer à utiliser nos services

      ${loginUrl ? `Connectez-vous dès maintenant : ${loginUrl}` : ''}

      Merci de faire confiance à ${appName}
      Si vous avez des questions, n'hésitez pas à nous contacter.
    `
  };
}