// templates/login.ts
import type { MailTemplate } from '../services/mail';

export interface LoginTemplateData {
  email: string;
  appName: string;
  loginUrl: string;
}

export function getLoginTemplate(data: LoginTemplateData): MailTemplate {
  const { email, appName, loginUrl } = data;

  return {
    subject: `Connexion à ${appName}`,
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Connexion à ${appName}</title>
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
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
            font-size: 16px;
            text-align: center;
          }
          .button:hover {
            background-color: #2563eb;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
          .security-note {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
          }
          .security-note p {
            margin: 0;
            color: #92400e;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Connexion à ${appName}</h1>
          </div>

          <div class="content">
            <p>Bonjour,</p>

            <p>Vous avez demandé à vous connecter à <strong>${appName}</strong> avec l'adresse email <strong>${email}</strong>.</p>

            <p>Cliquez sur le bouton ci-dessous pour vous connecter :</p>

            <p style="text-align: center;">
              <a href="${loginUrl}" class="button">🚀 Se connecter maintenant</a>
            </p>

            <div class="security-note">
              <p><strong>⚠️ Note de sécurité :</strong> Ce lien est valable pendant 24 heures et ne peut être utilisé qu'une seule fois. Si vous n'avez pas demandé cette connexion, ignorez cet email.</p>
            </div>

            <p>Vous pouvez aussi copier-coller ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px;">${loginUrl}</p>
          </div>

          <div class="footer">
            <p>Cet email a été envoyé par ${appName}</p>
            <p>Si vous avez des questions, contactez notre support.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Connexion à ${appName}

      Bonjour,

      Vous avez demandé à vous connecter à ${appName} avec l'adresse email ${email}.

      Cliquez sur ce lien pour vous connecter :
      ${loginUrl}

      Note de sécurité : Ce lien est valable pendant 24 heures et ne peut être utilisé qu'une seule fois. Si vous n'avez pas demandé cette connexion, ignorez cet email.

      Cet email a été envoyé par ${appName}
      Si vous avez des questions, contactez notre support.
    `
  };
}