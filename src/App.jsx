
import React, { useState, useEffect } from 'react';
// Force deployment update
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import JoinGroup from './pages/JoinGroup';
import CreateGroup from './pages/CreateGroup';
import GroupDetails from './pages/GroupDetails';
import Decision from './pages/Decision';
import Discover from './pages/Discover';
import About from './pages/About';
import Auth from './pages/Auth';
import Manifesto from './pages/Manifesto';
import Planning from './pages/Planning';
import TripPlan from './pages/TripPlan';
import ComingSoon from './pages/ComingSoon';
import './index.css';
import { API_URL } from './config';



const App = () => {
  // Persistence Initialization
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem("lastPage") || 'home');
  const [currentSpid, setCurrentSpid] = useState(() => localStorage.getItem("lastSpid") || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [token, setToken] = useState(null);

  // Register form state
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  const [registerMessage, setRegisterMessage] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginMessage, setLoginMessage] = useState('');

  // Create Group form state
  const [groupData, setGroupData] = useState({ create_spid: '' });
  const [groupMessage, setGroupMessage] = useState('');

  // Join Group form state
  const [joinData, setJoinData] = useState({
    create_spid: '',
    name: '',
    state: '',
    city: '',
    destinations: [{ type: '', description: '' }]
  });
  const [joinMessage, setJoinMessage] = useState('');

  // Decision form state
  const [decisionSpid, setDecisionSpid] = useState('');
  const [decisionResult, setDecisionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const [tripDestination, setTripDestination] = useState(''); // Selected destination for planning
  const [comingSoonFeature, setComingSoonFeature] = useState(''); // Feature name for coming soon page


  const API_BASE = `${API_URL}/api`;

  useEffect(() => {
    const storedToken = localStorage.getItem("access");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // Persist State Changes
  useEffect(() => {
    localStorage.setItem("lastPage", currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("lastSpid", currentSpid);
  }, [currentSpid]);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setIsLoggedIn(false);
    setCurrentPage('home'); // Logic updates localStorage via useEffect
    setCurrentSpid('');
    alert('Logged out successfully.');
  };

  const makeAuthenticatedRequest = async (url, options = {}) => {
    let currentToken = token || localStorage.getItem("access");
    
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 401) {
      const refresh = localStorage.getItem("refresh");
      
      if (!refresh) {
        handleLogout();
        return null;
      }

      const refreshResponse = await fetch(`${API_BASE}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh })
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        localStorage.setItem("access", data.access);
        setToken(data.access);
        currentToken = data.access;

        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          }
        });
      } else {
        handleLogout();
        return null;
      }
    }

    return response;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterMessage('');
    try {
      const response = await fetch(`${API_BASE}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      const data = await response.json();
      if (response.ok) {
        setRegisterMessage('Success! Please login now.');
        setRegisterData({ username: '', password: '' });
        setTimeout(() => setCurrentPage('login'), 2000);
      } else {
        setRegisterMessage('Error: ' + JSON.stringify(data));
      }
    } catch (error) {
      setRegisterMessage('Error: ' + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage('');
    try {
      const response = await fetch(`${API_BASE}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("user_type", data.user_type); // Store Role
        localStorage.setItem("username", data.username);
        localStorage.setItem("user_id", data.user_id);
        setToken(data.access);
        setIsLoggedIn(true);
        setLoginMessage('Login successful!');
        setLoginData({ username: '', password: '' });
        setTimeout(() => setCurrentPage('home'), 1000);
      } else {
        setLoginMessage('Error: ' + JSON.stringify(data));
      }
    } catch (error) {
      setLoginMessage('Error: ' + error.message);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setGroupMessage('');
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/group/create/`, {
        method: 'POST',
        body: JSON.stringify(groupData)
      });
      if (!response) return;
      const data = await response.json();
      if (response.ok) {
        setGroupMessage(`Group created! SPID: ${data.sp_id}`);
        setCurrentSpid(data.sp_id); // Set active group
        setGroupData({ create_spid: '' });

      } else {
         setGroupMessage('Error: ' + JSON.stringify(data));
      }
    } catch (error) {
      setGroupMessage('Error: ' + error.message);
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    setJoinMessage('');
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/group/join/`, {
        method: 'POST',
        body: JSON.stringify(joinData)
      });
      if (!response) return;
      const data = await response.json();
      if (response.ok) {
        setJoinMessage('Success: ' + data.message);
        if (data.group_spid) setCurrentSpid(data.group_spid);
        setJoinData({
          create_spid: '', name: '', state: '', city: '',
          destinations: [{ type: '', description: '' }]
        });
      } else {
        setJoinMessage('Error: ' + JSON.stringify(data));
      }
    } catch (error) {
      setJoinMessage('Error: ' + error.message);
    }
  };

  const handleGetDecision = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDecisionResult(null);
    const targetSpid = decisionSpid || currentSpid;
    if (!targetSpid) {
         setDecisionResult({ error: "Please enter a Group ID" });
         setLoading(false);
         return;
    }

    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/group/${targetSpid}/recommendation/`);
      if (!response) {
        setLoading(false);
        return;
      }
      const data = await response.json();
      if (response.ok) {
        setDecisionResult(data);
      } else {
        setDecisionResult({ error: JSON.stringify(data) });
      }
    } catch (error) {
      setDecisionResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const renderPage = () => {
    switch(currentPage) {
        case 'home': return <LandingPage onGetStarted={() => setCurrentPage('login')} />;
        case 'join': return (
            <JoinGroup 
                joinData={joinData} 
                setJoinData={setJoinData} 
                handleJoinGroup={handleJoinGroup} 
                joinMessage={joinMessage} 
            />
        );
        case 'about': return <About />;
        case 'discover': return (
            <Discover 
                onComingSoon={(featureName) => {
                    setComingSoonFeature(featureName);
                    setCurrentPage('coming-soon');
                }}
            />
        );
        case 'manifesto': return <Manifesto />;
        case 'create': return (
            <CreateGroup 
                groupData={groupData} 
                setGroupData={setGroupData} 
                handleCreateGroup={handleCreateGroup} 
                groupMessage={groupMessage} 
            />
        );
        case 'decision': return (
            <Decision 
                decisionSpid={decisionSpid || currentSpid}
                setDecisionSpid={setDecisionSpid}
                handleGetDecision={handleGetDecision}
                decisionResult={decisionResult}
                loading={loading}
                onViewPlan={(dest) => {
                    setTripDestination(dest);
                    setCurrentPage('trip-plan');
                }}
                onComingSoon={(featureName) => {
                    setComingSoonFeature(featureName);
                    setCurrentPage('coming-soon');
                }}
                authenticatedRequest={makeAuthenticatedRequest}
            />
        );
        case 'group-details': return (
            <GroupDetails 
                spid={currentSpid}
                onLeave={() => {
                   setCurrentSpid('');
                   setCurrentPage('home');
                   // Force a tiny re-render or state update if needed, but Spid is main driver
                }}
            />
        );
        case 'planning': return (
            <Planning 
                spid={currentSpid}
                goBack={() => setCurrentPage('home')}
            />
        );
        case 'trip-plan': return (
            <TripPlan 
                spid={currentSpid || decisionSpid}
                initialDestination={tripDestination}
                goBack={() => setCurrentPage('decision')} // Or home
                authenticatedRequest={makeAuthenticatedRequest}
            />
        );
        case 'register':

        case 'login':
            return (
                <Auth 
                    mode={currentPage}
                    data={currentPage === 'login' ? loginData : registerData}
                    setData={currentPage === 'login' ? setLoginData : setRegisterData}
                    handleSubmit={currentPage === 'login' ? handleLogin : handleRegister}
                    message={currentPage === 'login' ? loginMessage : registerMessage}
                    switchMode={() => setCurrentPage(currentPage === 'login' ? 'register' : 'login')}
                />
            );
        case 'coming-soon': return (
            <ComingSoon 
                featureName={comingSoonFeature}
                onBack={() => setCurrentPage('home')}
            />
        );
        default: return <Home onStart={() => setCurrentPage('join')} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] selection:bg-[#c0a080]/30 font-body">
      <Navbar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          isLoggedIn={isLoggedIn} 
          handleLogout={handleLogout}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          spid={currentSpid}
      />
      <main className={currentPage === 'home' ? '' : 'pt-20'}>
        {renderPage()}
      </main>
      
      {currentPage !== 'home' && (
      <footer className="py-8 text-center text-gray-600 text-xs font-mono tracking-widest uppercase">
        <p>© 2026 AETHER. THE FIFTH ELEMENT.</p>
      </footer>
      )}
    </div>
  );
};

export default App;
