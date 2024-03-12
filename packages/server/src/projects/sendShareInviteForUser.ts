import { Project } from '@scrrap/core';
import { UserType } from 'src/users/model';

export default ({
  project,
  invitedUser,
  invitingUser,
  message,
}: {
  project: Project;
  invitingUser: UserType;
  invitedUser: UserType;
  message: string;
}) => {
  const addMessage = message
    ? `, qui vous partage le message suivant : "${message}"`
    : ``;
  return {
    subject: `SCRRAP - Invitation au projet ${project.name}`,

    text: `SCRRAP - Invitation au projet ${project.name}`,

    html: `<p>Bonjour ${invitedUser.firstName} ${invitedUser.lastName},</p>
        <br/>
    
      <p>Vous avez été invité à collaborer au projet <b>${project.name}</b> sur SCRRAP.</p>
      <br/>
    
      <p>Cette invitation est envoyée par ${invitingUser.firstName} ${invitingUser.lastName}${addMessage}.</p><br/>
    
      <p>Connectez-vous sur SCRRAP pour le retrouver !</p>
      <br/>
    
      <p>À bientôt,</p>
      <br/>
    
      <p>SCRRAP</p>
          `,
  };
};
