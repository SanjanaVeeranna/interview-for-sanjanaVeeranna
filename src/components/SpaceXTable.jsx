import { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import DetailCard from './DetailCard';
import DateRangePicker from './DateRanger';

function SpaceXTable() {
    const [selectedLaunch, setSelectedLaunch] = useState(null);
    const [showDetailCard, setShowDetailCard] = useState(false);
    const [showDateRange, setShowDateRange] = useState(false);
    const [showLaunchFilter, setShowLaunchFilter] = useState(false);
    const [selectedLaunchFilter, setSelectedLaunchFilter] = useState('All Launches');
    const [currentPage, setCurrentPage] = useState(1);
    const [launches, setLaunches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({
        start: null,
        end: null,
        label: 'Past 6 months'
    });

    const launchesPerPage = 10;

    // Initialize default date range (Past 6 months)
    useEffect(() => {
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

        setDateRange({
            start: sixMonthsAgo,
            end: currentDate,
            label: 'Past 6 months'
        });
    }, []);

    // Fetch data from API
    useEffect(() => {
        const fetchLaunches = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://686820eed5933161d70adea3.mockapi.io/api/spacex/launches/launchers');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setLaunches(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLaunches();
    }, []);

    const parseDate = (dateString) => {
        // Handle different date formats
        const date = new Date(dateString);
        return isNaN(date) ? null : date;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Success':
                return 'bg-green-100 text-green-800';
            case 'Failed':
                return 'bg-red-100 text-red-800';
            case 'Upcoming':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleRowClick = (launch) => {
        setSelectedLaunch(launch);
        setShowDetailCard(true);
    };

    const handleCloseDetailCard = () => {
        setShowDetailCard(false);
        setSelectedLaunch(null);
    };

    const handleDateRangeChange = (startDate, endDate, label) => {
        setDateRange({
            start: startDate,
            end: endDate,
            label: label
        });
        setCurrentPage(1); // Reset to first page when date range changes
    };

    const filteredLaunches = launches.filter((launch) => {
        // First filter by launch status
        let statusMatch = true;
        if (selectedLaunchFilter === 'Upcoming Launches') statusMatch = launch.status === 'Upcoming';
        else if (selectedLaunchFilter === 'Successful Launches') statusMatch = launch.status === 'Success';
        else if (selectedLaunchFilter === 'Failed Launches') statusMatch = launch.status === 'Failed';

        // Then filter by date range
        let dateMatch = true;
        if (dateRange.start && dateRange.end && launch.launch_date) {
            const launchDate = parseDate(launch.launch_date);
            if (launchDate) {
                dateMatch = launchDate >= dateRange.start && launchDate <= dateRange.end;
            }
        }

        return statusMatch && dateMatch;
    });

    // Sort launches by date (most recent first)
    const sortedLaunches = [...filteredLaunches].sort((a, b) => {
        const dateA = parseDate(a.launch_date);
        const dateB = parseDate(b.launch_date);

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        return dateB - dateA; // Most recent first
    });

    // Pagination logic
    const totalPages = Math.ceil(sortedLaunches.length / launchesPerPage);
    const indexOfLastLaunch = currentPage * launchesPerPage;
    const indexOfFirstLaunch = indexOfLastLaunch - launchesPerPage;
    const currentLaunches = sortedLaunches.slice(indexOfFirstLaunch, indexOfLastLaunch);

    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-white min-h-screen w-full flex items-center justify-center">
                <div className="text-lg text-gray-600">Loading launches...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-white min-h-screen w-full flex items-center justify-center">
                <div className="text-lg text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen w-full">
            {/* Header Controls */}
            <div className="flex justify-between items-center mb-6 px-4 relative z-50">
                {/* Date Range Toggle */}
                <div className="relative">
                    <div
                        className="flex items-center space-x-1 px-3 py-1 rounded text-md cursor-pointer"
                        onClick={() => setShowDateRange(!showDateRange)}
                    >
                        <span className="text-gray-600">📅</span>
                        <span className="text-gray-900">{dateRange.label}</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                    {showDateRange && (
                        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-30 flex items-center justify-center z-50">
                            <div className="relative">
                                <DateRangePicker
                                    onDateRangeChange={handleDateRangeChange}
                                    onClose={() => setShowDateRange(false)}
                                />
                                <button
                                    onClick={() => setShowDateRange(false)}
                                    className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-lg font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Launch Filter Toggle */}
                <div className="relative">
                    <div
                        className="flex items-center space-x-1 px-3 py-1 rounded text-md cursor-pointer"
                        onClick={() => setShowLaunchFilter(!showLaunchFilter)}
                    >
                        <span className="text-gray-600">🚀</span>
                        <span className="text-gray-700">{selectedLaunchFilter}</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                    {showLaunchFilter && (
                        <div className="absolute top-full right-0 mt-2 bg-white shadow-md border border-gray-200 rounded-md w-48 z-50">
                            {['All Launches', 'Upcoming Launches', 'Successful Launches', 'Failed Launches'].map((option) => (
                                <div
                                    key={option}
                                    onClick={() => {
                                        setSelectedLaunchFilter(option);
                                        setShowLaunchFilter(false);
                                        setCurrentPage(1);
                                    }}
                                    className="px-4 py-2 text-md hover:bg-gray-100 cursor-pointer"
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Results Summary */}
            <div className="px-4 mb-4">
                <p className="text-sm text-gray-600">
                    Showing {currentLaunches.length} of {sortedLaunches.length} launches
                    {dateRange.start && dateRange.end && (
                        <span className="ml-2">
                            from {dateRange.start.toLocaleDateString()} to {dateRange.end.toLocaleDateString()}
                        </span>
                    )}
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border-2 border-gray-200 rounded-lg shadow-sm p-2 m-4">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-200">
                            <th className="text-left py-3 px-4">No.</th>
                            <th className="text-left py-3 px-4">Launched (UTC)</th>
                            <th className="text-left py-3 px-4">Location</th>
                            <th className="text-left py-3 px-4">Mission</th>
                            <th className="text-left py-3 px-4">Orbit</th>
                            <th className="text-left py-3 px-4">Launch Status</th>
                            <th className="text-left py-3 px-4">Rocket</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLaunches.map((launch, index) => (
                            <tr
                                key={launch.id || index}
                                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleRowClick(launch)}
                            >
                                <td className="py-3 px-4">{launch.id}</td>
                                <td className="py-3 px-4">
                                    {launch.launch_date ? new Date(launch.launch_date).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="py-3 px-4">{launch.launch_site}</td>
                                <td className="py-3 px-4">{launch.mission_name}</td>
                                <td className="py-3 px-4">{launch.orbit}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(launch.status)}`}>
                                        {launch.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4">{launch.rocket_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end items-center space-x-2 mt-6 px-4 pb-6">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => goToPage(i + 1)}
                        className={`px-3 py-1 text-md rounded ${currentPage === i + 1
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Detail Card Modal */}
            {showDetailCard && selectedLaunch && (
                <DetailCard
                    launch={selectedLaunch}
                    onClose={handleCloseDetailCard}
                />
            )}
        </div>
    );
}

export default SpaceXTable;