import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { User, Event, EventStatus, Page, DetailedEvent, DetailedSwapRequest } from './types';
import { apiService } from './services/mockApi';
import { CalendarIcon, SwapIcon, BellIcon, LogoutIcon, PlusIcon, CheckIcon, XIcon } from './components/Icons';

// --- Utility Functions ---
const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const getStatusPill = (status: EventStatus) => {
    const styles: { [key in EventStatus]: string } = {
        [EventStatus.BUSY]: 'bg-gray-200 text-gray-800',
        [EventStatus.SWAPPABLE]: 'bg-green-200 text-green-800',
        [EventStatus.SWAP_PENDING]: 'bg-yellow-200 text-yellow-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

// --- Child Components defined outside main App component ---

const Header: React.FC<{ user: User; onNavigate: (page: Page) => void; onLogout: () => void }> = ({ user, onNavigate, onLogout }) => (
    <header className="bg-card shadow-md">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <div className="flex-shrink-0 text-primary font-bold text-2xl flex items-center">
                        <SwapIcon className="h-8 w-8 mr-2"/>
                        SlotSwapper
                    </div>
                </div>
                <div className="hidden md:block">
                    <div className="ml-10 flex items-center space-x-4">
                        <NavButton icon={<CalendarIcon/>} onClick={() => onNavigate('dashboard')}>Dashboard</NavButton>
                        <NavButton icon={<SwapIcon/>} onClick={() => onNavigate('marketplace')}>Marketplace</NavButton>
                        <NavButton icon={<BellIcon/>} onClick={() => onNavigate('requests')}>Requests</NavButton>
                    </div>
                </div>
                 <div className="flex items-center">
                    <span className="text-gray-500 mr-4 hidden sm:block">Welcome, {user.name}</span>
                    <button onClick={onLogout} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <LogoutIcon />
                    </button>
                </div>
            </div>
        </nav>
    </header>
);

const NavButton: React.FC<{icon: React.ReactNode, onClick: () => void, children: React.ReactNode}> = ({icon, onClick, children}) => (
    <button onClick={onClick} className="text-gray-500 hover:bg-gray-100 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
        <span className="mr-2">{icon}</span>
        {children}
    </button>
);

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
);

const AuthForm: React.FC<{
    isSignUp: boolean;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    error: string | null;
    isLoading: boolean;
    onSwitch: () => void;
}> = ({ isSignUp, onSubmit, error, isLoading, onSwitch }) => (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
             <SwapIcon className="mx-auto h-12 w-auto text-primary"/>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                {isSignUp ? 'Create a new account' : 'Sign in to your account'}
            </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6" onSubmit={onSubmit}>
                    {isSignUp && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <div className="mt-1">
                                <input id="name" name="name" type="text" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <div className="mt-1">
                            <input id="email" name="email" type="email" autoComplete="email" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="mt-1">
                            <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div>
                        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-indigo-300">
                            {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                        </button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">{isSignUp ? 'Already have an account?' : 'New to SlotSwapper?'}</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button onClick={onSwitch} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            {isSignUp ? 'Sign In' : 'Create an account'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [page, setPage] = useState<Page>('login');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Page-specific state
    const [myEvents, setMyEvents] = useState<Event[]>([]);
    const [swappableSlots, setSwappableSlots] = useState<DetailedEvent[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<DetailedSwapRequest[]>([]);
    const [outgoingRequests, setOutgoingRequests] = useState<DetailedSwapRequest[]>([]);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlotToSwap, setSelectedSlotToSwap] = useState<DetailedEvent | null>(null);
    const [mySwappableSlots, setMySwappableSlots] = useState<Event[]>([]);


    const handleApiCall = useCallback(async <T,>(apiCall: () => Promise<T>, onSuccess?: (data: T) => void) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiCall();
            if (onSuccess) onSuccess(data);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchDashboardData = useCallback(() => {
        if (!currentUser) return;
        handleApiCall(apiService.getOwnEvents, setMyEvents);
    }, [currentUser, handleApiCall]);
    
    const fetchMarketplaceData = useCallback(() => {
        if (!currentUser) return;
        handleApiCall(apiService.getSwappableSlots, setSwappableSlots);
    }, [currentUser, handleApiCall]);
    
    const fetchRequestsData = useCallback(() => {
        if (!currentUser) return;
        handleApiCall(apiService.getSwapRequests, (data) => {
            setIncomingRequests(data.incoming);
            setOutgoingRequests(data.outgoing);
        });
    }, [currentUser, handleApiCall]);

    useEffect(() => {
        const user = apiService.getLoggedInUser();
        if (user) {
            setCurrentUser(user);
            setPage('dashboard');
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!currentUser) return;
        switch (page) {
            case 'dashboard':
                fetchDashboardData();
                break;
            case 'marketplace':
                fetchMarketplaceData();
                break;
            case 'requests':
                fetchRequestsData();
                break;
            default:
                break;
        }
    }, [page, currentUser, fetchDashboardData, fetchMarketplaceData, fetchRequestsData]);

    const handleLogout = () => {
        apiService.logOut();
        setCurrentUser(null);
        setPage('login');
    };
    
    const handleAuthSubmit = (e: FormEvent<HTMLFormElement>, isSignUp: boolean) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const name = formData.get('name') as string;

        const apiCall = isSignUp ? () => apiService.signUp(name, email, password) : () => apiService.logIn(email, password);
        
        handleApiCall(apiCall, (user) => {
            setCurrentUser(user);
            setPage('dashboard');
        });
    };

    const handleCreateEvent = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const startTime = new Date(formData.get('startTime') as string).toISOString();
        const endTime = new Date(formData.get('endTime') as string).toISOString();

        handleApiCall(() => apiService.createEvent(title, startTime, endTime), () => {
            fetchDashboardData();
            (e.target as HTMLFormElement).reset();
        });
    };

    const handleUpdateStatus = (eventId: string, status: EventStatus) => {
        handleApiCall(() => apiService.updateEventStatus(eventId, status), fetchDashboardData);
    };
    
    const handleOpenSwapModal = (slot: DetailedEvent) => {
        setSelectedSlotToSwap(slot);
        handleApiCall(apiService.getOwnSwappableSlots, (data) => {
            setMySwappableSlots(data);
            setIsModalOpen(true);
        });
    };
    
    const handleRequestSwap = (mySlotId: string) => {
        if (!selectedSlotToSwap) return;
        handleApiCall(() => apiService.createSwapRequest(mySlotId, selectedSlotToSwap.id), () => {
            setIsModalOpen(false);
            setSelectedSlotToSwap(null);
            setPage('requests'); // Navigate to see the outgoing request
        });
    };

    const handleRespondToRequest = (requestId: string, accepted: boolean) => {
        handleApiCall(() => apiService.respondToSwapRequest(requestId, accepted), fetchRequestsData);
    };

    if (isLoading && !currentUser) {
        return <Spinner />;
    }

    if (!currentUser) {
        return (
            <AuthForm
                isSignUp={page === 'signup'}
                onSubmit={(e) => handleAuthSubmit(e, page === 'signup')}
                error={error}
                isLoading={isLoading}
                onSwitch={() => setPage(page === 'login' ? 'signup' : 'login')}
            />
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header user={currentUser} onNavigate={setPage} onLogout={handleLogout} />
            <main>
                <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                   {page === 'dashboard' && (
                        <DashboardPage events={myEvents} isLoading={isLoading} onCreateEvent={handleCreateEvent} onUpdateStatus={handleUpdateStatus}/>
                   )}
                   {page === 'marketplace' && (
                       <MarketplacePage slots={swappableSlots} isLoading={isLoading} onSwapRequest={handleOpenSwapModal}/>
                   )}
                   {page === 'requests' && (
                        <RequestsPage incoming={incomingRequests} outgoing={outgoingRequests} isLoading={isLoading} onRespond={handleRespondToRequest}/>
                   )}
                </div>
            </main>
            {isModalOpen && selectedSlotToSwap && (
                <SwapRequestModal
                    targetSlot={selectedSlotToSwap}
                    mySlots={mySwappableSlots}
                    isLoading={isLoading}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleRequestSwap}
                />
            )}
        </div>
    );
};

// --- Page Components ---

const DashboardPage: React.FC<{
    events: Event[],
    isLoading: boolean,
    onCreateEvent: (e: React.FormEvent<HTMLFormElement>) => void,
    onUpdateStatus: (id: string, status: EventStatus) => void,
}> = ({ events, isLoading, onCreateEvent, onUpdateStatus }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">My Calendar</h1>
            {isLoading ? <Spinner/> : (
                <div className="bg-card rounded-lg shadow">
                    <ul className="divide-y divide-gray-200">
                    {events.length > 0 ? events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map(event => (
                        <li key={event.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                           <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <p className="text-lg font-semibold text-primary">{event.title}</p>
                                    <p className="text-sm text-gray-500">{formatDateTime(event.startTime)} - {formatDateTime(event.endTime)}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getStatusPill(event.status)}
                                    {event.status === EventStatus.BUSY && (
                                        <button onClick={() => onUpdateStatus(event.id, EventStatus.SWAPPABLE)} className="text-xs font-medium text-white bg-secondary hover:bg-green-600 px-3 py-1 rounded-md">Make Swappable</button>
                                    )}
                                    {event.status === EventStatus.SWAPPABLE && (
                                        <button onClick={() => onUpdateStatus(event.id, EventStatus.BUSY)} className="text-xs font-medium text-white bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded-md">Make Busy</button>
                                    )}
                                </div>
                           </div>
                        </li>
                    )) : <p className="p-6 text-gray-500">You have no events. Create one to get started!</p>}
                    </ul>
                </div>
            )}
        </div>
        <div>
            <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
            <div className="bg-card p-6 rounded-lg shadow">
                <form onSubmit={onCreateEvent} className="space-y-4">
                     <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" id="title" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"/>
                    </div>
                     <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input type="datetime-local" name="startTime" id="startTime" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"/>
                    </div>
                     <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                        <input type="datetime-local" name="endTime" id="endTime" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"/>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center">
                        <PlusIcon className="w-5 h-5 mr-2"/> Add Event
                    </button>
                </form>
            </div>
        </div>
    </div>
);

const MarketplacePage: React.FC<{
    slots: DetailedEvent[],
    isLoading: boolean,
    onSwapRequest: (slot: DetailedEvent) => void,
}> = ({ slots, isLoading, onSwapRequest }) => (
    <div>
        <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
        <p className="text-gray-600 mb-8">Browse slots other users have made available for swapping.</p>
        {isLoading ? <Spinner/> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slots.length > 0 ? slots.map(slot => (
                    <div key={slot.id} className="bg-card rounded-lg shadow p-6 flex flex-col justify-between">
                        <div>
                            <p className="text-lg font-bold text-primary">{slot.title}</p>
                            <p className="text-sm text-gray-500 mt-1">From: {slot.user?.name}</p>
                            <p className="text-sm font-medium text-gray-700 mt-4">{formatDateTime(slot.startTime)}</p>
                            <p className="text-sm text-gray-500">to</p>
                            <p className="text-sm font-medium text-gray-700">{formatDateTime(slot.endTime)}</p>
                        </div>
                        <button onClick={() => onSwapRequest(slot)} className="mt-6 w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-green-600 flex items-center justify-center">
                           <SwapIcon className="w-5 h-5 mr-2"/> Request Swap
                        </button>
                    </div>
                )) : <p className="text-gray-500 col-span-full">No swappable slots available right now. Check back later!</p>}
            </div>
        )}
    </div>
);

