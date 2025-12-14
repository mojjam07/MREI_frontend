
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Clock, Star, Upload, Save, Edit, Camera, Award, BookOpen } from 'lucide-react';
import { useTutorDashboard } from '../../hooks/useTutorDashboard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import FormModal from '../ui/FormModal';


const TutorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    first_name: 'Dr. Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@eduplatform.com',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced educator with over 10 years of teaching experience in mathematics and sciences. Passionate about making complex concepts accessible to all students.',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Statistics'],
    experience_years: 10,
    education: [
      {
        degree: 'Ph.D. in Mathematics',
        institution: 'State University',
        year: '2018',
        description: 'Specialized in Applied Mathematics and Statistics'
      },
      {
        degree: 'M.Sc. in Physics',
        institution: 'Tech University',
        year: '2015',
        description: 'Focus on Theoretical Physics and Quantum Mechanics'
      }
    ],
    certifications: [
      {
        name: 'Certified Mathematics Teacher',
        issuing_body: 'National Education Board',
        year: '2020',
        credential_id: 'CMT-2020-001'
      },
      {
        name: 'Online Teaching Certification',
        issuing_body: 'Digital Education Institute',
        year: '2022',
        credential_id: 'OTE-2022-045'
      }
    ],
    hourly_rate: 75,
    availability: {
      monday: { available: true, start: '09:00', end: '17:00' },
      tuesday: { available: true, start: '09:00', end: '17:00' },
      wednesday: { available: true, start: '09:00', end: '17:00' },
      thursday: { available: true, start: '09:00', end: '17:00' },
      friday: { available: true, start: '09:00', end: '17:00' },
      saturday: { available: false, start: '', end: '' },
      sunday: { available: false, start: '', end: '' }
    },
    languages: ['English', 'Spanish'],
    timezone: 'America/New_York',
    teaching_style: 'Interactive and student-centered approach with focus on practical applications and real-world examples.',
    specializations: ['Advanced Mathematics', 'Test Preparation', 'Research Methods']
  });

  const [availabilityData, setAvailabilityData] = useState(profileData.availability);
  const [newQualification, setNewQualification] = useState({
    type: 'education', // 'education' or 'certification'
    name: '',
    institution: '',
    year: '',
    description: '',
    credential_id: ''
  });


  const {
    updateProfile,
    uploading
  } = useTutorDashboard();

  // Get profile completion percentage
  const getProfileCompletion = () => {
    const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'bio'];
    const completedFields = requiredFields.filter(field => profileData[field] && profileData[field].trim() !== '').length;
    const completionRate = (completedFields / requiredFields.length) * 100;
    
    // Add bonus points for additional information
    let bonusPoints = 0;
    if (profileData.education.length > 0) bonusPoints += 15;
    if (profileData.certifications.length > 0) bonusPoints += 15;
    if (profileData.subjects.length > 0) bonusPoints += 10;
    if (profileData.hourly_rate > 0) bonusPoints += 10;
    
    return Math.min(100, completionRate + bonusPoints);
  };

  const completionRate = getProfileCompletion();

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Handle availability update
  const handleAvailabilityUpdate = () => {
    setProfileData({ ...profileData, availability: availabilityData });
    setShowAvailabilityModal(false);
  };

  // Handle qualification add
  const handleAddQualification = () => {
    if (!newQualification.name || !newQualification.year) return;
    
    if (newQualification.type === 'education') {
      setProfileData({
        ...profileData,
        education: [...profileData.education, {
          degree: newQualification.name,
          institution: newQualification.institution,
          year: newQualification.year,
          description: newQualification.description
        }]
      });
    } else {
      setProfileData({
        ...profileData,
        certifications: [...profileData.certifications, {
          name: newQualification.name,
          issuing_body: newQualification.institution,
          year: newQualification.year,
          credential_id: newQualification.credential_id
        }]
      });
    }
    
    setNewQualification({
      type: 'education',
      name: '',
      institution: '',
      year: '',
      description: '',
      credential_id: ''
    });
    setShowQualificationModal(false);
  };

  // Calculate teaching statistics
  const getTeachingStats = () => {
    return {
      totalStudents: 156,
      averageRating: 4.8,
      totalHours: 1200,
      responseRate: 98,
      completionRate: 95
    };
  };

  const stats = getTeachingStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Tutor Profile</h2>
        <div className="flex gap-2">
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
          {isEditing && (
            <Button onClick={handleProfileUpdate} disabled={uploading}>
              <Save className="w-4 h-4 mr-2" />
              {uploading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>

      {/* Profile Completion */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
          <span className="text-2xl font-bold text-blue-600">{Math.round(completionRate)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          Complete your profile to attract more students and increase your visibility.
        </p>
      </Card>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <div className="text-center">
            {/* Profile Photo */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {profileData.first_name.charAt(0)}{profileData.last_name.charAt(0)}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-gray-700">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Basic Info */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {profileData.first_name} {profileData.last_name}
            </h3>
            <p className="text-gray-600 mb-4">{profileData.subjects.join(', ')}</p>
            
            {/* Rating */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(stats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{stats.averageRating}</span>
              <span className="text-sm text-gray-500">({stats.totalStudents} students)</span>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.totalHours}</p>
                <p className="text-sm text-gray-600">Hours Taught</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">${profileData.hourly_rate}</p>
                <p className="text-sm text-gray-600">Per Hour</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2" title="Profile Information">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  {isEditing ? (
                    <Input
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.first_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  {isEditing ? (
                    <Input
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.last_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{profileData.email}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? (
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{profileData.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              ) : (
                <p className="text-gray-900">{profileData.bio}</p>
              )}
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
              <div className="flex flex-wrap gap-2">
                {profileData.subjects.map((subject, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {subject}
                  </span>
                ))}
                {isEditing && (
                  <button className="px-3 py-1 border border-dashed border-gray-400 text-gray-600 rounded-full text-sm hover:border-gray-600">
                    + Add Subject
                  </button>
                )}
              </div>
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">$</span>
                  <Input
                    type="number"
                    value={profileData.hourly_rate}
                    onChange={(e) => setProfileData({...profileData, hourly_rate: parseInt(e.target.value)})}
                    className="w-24"
                  />
                  <span className="text-gray-500">per hour</span>
                </div>
              ) : (
                <p className="text-gray-900 font-bold text-lg">${profileData.hourly_rate}/hour</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Education */}
        <Card 
          title="Education" 
          action={
            <Button 
              size="sm" 
              onClick={() => setShowQualificationModal(true)}
            >
              <Award className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          }
        >
          <div className="space-y-4">
            {profileData.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.year}</p>
                <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Certifications */}
        <Card 
          title="Certifications" 
          action={
            <Button 
              size="sm" 
              onClick={() => {
                setNewQualification({...newQualification, type: 'certification'});
                setShowQualificationModal(true);
              }}
            >
              <Award className="w-4 h-4 mr-2" />
              Add Certification
            </Button>
          }
        >
          <div className="space-y-4">
            {profileData.certifications.map((cert, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                <p className="text-gray-600">{cert.issuing_body}</p>
                <p className="text-sm text-gray-500">{cert.year}</p>
                {cert.credential_id && (
                  <p className="text-xs text-gray-400">ID: {cert.credential_id}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Availability */}
      <Card 
        title="Weekly Availability" 
        action={
          <Button size="sm" onClick={() => setShowAvailabilityModal(true)}>
            <Clock className="w-4 h-4 mr-2" />
            Edit Availability
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {Object.entries(profileData.availability).map(([day, schedule]) => (
            <div key={day} className={`p-4 rounded-lg border-2 ${
              schedule.available ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <h4 className="font-semibold text-gray-900 capitalize mb-2">{day}</h4>
              {schedule.available ? (
                <div>
                  <p className="text-sm text-gray-600">{schedule.start}</p>
                  <p className="text-sm text-gray-600">{schedule.end}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Not available</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Teaching Performance */}
      <Card title="Teaching Performance">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-600">{stats.averageRating}</span>
            </div>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{stats.totalStudents}</div>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">{stats.responseRate}%</div>
            <p className="text-sm text-gray-600">Response Rate</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">{stats.completionRate}%</div>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
        </div>
      </Card>

      {/* Add Qualification Modal */}
      {showQualificationModal && (
        <FormModal
          isOpen={showQualificationModal}
          onClose={() => {
            setShowQualificationModal(false);
            setNewQualification({
              type: 'education',
              name: '',
              institution: '',
              year: '',
              description: '',
              credential_id: ''
            });
          }}
          title="Add New Qualification"
          size="lg"
          onSubmit={handleAddQualification}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={newQualification.type}
                onChange={(e) => setNewQualification({...newQualification, type: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="education">Education</option>
                <option value="certification">Certification</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {newQualification.type === 'education' ? 'Degree' : 'Certification Name'} *
              </label>
              <Input
                value={newQualification.name}
                onChange={(e) => setNewQualification({...newQualification, name: e.target.value})}
                placeholder={newQualification.type === 'education' ? 'e.g., Ph.D. in Mathematics' : 'e.g., Certified Teacher'}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {newQualification.type === 'education' ? 'Institution' : 'Issuing Body'} *
              </label>
              <Input
                value={newQualification.institution}
                onChange={(e) => setNewQualification({...newQualification, institution: e.target.value})}
                placeholder="e.g., State University"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
              <Input
                type="number"
                value={newQualification.year}
                onChange={(e) => setNewQualification({...newQualification, year: e.target.value})}
                placeholder="2020"
                required
              />
            </div>
            
            {newQualification.type === 'certification' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credential ID</label>
                <Input
                  value={newQualification.credential_id}
                  onChange={(e) => setNewQualification({...newQualification, credential_id: e.target.value})}
                  placeholder="Optional credential ID"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newQualification.description}
                onChange={(e) => setNewQualification({...newQualification, description: e.target.value})}
                placeholder="Brief description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
          </div>
        </FormModal>
      )}

      {/* Availability Modal */}
      {showAvailabilityModal && (
        <FormModal
          isOpen={showAvailabilityModal}
          onClose={() => setShowAvailabilityModal(false)}
          title="Edit Weekly Availability"
          size="lg"
          onSubmit={handleAvailabilityUpdate}
        >
          <div className="space-y-4">
            {Object.entries(availabilityData).map(([day, schedule]) => (
              <div key={day} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-20">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={schedule.available}
                      onChange={(e) => setAvailabilityData({
                        ...availabilityData,
                        [day]: { ...schedule, available: e.target.checked }
                      })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="capitalize font-medium">{day}</span>
                  </label>
                </div>
                
                {schedule.available && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={schedule.start}
                      onChange={(e) => setAvailabilityData({
                        ...availabilityData,
                        [day]: { ...schedule, start: e.target.value }
                      })}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={schedule.end}
                      onChange={(e) => setAvailabilityData({
                        ...availabilityData,
                        [day]: { ...schedule, end: e.target.value }
                      })}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default TutorProfile;
