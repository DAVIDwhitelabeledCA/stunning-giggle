import { useState } from "react";
import { FrontendUser } from "@shared/schema";
import { 
  Shield, 
  Plus, 
  Trash2, 
  Edit, 
  AlertTriangle, 
  Send,
  Newspaper,
  Calendar,
  Bell,
  Users
} from "lucide-react";

interface AdminPanelProps {
  user: FrontendUser;
}

export default function AdminPanel({ user }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'alerts'>('content');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [contentType, setContentType] = useState<'news' | 'event'>('news');
  const [alertForm, setAlertForm] = useState({
    title: '',
    message: '',
    type: 'critical' as const,
    targetLevel: 3
  });

  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'General',
    imageUrl: ''
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: ''
  });

  // Sample existing content for management
  const existingNews = [
    {
      id: 1,
      title: "Q1 Financial Results Released",
      category: "Finance",
      createdAt: "2024-01-15",
      status: "Published"
    },
    {
      id: 2,
      title: "New Employee Wellness Program",
      category: "HR",
      createdAt: "2024-01-10",
      status: "Draft"
    }
  ];

  const existingEvents = [
    {
      id: 1,
      title: "All-Hands Company Meeting",
      date: "2024-01-25",
      location: "Main Conference Room",
      status: "Scheduled"
    },
    {
      id: 2,
      title: "Team Building Workshop",
      date: "2024-02-01",
      location: "Recreation Center",
      status: "Scheduled"
    }
  ];

  const handleSendCriticalAlert = async () => {
    if (!alertForm.title || !alertForm.message) return;
    
    try {
      const response = await fetch('/api/admin/alerts/critical', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: alertForm.title,
          message: alertForm.message,
          targetLevel: alertForm.targetLevel
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setAlertForm({
          title: '',
          message: '',
          type: 'critical',
          targetLevel: 3
        });
        alert(`Critical alert sent successfully to ${result.notificationsCreated} users`);
      } else {
        throw new Error('Failed to send alert');
      }
    } catch (error) {
      alert('Failed to send critical alert. Please try again.');
      console.error('Error sending alert:', error);
    }
  };

  const handleCreateContent = async () => {
    try {
      if (contentType === 'news') {
        if (!newsForm.title || !newsForm.content || !newsForm.summary) return;
        
        const response = await fetch('/api/admin/news', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newsForm),
        });

        if (response.ok) {
          setNewsForm({
            title: '',
            content: '',
            summary: '',
            category: 'General',
            imageUrl: ''
          });
          alert('News article created successfully');
        } else {
          throw new Error('Failed to create news article');
        }
      } else {
        if (!eventForm.title || !eventForm.startTime || !eventForm.location) return;
        
        const response = await fetch('/api/admin/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventForm),
        });

        if (response.ok) {
          setEventForm({
            title: '',
            description: '',
            startTime: '',
            endTime: '',
            location: ''
          });
          alert('Event created successfully');
        } else {
          throw new Error('Failed to create event');
        }
      }
      setShowCreateForm(false);
    } catch (error) {
      alert(`Failed to create ${contentType}. Please try again.`);
      console.error('Error creating content:', error);
    }
  };

  if (user.userLevel > 3) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <Shield size={48} className="text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Access Restricted</h3>
        <p className="text-red-600">
          Administrative features are only available to users with Level 3 access or above.
          Current level: {user.userLevel}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 card-depth">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mobile-shadow">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Level {user.userLevel} Access - Manage content and send alerts
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                activeTab === 'content'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Content Management
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                activeTab === 'alerts'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Critical Alerts
            </button>
          </div>
        </div>
      </div>

      {/* Content Management Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Create Content Button */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl card-depth p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Create New Content</h2>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark transition-colors button-depth"
              >
                <Plus size={16} />
                <span>Add Content</span>
              </button>
            </div>

            {showCreateForm && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                {/* Content Type Selection */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setContentType('news')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                      contentType === 'news'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Newspaper size={16} />
                    <span>News Article</span>
                  </button>
                  <button
                    onClick={() => setContentType('event')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                      contentType === 'event'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Calendar size={16} />
                    <span>Event</span>
                  </button>
                </div>

                {/* News Form */}
                {contentType === 'news' && (
                  <div className="grid gap-4">
                    <input
                      type="text"
                      placeholder="Article title"
                      value={newsForm.title}
                      onChange={(e) => setNewsForm(prev => ({ ...prev, title: e.target.value }))}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                    <select
                      value={newsForm.category}
                      onChange={(e) => setNewsForm(prev => ({ ...prev, category: e.target.value }))}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    >
                      <option value="General">General</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Technology">Technology</option>
                      <option value="Announcements">Announcements</option>
                    </select>
                    <textarea
                      placeholder="Article summary"
                      value={newsForm.summary}
                      onChange={(e) => setNewsForm(prev => ({ ...prev, summary: e.target.value }))}
                      rows={2}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                    <textarea
                      placeholder="Article content"
                      value={newsForm.content}
                      onChange={(e) => setNewsForm(prev => ({ ...prev, content: e.target.value }))}
                      rows={6}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                    <input
                      type="url"
                      placeholder="Image URL (optional)"
                      value={newsForm.imageUrl}
                      onChange={(e) => setNewsForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>
                )}

                {/* Event Form */}
                {contentType === 'event' && (
                  <div className="grid gap-4">
                    <input
                      type="text"
                      placeholder="Event title"
                      value={eventForm.title}
                      onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                    <textarea
                      placeholder="Event description"
                      value={eventForm.description}
                      onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="datetime-local"
                        placeholder="Start time"
                        value={eventForm.startTime}
                        onChange={(e) => setEventForm(prev => ({ ...prev, startTime: e.target.value }))}
                        className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      />
                      <input
                        type="datetime-local"
                        placeholder="End time"
                        value={eventForm.endTime}
                        onChange={(e) => setEventForm(prev => ({ ...prev, endTime: e.target.value }))}
                        className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Location"
                      value={eventForm.location}
                      onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={handleCreateContent}
                    className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary-dark transition-colors button-depth"
                  >
                    Create {contentType === 'news' ? 'Article' : 'Event'}
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Existing Content Management */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* News Management */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl card-depth p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <Newspaper size={20} className="mr-2 text-blue-500" />
                Manage News
              </h3>
              <div className="space-y-3">
                {existingNews.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-white text-sm">{article.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {article.category} • {article.createdAt}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors">
                        <Edit size={14} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events Management */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl card-depth p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <Calendar size={20} className="mr-2 text-green-500" />
                Manage Events
              </h3>
              <div className="space-y-3">
                {existingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-white text-sm">{event.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {event.date} • {event.location}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors">
                        <Edit size={14} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Critical Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl card-depth p-6">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle size={24} className="text-red-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Send Critical Alert</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Send urgent notifications to users with Level 3 access or above
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alert Title
              </label>
              <input
                type="text"
                value={alertForm.title}
                onChange={(e) => setAlertForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter alert title"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alert Message
              </label>
              <textarea
                value={alertForm.message}
                onChange={(e) => setAlertForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter detailed alert message"
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target User Level
              </label>
              <select
                value={alertForm.targetLevel}
                onChange={(e) => setAlertForm(prev => ({ ...prev, targetLevel: parseInt(e.target.value) }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value={1}>Level 1+ (Admin and above)</option>
                <option value={2}>Level 2+ (Dept Manager and above)</option>
                <option value={3}>Level 3+ (Dept Head and above)</option>
              </select>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-200">Critical Alert Warning</h4>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    This will send an immediate notification to all users with Level {alertForm.targetLevel} access or above. 
                    Recipients will receive a popup notification that requires acknowledgment.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSendCriticalAlert}
              disabled={!alertForm.title || !alertForm.message}
              className="w-full bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors button-depth flex items-center justify-center space-x-2"
            >
              <Send size={16} />
              <span>Send Critical Alert</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}