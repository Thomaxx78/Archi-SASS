// Exemple d'utilisation du service de mail avec templates
// Ce fichier montre comment utiliser le service sans modifier le code existant

import { mailService } from './src/server/services/mail';
import { getWelcomeTemplate, getInvitationTemplate } from './src/server/templates';

// Exemple 1: Envoyer un email de bienvenue
async function sendWelcomeEmail() {
  const welcomeTemplate = getWelcomeTemplate({
    userName: 'Jean Dupont',
    appName: 'Archi-SASS',
    loginUrl: 'https://your-app.com/login'
  });

  await mailService.sendMail({
    to: 'jean.dupont@example.com',
    template: welcomeTemplate
  });
}

// Exemple 2: Envoyer une invitation à un événement
async function sendInvitationEmail() {
  const invitationTemplate = getInvitationTemplate({
    invitedUserName: 'Marie Martin',
    inviterName: 'Jean Dupont',
    eventTitle: 'Réunion équipe projet',
    eventDate: '15 octobre 2024 à 14h00',
    eventLocation: 'Salle de conférence A',
    eventDescription: 'Réunion hebdomadaire pour faire le point sur l\'avancement du projet.',
    acceptUrl: 'https://your-app.com/events/123/accept',
    declineUrl: 'https://your-app.com/events/123/decline'
  });

  await mailService.sendMail({
    to: 'marie.martin@example.com',
    template: invitationTemplate,
    cc: 'manager@example.com'
  });
}

// Exemple 3: Envoyer à plusieurs destinataires
async function sendBulkEmail() {
  const welcomeTemplate = getWelcomeTemplate({
    userName: 'Nouveaux utilisateurs',
    appName: 'Archi-SASS'
  });

  await mailService.sendMail({
    to: ['user1@example.com', 'user2@example.com', 'user3@example.com'],
    template: welcomeTemplate
  });
}

// Exemple 4: Vérifier la connexion SMTP
async function checkEmailConnection() {
  const isConnected = await mailService.verifyConnection();
  console.log('SMTP connection:', isConnected ? 'OK' : 'Failed');
}

// Export des fonctions pour utilisation
export {
  sendWelcomeEmail,
  sendInvitationEmail,
  sendBulkEmail,
  checkEmailConnection
};