import { isDevelopment, getAppConfig } from '../../utils/environment';

const EnvironmentBadge = () => {
  if (!isDevelopment()) return null;

  const config = getAppConfig();

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
        🔧 {config.environment.toUpperCase()} v{config.version}
      </div>
    </div>
  );
};

export default EnvironmentBadge;