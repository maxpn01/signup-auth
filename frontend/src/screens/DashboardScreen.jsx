import { Table, Container, Button } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { 
    useGetUserProfilesMutation,
    useBlockUsersMutation,
    useUnblockUsersMutation,
    useDeleteUsersMutation
} from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import { FaLock, FaLockOpen, FaTrashAlt } from 'react-icons/fa';
import { useLogoutMutation } from "../slices/usersApiSlice";
import { updateUserStatus, logout } from "../slices/authSlice";

const DashboardScreen = () => {
    const [users, setUsers] = useState([]);
    const [getUsers] = useGetUserProfilesMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const { userInfo } = useSelector(state => state.auth);

    const handleLogout = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const result = await getUsers().unwrap();
            setUsers(result);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const [selectedUsers, setSelectedUsers] = useState([]);

    const [blockUsers] = useBlockUsersMutation();
    const [unblockUsers] = useUnblockUsersMutation();
    const [deleteUsers] = useDeleteUsersMutation();

    const handleCheckboxChange = (userId) => {
        if (selectedUsers.includes(userId))
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        else setSelectedUsers([...selectedUsers, userId]);
    };

    const handleBlock = async () => {
        try {
            await blockUsers({ selectedUsers });

            if (selectedUsers.includes(userInfo.user._id)) {
                dispatch(updateUserStatus("blocked"));
                handleLogout();
            } else {
                fetchUsers();
                setSelectedUsers([]);
            }
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };
    
    const handleUnblock = async () => {
        try {
            await unblockUsers({ selectedUsers });

            if (selectedUsers.includes(userInfo.user._id)) 
                dispatch(updateUserStatus("active"));

            fetchUsers();
            setSelectedUsers([]);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };
    
    const handleDelete = async () => {
        try {
            await deleteUsers({ selectedUsers });

            if (selectedUsers.includes(userInfo.user._id)) 
                handleLogout();
            else {
                fetchUsers();
                setSelectedUsers([]);
            }
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }; 

    const convertDateString = (s) => {
        const time = new Date(s).toLocaleTimeString("en-us", { hour: "numeric", minute: "numeric", second: "numeric" });
        const date = new Date(s).toLocaleDateString("en-us", { day: "numeric", month: "short", year: "numeric" });
        return time.toString() + ", " + date.toString();
    };

    return (
        <Container>
             <div className="toolbar mt-5 mb-3">
                <Button variant="outline-warning" className="me-2" onClick={handleBlock}><FaLock /> Block</Button>
                <Button variant="outline-warning" className="me-2" onClick={handleUnblock}><FaLockOpen /></Button>
                <Button variant="outline-danger" onClick={handleDelete}><FaTrashAlt /></Button>
            </div>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>
                    <input
                        type="checkbox"
                        checked={selectedUsers.length === users.length}
                        onChange={() => {
                            if (selectedUsers.length === users.length)
                                setSelectedUsers([]);
                            else setSelectedUsers(users.map((user) => user._id));
                        }}
                    />
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Last Login</th>
                    <th>Registration</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user._id}>
                    <td>
                        <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleCheckboxChange(user._id)}
                        />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{convertDateString(user.lastLoginDate)}</td>
                    <td>{convertDateString(user.registrationDate)}</td>
                    <td>{user.status}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    )
};

export default DashboardScreen;