const RequestsPage: React.FC<{
    incoming: DetailedSwapRequest[],
    outgoing: DetailedSwapRequest[],
    isLoading: boolean,
    onRespond: (id: string, accepted: boolean) => void,
}> = ({ incoming, outgoing, isLoading, onRespond }) => (
    <div>
        <h1 className="text-3xl font-bold mb-8">Swap Requests</h1>
        {isLoading ? <Spinner/> : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Incoming Requests</h2>
                    <div className="space-y-4">
                        {incoming.length > 0 ? incoming.map(req => (
                            <div key={req.id} className="bg-card rounded-lg shadow p-4">
                                <p className="text-sm"><span className="font-bold">{req.requester.name}</span> wants to swap their slot:</p>
                                <p className="text-sm font-semibold text-primary my-1">"{req.requesterSlot.title}"</p>
                                <p className="text-sm">for your slot:</p>
                                <p className="text-sm font-semibold text-secondary my-1">"{req.requestedSlot.title}"</p>
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button onClick={() => onRespond(req.id, true)} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 flex items-center"><CheckIcon className="w-4 h-4 mr-1"/>Accept</button>
                                    <button onClick={() => onRespond(req.id, false)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 flex items-center"><XIcon className="w-4 h-4 mr-1"/>Reject</button>
                                </div>
                            </div>
                        )) : <p className="text-gray-500">No incoming requests.</p>}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Outgoing Requests</h2>
                     <div className="space-y-4">
                        {outgoing.length > 0 ? outgoing.map(req => (
                            <div key={req.id} className="bg-card rounded-lg shadow p-4 opacity-70">
                                <p className="text-sm">You requested to swap your slot:</p>
                                <p className="text-sm font-semibold text-secondary my-1">"{req.requesterSlot.title}"</p>
                                <p className="text-sm">for <span className="font-bold">{req.requestedUser.name}'s</span> slot:</p>
                                <p className="text-sm font-semibold text-primary my-1">"{req.requestedSlot.title}"</p>
                                <p className="text-xs text-yellow-700 font-semibold text-right mt-2">PENDING</p>
                            </div>
                        )) : <p className="text-gray-500">You have no outgoing requests.</p>}
                    </div>
                </div>
            </div>
        )}
    </div>
);

