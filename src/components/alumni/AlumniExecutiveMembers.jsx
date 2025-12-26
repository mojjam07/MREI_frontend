import React, { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  Building
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import apiClient from '../../services/apiClient';

import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingOverlay from '../ui/LoadingOverlay';

const AlumniExecutiveMembers = () => {
  const { t } = useLanguage();
  const [executiveMembers, setExecutiveMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchExecutiveMembers();
  }, []);

  const fetchExecutiveMembers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/executive-members');
      setExecutiveMembers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching executive members:', error);
      // Fallback to sample data if API fails
      setExecutiveMembers([
        {
          id: 1,
          name: 'Dr. Ahmed Hassan',
          position: 'President',
          email: 'ahmed.hassan@example.com',
          phone: '+966501234567',
          photo: '/api/placeholder/100/100',
          graduationYear: '1995',
          currentCompany: 'Ministry of Education',
          bio: 'Experienced educational leader with over 25 years in academic administration.',
          linkedin: 'https://linkedin.com/in/ahmedhassan',
          tenure: '2020-2023'
        },
        {
          id: 2,
          name: 'Sarah Al-Mansouri',
          position: 'Vice President',
          email: 'sarah.almansouri@example.com',
          phone: '+966507654321',
          photo: '/api/placeholder/100/100',
          graduationYear: '1998',
          currentCompany: 'King Saud University',
          bio: 'Research specialist in educational technology and curriculum development.',
          linkedin: 'https://linkedin.com/in/sarahalmansouri',
          tenure: '2021-2024'
        },
        {
          id: 3,
          name: 'Mohammed Al-Rashid',
          position: 'Treasurer',
          email: 'mohammed.alrashid@example.com',
          phone: '+966503456789',
          photo: '/api/placeholder/100/100',
          graduationYear: '2000',
          currentCompany: 'Saudi Development Fund',
          bio: 'Financial expert with expertise in educational funding and resource management.',
          linkedin: 'https://linkedin.com/in/mohammedalrashid',
          tenure: '2022-2025'
        },
        {
          id: 4,
          name: 'Fatima Al-Zahra',
          position: 'Secretary',
          email: 'fatima.alzahra@example.com',
          phone: '+966509876543',
          photo: '/api/placeholder/100/100',
          graduationYear: '2005',
          currentCompany: 'National Center for Assessment',
          bio: 'Education specialist focused on student assessment and academic excellence.',
          linkedin: 'https://linkedin.com/in/fatimaalzahra',
          tenure: '2021-2024'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getPositionColor = (position) => {
    const colors = {
      'President': 'bg-purple-100 text-purple-800 border-purple-200',
      'Vice President': 'bg-blue-100 text-blue-800 border-blue-200',
      'Treasurer': 'bg-green-100 text-green-800 border-green-200',
      'Secretary': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[position] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingOverlay 
          isLoading={true} 
          loadingText={t('common.loading')} 
          overlayColor="transparent"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4" style={{color: 'var(--text-color)'}}>
          {t('alumni.presentExcos')}
        </h1>
        <p className="text-lg mb-6" style={{color: 'var(--text-secondary)'}}>
          {t('alumni.executiveSubtitle')}
        </p>
      </div>

      {/* Executive Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {executiveMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              {/* Photo */}
              <div className="flex-shrink-0">
                <img
                  src={member.photo || '/api/placeholder/100/100'}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>

              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold" style={{color: 'var(--text-color)'}}>
                    {member.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPositionColor(member.position)}`}>
                    {member.position}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2" style={{color: 'var(--text-secondary)'}}>
                    <Mail className="w-4 h-4" />
                    <span className="break-all">{member.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2" style={{color: 'var(--text-secondary)'}}>
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                  
                  {member.graduationYear && (
                    <div className="flex items-center gap-2" style={{color: 'var(--text-secondary)'}}>
                      <Calendar className="w-4 h-4" />
                      <span>{t('alumni.graduated')} {member.graduationYear}</span>
                    </div>
                  )}
                  
                  {member.currentCompany && (
                    <div className="flex items-center gap-2" style={{color: 'var(--text-secondary)'}}>
                      <Building className="w-4 h-4" />
                      <span className="break-words">{member.currentCompany}</span>
                    </div>
                  )}
                </div>

                {member.bio && (
                  <p className="text-sm mt-3" style={{color: 'var(--text-secondary)'}}>
                    {member.bio}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMember(member)}
                  >
                    {t('alumni.actions.viewDetails')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    href={`mailto:${member.email}`}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    {t('alumni.actions.contact')}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {executiveMembers.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
            <h3 className="text-lg font-medium mb-2" style={{color: 'var(--text-color)'}}>
              {t('alumni.placeholders.noExecutiveMembers')}
            </h3>
            <p style={{color: 'var(--text-secondary)'}}>
              Executive member information will be updated soon.
            </p>
          </div>
        </Card>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start space-x-6">
                <img
                  src={selectedMember.photo || '/api/placeholder/120/120'}
                  alt={selectedMember.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold" style={{color: 'var(--text-color)'}}>
                      {selectedMember.name}
                    </h2>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPositionColor(selectedMember.position)}`}>
                      {selectedMember.position}
                    </span>
                  </div>
                  
                  {selectedMember.tenure && (
                    <p className="text-sm mb-4" style={{color: 'var(--text-secondary)'}}>
                      Tenure: {selectedMember.tenure}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              {selectedMember.bio && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--text-color)'}}>
                    Biography
                  </h3>
                  <p style={{color: 'var(--text-secondary)'}}>
                    {selectedMember.bio}
                  </p>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1" style={{color: 'var(--text-color)'}}>
                      {t('alumni.contactInfo')}
                    </h4>
                    <div className="space-y-2 text-sm" style={{color: 'var(--text-secondary)'}}>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="break-all">{selectedMember.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{selectedMember.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1" style={{color: 'var(--text-color)'}}>
                      {t('alumni.roles')}
                    </h4>
                    <div className="space-y-2 text-sm" style={{color: 'var(--text-secondary)'}}>
                      {selectedMember.graduationYear && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{t('alumni.graduated')} {selectedMember.graduationYear}</span>
                        </div>
                      )}
                      {selectedMember.currentCompany && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          <span className="break-words">{selectedMember.currentCompany}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  href={`mailto:${selectedMember.email}`}
                  className="flex-1"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {t('alumni.actions.sendEmail')}
                </Button>
                {selectedMember.linkedin && (
                  <Button
                    variant="outline"
                    href={selectedMember.linkedin}
                    target="_blank"
                  >
                    LinkedIn
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniExecutiveMembers;
