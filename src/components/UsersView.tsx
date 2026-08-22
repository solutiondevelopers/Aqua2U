import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Shield, UserPlus, Check, Trash2, Mail, Lock } from 'lucide-react';

export const UsersView: React.FC = () => {
  const [users, setUsers] = useState([
    { id: 'US-101', name: 'R. Mehta', email: 'admin@citywater.gov.in', role: 'Municipal Authority (Admin)', status: 'Active', lastActive: 'Just now' },
    { id: 'US-102', name: 'Suresh Kumar', email: 'suresh.driver@citywater.gov.in', role: 'Tanker Driver (TK-104)', status: 'Active', lastActive: '5 min ago' },
    { id: 'US-103', name: 'Sunita Gaikwad', email: 'sunita.citizen@gmail.com', role: 'Citizen Beneficiary', status: 'Active', lastActive: '12 min ago' },
    { id: 'US-104', name: 'Vikram Shinde', email: 'operator.parvati@citywater.gov.in', role: 'Filling Station Operator (FS-01)', status: 'Active', lastActive: '1 hr ago' },
    { id: 'US-105', name: 'Control Desk Dispatch', email: 'dispatch@citywater.gov.in', role: 'Control Desk Dispatcher', status: 'Active', lastActive: 'Just now' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Citizen Beneficiary');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    setUsers(prev => [
      {
        id: `US-10${prev.length + 1}`,
        name: newName,
        email: newEmail,
        role: newRole,
        status: 'Active',
        lastActive: 'Just now'
      },
      ...prev
    ]);
    setNewName('');
    setNewEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Municipal User Management & RBAC</h2>
          <p className="text-xs text-slate-500">Manage role-based access control (RBAC), security permissions, and authenticated accounts.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User Account</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Authorized Users ({users.length})</span>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold">
            Strict Data Isolation Enforced
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {users.map(user => (
            <div key={user.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs flex items-center justify-center">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{user.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{user.id}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 inline-block">
                    {user.role}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Last active: {user.lastActive}</span>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {user.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Provision New Municipal User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-xs font-bold">✕</button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Inspector Patil"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="patil@citywater.gov.in"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Assigned Role & Portal Access</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                >
                  <option value="Municipal Authority (Admin)">Municipal Authority (Admin)</option>
                  <option value="Control Desk Dispatcher">Control Desk Dispatcher</option>
                  <option value="Tanker Driver">Tanker Driver</option>
                  <option value="Filling Station Operator">Filling Station Operator</option>
                  <option value="Citizen Beneficiary">Citizen Beneficiary</option>
                </select>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
