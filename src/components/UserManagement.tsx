import React, { useState } from 'react';
import { Check, X, ShieldAlert, UserX, Plus, CheckCircle, AlertTriangle } from 'lucide-react';

interface UserRole {
  id: number;
  role_name: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface User {
  user_id: number;
  full_name: string;
  email: string;
  status: 'active' | 'pending' | 'suspended';
  roles: UserRole[];
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      user_id: 1,
      full_name: "John Munyiri",
      email: "john.munyiri@example.com",
      status: "active",
      roles: [{ id: 1, role_name: "club_admin", status: "approved" }]
    },
    {
      user_id: 2,
      full_name: "Sarah Kipchoge",
      email: "sarah.kipchoge@example.com",
      status: "active",
      roles: [{ id: 2, role_name: "tournament_admin", status: "approved" }]
    },
    {
      user_id: 3,
      full_name: "Peter Mwangi",
      email: "peter.mwangi@example.com",
      status: "pending",
      roles: [{ id: 3, role_name: "referee", status: "pending" }]
    },
    {
      user_id: 4,
      full_name: "Jane Okonkwo",
      email: "jane.okonkwo@example.com",
      status: "active",
      roles: [{ id: 4, role_name: "federation_admin", status: "approved" }]
    }
  ]);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleApproveRole = (userRoleId: number) => {
    setUsers(users.map(user => ({
      ...user,
      roles: user.roles.map(role =>
        role.id === userRoleId ? { ...role, status: 'approved' as const } : role
      )
    })));
    setMessage({ type: 'success', text: 'Role approved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRevokeRole = (userRoleId: number) => {
    setUsers(users.map(user => ({
      ...user,
      roles: user.roles.map(role =>
        role.id === userRoleId ? { ...role, status: 'rejected' as const } : role
      )
    })));
    setMessage({ type: 'success', text: 'Role revoked!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpdateStatus = (userId: number, newStatus: 'active' | 'suspended' | 'pending') => {
    setUsers(users.map(user =>
      user.user_id === userId ? { ...user, status: newStatus } : user
    ));
    setMessage({ type: 'success', text: `User status updated to ${newStatus}!` });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.user_id !== userId));
      setMessage({ type: 'success', text: 'User deleted!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-500">Manage system users, roles, and permissions</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Roles & Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Account Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">{user.full_name}</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <div key={role.id} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                          <span className="text-xs font-semibold text-slate-600 capitalize">
                            {role.role_name.replace('_', ' ')}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            role.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                            role.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {role.status}
                          </span>
                          {role.status === 'pending' && (
                            <button 
                              onClick={() => handleApproveRole(role.id)}
                              className="text-emerald-600 hover:text-emerald-800"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          {role.status === 'approved' && (
                            <button 
                              onClick={() => handleRevokeRole(role.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      user.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      user.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.status !== 'suspended' && (
                        <button
                          onClick={() => handleUpdateStatus(user.user_id, 'suspended')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Suspend User"
                        >
                          <UserX size={18} />
                        </button>
                      )}
                      {user.status === 'suspended' && (
                        <button
                          onClick={() => handleUpdateStatus(user.user_id, 'active')}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Activate User"
                        >
                          <ShieldAlert size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
