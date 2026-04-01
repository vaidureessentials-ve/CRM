// Dynamic Role Management Utility
// This persists to localStorage for a 'Frontend-First' feel in a local environment.

const DEFAULT_ROLES = [
  { id: 'admin', label: 'Admin', color: 'purple', description: 'Total system override' },
  { id: 'business_associate', label: 'Business Associate', color: 'blue', description: 'Sales and client interaction' },
  { id: 'team_leader', label: 'Team Leader', color: 'amber', description: 'Supervision and oversight' },
  { id: 'manager', label: 'Manager', color: 'blue', description: 'Departmental management and strategy' },
  { id: 'hr', label: 'HR', color: 'purple', description: 'Human resources and recruitment' },
  { id: 'assistant_manager', label: 'Assistant Manager', color: 'emerald', description: 'Operational support and assistance' }
];

export const getRoles = () => {
  const saved = localStorage.getItem('crm_roles');
  if (!saved) return DEFAULT_ROLES;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return DEFAULT_ROLES;
  }
};

export const saveRoles = (roles) => {
  localStorage.setItem('crm_roles', JSON.stringify(roles));
};

export const addRole = (role) => {
  const roles = getRoles();
  const updated = [...roles, { ...role, id: role.label.toLowerCase().replace(/ /g, '_') }];
  saveRoles(updated);
  return updated;
};

export const updateRole = (id, updatedRole) => {
  const roles = getRoles();
  const updated = roles.map(r => r.id === id ? { ...updatedRole, id } : r);
  saveRoles(updated);
  return updated;
};

export const deleteRole = (id) => {
  const roles = getRoles();
  if (['admin', 'business_associate', 'team_leader'].includes(id)) return roles; // Protected
  const updated = roles.filter(r => r.id !== id);
  saveRoles(updated);
  return updated;
};
