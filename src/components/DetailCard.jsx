import React from 'react';
import { X, ExternalLink, Share, Eye } from 'lucide-react';

const DetailCard = ({ launch, onClose }) => {

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-start justify-between px-3 py-2">
                    <div className="flex items-start space-x-3">
                        <div className="w-20 h-20 bg-blue-900 rounded-lg flex items-center justify-center">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h2 className="text-lg font-semibold text-gray-900">{launch.mission_name}</h2>
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    {launch.status}
                                </span>
                            </div>
                            <div className="mt-1">
                                <span className="text-sm text-gray-500">Falcon 9</span>
                            </div>
                            <div className="flex items-center space-x-4 mt-2">
                                <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                                <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                                    <Share className="w-4 h-4" />
                                </button>
                                <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                                    <Eye className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed pb-2">
                        Mission details for {launch.mission_name} launched on {launch.launch_date} from {launch.launch_site}.  Mission details for {launch.mission} launched on {launch.launched} from {launch.location}.  Mission details for {launch.mission} launched on {launch.launched} from {launch.location}.
                    </p>

                    {/* Details List */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-sm text-gray-600">Flight Number</span>
                            <span className="text-sm text-gray-900 font-medium">{launch.id}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-sm text-gray-600">Mission Name</span>
                            <span className="text-sm text-gray-900 font-medium">{launch.mission_name}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-sm text-gray-600">Rocket Type</span>
                            <span className="text-sm text-gray-900 font-medium">{launch.rocket_type}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-sm text-gray-600">Rocket Name</span>
                            <span className="text-sm text-gray-900 font-medium">{launch.rocket_name}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-sm text-gray-600">Nationality</span>
                            <span className="text-sm text-gray-900 font-medium">{launch.nationality}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-sm text-gray-600">Launch Date</span>
                            <span className="text-sm text-gray-900 font-medium">{launch.launch_date}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-sm text-gray-600">Payload Type</span>
                            <span className="text-sm text-gray-900 font-medium">{launch.payload_type}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-sm text-gray-600">Orbit</span>
                            <span className="text-sm text-gray-900 font-medium">{launch.orbit}</span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-600">Launch Site</span>
                            <span className="text-sm text-gray-900 font-medium">{launch.launch_site}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailCard;