import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const UpcomingSessionCard = ({ session, onViewDetails, onPrepare }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'preparation': return 'text-accent bg-accent/10';
      default: return 'text-text-secondary bg-muted';
    }
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
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`)?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="card-breathing hover-lift border border-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon 
              name={getTherapyIcon(session?.therapyType)} 
              size={24} 
              className="text-primary" 
            />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              {session?.therapyType}
            </h3>
            <p className="font-body text-sm text-text-secondary">
              {session?.therapyName}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session?.status)}`}>
          {session?.status?.charAt(0)?.toUpperCase() + session?.status?.slice(1)}
        </span>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Calendar" size={16} className="text-text-secondary" />
          <span className="font-body text-sm text-foreground">
            {formatDate(session?.date)} at {formatTime(session?.time)}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Icon name="MapPin" size={16} className="text-text-secondary" />
          <span className="font-body text-sm text-foreground">
            {session?.location}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Image 
            src={session?.practitioner?.avatar}
            alt={session?.practitioner?.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="font-body text-sm text-foreground">
            Dr. {session?.practitioner?.name}
          </span>
          <span className="font-caption text-xs text-text-secondary">
            {session?.practitioner?.specialization}
          </span>
        </div>
      </div>
      {session?.preparationStatus && (
        <div className="bg-muted rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name={session?.preparationStatus?.completed ? "CheckCircle" : "Clock"} 
                size={16} 
                className={session?.preparationStatus?.completed ? "text-success" : "text-warning"} 
              />
              <span className="font-body text-sm text-foreground">
                Purva Karma Preparation
              </span>
            </div>
            <span className="font-caption text-xs text-text-secondary">
              {session?.preparationStatus?.completed ? 'Complete' : `${session?.preparationStatus?.timeRemaining} left`}
            </span>
          </div>
        </div>
      )}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(session?.id)}
          iconName="Eye"
          iconPosition="left"
          className="flex-1"
        >
          View Details
        </Button>
        {!session?.preparationStatus?.completed && (
          <Button
            variant="default"
            size="sm"
            onClick={() => onPrepare(session?.id)}
            iconName="CheckSquare"
            iconPosition="left"
            className="flex-1"
          >
            Prepare
          </Button>
        )}
      </div>
    </div>
  );
};

export default UpcomingSessionCard;