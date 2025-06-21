import { FrontendUser } from "@shared/schema";
import { Building, Users, Mail, Phone, MapPin, UserCheck } from "lucide-react";

interface DepartmentsProps {
  user: FrontendUser;
}

export default function Departments({ user }: DepartmentsProps) {
  // Department data with team members
  const departments = [
    {
      id: 1,
      name: "Engineering",
      description: "Building and maintaining our technology infrastructure",
      head: "Sarah Johnson",
      headTitle: "VP of Engineering",
      headEmail: "sarah.johnson@company.com",
      location: "Tech Hub - Floor 3",
      teamSize: 15,
      color: "bg-blue-500",
      members: [
        { name: "Mike Chen", role: "Senior Developer", avatar: "MC" },
        { name: "Jessica Davis", role: "DevOps Engineer", avatar: "JD" },
        { name: "Alex Rodriguez", role: "Frontend Developer", avatar: "AR" },
        { name: "Emma Wilson", role: "Backend Developer", avatar: "EW" },
        { name: "David Kim", role: "Full Stack Developer", avatar: "DK" }
      ]
    },
    {
      id: 2,
      name: "Marketing",
      description: "Driving brand awareness and customer acquisition",
      head: "Robert Martinez",
      headTitle: "Marketing Director",
      headEmail: "robert.martinez@company.com",
      location: "Creative Wing - Floor 2",
      teamSize: 8,
      color: "bg-purple-500",
      members: [
        { name: "Lisa Thompson", role: "Content Manager", avatar: "LT" },
        { name: "James Parker", role: "Social Media Specialist", avatar: "JP" },
        { name: "Maria Garcia", role: "Brand Manager", avatar: "MG" },
        { name: "Tom Anderson", role: "Digital Marketing", avatar: "TA" }
      ]
    },
    {
      id: 3,
      name: "Sales",
      description: "Growing revenue through customer relationships",
      head: "Jennifer Lee",
      headTitle: "Sales Manager",
      headEmail: "jennifer.lee@company.com",
      location: "Sales Floor - Floor 1",
      teamSize: 12,
      color: "bg-green-500",
      members: [
        { name: "Kevin Brown", role: "Account Executive", avatar: "KB" },
        { name: "Rachel Green", role: "Sales Representative", avatar: "RG" },
        { name: "Daniel White", role: "Business Development", avatar: "DW" },
        { name: "Sophie Taylor", role: "Customer Success", avatar: "ST" }
      ]
    },
    {
      id: 4,
      name: "Human Resources",
      description: "Supporting our people and company culture",
      head: "Michelle Adams",
      headTitle: "HR Director",
      headEmail: "michelle.adams@company.com",
      location: "Admin Building - Floor 2",
      teamSize: 5,
      color: "bg-orange-500",
      members: [
        { name: "Peter Wilson", role: "HR Specialist", avatar: "PW" },
        { name: "Amanda Clark", role: "Recruiter", avatar: "AC" },
        { name: "Chris Johnson", role: "HR Coordinator", avatar: "CJ" }
      ]
    },
    {
      id: 5,
      name: "Finance",
      description: "Managing financial operations and planning",
      head: "Steven Thompson",
      headTitle: "Finance Director",
      headEmail: "steven.thompson@company.com",
      location: "Executive Floor - Floor 4",
      teamSize: 6,
      color: "bg-indigo-500",
      members: [
        { name: "Linda Davis", role: "Financial Analyst", avatar: "LD" },
        { name: "Mark Roberts", role: "Accountant", avatar: "MR" },
        { name: "Carol Mitchell", role: "Accounts Payable", avatar: "CM" }
      ]
    },
    {
      id: 6,
      name: "Operations",
      description: "Ensuring smooth daily business operations",
      head: "Brian Walker",
      headTitle: "Operations Manager",
      headEmail: "brian.walker@company.com",
      location: "Operations Center - Floor 1",
      teamSize: 10,
      color: "bg-teal-500",
      members: [
        { name: "Nancy Hall", role: "Operations Coordinator", avatar: "NH" },
        { name: "Gary Turner", role: "Facilities Manager", avatar: "GT" },
        { name: "Helen Young", role: "Office Manager", avatar: "HY" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 card-depth mb-6">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mobile-shadow">
              <Building size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Departments</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Browse teams and connect with colleagues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white dark:bg-gray-800 rounded-2xl card-depth hover:mobile-shadow-lg transition-shadow">
            <div className="p-6">
              {/* Department Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${dept.color} rounded-xl flex items-center justify-center mobile-shadow`}>
                    <Building size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{dept.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{dept.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                  <Users size={12} className="text-gray-500" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{dept.teamSize}</span>
                </div>
              </div>

              {/* Department Head */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-semibold text-sm mobile-shadow">
                    {dept.head.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{dept.head}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{dept.headTitle}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors button-depth">
                      <Mail size={12} className="text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2 mb-4 text-xs text-gray-600 dark:text-gray-400">
                <MapPin size={12} />
                <span>{dept.location}</span>
              </div>

              {/* Team Members */}
              <div>
                <h5 className="text-sm font-medium text-gray-800 dark:text-white mb-3">Team Members</h5>
                <div className="space-y-2">
                  {dept.members.map((member, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300">
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">{member.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{member.role}</p>
                      </div>
                      <button className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <UserCheck size={14} className="text-gray-500" />
                      </button>
                    </div>
                  ))}
                  {dept.teamSize > dept.members.length && (
                    <div className="text-center pt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{dept.teamSize - dept.members.length} more members
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}