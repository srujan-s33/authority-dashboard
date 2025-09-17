// Sample data for demonstration
const sampleAlerts = [
    {
        id: 'T001',
        touristName: 'Aarav Sharma',
        touristId: 'TID-2024-001',
        alertType: 'medical',
        severity: 'high',
        distance: 0.8,
        time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        status: 'new',
        coordinates: '40.7128, -74.0060',
        address: 'Central Park, New York, NY'
    },
    {
        id: 'T002',
        touristName: 'Adithya Lyer',
        touristId: 'TID-2024-002',
        alertType: 'security',
        severity: 'high',
        distance: 2.3,
        time: new Date(Date.now() - 32 * 60 * 1000), // 32 minutes ago
        status: 'in-progress',
        coordinates: '40.7589, -73.9851',
        address: 'Times Square, New York, NY'
    },
    {
        id: 'T003',
        touristName: 'Priya Sigh',
        touristId: 'TID-2024-003',
        alertType: 'lost',
        severity: 'medium',
        distance: 1.5,
        time: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        status: 'new',
        coordinates: '40.7505, -73.9934',
        address: 'Broadway, New York, NY'
    },
    {
        id: 'T004',
        touristName: 'Sehwag Patel',
        touristId: 'TID-2024-004',
        alertType: 'accident',
        severity: 'medium',
        distance: 3.7,
        time: new Date(Date.now() - 67 * 60 * 1000), // 1 hour 7 minutes ago
        status: 'in-progress',
        coordinates: '40.7614, -73.9776',
        address: 'Brooklyn Bridge, New York, NY'
    },
    {
        id: 'T005',
        touristName: 'Shashank Reddy',
        touristId: 'TID-2024-005',
        alertType: 'medical',
        severity: 'low',
        distance: 5.2,
        time: new Date(Date.now() - 95 * 60 * 1000), // 1 hour 35 minutes ago
        status: 'resolved',
        coordinates: '40.7282, -74.0776',
        address: 'Statue of Liberty, New York, NY'
    },
    {
        id: 'T006',
        touristName: 'Ganesh Kashyap',
        touristId: 'TID-2024-006',
        alertType: 'natural',
        severity: 'high',
        distance: 0.5,
        time: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
        status: 'new',
        coordinates: '40.7831, -73.9712',
        address: 'Central Park North, New York, NY'
    },
    {
        id: 'T007',
        touristName: 'Rahul Choudhray',
        touristId: 'TID-2024-007',
        alertType: 'security',
        severity: 'medium',
        distance: 4.1,
        time: new Date(Date.now() - 123 * 60 * 1000), // 2 hours 3 minutes ago
        status: 'resolved',
        coordinates: '40.7484, -73.9857',
        address: 'Empire State Building, New York, NY'
    },
    {
        id: 'T008',
        touristName: 'Manav Singh',
        touristId: 'TID-2024-008',
        alertType: 'lost',
        severity: 'low',
        distance: 6.8,
        time: new Date(Date.now() - 156 * 60 * 1000), // 2 hours 36 minutes ago
        status: 'resolved',
        coordinates: '40.7580, -73.9855',
        address: 'Times Square South, New York, NY'
    }
];

// DOM Elements
const alertsTableBody = document.getElementById('alertsTableBody');
const searchInput = document.getElementById('searchInput');
const alertTypeFilter = document.getElementById('alertTypeFilter');
const statusFilter = document.getElementById('statusFilter');
const distanceFilter = document.getElementById('distanceFilter');
const timeFilter = document.getElementById('timeFilter');
const alertCounter = document.getElementById('alertCounter');
const refreshBtn = document.getElementById('refreshBtn');
const notificationPanel = document.getElementById('notificationPanel');
const closeNotification = document.getElementById('closeNotification');

// State
let currentAlerts = [...sampleAlerts];
let filteredAlerts = [...sampleAlerts];
let sortColumn = 'time';
let sortDirection = 'desc';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    renderAlerts();
    updateAlertCounter();
    setupEventListeners();
    
    // Simulate new alerts periodically
    setInterval(simulateNewAlert, 30000); // Every 30 seconds
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Dashboard loaded successfully. Monitoring active alerts.', 'success');
    }, 1000);
});

// Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    alertTypeFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    distanceFilter.addEventListener('change', applyFilters);
    timeFilter.addEventListener('change', applyFilters);
    refreshBtn.addEventListener('click', refreshData);
    closeNotification.addEventListener('click', hideNotification);
    
    // Sort functionality
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;
            handleSort(column);
        });
    });
}

