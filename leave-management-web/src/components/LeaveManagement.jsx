import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const ManageLeavesPage = () => {
    const [leaves, setLeaves] = useState([]);
    const [error, setError] = useState(null);

    const fetchLeaves = async () => {
        try {
            const response = await axios.get('http://localhost:8800/api/leaves', {
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

    const handleApprove = async (leaveId) => {
        try {
            await axios.patch(`http://localhost:8800/api/leavesApp/approve`, { leaveId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // อัปเดต state โดยการกรองใบลาที่ได้รับการอนุมัติออกจาก state
            setLeaves((prevLeaves) => prevLeaves.filter(leave => leave.id !== leaveId));
        } catch (error) {
            console.error('Failed to approve leave:', error);
        }
    };
    
    const handleReject = async (leaveId) => {
        try {
            await axios.patch(`http://localhost:8800/api/leavesApp/reject`, { leaveId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // อัปเดต state โดยการกรองใบลาที่ได้รับการปฏิเสธออกจาก state
            setLeaves((prevLeaves) => prevLeaves.filter(leave => leave.id !== leaveId));
        } catch (error) {
            console.error('Failed to reject leave:', error);
        }
    };
    

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
                                    <th>ผู้ใช้งาน</th>
                                    <th>ดำเนินการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map((leave) => (
                                    <tr key={leave.id}>
                                        <td>{leave.type}</td>
                                        <td>{leave.status}</td>
                                        <td>{leave.userName}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleApprove(leave.id)} 
                                                className="btn btn-success mr-2"
                                            >
                                                อนุมัติ
                                            </button>
                                            <button 
                                                onClick={() => handleReject(leave.id)} 
                                                className="btn btn-error"
                                            >
                                                ปฏิเสธ
                                            </button>
                                        </td>
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

export default ManageLeavesPage;
