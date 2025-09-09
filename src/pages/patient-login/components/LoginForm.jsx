import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onLoginSuccess }) => {
  const [contactInfo, setContactInfo] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('contact'); // 'contact' or 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState({});
  const [contactType, setContactType] = useState('');

  // Mock credentials for testing
  const mockCredentials = {
    phone: '9876543210',
    email: 'patient@ayursutra.com',
    otp: '123456'
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    // Auto-detect contact type
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    
    if (emailRegex?.test(contactInfo)) {
      setContactType('email');
    } else if (phoneRegex?.test(contactInfo)) {
      setContactType('phone');
    } else {
      setContactType('');
    }
  }, [contactInfo]);

  const validateContact = () => {
    const newErrors = {};
    
    if (!contactInfo?.trim()) {
      newErrors.contact = 'Phone number or email is required';
      return newErrors;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    
    if (!emailRegex?.test(contactInfo) && !phoneRegex?.test(contactInfo)) {
      newErrors.contact = 'Please enter a valid 10-digit phone number or email address';
    }

    return newErrors;
  };

  const validateOTP = () => {
    const newErrors = {};
    
    if (!otp?.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (otp?.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    } else if (!/^[0-9]{6}$/?.test(otp)) {
      newErrors.otp = 'OTP must contain only numbers';
    }

    return newErrors;
  };

  const handleSendOTP = async () => {
    const validationErrors = validateContact();
    if (Object.keys(validationErrors)?.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check if contact matches mock credentials
    if (contactInfo !== mockCredentials?.phone && contactInfo !== mockCredentials?.email) {
      setErrors({ contact: 'Please use demo credentials: 9876543210 or patient@ayursutra.com' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStep('otp');
      setTimer(60);
      setAttempts(0);
    } catch (error) {
      setErrors({ contact: 'Failed to send OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const validationErrors = validateOTP();
    if (Object.keys(validationErrors)?.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (otp !== mockCredentials?.otp) {
      setAttempts(prev => prev + 1);
      setErrors({ 
        otp: `Invalid OTP. Please use demo OTP: ${mockCredentials?.otp}. Attempts: ${attempts + 1}/3` 
      });
      
      if (attempts >= 2) {
        setStep('contact');
        setTimer(120);
        setAttempts(0);
        setOtp('');
        setErrors({ contact: 'Too many failed attempts. Please request a new OTP.' });
      }
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success - call parent callback
      onLoginSuccess({
        contactInfo,
        contactType,
        loginTime: new Date()?.toISOString()
      });
    } catch (error) {
      setErrors({ otp: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (timer > 0) return;
    
    setOtp('');
    setErrors({});
    setTimer(60);
    setAttempts(0);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  if (step === 'otp') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="MessageSquare" size={24} className="text-primary" />
          </div>
          <h2 className="text-2xl font-heading font-semibold text-foreground">
            Verify OTP
          </h2>
          <p className="text-text-secondary font-body">
            We've sent a 6-digit code to{' '}
            <span className="font-medium text-foreground">
              {contactType === 'phone' ? `+91 ${contactInfo}` : contactInfo}
            </span>
          </p>
        </div>
        <div className="space-y-4">
          <Input
            label="Enter OTP"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => {
              const value = e?.target?.value?.replace(/\D/g, '')?.slice(0, 6);
              setOtp(value);
              if (errors?.otp) setErrors({ ...errors, otp: '' });
            }}
            error={errors?.otp}
            maxLength={6}
            className="text-center text-lg font-data tracking-widest"
          />

          <Button
            onClick={handleVerifyOTP}
            loading={isLoading}
            disabled={otp?.length !== 6}
            fullWidth
            iconName="Shield"
            iconPosition="left"
          >
            Verify & Login
          </Button>

          <div className="text-center space-y-2">
            {timer > 0 ? (
              <p className="text-sm text-text-secondary font-body">
                Resend OTP in {formatTimer(timer)}
              </p>
            ) : (
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                iconName="RefreshCw"
                iconPosition="left"
                className="text-primary"
              >
                Resend OTP
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setStep('contact');
              setOtp('');
              setErrors({});
              setTimer(0);
            }}
            iconName="ArrowLeft"
            iconPosition="left"
            fullWidth
          >
            Change Contact Info
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Icon name="User" size={24} className="text-primary" />
        </div>
        <h2 className="text-2xl font-heading font-semibold text-foreground">
          Welcome Back, Rogi
        </h2>
        <p className="text-text-secondary font-body">
          Sign in to continue your Ayurvedic journey
        </p>
      </div>
      <div className="space-y-4">
        <Input
          label="Phone Number or Email"
          type={contactType === 'phone' ? 'tel' : contactType === 'email' ? 'email' : 'text'}
          placeholder="Enter 10-digit phone or email"
          value={contactInfo}
          onChange={(e) => {
            setContactInfo(e?.target?.value);
            if (errors?.contact) setErrors({ ...errors, contact: '' });
          }}
          error={errors?.contact}
          description={contactType === 'phone' ? 'Phone number detected' : contactType === 'email' ? 'Email address detected' : 'Enter phone number or email address'}
        />

        <Button
          onClick={handleSendOTP}
          loading={isLoading}
          disabled={!contactInfo?.trim() || timer > 0}
          fullWidth
          iconName="Send"
          iconPosition="left"
        >
          {timer > 0 ? `Wait ${formatTimer(timer)}` : 'Send OTP'}
        </Button>
      </div>
      <div className="text-center">
        <p className="text-sm text-text-secondary font-body">
          Demo Credentials: 9876543210 or patient@ayursutra.com | OTP: 123456
        </p>
      </div>
    </div>
  );
};

export default LoginForm;