import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Activity,
  Server,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { selectUser } from '../../store/slices/authSlice';
import { formatRelativeTime } from '../../lib/utils';

const AdminDashboard = () => {
  const user = useSelector(selectUser);
  const [dashboardData, setDashboardData] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
    fetchSystemHealth();

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchSystemHealth();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/v1/admin/dashboard-stats', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemHealth = async () => {
    try {
      const response = await fetch('/api/v1/admin/system-health', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setSystemHealth(data.system);
      }
    } catch (error) {
      console.error('Failed to fetch system health:', error);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, trend, color = "text-blue-600" }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend}% from last month
              </p>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 bg-gradient-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'system', label: 'System Health', icon: Server },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center space-x-2"
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </Button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboardData && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={dashboardData.overview.totalUsers.toLocaleString()}
              icon={Users}
              color="text-blue-600"
            />
            <StatCard
              title="Active Jobs"
              value={dashboardData.overview.activeJobs.toLocaleString()}
              icon={Briefcase}
              color="text-green-600"
            />
            <StatCard
              title="Applications"
              value={dashboardData.overview.totalApplications.toLocaleString()}
              icon={FileText}
              color="text-purple-600"
            />
            <StatCard
              title="Online Users"
              value={dashboardData.realTime.connectedUsers}
              icon={Activity}
              color="text-orange-600"
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Job Seekers</span>
                    <span className="text-sm text-muted-foreground">
                      {dashboardData.overview.jobSeekers}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(dashboardData.overview.jobSeekers / dashboardData.overview.totalUsers) * 100}%`
                      }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Employers</span>
                    <span className="text-sm text-muted-foreground">
                      {dashboardData.overview.employers}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(dashboardData.overview.employers / dashboardData.overview.totalUsers) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Job Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.categories.slice(0, 5).map((category, index) => (
                    <div key={category._id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category._id}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(category.count / dashboardData.categories[0].count) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-8 text-right">
                          {category.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && dashboardData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Job Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.trends.monthlyJobs}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id.month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.trends.monthlyApplications}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id.month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsPieChart>
                  <Pie
                    data={dashboardData.categories.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                  >
                    {dashboardData.categories.slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Health Tab */}
      {activeTab === 'system' && systemHealth && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Server Uptime</p>
                    <p className="text-2xl font-bold">
                      {Math.floor(systemHealth.uptime / 3600)}h {Math.floor((systemHealth.uptime % 3600) / 60)}m
                    </p>
                  </div>
                  <Server className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Memory Usage</p>
                    <p className="text-2xl font-bold">
                      {systemHealth.memory.used}MB / {systemHealth.memory.total}MB
                    </p>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(systemHealth.memory.used / systemHealth.memory.total) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Connected Users</p>
                    <p className="text-2xl font-bold">{systemHealth.realTime.connected}</p>
                    <p className="text-sm text-muted-foreground">
                      JS: {systemHealth.realTime.jobSeekers} | E: {systemHealth.realTime.employers}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Database Records</p>
                    <p className="text-2xl font-bold">
                      {(systemHealth.database.users + systemHealth.database.jobs + systemHealth.database.applications).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      U: {systemHealth.database.users} | J: {systemHealth.database.jobs} | A: {systemHealth.database.applications}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Memory Details</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Heap Used:</span>
                        <span>{systemHealth.memory.used}MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Heap Total:</span>
                        <span>{systemHealth.memory.total}MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>External:</span>
                        <span>{systemHealth.memory.external}MB</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Real-time Connections</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Job Seekers Online:</span>
                        <span>{systemHealth.realTime.jobSeekers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Employers Online:</span>
                        <span>{systemHealth.realTime.employers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span>{formatRelativeTime(systemHealth.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
