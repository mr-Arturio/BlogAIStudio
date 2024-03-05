import { faRobot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Logo = () => {
  return (
    <div className="text-4xl text-center py-4 font-heading">
      BlogAiStudio
      <FontAwesomeIcon icon={faRobot} className="text-2xxl text-green-500 pl-1 " />
    </div>
  );
};