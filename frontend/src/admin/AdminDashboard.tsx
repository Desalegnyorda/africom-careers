import { useEffect, useState } from 'react';
import { MdDashboard } from "react-icons/md";
import { HiDocumentText } from "react-icons/hi";
import { FiLogOut, FiUser } from "react-icons/fi";
import { FaUsers, FaFileAlt, FaCheckCircle, FaUserTie, FaUserCheck, FaTimesCircle, FaSearch, FaFilter, FaArchive } from "react-icons/fa";

export default function AdminDashboard() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [profileForm, setProfileForm] = useState({ email: '', currentPassword: '', newPassword: '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; applicantId: string; newStatus: string; applicantName: string; currentStatus: string } | null>(null);
  const [updatingButton, setUpdatingButton] = useState<string | null>(null);
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'applicants' | 'vacancies'>('applicants');
  const [isSyncingVacancies, setIsSyncingVacancies] = useState(false);

  useEffect(() => {
    // Fetch applicants, positions, and vacancies in parallel
    Promise.all([
      fetch('http://127.0.0.1:5000/api/applicants/all').then(res => res.json()),
      fetch('http://127.0.0.1:5000/api/positions').then(res => res.json()),
      fetch('http://127.0.0.1:5000/api/vacancies').then(res => res.json())
    ]).then(([applicantsData, positionsData, vacanciesData]) => {
      setApplicants(applicantsData);
      setPositions(positionsData);
      if (vacanciesData.success) {
        setVacancies(vacanciesData.data);
      }
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
    
    // Fetch admin info
    fetchAdminProfile();
  }, []);

  // Fetch admin profile
  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://127.0.0.1:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAdminInfo(data.admin);
        setProfileForm(prev => ({ ...prev, email: data.admin.email }));
      }
    } catch (error) {
      console.error('Failed to fetch admin profile:', error);
    }
  };

  // Update admin profile
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://127.0.0.1:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });

      const data = await response.json();
      if (data.success) {
        alert('Profile updated successfully!');
        fetchAdminProfile(); // Refresh admin info
        setProfileForm(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Error updating profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle status update with confirmation
  const handleStatusUpdate = async (id: string, newStatus: string, applicantName: string) => {
    // Find the applicant to get current status
    const applicant = applicants.find(app => app.id === id);
    const currentStatus = applicant?.application_status || 'submitted';
    
    setConfirmModal({
      isOpen: true,
      applicantId: id,
      newStatus,
      applicantName,
      currentStatus
    });
  };

  // Confirm status update
  const confirmStatusUpdate = async () => {
    if (confirmModal) {
      setUpdatingButton(confirmModal.newStatus);
      await updateStatus(confirmModal.applicantId, confirmModal.newStatus);
      setConfirmModal(null);
      setUpdatingButton(null);
    }
  };

  // --- UPDATE STATUS ACTION (Includes Hired) ---
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/applicants/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();

      if (res.ok) {
        // Update the specific applicant in the list
        setApplicants(prev => prev.map(app => 
          app.id === id ? { ...app, application_status: newStatus } : app
        ));
        // Update selected applicant if modal is open
        setSelectedApplicant((prev: any) => prev && prev.id === id ? { ...prev, application_status: newStatus } : prev);
        
        // Show success feedback with email status (only if email was attempted)
        let message = `Status updated to ${newStatus}`;
        if (data.emailSent !== undefined) {
          const emailStatus = data.emailSent ? 'Email sent successfully!' : 'Email notification failed';
          message += `. ${emailStatus}`;
        }
        alert(message);
        console.log(`Status updated to ${newStatus} successfully`, data);
      } else {
        console.error('Failed to update status:', data.message);
        alert(`Failed to update status: ${data.message}`);
      }
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const viewDetails = async (id: string) => {
    const res = await fetch(`http://127.0.0.1:5000/api/applicants/${id}`);
    const data = await res.json();
    setSelectedApplicant(data);
    setIsModalOpen(true);
  };

  // Sync vacancies from AFRICOM careers API
  const syncVacancies = async () => {
    setIsSyncingVacancies(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/vacancies/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setVacancies(data.data);
        alert(`Successfully synced ${data.count} vacancies from ${data.source}`);
      } else {
        alert(`Failed to sync vacancies: ${data.message}`);
      }
    } catch (error) {
      console.error('Error syncing vacancies:', error);
      alert('Error syncing vacancies. Please try again.');
    } finally {
      setIsSyncingVacancies(false);
    }
  };

  // --- MASTER FILTERING LOGIC ---
  
  // Layer 1: Filter by Job Position
  const filteredByPosition = selectedPosition === 'all' 
    ? applicants 
    : applicants.filter((app: any) => 
        app.applied_positions && 
        app.applied_positions.includes(selectedPosition)
      );
  
  // Layer 2: Calculate circle numbers from filtered applicants for accurate percentages
  const total = filteredByPosition.length;
  const getCount = (status: string) => filteredByPosition.filter((a: any) => a.application_status === status).length;
  
  const shortlistedCount = getCount('shortlisted');
  const interviewCount = getCount('interview');
  const rejectedCount = getCount('rejected');
  const submittedCount = getCount('submitted');
  const talentPoolCount = getCount('talent_pool');
  
  // Layer 3: Filter by Status Circle clicked
  const filteredByStatus = selectedStatus === 'all' 
    ? filteredByPosition 
    : filteredByPosition.filter((app: any) => app.application_status === selectedStatus);
  
  // Final search filter
  const finalFiltered = filteredByStatus.filter((app: any) => {
    const searchTermLower = searchTerm.toLowerCase();
    const fullName = `${app.first_name} ${app.last_name}`.toLowerCase();
    const email = app.email?.toLowerCase() || '';
    const status = app.application_status?.toLowerCase() || '';
    const displayStatus = status;
    const positions = app.applied_positions?.toLowerCase() || '';
    
    return fullName.includes(searchTermLower) ||
           email.includes(searchTermLower) ||
           status.includes(searchTermLower) ||
           displayStatus.includes(searchTermLower) ||
           positions.includes(searchTermLower);
  });

  return (
    <div className="flex h-screen bg-[#F4F7FE] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-56' : 'w-16'} bg-[#0F2A5D] text-white flex flex-col shadow-2xl shrink-0 transition-all duration-300 ease-in-out z-20 overflow-hidden h-screen fixed left-0 top-0`}>
        
        {/* Sidebar Top Area */}
        <div className="h-24 flex items-center justify-between px-6">
          {isSidebarOpen ? (
            <>
              <h2 className="text-xl font-black tracking-widest text-blue-400">AFRICOM HR</h2>
              {/* TOGGLE INSIDE SIDEBAR (When Open) */}
              <button onClick={() => setIsSidebarOpen(false)} className="text-white/50 hover:text-white transition-colors">
                 <span className="text-2xl">«</span>
              </button>
            </>
          ) : (
            /* Small Logo for collapsed state */
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center font-black mx-auto shadow-lg shadow-blue-900/50 text-sm">A</div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-2 mt-4">
          <div 
            onClick={() => setActiveTab('applicants')}
            className={`${activeTab === 'applicants' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400'} p-3 rounded-xl font-bold flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'} hover:bg-blue-500/20 hover:text-white transition cursor-pointer border-l-4 ${activeTab === 'applicants' && isSidebarOpen ? 'border-blue-400' : 'border-transparent'} ${!isSidebarOpen && 'border-l-0'}`}
          >
            <MdDashboard size={20}/>
            {isSidebarOpen && <span>Dashboard</span>}
          </div>
          <div 
            onClick={() => setActiveTab('vacancies')}
            className={`${activeTab === 'vacancies' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400'} p-3 rounded-xl font-medium flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'} hover:bg-blue-500/20 hover:text-white transition cursor-pointer border-l-4 ${activeTab === 'vacancies' && isSidebarOpen ? 'border-blue-400' : 'border-transparent'} ${!isSidebarOpen && 'border-l-0'}`}
          >
            <HiDocumentText size={20}/>
            {isSidebarOpen && <span>Vacancies</span>}
          </div>
          <div 
            onClick={() => setIsProfileModalOpen(true)}
            className="text-gray-400 p-3 rounded-xl font-medium flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'} hover:bg-blue-500/20 hover:text-white transition cursor-pointer"
          >
            <FiUser size={20}/>
            {isSidebarOpen && <span>Profile</span>}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button onClick={() => { localStorage.clear(); window.location.href='/admin'; }} className={`flex items-center gap-4 text-red-400 font-bold p-3 w-full hover:bg-white/5 rounded-xl transition-all ${!isSidebarOpen && 'justify-center'}`}>
            <FiLogOut size={18}/>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
        <main className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'ml-56' : 'ml-16'
      }`}>
        
        {/* HEADER WITH BREADCRUMBS */}
        <header className="h-24 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-5">
            
            {/* HAMBURGER TOGGLE (Only shows in breadcrumb when sidebar is collapsed) */}
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="w-10 h-10 rounded-xl bg-[#F4F7FE] text-[#0F2A5D] flex items-center justify-center hover:bg-gray-100 transition-all shadow-sm animate-in fade-in zoom-in duration-300 mr-2"
              >
                <span className="text-xl">☰</span>
              </button>
            )}

            {/* TITLE */}
            <h1 className="text-2xl font-black text-[#1B2559] tracking-tight">
              {activeTab === 'applicants' ? 'Requirements Management' : 'Vacancy Management'}
            </h1>
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-4 mr-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">Admin</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pt-16 space-y-8 bg-[#F4F7FE]">
          
          {activeTab === 'applicants' ? (
            <>
              {/* FILTER CONTROLS */}
              <div className="bg-white rounded-[30px] shadow-lg shadow-gray-200/50 p-6 border border-white">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <FaFilter className="text-gray-400" size={16} />
                    <h3 className="text-sm font-black text-[#1B2559] uppercase tracking-widest">Filters</h3>
                  </div>
                  
                  {/* Position Dropdown */}
                  <div className="flex-1 max-w-xs">
                    <select
                      value={selectedPosition}
                      onChange={(e) => {
                        setSelectedPosition(e.target.value);
                      }}
                      className="w-full min-w-[250px] px-4 py-2 bg-[#F4F7FE] border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium"
                    >
                      <option value="all">All Positions</option>
                      {positions.map((pos: any) => (
                        <option key={pos.id} value={pos.position_name}>
                          {pos.position_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                                  
                  {/* Clear Filters Button */}
                  <button
                    onClick={() => {
                      setSelectedPosition('all');
                      setSelectedStatus('all');
                      setSearchTerm('');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
                  >
                    Clear All
                  </button>
                </div>
              </div>
          
          {/* CIRCULAR STATUS CARDS */}
          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <TotalCard 
              label="Total Applicants" 
              value={total} 
              color="#4318FF" 
              isActive={selectedStatus === 'all'}
              onClick={() => setSelectedStatus('all')}
            />
            <StatusCircle 
              label="Submitted" 
              value={submittedCount} 
              color="#05CD99" 
              total={total} 
              icon={<FaFileAlt size={20} color="#05CD99" />}
              isActive={selectedStatus === 'submitted'}
              onClick={() => setSelectedStatus(selectedStatus === 'submitted' ? 'all' : 'submitted')}
            />
            <StatusCircle 
              label="Shortlisted" 
              value={shortlistedCount} 
              color="#9333EA" 
              total={total} 
              icon={<FaCheckCircle size={20} color="#9333EA" />}
              isActive={selectedStatus === 'shortlisted'}
              onClick={() => setSelectedStatus(selectedStatus === 'shortlisted' ? 'all' : 'shortlisted')}
            />
            <StatusCircle 
              label="Interview" 
              value={interviewCount} 
              color="#F59E0B" 
              total={total} 
              icon={<FaUserTie size={20} color="#F59E0B" />}
              isActive={selectedStatus === 'interview'}
              onClick={() => setSelectedStatus(selectedStatus === 'interview' ? 'all' : 'interview')}
            />
            <StatusCircle 
              label="Talent Pool" 
              value={talentPoolCount} 
              color="#10B981" 
              total={total} 
              icon={<FaUserCheck size={20} color="#10B981" />}
              isActive={selectedStatus === 'talent_pool'}
              onClick={() => setSelectedStatus(selectedStatus === 'talent_pool' ? 'all' : 'talent_pool')}
            />
            <StatusCircle 
              label="Rejected" 
              value={rejectedCount} 
              color="#EE5D50" 
              total={total} 
              icon={<FaTimesCircle size={20} color="#EE5D50" />}
              isActive={selectedStatus === 'rejected'}
              onClick={() => setSelectedStatus(selectedStatus === 'rejected' ? 'all' : 'rejected')}
            />
          </div>

          {/* CANDIDATE TABLE */}
          <div className="bg-white rounded-[30px] shadow-lg shadow-gray-200/50 p-8 border border-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <h2 className="text-lg font-black text-[#1B2559]">Applicant Pipeline</h2>
              <div className="relative w-full md:w-80">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search candidates..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#F4F7FE] border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm placeholder-gray-500 shadow-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <th className="pb-4 px-4">Candidate</th>
                    <th className="pb-4 px-4">Status</th>
                    <th className="pb-4 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {finalFiltered.map((app: any, index: number) => (
                    <tr key={app.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]'} hover:bg-blue-50/50 transition group`}>
                      <td className="py-5 px-4">
                        <div>
                          <div className="font-bold text-[#1B2559]">{app.first_name} {app.last_name}</div>
                          <div className="text-[10px] text-gray-400 font-medium">{app.email}</div>
                          {app.applied_positions && (
                            <div className="text-[9px] text-blue-600 font-medium mt-1">
                              {app.applied_positions}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          app.application_status === 'shortlisted' ? 'bg-green-100 text-green-600' : 
                          app.application_status === 'interview' ? 'bg-purple-100 text-purple-600' :
                          app.application_status === 'talent_pool' ? 'bg-emerald-100 text-emerald-600' :
                          app.application_status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {app.application_status || 'Submitted'}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-right">
                        <button onClick={() => viewDetails(app.id)} className="bg-[#EEF2FF] text-[#4F46E5] px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#4F46E5] hover:text-white transition-all duration-200">VIEW PROFILE</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
            </>
          ) : (
            <>
              {/* VACANCY MANAGEMENT */}
              <div className="bg-white rounded-[30px] shadow-lg shadow-gray-200/50 p-6 border border-white">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                  <h2 className="text-lg font-black text-[#1B2559]">Vacancies from AFRICOM Careers</h2>
                  <button
                    onClick={syncVacancies}
                    disabled={isSyncingVacancies}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      isSyncingVacancies
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isSyncingVacancies ? 'Syncing...' : 'Sync Vacancies'}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                        <th className="pb-4 px-4">Position</th>
                        <th className="pb-4 px-4">Department</th>
                        <th className="pb-4 px-4">Location</th>
                        <th className="pb-4 px-4">Type</th>
                        <th className="pb-4 px-4">Posted</th>
                        <th className="pb-4 px-4">Deadline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {vacancies.map((vacancy: any, index: number) => (
                        <tr key={vacancy.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FC]'} hover:bg-blue-50/50 transition`}>
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-bold text-[#1B2559]">{vacancy.title}</div>
                              <div className="text-[10px] text-gray-400">{vacancy.experience}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">{vacancy.department}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">{vacancy.location}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-medium">
                              {vacancy.type}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">{vacancy.postedDate}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">{vacancy.deadline}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {vacancies.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No vacancies found. Click "Sync Vacancies" to fetch from AFRICOM careers.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* SLIDE-IN PANEL */}
      {isModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-[100]">
          {/* BACKDROP */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* SLIDING PANEL */}
          <div className={`absolute right-0 top-0 h-full w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
            isModalOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="h-full overflow-y-auto">
              {/* STICKY PANEL HEADER */}
              <div className="sticky top-0 bg-white border-b border-gray-100 p-6 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#4318FF] flex items-center justify-center text-white text-xl font-black">
                      {selectedApplicant.first_name[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-[#1B2559]">
                        {selectedApplicant.first_name} {selectedApplicant.last_name}
                      </h2>
                      <p className="text-blue-600 font-bold uppercase text-[9px] tracking-widest">
                        Current Status: {selectedApplicant.application_status || 'Submitted'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition text-lg"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              {/* PANEL CONTENT */}
              <div className="p-6">
                {/* GROUP A: THE HIRING FUNNEL */}
                <div className="mb-6">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">The Hiring Funnel</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatusUpdate(selectedApplicant.id, 'shortlisted', `${selectedApplicant.first_name} ${selectedApplicant.last_name}`)} 
                      disabled={updatingButton === 'shortlisted'}
                      className={`flex-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase transition ${
                        updatingButton === 'shortlisted'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                      }`}
                    >
                      {updatingButton === 'shortlisted' ? 'Sending...' : 'Shortlist'}
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(selectedApplicant.id, 'interview', `${selectedApplicant.first_name} ${selectedApplicant.last_name}`)} 
                      disabled={updatingButton === 'interview'}
                      className={`flex-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase transition ${
                        updatingButton === 'interview'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white'
                      }`}
                    >
                      {updatingButton === 'interview' ? 'Sending...' : 'Interview'}
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(selectedApplicant.id, 'rejected', `${selectedApplicant.first_name} ${selectedApplicant.last_name}`)} 
                      disabled={updatingButton === 'rejected'}
                      className={`flex-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase transition ${
                        updatingButton === 'rejected'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                      }`}
                    >
                      {updatingButton === 'rejected' ? 'Sending...' : 'Reject'}
                    </button>
                  </div>
                </div>

                {/* GROUP B: THE STRATEGIC ARCHIVE */}
                <div className="mb-6">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Strategic Archive</p>
                  <button 
                    onClick={() => handleStatusUpdate(selectedApplicant.id, 'talent_pool', `${selectedApplicant.first_name} ${selectedApplicant.last_name}`)} 
                    disabled={updatingButton === 'talent_pool'}
                    className={`w-full px-4 py-3 rounded-xl text-[11px] font-black uppercase transition flex items-center justify-center gap-2 border-2 ${
                      updatingButton === 'talent_pool'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                        : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:border-blue-600'
                    }`}
                  >
                    <FaArchive size={16} />
                    {updatingButton === 'talent_pool' ? 'Adding to Talent Pool...' : 'Add to Talent Pool'}
                  </button>
                </div>

                {/* CANDIDATE DETAILS */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <DetailItem label="Email" value={selectedApplicant.email} />
                    <DetailItem label="Phone" value={selectedApplicant.phone} />
                    <DetailItem label="Gender" value={selectedApplicant.gender || 'Not specified'} />
                    <DetailItem label="Location" value={`${selectedApplicant.city}, ${selectedApplicant.country}`} />
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">CV File</p>
                    {selectedApplicant.cv_file_path ? (
                      <a 
                        href={`http://127.0.0.1:5000/${selectedApplicant.cv_file_path.replace(/\\/g, '/')}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 underline font-black text-sm"
                      >
                        Open Resume
                      </a>
                    ) : 
                      <span className="text-gray-400 italic text-sm">No CV found</span>
                    }
                  </div>

                  <div>
                    <SectionTitle title="Education" />
                    <div className="space-y-3">
                      {selectedApplicant.education?.length > 0 ? 
                        selectedApplicant.education.map((edu: any) => (
                          <div key={edu.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                            <div className="space-y-1">
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Institution</p>
                                <p className="font-black text-[#1B2559] text-sm">{edu.institution || 'Not specified'}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Education Level</p>
                                  <p className="text-[10px] text-blue-600 font-medium">{edu.education_level || 'Not specified'}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Field of Study</p>
                                  <p className="text-[10px] text-blue-600 font-medium">{edu.field_of_study || 'Not specified'}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Graduation Year</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase">{edu.graduation_year || 'Not specified'}</p>
                              </div>
                            </div>
                          </div>
                        )) : 
                        <p className="text-gray-400 text-sm italic">No education listed.</p>
                      }
                    </div>
                  </div>

                  <div>
                    <SectionTitle title="Work Experience" />
                    <div className="space-y-3">
                      {selectedApplicant.experience?.length > 0 ? 
                        selectedApplicant.experience.map((ex: any) => (
                          <div key={ex.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                            <div className="space-y-2">
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Position</p>
                                <p className="font-black text-[#1B2559] text-sm">{ex.position || 'Not specified'}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Company Name</p>
                                <p className="text-[11px] text-blue-600 font-bold">{ex.company_name || 'Not specified'}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Company Address</p>
                                <p className="text-[9px] text-gray-500">{ex.company_address || 'Not specified'}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Employment Status</p>
                                <p className="text-[9px] text-purple-600 font-medium uppercase">{ex.employment_status || 'Not specified'}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Date From</p>
                                  <p className="text-[9px] text-gray-400 font-bold">{ex.date_from ? new Date(ex.date_from).toLocaleDateString() : 'Not specified'}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Date To</p>
                                  <p className="text-[9px] text-gray-400 font-bold">{ex.date_to ? new Date(ex.date_to).toLocaleDateString() : 'Present'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )) : 
                        <p className="text-gray-400 text-sm italic">No experience listed.</p>
                      }
                    </div>
                  </div>

                  <div>
                    <SectionTitle title="Skills & Bio" />
                    <div className="bg-gray-50 p-4 rounded-2xl text-[#1B2559] text-sm border border-gray-100 leading-relaxed">
                      {selectedApplicant.skills_description || 'No additional bio provided.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* BACKDROP */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsProfileModalOpen(false)}
          />
          
          {/* MODAL */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[480px] bg-white shadow-2xl rounded-2xl">
            <div className="p-6">
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-[#1B2559]">Admin Profile</h2>
                <button 
                  onClick={() => setIsProfileModalOpen(false)} 
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition text-lg"
                >
                  ×
                </button>
              </div>
              
              {/* PROFILE FORM */}
              <form onSubmit={updateProfile} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Email</label>
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
                    {adminInfo?.email || 'Loading...'}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">New Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#F4F7FE] border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    placeholder="Enter new email (optional)"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
                  <input
                    type="password"
                    value={profileForm.currentPassword}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#F4F7FE] border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    placeholder="Required only when changing password"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                  <input
                    type="password"
                    value={profileForm.newPassword}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#F4F7FE] border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* BACKDROP */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={() => setConfirmModal(null)}
          />
          
          {/* MODAL */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[420px] bg-white shadow-2xl rounded-2xl">
            <div className="p-6">
              {/* MODAL HEADER */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
              </div>
              
              {/* MODAL CONTENT */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-black text-[#1B2559] mb-2">Confirm Status Change</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Are you sure you want to change the status for <span className="font-bold">{confirmModal.applicantName}</span>?
                </p>
                
                {/* Status Change Display */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-xl flex-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
                    <p className={`font-black uppercase text-sm ${
                      confirmModal.currentStatus === 'interview' ? 'text-purple-600' :
                      confirmModal.currentStatus === 'talent_pool' ? 'text-green-600' :
                      confirmModal.currentStatus === 'rejected' ? 'text-red-600' :
                      confirmModal.currentStatus === 'shortlisted' ? 'text-green-600' :
                      'text-blue-600'
                    }`}>
                      {confirmModal.currentStatus === 'talent_pool' ? 'Talent Pool' :
                       confirmModal.currentStatus === 'rejected' ? 'Rejected' :
                       confirmModal.currentStatus === 'shortlisted' ? 'Shortlisted' :
                       confirmModal.currentStatus || 'Submitted'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <span className="text-gray-400 text-lg">→</span>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-xl flex-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">New Status</p>
                    <p className={`font-black uppercase text-sm ${
                      confirmModal.newStatus === 'interview' ? 'text-purple-600' :
                      confirmModal.newStatus === 'talent_pool' ? 'text-green-600' :
                      confirmModal.newStatus === 'rejected' ? 'text-red-600' :
                      confirmModal.newStatus === 'shortlisted' ? 'text-green-600' :
                      'text-blue-600'
                    }`}>
                      {confirmModal.newStatus === 'talent_pool' ? 'Talent Pool' :
                       confirmModal.newStatus === 'rejected' ? 'Rejected' :
                       confirmModal.newStatus === 'shortlisted' ? 'Shortlisted' :
                       confirmModal.newStatus}
                    </p>
                  </div>
                </div>
                {confirmModal.newStatus !== 'talent_pool' && (
                  <p className="text-xs text-orange-600 mt-4 font-medium">
                    ⚠️ This action will send an email notification to the candidate.
                  </p>
                )}
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusUpdate}
                  disabled={updatingButton !== null}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {updatingButton ? 'Sending...' : (confirmModal.newStatus === 'talent_pool' ? 'Confirm' : 'Confirm & Send Email')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- HELPER COMPONENTS ---

function TotalCard({ label, value, color, isActive, onClick }: any) {
  return (
    <div 
      className={`bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
        isActive ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <FaUsers size={24} color={color} />
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-black text-[#1B2559]">{value}</h3>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
}

function StatusCircle({ label, value, color, total, icon, isActive, onClick }: any) {
  // Calculate percentage relative to the total applicants for the selected position
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);
  const radius = 24;
  const strokeDash = 2 * Math.PI * radius; 
  const offset = strokeDash - (percentage / 100) * strokeDash;

  return (
    <div 
      className={`bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
        isActive ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-black text-[#1B2559]">{value}</h3>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest">{label}</p>
        </div>
        <div className="relative w-14 h-14">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="28" cy="28" r="24" stroke="#E9EDF7" strokeWidth="5" fill="transparent" />
            <circle 
              cx="28" cy="28" r="24" stroke={color} strokeWidth="5" fill="transparent" 
              strokeDasharray={strokeDash} strokeDashoffset={offset} strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-[#1B2559]">
            {Math.round(percentage)}%
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: any) {
  return (
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="font-bold text-[#1B2559]">{value || 'N/A'}</p>
    </div>
  );
}

function SectionTitle({ title }: any) {
  return <h3 className="text-md font-black text-[#1B2559] mb-4 border-b pb-2 border-gray-50 tracking-tight">{title}</h3>;
}