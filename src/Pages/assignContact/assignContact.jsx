import React, { useState, useEffect } from 'react';
import { Table, Button, Select, Input, message, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axiosInstance from '../../api';

const { Option } = Select;

const AssignContact = () => {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredLeads, setFilteredLeads] = useState([]);

  useEffect(() => {
    fetchUsersAndLeads();
  }, []);

  const fetchUsersAndLeads = async () => {
    try {
      const [usersResponse, leadsResponse] = await Promise.all([
        axiosInstance.get('get-all-user/'),
        axiosInstance.get('/contacts/')
      ]);

      setUsers(usersResponse.data);
      setLeads(leadsResponse.data);
      setFilteredLeads(leadsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load data. Please try again.');
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = leads.filter(lead => 
      lead.first_name.toLowerCase().includes(value.toLowerCase()) ||
      lead.last_name.toLowerCase().includes(value.toLowerCase()) ||
      lead.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredLeads(filtered);
  };

  const handleAssign = async (leadId, userId) => {
    try {
      const leadToUpdate = leads.find(lead => lead.id === leadId);
      if (!leadToUpdate) {
        throw new Error('Lead not found');
      }

      const updatedLead = {
        ...leadToUpdate,
        assigned_to: userId || "",
      };

      await axiosInstance.put(`contacts/${leadId}/`, updatedLead);
      message.success('Contact assigned successfully');
      fetchUsersAndLeads(); // Refresh data
    } catch (error) {
      console.error('Error assigning Contact:', error);
      message.error('Failed to assign Contact. Please try again.');
    }
  };

  const columns = [
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (_, record) => `${record.phone}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assigned_to',
      key: 'assigned_to',
      render: (assignedTo, record) => (
        <Select
          style={{ width: 200 }}
          placeholder="Select a user"
          onChange={(value) => handleAssign(record.id, value)}
          value={assignedTo && assignedTo.length > 0 ? assignedTo[0].toString() : undefined}
        >
          <Option value="">Unassigned</Option>
          {users.map(user => (
            <Option key={user.id} value={user.id.toString()}>{user.name || user.username}</Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lead Assignment</h1>
      <Input
        placeholder="Search contacts"
        prefix={<SearchOutlined />}
        style={{ width: 200, marginBottom: 16 }}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Spin spinning={loading}>
        <Table 
          columns={columns} 
          dataSource={filteredLeads}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Spin>
    </div>
  );
};

export default AssignContact;