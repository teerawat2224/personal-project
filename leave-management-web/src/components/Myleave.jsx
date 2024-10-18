import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import useUserStore from '../stores/userStore';

const MyLeavesPage = () => {
    const [leaves, setLeaves] = useState([]);
    const [error, setError] = useState(null);
    const user = useUserStore( state => state.user)
    console.log(user)

    const fetchLeaves = async () => {
        try {
            const response = await axios.get(`http://localhost:8800/api/leaves/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setLeaves(response.data);
        } catch (error) {
            setError('ไม่สามารถดึงข้อมูลใบลาได้');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);
console.log(leaves)

    

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Topbar />
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">จัดการใบลา</h1>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full border border-gray-300">
                            <thead>
                                <tr>
                                    <th>ประเภทใบลา</th>
                                    <th>สถานะ</th>
                                    <th>เหตุผล</th>
                                    <th>วันเริ่มลา</th>
                                    <th>จบวันลา</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map((leave) => (
                                    <tr key={leave.id}>
                                        <td>{leave.type}</td>
                                        <td>{leave.status}</td>
                                        <td>{leave.userNote}</td>
                                        <td>{new Date(leave.createdAt).toLocaleDateString("en-GB")}</td>
                                        <td>{new Date(leave.endDate).toLocaleDateString("en-GB")}</td>                            
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyLeavesPage;
