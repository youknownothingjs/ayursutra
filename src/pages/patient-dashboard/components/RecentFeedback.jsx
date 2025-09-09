import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentFeedback = ({ onViewAll, onSubmitNew }) => {
  const recentFeedback = [
    {
      id: 1,
      sessionDate: '2024-09-05',
      therapyType: 'Abhyanga',
      rating: 5,
      symptoms: 'Reduced back pain and improved sleep quality',
      improvements: 'Significant reduction in muscle tension',
      sideEffects: 'None reported',
      practitioner: 'Dr. Priya Sharma',
      submittedAt: '2024-09-06T10:30:00'
    },
    {
      id: 2,
      sessionDate: '2024-09-02',
      therapyType: 'Shirodhara',
      rating: 4,
      symptoms: 'Mild headache relief, better mental clarity',
      improvements: 'Improved concentration and reduced anxiety',
      sideEffects: 'Slight drowsiness for 2 hours post-treatment',
      practitioner: 'Dr. Rajesh Kumar',
      submittedAt: '2024-09-03T14:15:00'
    },
    {
      id: 3,
      sessionDate: '2024-08-30',
      therapyType: 'Virechana',
      rating: 5,
      symptoms: 'Digestive issues completely resolved',
      improvements: 'Better appetite and energy levels',
      sideEffects: 'Temporary weakness on treatment day',
      practitioner: 'Dr. Meera Patel',
      submittedAt: '2024-08-31T09:45:00'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={index < rating ? 'text-warning fill-current' : 'text-border'}
      />
    ));
  };

  const getTherapyIcon = (type) => {
    switch (type) {
      case 'Abhyanga': return 'Droplets';
      case 'Shirodhara': return 'Waves';
      case 'Virechana': return 'Leaf';
      default: return 'Heart';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="card-breathing border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="MessageSquare" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Recent Feedback
            </h3>
            <p className="font-body text-sm text-text-secondary">
              Your therapy session reviews
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onViewAll}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {recentFeedback?.map((feedback) => (
          <div key={feedback?.id} className="bg-muted rounded-lg p-4 border border-border/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon 
                    name={getTherapyIcon(feedback?.therapyType)} 
                    size={16} 
                    className="text-primary" 
                  />
                </div>
                <div>
                  <h4 className="font-body font-medium text-foreground">
                    {feedback?.therapyType}
                  </h4>
                  <p className="font-caption text-xs text-text-secondary">
                    {formatDate(feedback?.sessionDate)} • Dr. {feedback?.practitioner?.split(' ')?.[1]}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {renderStars(feedback?.rating)}
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="font-caption text-xs text-text-secondary uppercase tracking-wide">
                  Lakshana (Symptoms)
                </span>
                <p className="font-body text-sm text-foreground mt-1">
                  {feedback?.symptoms}
                </p>
              </div>
              
              <div>
                <span className="font-caption text-xs text-text-secondary uppercase tracking-wide">
                  Shamana (Improvements)
                </span>
                <p className="font-body text-sm text-foreground mt-1">
                  {feedback?.improvements}
                </p>
              </div>
              
              {feedback?.sideEffects !== 'None reported' && (
                <div>
                  <span className="font-caption text-xs text-text-secondary uppercase tracking-wide">
                    Upadrava (Side Effects)
                  </span>
                  <p className="font-body text-sm text-foreground mt-1">
                    {feedback?.sideEffects}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button
          variant="default"
          onClick={onSubmitNew}
          iconName="Plus"
          iconPosition="left"
          className="w-full"
        >
          Submit New Feedback
        </Button>
      </div>
    </div>
  );
};

export default RecentFeedback;