import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { getSession } from '../utils/storage';

/** Guards authenticated routes and optionally requires the administrator role. */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();
  const session = getSession();
  if (!session) return <Navigate replace state={{ from: location }} to="/login" />;
  if (adminOnly && session.role !== 'admin') return <Navigate replace to="/blogs" />;
  return children;
}
ProtectedRoute.propTypes = { children: PropTypes.node.isRequired, adminOnly: PropTypes.bool };