// Render alerts table
function renderAlerts() {
    alertsTableBody.innerHTML = '';
    
    if (filteredAlerts.length === 0) {
        alertsTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: var(--gray-500);">
                    No alerts found matching your criteria.
                </td>
            </tr>
        `;
        return;
    }
    
    filteredAlerts.forEach(alert => {
        const row = createAlertRow(alert);
        alertsTableBody.appendChild(row);
    });
}

// Create alert row
function createAlertRow(alert) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="severity-indicator severity-${alert.severity}"></div>
        </td>
        <td>
            <div class="tourist-info">
                <div class="tourist-name">${alert.touristName}</div>
                <div class="tourist-id">${alert.touristId}</div>
            </div>
        </td>
        <td>
            <div class="alert-type">
                ${getAlertIcon(alert.alertType)}
                ${formatAlertType(alert.alertType)}
            </div>
        </td>
        <td>
            <div class="distance-info">${alert.distance} km</div>
        </td>
        <td>
            <div class="time-info">
                <div class="time-absolute">${formatTime(alert.time)}</div>
                <div class="time-relative">${getRelativeTime(alert.time)}</div>
            </div>
        </td>
        <td>
            <span class="status-badge status-${alert.status}">${formatStatus(alert.status)}</span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="action-btn btn-map" onclick="viewMap('${alert.id}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" stroke-width="2"/>
                        <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Map
                </button>
                <button class="action-btn btn-dispatch" onclick="dispatchHelp('${alert.id}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 11H15M9 15H15M17 21L12 16L7 21V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Dispatch
                </button>
                <button class="action-btn btn-message" onclick="sendMessageModal('${alert.id}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Message
                </button>
            </div>
        </td>
    `;
    return row;
}

// Utility functions
function getAlertIcon(type) {
    const icons = {
        medical: '<svg class="alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" stroke="currentColor" stroke-width="2"/></svg>',
        security: '<svg class="alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22S8 18 8 13V6L12 4L16 6V13C16 18 12 22 12 22Z" stroke="currentColor" stroke-width="2"/></svg>',
        lost: '<svg class="alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/></svg>',
        accident: '<svg class="alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.29 3.86L1.82 18C1.64 18.37 1.9 18.75 2.31 18.75H21.68C22.09 18.75 22.35 18.37 22.17 18L13.7 3.86C13.35 3.33 12.64 3.33 12.29 3.86H10.29Z" stroke="currentColor" stroke-width="2"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="17" r="1" stroke="currentColor" stroke-width="2"/></svg>',
        natural: '<svg class="alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19V5C6 3.89543 6.89543 3 8 3H16C17.1046 3 18 3.89543 18 5V19L12 15L6 19Z" stroke="currentColor" stroke-width="2"/></svg>'
    };
    return icons[type] || '';
}

function formatAlertType(type) {
    const types = {
        medical: 'Medical Emergency',
        security: 'Security Threat',
        lost: 'Lost Tourist',
        accident: 'Accident',
        natural: 'Natural Disaster'
    };
    return types[type] || type;
}

function formatStatus(status) {
    const statuses = {
        new: 'New',
        'in-progress': 'In Progress',
        resolved: 'Resolved'
    };
    return statuses[status] || status;
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

function getRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

// Search and filter functions
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        filteredAlerts = [...currentAlerts];
    } else {
        filteredAlerts = currentAlerts.filter(alert => 
            alert.touristName.toLowerCase().includes(query) ||
            alert.touristId.toLowerCase().includes(query) ||
            formatAlertType(alert.alertType).toLowerCase().includes(query)
        );
    }
    
    applyFilters();
}

function applyFilters() {
    let filtered = [...currentAlerts];
    
    // Apply search filter
    const query = searchInput.value.toLowerCase().trim();
    if (query) {
        filtered = filtered.filter(alert => 
            alert.touristName.toLowerCase().includes(query) ||
            alert.touristId.toLowerCase().includes(query) ||
            formatAlertType(alert.alertType).toLowerCase().includes(query)
        );
    }
    
    // Apply alert type filter
    const alertType = alertTypeFilter.value;
    if (alertType) {
        filtered = filtered.filter(alert => alert.alertType === alertType);
    }
    
    // Apply status filter
    const status = statusFilter.value;
    if (status) {
        filtered = filtered.filter(alert => alert.status === status);
    }
    
    // Apply distance filter
    const distance = distanceFilter.value;
    if (distance) {
        filtered = filtered.filter(alert => {
            const dist = alert.distance;
            switch (distance) {
                case '0-1': return dist <= 1;
                case '1-5': return dist > 1 && dist <= 5;
                case '5-10': return dist > 5 && dist <= 10;
                case '10+': return dist > 10;
                default: return true;
            }
        });
    }
    
    // Apply time filter
    const time = timeFilter.value;
    if (time) {
        const now = new Date();
        filtered = filtered.filter(alert => {
            const alertTime = alert.time;
            const diffMs = now - alertTime;
            const diffHours = diffMs / (1000 * 60 * 60);
            const diffDays = diffHours / 24;
            
            switch (time) {
                case 'last-hour': return diffHours <= 1;
                case 'last-day': return diffHours <= 24;
                case 'last-week': return diffDays <= 7;
                default: return true;
            }
        });
    }
    
    filteredAlerts = filtered;
    applySorting();
    renderAlerts();
    updateAlertCounter();
}

