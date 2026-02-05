import { useEffect, useState } from 'react';
import { 
  Trash2, 
  Search, 
  ShieldCheck,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import type { IUser } from '../../types/user';

export const AdminDashboard = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      alert('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.name?.toLowerCase().includes(lowerQuery) ||
        u.email.toLowerCase().includes(lowerQuery)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    try {
      const updatedUser = await adminService.updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u._id === userId ? updatedUser : u)));
      // Ideally show toast
    } catch (error: any) {
        console.error(error);
        alert(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error: any) {
        console.error(error);
        alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-950 text-slate-100 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <ShieldCheck className="w-8 h-8 mr-3 text-indigo-500" />
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Manage users and system permissions</p>
          </div>
          <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
                placeholder="Search users..." 
                className="pl-9 bg-slate-900 border-slate-800 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card className="bg-slate-900/50 backdrop-blur border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold mr-3 border border-slate-700">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-medium text-slate-200">{user.name}</div>
                            <div className="text-sm text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            user.role === 'admin'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {user.isActive ? (
                             <span className="inline-flex items-center text-emerald-400 text-sm">
                                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Active
                             </span>
                        ) : (
                             <span className="text-slate-500 text-sm">Inactive</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-400 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                           <select
                                className="bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded focus:ring-indigo-500 focus:border-indigo-500 p-1.5"
                                value={user.role}
                                onChange={(e) => handleRoleChange(user._id, e.target.value as 'user' | 'admin')}
                                disabled={currentUser?.id === user._id} // Prevent changing own role for safety in UI (backend logic exists but UI should also be safe)
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                onClick={() => handleDeleteUser(user._id)}
                                disabled={currentUser?.id === user._id}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