const SwapRequestModal: React.FC<{
    targetSlot: DetailedEvent,
    mySlots: Event[],
    isLoading: boolean,
    onClose: () => void,
    onConfirm: (mySlotId: string) => void,
}> = ({ targetSlot, mySlots, isLoading, onClose, onConfirm }) => {
    const [selectedMySlotId, setSelectedMySlotId] = useState<string>('');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">Request a Swap</h2>
                    <p className="text-sm text-gray-600 mt-1">Select one of your swappable slots to offer in exchange for <span className="font-semibold text-primary">"{targetSlot.title}"</span>.</p>
                </div>
                <div className="p-6">
                    {isLoading && <Spinner/>}
                    {!isLoading && mySlots.length > 0 && (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {mySlots.map(slot => (
                                <label key={slot.id} className={`block p-3 border rounded-md cursor-pointer transition-all ${selectedMySlotId === slot.id ? 'border-primary bg-indigo-50 ring-2 ring-primary' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input type="radio" name="my-slot-selection" value={slot.id} className="hidden" onChange={() => setSelectedMySlotId(slot.id)} />
                                    <p className="font-semibold">{slot.title}</p>
                                    <p className="text-sm text-gray-500">{formatDateTime(slot.startTime)}</p>
                                </label>
                            ))}
                        </div>
                    )}
                    {!isLoading && mySlots.length === 0 && (
                        <p className="text-center text-gray-500 p-4 bg-gray-100 rounded-md">You have no swappable slots to offer.</p>
                    )}
                </div>
                <div className="p-4 bg-gray-50 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button onClick={() => onConfirm(selectedMySlotId)} disabled={!selectedMySlotId || isLoading} className="px-4 py-2 bg-secondary border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-600 disabled:bg-green-300">
                        {isLoading ? 'Sending...' : 'Send Request'}
                    </button>
                </div>
            </div>
        </div>
    )
};


export default App;