// Sorting functions
function handleSort(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'desc';
    }
    
    applySorting();
    renderAlerts();
    updateSortIndicators();
}

function applySorting() {
    filteredAlerts.sort((a, b) => {
        let aVal, bVal;
        
        switch (sortColumn) {
            case 'severity':
                const severityOrder = { high: 3, medium: 2, low: 1, resolved: 0 };
                aVal = severityOrder[a.severity];
                bVal = severityOrder[b.severity];
                break;
            case 'name':
                aVal = a.touristName.toLowerCase();
                bVal = b.touristName.toLowerCase();
                break;
            case 'type':
                aVal = a.alertType.toLowerCase();
                bVal = b.alertType.toLowerCase();
                break;
            case 'distance':
                aVal = a.distance;
                bVal = b.distance;
                break;
            case 'time':
                aVal = a.time.getTime();
                bVal = b.time.getTime();
                break;
            default:
                return 0;
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
}

function updateSortIndicators() {
    document.querySelectorAll('.sortable').forEach(header => {
        const svg = header.querySelector('svg');
        if (header.dataset.sort === sortColumn) {
            svg.style.transform = sortDirection === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)';
            svg.style.opacity = '1';
        } else {
            svg.style.transform = 'rotate(0deg)';
            svg.style.opacity = '0.5';
        }
    });
}

// Action functions
function viewMap(alertId) {
    const alert = currentAlerts.find(a => a.id === alertId);
    if (!alert) return;
    
    document.getElementById('modalCoordinates').textContent = alert.coordinates;
    document.getElementById('modalAddress').textContent = alert.address;
    
    showModal('mapModal');
}

function dispatchHelp(alertId) {
    const alert = currentAlerts.find(a => a.id === alertId);
    if (!alert) return;
    
    // Update alert status
    alert.status = 'in-progress';
    applyFilters();
    
    showNotification(`Help dispatched to ${alert.touristName}. Emergency services are on the way.`, 'success');
}

function sendMessageModal(alertId) {
    const alert = currentAlerts.find(a => a.id === alertId);
    if (!alert) return;
    
    // Store current alert ID for message sending
    window.currentMessageAlertId = alertId;
    showModal('messageModal');
}

function sendMessage() {
    const messageText = document.getElementById('messageText').value.trim();
    if (!messageText) {
        showNotification('Please enter a message.', 'error');
        return;
    }
    
    const alert = currentAlerts.find(a => a.id === window.currentMessageAlertId);
    if (alert) {
        showNotification(`Message sent to ${alert.touristName}: "${messageText}"`, 'success');
        document.getElementById('messageText').value = '';
        closeModal('messageModal');
    }
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Notification functions
function showNotification(message, type = 'info') {
    const notificationContent = document.getElementById('notificationContent');
    notificationContent.innerHTML = `
        <div class="notification-message">
            <p>${message}</p>
            <small>${new Date().toLocaleTimeString()}</small>
        </div>
    `;
    
    notificationPanel.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification() {
    notificationPanel.classList.remove('show');
}

// Data management functions
function updateAlertCounter() {
    const activeAlerts = currentAlerts.filter(alert => alert.status !== 'resolved').length;
    alertCounter.textContent = activeAlerts;
}

function refreshData() {
    // Simulate data refresh
    refreshBtn.style.transform = 'rotate(360deg)';
    
    setTimeout(() => {
        refreshBtn.style.transform = 'rotate(0deg)';
        showNotification('Data refreshed successfully.', 'success');
        applyFilters();
    }, 1000);
}

function simulateNewAlert() {
    // Randomly generate a new alert
    const names = ['Kavya Singh', 'Maria Patel', 'John Smith', 'Tanvi Suresh', 'Ahmed Hassan'];
    const types = ['medical', 'security', 'lost', 'accident'];
    const severities = ['high', 'medium', 'low'];
    
    const newAlert = {
        id: `T${String(currentAlerts.length + 1).padStart(3, '0')}`,
        touristName: names[Math.floor(Math.random() * names.length)],
        touristId: `TID-2024-${String(currentAlerts.length + 1).padStart(3, '0')}`,
        alertType: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        distance: Math.round((Math.random() * 10 + 0.1) * 10) / 10,
        time: new Date(),
        status: 'new',
        coordinates: `${(40.7 + Math.random() * 0.1).toFixed(4)}, ${(-74.0 + Math.random() * 0.1).toFixed(4)}`,
        address: 'New York, NY'
    };
    
    currentAlerts.unshift(newAlert);
    applyFilters();
    
    showNotification(`New ${newAlert.severity} priority alert from ${newAlert.touristName}`, 'warning');
    
    // Play notification sound (in a real app)
    // new Audio('/notification-sound.mp3').play();
}

// Initialize sorting
applySorting();
updateSortIndicators();