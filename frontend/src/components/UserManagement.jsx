import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Trash, Edit, Save, XCircle, PlusCircle, Search } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // เก็บรายการผู้ใช้ที่กรองแล้ว
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // เก็บค่าค้นหาชื่อผู้ใช้
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [passwordError, setPasswordError] = useState(""); // เก็บข้อความแจ้งเตือนเกี่ยวกับรหัสผ่าน

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users");
        setUsers(res.data);
        setFilteredUsers(res.data); // กำหนดค่าเริ่มต้นสำหรับผู้ใช้ที่กรองแล้ว
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ฟังก์ชันค้นหาผู้ใช้ตามชื่อ
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleEditUser = (user) => {
    setEditingUserId(user._id);
    setEditedUser({ name: user.name, email: user.email, role: user.role });
  };

  const handleSaveUser = async (userId) => {
    try {
      await axios.put(`/users/${userId}`, editedUser);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, ...editedUser } : user
        )
      );
      setEditingUserId(null);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddUser = async () => {
    if (newUser.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("/auth/signup", {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      });

      setUsers([...users, res.data]);
      setFilteredUsers([...users, res.data]); // เพิ่มผู้ใช้ใหม่ในรายการกรองแล้ว
      setNewUser({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "customer",
      });
      setPasswordError(""); // รีเซ็ตข้อความแจ้งเตือน
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-emerald-400 mb-6">
        User Management
      </h2>

      {/* ช่องค้นหาผู้ใช้ */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 rounded bg-gray-700 text-white w-full"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* ฟอร์มสำหรับเพิ่มผู้ใช้ใหม่ */}
      <div className="mb-6">
        <h3 className="text-xl text-gray-300">Add New User</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={newUser.confirmPassword}
            onChange={(e) =>
              setNewUser({ ...newUser, confirmPassword: e.target.value })
            }
            className="p-2 rounded bg-gray-700 text-white"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          onClick={handleAddUser}
          className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-500 flex items-center"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add User
        </button>
        {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
      </div>

      {/* แสดงตารางข้อมูลผู้ใช้ */}
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingUserId === user._id ? (
                  <input
                    type="text"
                    className="text-gray-900 p-2 rounded"
                    value={editedUser.name}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, name: e.target.value })
                    }
                  />
                ) : (
                  user.name
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingUserId === user._id ? (
                  <input
                    type="email"
                    className="text-gray-900 p-2 rounded"
                    value={editedUser.email}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, email: e.target.value })
                    }
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingUserId === user._id ? (
                  <select
                    className="text-gray-900 p-2 rounded"
                    value={editedUser.role}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, role: e.target.value })
                    }
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingUserId === user._id ? (
                  <div className="flex space-x-2">
                    <button
                      className="text-green-400 hover:text-green-300"
                      onClick={() => handleSaveUser(user._id)}
                    >
                      <Save className="h-5 w-5" />
                    </button>
                    <button
                      className="text-yellow-400 hover:text-yellow-300"
                      onClick={() => setEditingUserId(null)}
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-400 hover:text-blue-300"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
