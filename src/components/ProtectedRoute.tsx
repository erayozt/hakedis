import { Navigate } from 'react-router-dom';
import { isFraudFeaturesEnabled } from '../utils/environment';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireFraudFeature?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireFraudFeature = false, 
  redirectTo = '/admin/dashboard' 
}: ProtectedRouteProps) {
  if (requireFraudFeature && !isFraudFeaturesEnabled()) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
} 