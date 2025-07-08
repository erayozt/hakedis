import { Permission } from '../types';

interface PermissionMatrixProps {
  permissions: Permission[];
  selectedPermissions: string[];
  onChange: (permissionIds: string[]) => void;
}

export default function PermissionMatrix({
  permissions,
  selectedPermissions,
  onChange,
}: PermissionMatrixProps) {
  const getPermissionsByModule = () => {
    const modules = permissions.reduce((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
    
    return modules;
  };

  const getModuleDisplayName = (module: string) => {
    const moduleNames: Record<string, string> = {
      'wallet-settlement': 'Cüzdan Hakediş',
      'stored-card': 'Saklı Kart',
      'users': 'Kullanıcı Yönetimi',
      'roles': 'Rol Yönetimi',
      'communication': 'İletişim',
    };
    return moduleNames[module] || module;
  };

  const getActionDisplayName = (action: string) => {
    const actionNames: Record<string, string> = {
      view: 'Görüntüle',
      create: 'Oluştur',
      update: 'Güncelle',
      delete: 'Sil',
    };
    return actionNames[action] || action;
  };

  const handlePermissionToggle = (permissionId: string) => {
    const newSelectedPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter(id => id !== permissionId)
      : [...selectedPermissions, permissionId];
    
    onChange(newSelectedPermissions);
  };

  const handleModuleToggle = (modulePermissions: Permission[]) => {
    const modulePermissionIds = modulePermissions.map(p => p.id);
    const allSelected = modulePermissionIds.every(id => selectedPermissions.includes(id));
    
    let newSelectedPermissions;
    if (allSelected) {
      // Remove all module permissions
      newSelectedPermissions = selectedPermissions.filter(id => !modulePermissionIds.includes(id));
    } else {
      // Add all module permissions
      newSelectedPermissions = Array.from(new Set([...selectedPermissions, ...modulePermissionIds]));
    }
    
    onChange(newSelectedPermissions);
  };

  const handleActionToggle = (action: string) => {
    const actionPermissions = permissions.filter(p => p.action === action);
    const actionPermissionIds = actionPermissions.map(p => p.id);
    const allSelected = actionPermissionIds.every(id => selectedPermissions.includes(id));
    
    let newSelectedPermissions;
    if (allSelected) {
      // Remove all action permissions
      newSelectedPermissions = selectedPermissions.filter(id => !actionPermissionIds.includes(id));
    } else {
      // Add all action permissions
      newSelectedPermissions = Array.from(new Set([...selectedPermissions, ...actionPermissionIds]));
    }
    
    onChange(newSelectedPermissions);
  };

  const moduleGroups = getPermissionsByModule();
  const actions = ['view', 'create', 'update', 'delete'];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Modül
              </th>
              {actions.map(action => {
                const actionPermissions = permissions.filter(p => p.action === action);
                const actionPermissionIds = actionPermissions.map(p => p.id);
                const allSelected = actionPermissionIds.length > 0 && 
                  actionPermissionIds.every(id => selectedPermissions.includes(id));
                const someSelected = actionPermissionIds.some(id => selectedPermissions.includes(id));
                
                return (
                  <th key={action} className="text-center py-3 px-4 font-medium text-gray-700">
                    <div className="flex flex-col items-center space-y-2">
                      <span>{getActionDisplayName(action)}</span>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={input => {
                          if (input) input.indeterminate = someSelected && !allSelected;
                        }}
                        onChange={() => handleActionToggle(action)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Object.entries(moduleGroups).map(([module, modulePermissions]) => {
              const modulePermissionIds = modulePermissions.map(p => p.id);
              const allModuleSelected = modulePermissionIds.every(id => selectedPermissions.includes(id));
              const someModuleSelected = modulePermissionIds.some(id => selectedPermissions.includes(id));
              
              return (
                <tr key={module} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={allModuleSelected}
                        ref={input => {
                          if (input) input.indeterminate = someModuleSelected && !allModuleSelected;
                        }}
                        onChange={() => handleModuleToggle(modulePermissions)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="font-medium text-gray-900">
                        {getModuleDisplayName(module)}
                      </span>
                    </div>
                  </td>
                  {actions.map(action => {
                    const permission = modulePermissions.find(p => p.action === action);
                    
                    return (
                      <td key={action} className="py-3 px-4 text-center">
                        {permission ? (
                          <div className="flex flex-col items-center space-y-1">
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-xs text-gray-500 text-center">
                              {permission.displayName.split(' - ')[1]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {selectedPermissions.length > 0 && (
        <div className="bg-blue-50 p-4 border-t border-gray-200">
          <p className="text-sm text-blue-800 font-medium mb-2">
            Seçilen Yetkiler ({selectedPermissions.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedPermissions.map(permissionId => {
              const permission = permissions.find(p => p.id === permissionId);
              return permission ? (
                <span
                  key={permissionId}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {permission.displayName}
                  <button
                    type="button"
                    onClick={() => handlePermissionToggle(permissionId)}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
} 