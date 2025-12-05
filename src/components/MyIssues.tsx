import { ListFilter, LayoutGrid, List, User } from 'lucide-react';
import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux';
import IssueListItem, { type Issue } from './ui/IssueListItem';
import IssuePropertySideBar from './ui/IssuePropertySideBar';
import IssueContainer from './ui/IssueContainer';
import Popover from './ui/Popover';

type ViewMode = 'list' | 'board';

interface Filters {
    priorities: string[];
    statuses: string[];
    dueDateRange: 'overdue' | 'today' | 'this-week' | 'this-month' | 'all';
}

const MyIssues = () => {
    const user = useSelector((state: any) => state.loggedInUser);
    const [myIssues, setMyIssues] = useState<Issue[]>([]);
    const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
    const [selectedTab, setSelectedTab] = useState<string>('assigned');
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterPosition, setFilterPosition] = useState({ x: 0, y: 0 });
    const filterButtonRef = useRef<HTMLDivElement>(null);

    const [filters, setFilters] = useState<Filters>({
        priorities: [],
        statuses: [],
        dueDateRange: 'all'
    });

    const priorityOptions = ['No Priority', 'Urgent', 'High', 'Medium', 'Low'];
    const statusOptions = ['Backlog', 'Todo', 'In Progress', 'Done', 'Cancelled', 'Duplicate', 'Triage'];
    const dueDateOptions = [
        { value: 'all', label: 'All' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'today', label: 'Today' },
        { value: 'this-week', label: 'This Week' },
        { value: 'this-month', label: 'This Month' },
    ];

    const fetchIssues = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/issues?${selectedTab === 'created' ? 'createdBy' : 'assignee'}=${user._id}`, {
                method: 'GET'
            });
            const data = await response.json();
            setMyIssues(data.issues);
            setFilteredIssues(data.issues);
        } catch (error) {
            console.error("Failed to fetch issues:", error);
        }
    }

    useEffect(() => {
        if (user?._id) {
            fetchIssues();
        }
    }, [user, selectedTab])

    useEffect(() => {
        applyFilters();
    }, [filters, myIssues])

    const applyFilters = () => {
        let filtered = [...myIssues];

        // Filter by priority
        if (filters.priorities.length > 0) {
            filtered = filtered.filter(issue => 
                filters.priorities.includes(issue.priority)
            );
        }

        // Filter by status
        if (filters.statuses.length > 0) {
            filtered = filtered.filter(issue => 
                filters.statuses.includes(issue.status)
            );
        }

        // Filter by due date
        if (filters.dueDateRange !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            filtered = filtered.filter(issue => {
                if (!issue.dueDate) return false;
                
                const dueDate = new Date(issue.dueDate);
                const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

                switch (filters.dueDateRange) {
                    case 'overdue':
                        return dueDateOnly < today;
                    case 'today':
                        return dueDateOnly.getTime() === today.getTime();
                    case 'this-week': {
                        const weekFromNow = new Date(today);
                        weekFromNow.setDate(weekFromNow.getDate() + 7);
                        return dueDateOnly >= today && dueDateOnly <= weekFromNow;
                    }
                    case 'this-month': {
                        const monthFromNow = new Date(today);
                        monthFromNow.setMonth(monthFromNow.getMonth() + 1);
                        return dueDateOnly >= today && dueDateOnly <= monthFromNow;
                    }
                    default:
                        return true;
                }
            });
        }

        setFilteredIssues(filtered);
    };

    const handleFilterClick = () => {
        if (filterButtonRef.current) {
            const rect = filterButtonRef.current.getBoundingClientRect();
            setFilterPosition({ x: rect.left, y: rect.bottom });
        }
        setIsFilterOpen(!isFilterOpen);
    };

    const togglePriority = (priority: string) => {
        setFilters(prev => ({
            ...prev,
            priorities: prev.priorities.includes(priority)
                ? prev.priorities.filter(p => p !== priority)
                : [...prev.priorities, priority]
        }));
    };

    const toggleStatus = (status: string) => {
        setFilters(prev => ({
            ...prev,
            statuses: prev.statuses.includes(status)
                ? prev.statuses.filter(s => s !== status)
                : [...prev.statuses, status]
        }));
    };

    const clearFilters = () => {
        setFilters({
            priorities: [],
            statuses: [],
            dueDateRange: 'all'
        });
    };

    const hasActiveFilters = () => {
        return filters.priorities.length > 0 || 
               filters.statuses.length > 0 || 
               filters.dueDateRange !== 'all';
    };

    const tabs = [
        {
            id: 'assigned',
            title: 'Assigned',
            onClick: () => setSelectedTab('assigned')
        },
        {
            id: 'created',
            title: 'Created',
            onClick: () => setSelectedTab('created')
        },
    ]

    const groupIssuesByStatus = () => {
        const groups: { [key: string]: Issue[] } = {
            'Backlog': [],
            'Todo': [],
            'In Progress': [],
            'Done': [],
        };

        filteredIssues.forEach((issue) => {
            const status = issue.status || 'Backlog';
            if (groups[status]) {
                groups[status].push(issue);
            } else {
                groups['Backlog'].push(issue);
            }
        });

        return groups;
    };

    const getKanbanView = () => {
        const groupedIssues = groupIssuesByStatus();
        const columns = ['Backlog', 'Todo', 'In Progress', 'Done'];

        return (
            <div className='h-full w-full flex overflow-x-auto p-6 gap-4'>
                {columns.map((columnName) => (
                    <div 
                        key={columnName} 
                        className='flex-shrink-0 w-[300px] flex flex-col bg-gray-50 rounded-lg'
                    >
                        <div className='p-4 border-b border-gray-200'>
                            <h3 className='font-semibold text-gray-700 flex items-center justify-between'>
                                {columnName}
                                <span className='text-xs bg-gray-200 px-2 py-1 rounded-full'>
                                    {groupedIssues[columnName]?.length || 0}
                                </span>
                            </h3>
                        </div>

                        <div className='flex-1 p-2 space-y-2 overflow-y-auto'>
                            {groupedIssues[columnName]?.map((issue: any) => (
                                <div
                                    key={issue._id}
                                    onClick={() => setSelectedIssue(issue)}
                                    className='bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow'
                                >
                                    <div className='flex items-start justify-between mb-2'>
                                        <span className='text-xs text-gray-500 font-mono'>
                                            {issue.ticketId}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${
                                            issue.priority === 'High' || issue.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                                            issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {issue.priority}
                                        </span>
                                    </div>
                                    <h4 className='text-sm font-medium text-gray-800 line-clamp-2'>
                                        {issue.title}
                                    </h4>
                                    {issue.dueDate && (
                                        <div className={`mt-2 text-xs ${
                                            new Date(issue.dueDate) < new Date() ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                            Due: {new Date(issue.dueDate).toLocaleDateString()}
                                        </div>
                                    )}
                                    {issue.assignee && (
                                        <div className='mt-2 text-xs text-gray-600 flex items-center gap-2'>
                                            <User size={12} /> {issue.assignee.username}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const getIssueListsView = () => {
        return (
            <div className='h-full w-full flex flex-col'>
                <div className="header w-full">
                    <div className="left flex gap-[10px] pl-[30px] h-[40px] items-center border-b-[1px] border-[var(--task-border-color-light)]">
                        <p className='m-[0]'>My Issues</p>
                        {tabs.map((t) => {
                            return (
                                <button 
                                    key={t.id} 
                                    onClick={t.onClick} 
                                    className={`py-[2px] cursor-pointer px-[8px] border-1 border-[var(--task-border-color-light)] rounded-[4px] ${
                                        t.id === selectedTab ? 'bg-[whitesmoke]' : 'bg-[white]'
                                    }`}
                                >
                                    {t.title}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="filters flex w-full pl-[30px] h-[40px] items-center border-b-[1px] border-[var(--task-border-color-light)] justify-between pr-[30px]">
                    <div className="left flex gap-2 items-center">
                        <div 
                            ref={filterButtonRef}
                            className={`flex gap-2 items-center cursor-pointer px-3 py-1 rounded-md hover:bg-gray-100 ${
                                hasActiveFilters() ? 'bg-blue-50 text-blue-600' : ''
                            }`}
                            onClick={handleFilterClick}
                        >
                            <ListFilter size={16} />
                            Filter
                            {hasActiveFilters() && (
                                <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    {filters.priorities.length + filters.statuses.length + (filters.dueDateRange !== 'all' ? 1 : 0)}
                                </span>
                            )}
                        </div>
                        
                        {hasActiveFilters() && (
                            <button
                                onClick={clearFilters}
                                className="text-xs text-gray-600 hover:text-gray-800 underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>

                    <div className="view-toggle flex gap-1 border border-gray-300 rounded-md p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded ${
                                viewMode === 'list' 
                                    ? 'bg-blue-100 text-blue-600' 
                                    : 'hover:bg-gray-100'
                            }`}
                            title="List View"
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('board')}
                            className={`p-1.5 rounded ${
                                viewMode === 'board' 
                                    ? 'bg-blue-100 text-blue-600' 
                                    : 'hover:bg-gray-100'
                            }`}
                            title="Board View"
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    <div className='flex flex-col overflow-y-auto'>
                        {filteredIssues.map((item: Issue) => {
                            return (
                                <IssueListItem 
                                    onClick={() => setSelectedIssue(item)} 
                                    key={item._id} 
                                    item={item} 
                                />
                            )
                        })}
                        {filteredIssues.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No issues found matching your filters
                            </div>
                        )}
                    </div>
                ) : (
                    getKanbanView()
                )}
            </div>
        )
    }

    const getIssueDescriptionView = () => {
        return (
            <div className='h-full w-full flex justify-between'>
                <IssueContainer onBack={() => setSelectedIssue(null)} issue={selectedIssue}/>
                <IssuePropertySideBar issue={selectedIssue}/>
            </div>
        )
    }

    return (
        <>
            {selectedIssue ? getIssueDescriptionView() : getIssueListsView()}
            
            <Popover
                x={filterPosition.x}
                y={filterPosition.y}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
            >
                <div className="flex flex-col gap-4 min-w-[280px]">
                    {/* Priority Filter */}
                    <div>
                        <h4 className="text-sm font-semibold mb-2 text-gray-700">Priority</h4>
                        <div className="flex flex-col gap-1">
                            {priorityOptions.map(priority => (
                                <label key={priority} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                    <input
                                        type="checkbox"
                                        checked={filters.priorities.includes(priority)}
                                        onChange={() => togglePriority(priority)}
                                        className="cursor-pointer"
                                    />
                                    <span className="text-sm">{priority}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <h4 className="text-sm font-semibold mb-2 text-gray-700">Status</h4>
                        <div className="flex flex-col gap-1">
                            {statusOptions.map(status => (
                                <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                    <input
                                        type="checkbox"
                                        checked={filters.statuses.includes(status)}
                                        onChange={() => toggleStatus(status)}
                                        className="cursor-pointer"
                                    />
                                    <span className="text-sm">{status}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Due Date Filter */}
                    <div>
                        <h4 className="text-sm font-semibold mb-2 text-gray-700">Due Date</h4>
                        <div className="flex flex-col gap-1">
                            {dueDateOptions.map(option => (
                                <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                    <input
                                        type="radio"
                                        name="dueDate"
                                        checked={filters.dueDateRange === option.value}
                                        onChange={() => setFilters(prev => ({ ...prev, dueDateRange: option.value as any }))}
                                        className="cursor-pointer"
                                    />
                                    <span className="text-sm">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </Popover>
        </>
    );
}

export default MyIssues