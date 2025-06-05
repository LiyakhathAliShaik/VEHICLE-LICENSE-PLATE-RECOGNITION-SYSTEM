import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Camera, 
  Database, 
  Bell, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter, 
  Download,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';

// Mock data for demonstration
const mockDetections = [
  { id: 1, plateNumber: 'ABC123', timestamp: '2025-06-10T14:32:45', confidence: 0.98, status: 'allowed', vehicleType: 'sedan', location: 'Main Gate' },
  { id: 2, plateNumber: 'XYZ789', timestamp: '2025-06-10T14:30:12', confidence: 0.95, status: 'blacklisted', vehicleType: 'suv', location: 'Main Gate' },
  { id: 3, plateNumber: 'DEF456', timestamp: '2025-06-10T14:28:30', confidence: 0.92, status: 'allowed', vehicleType: 'truck', location: 'Side Entrance' },
  { id: 4, plateNumber: 'GHI789', timestamp: '2025-06-10T14:25:18', confidence: 0.89, status: 'unknown', vehicleType: 'sedan', location: 'Main Gate' },
  { id: 5, plateNumber: 'JKL012', timestamp: '2025-06-10T14:20:05', confidence: 0.97, status: 'allowed', vehicleType: 'motorcycle', location: 'Side Entrance' },
  { id: 6, plateNumber: 'MNO345', timestamp: '2025-06-10T14:15:42', confidence: 0.91, status: 'allowed', vehicleType: 'van', location: 'Delivery Entrance' },
  { id: 7, plateNumber: 'PQR678', timestamp: '2025-06-10T14:10:33', confidence: 0.88, status: 'blacklisted', vehicleType: 'sedan', location: 'Main Gate' },
  { id: 8, plateNumber: 'STU901', timestamp: '2025-06-10T14:05:21', confidence: 0.94, status: 'allowed', vehicleType: 'suv', location: 'Side Entrance' },
];

// Mock statistics
const mockStats = {
  totalDetections: 1458,
  todayDetections: 124,
  blacklistedDetected: 7,
  averageAccuracy: 94.2
};

// Mock camera locations
const mockLocations = [
  { id: 1, name: 'Main Gate', status: 'active' },
  { id: 2, name: 'Side Entrance', status: 'active' },
  { id: 3, name: 'Delivery Entrance', status: 'active' },
  { id: 4, name: 'Parking Lot A', status: 'inactive' },
];

function App() {
  const [detections, setDetections] = useState(mockDetections);
  const [stats, setStats] = useState(mockStats);
  const [locations, setLocations] = useState(mockLocations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate data fetching
  const fetchData = () => {
    setIsLoading(true);
    // In a real application, this would be an API call
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort detections
  const filteredDetections = detections
    .filter(detection => {
      const matchesSearch = detection.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || detection.status === statusFilter;
      const matchesLocation = locationFilter === 'all' || detection.location === locationFilter;
      return matchesSearch && matchesStatus && matchesLocation;
    })
    .sort((a, b) => {
      if (sortField === 'timestamp') {
        return sortDirection === 'asc' 
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortField === 'confidence') {
        return sortDirection === 'asc' 
          ? a.confidence - b.confidence
          : b.confidence - a.confidence;
      } else {
        // Sort by plate number as default
        return sortDirection === 'asc'
          ? a.plateNumber.localeCompare(b.plateNumber)
          : b.plateNumber.localeCompare(a.plateNumber);
      }
    });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Smart License Plate Recognition</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-indigo-600 hover:bg-indigo-800 px-4 py-2 rounded-md flex items-center space-x-2 transition-colors">
              <Bell className="h-5 w-5" />
              <span>Alerts</span>
            </button>
            <div className="relative">
              <button className="bg-indigo-600 hover:bg-indigo-800 px-4 py-2 rounded-md flex items-center space-x-2 transition-colors">
                <span>Admin</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Camera className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Detections</p>
              <p className="text-2xl font-bold">{stats.totalDetections.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Today's Detections</p>
              <p className="text-2xl font-bold">{stats.todayDetections}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Blacklisted Detected</p>
              <p className="text-2xl font-bold">{stats.blacklistedDetected}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Average Accuracy</p>
              <p className="text-2xl font-bold">{stats.averageAccuracy}%</p>
            </div>
          </div>
        </div>

        {/* Camera Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Camera Locations</h2>
            <button className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {locations.map(location => (
              <div key={location.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Camera className="h-5 w-5 text-gray-600 mr-2" />
                    <h3 className="font-medium">{location.name}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    location.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {location.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="mt-2">
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">Configure</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detection Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <h2 className="text-xl font-bold text-gray-800">Recent Detections</h2>
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search plate number..."
                  className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              {/* Filters */}
              <div className="flex space-x-4">
                <select 
                  className="border rounded-md px-3 py-2 bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="allowed">Allowed</option>
                  <option value="blacklisted">Blacklisted</option>
                  <option value="unknown">Unknown</option>
                </select>
                
                <select 
                  className="border rounded-md px-3 py-2 bg-white"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="all">All Locations</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.name}>{location.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('plateNumber')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Plate Number</span>
                      {sortField === 'plateNumber' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('timestamp')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Timestamp</span>
                      {sortField === 'timestamp' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('confidence')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Confidence</span>
                      {sortField === 'confidence' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <RefreshCw className="h-5 w-5 animate-spin text-indigo-600" />
                        <span>Loading data...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredDetections.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No detections found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredDetections.map((detection) => (
                    <tr key={detection.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{detection.plateNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(detection.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                detection.confidence > 0.95 ? 'bg-green-600' : 
                                detection.confidence > 0.9 ? 'bg-yellow-500' : 'bg-orange-500'
                              }`} 
                              style={{ width: `${detection.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{Math.round(detection.confidence * 100)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          detection.status === 'allowed' ? 'bg-green-100 text-green-800' : 
                          detection.status === 'blacklisted' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {detection.status.charAt(0).toUpperCase() + detection.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {detection.vehicleType.charAt(0).toUpperCase() + detection.vehicleType.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {detection.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">View</button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredDetections.length}</span> of <span className="font-medium">{detections.length}</span> detections
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border rounded-md bg-white text-gray-600 hover:bg-gray-50">Previous</button>
              <button className="px-4 py-2 border rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper component for the chevron icon
const ChevronRight = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default App;