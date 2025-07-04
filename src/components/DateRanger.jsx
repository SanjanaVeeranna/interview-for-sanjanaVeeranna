import { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// DateRangePicker Component
const DateRangePicker = ({ onDateRangeChange, onClose }) => {
    const [selectedRange, setSelectedRange] = useState('Past 6 months');
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [customStartDate, setCustomStartDate] = useState(null);
    const [customEndDate, setCustomEndDate] = useState(null);

    const ranges = [
        'Past week',
        'Past month',
        'Past 3 months',
        'Past 6 months',
        'Past year',
        'Past 2 years'
    ];

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const generateCalendar = (month, year) => {
        const daysInMonth = getDaysInMonth(month, year);
        const firstDay = getFirstDayOfMonth(month, year);
        const calendar = [];

        for (let i = 0; i < firstDay; i++) {
            calendar.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            calendar.push(day);
        }

        return calendar;
    };

    const navigateMonth = (direction) => {
        if (direction === 'prev') {
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
            } else {
                setCurrentMonth(currentMonth - 1);
            }
        } else {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
            } else {
                setCurrentMonth(currentMonth + 1);
            }
        }
    };

    const handleRangeSelect = (range) => {
        setSelectedRange(range);
        const currentDate = new Date();
        let startDate = new Date();

        switch (range) {
            case 'Past week':
                startDate.setDate(currentDate.getDate() - 7);
                break;
            case 'Past month':
                startDate.setMonth(currentDate.getMonth() - 1);
                break;
            case 'Past 3 months':
                startDate.setMonth(currentDate.getMonth() - 3);
                break;
            case 'Past 6 months':
                startDate.setMonth(currentDate.getMonth() - 6);
                break;
            case 'Past year':
                startDate.setFullYear(currentDate.getFullYear() - 1);
                break;
            case 'Past 2 years':
                startDate.setFullYear(currentDate.getFullYear() - 2);
                break;
        }

        onDateRangeChange(startDate, currentDate, range);
    };

    const handleDateClick = (day, month, year) => {
        const clickedDate = new Date(year, month, day);

        if (!customStartDate || (customStartDate && customEndDate)) {
            // Start new selection
            setCustomStartDate(clickedDate);
            setCustomEndDate(null);
        } else if (customStartDate && !customEndDate) {
            // Complete selection
            if (clickedDate >= customStartDate) {
                setCustomEndDate(clickedDate);
                onDateRangeChange(customStartDate, clickedDate, 'Custom Range');
            } else {
                setCustomStartDate(clickedDate);
                setCustomEndDate(null);
            }
        }
    };

    const isDateInRange = (day, month, year) => {
        if (!customStartDate) return false;

        const date = new Date(year, month, day);

        if (customStartDate && customEndDate) {
            return date >= customStartDate && date <= customEndDate;
        } else if (customStartDate) {
            return date.getTime() === customStartDate.getTime();
        }

        return false;
    };

    const currentMonthCalendar = generateCalendar(currentMonth, currentYear);
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const nextMonthCalendar = generateCalendar(nextMonth, nextYear);

    return (
        <div className="bg-white border-gray-300 rounded-lg shadow-lg px-4 py-8 border-2 w-[600px] font-sans">
            <div className="flex">
                <div className="w-40 border-r border-gray-200 pr-4 mr-4">
                    {ranges.map((range) => (
                        <div
                            key={range}
                            className={`text-sm py-1 px-2 cursor-pointer rounded ${selectedRange === range
                                ? 'bg-blue-100 text-blue-800'
                                : 'text-gray-900 hover:bg-gray-100'
                                }`}
                            onClick={() => handleRangeSelect(range)}
                        >
                            {range}
                        </div>
                    ))}
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigateMonth('prev')}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <ChevronLeft size={16} className="text-gray-900" />
                        </button>

                        <div className="flex space-x-14">
                            <div className="text-center">
                                <span className="text-sm font-medium">
                                    {months[currentMonth]} {currentYear}
                                </span>
                            </div>
                            <div className="text-center">
                                <span className="text-sm font-medium">
                                    {months[nextMonth]} {nextYear}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigateMonth('next')}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <ChevronRight size={16} className="text-gray-900" />
                        </button>
                    </div>

                    <div className="flex space-x-8">
                        {/* Current Month Calendar */}
                        <div className="w-45">
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {daysOfWeek.map((day) => (
                                    <div key={day} className="text-xs text-center font-medium">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {currentMonthCalendar.map((day, index) => (
                                    <div
                                        key={index}
                                        className={`text-xs text-center py-1 cursor-pointer ${day
                                            ? `text-gray-900 hover:bg-blue-100 rounded ${isDateInRange(day, currentMonth, currentYear) ? 'bg-blue-200' : ''}`
                                            : ''
                                            }`}
                                        onClick={() => day && handleDateClick(day, currentMonth, currentYear)}
                                    >
                                        {day || ''}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Next Month Calendar */}
                        <div className="w-45">
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {daysOfWeek.map((day) => (
                                    <div key={day} className="text-xs text-center font-medium">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {nextMonthCalendar.map((day, index) => (
                                    <div
                                        key={index}
                                        className={`text-xs text-center py-1 cursor-pointer ${day
                                            ? `text-gray-900 hover:bg-blue-100 rounded ${isDateInRange(day, nextMonth, nextYear) ? 'bg-blue-200' : ''}`
                                            : ''
                                            }`}
                                        onClick={() => day && handleDateClick(day, nextMonth, nextYear)}
                                    >
                                        {day || ''}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};