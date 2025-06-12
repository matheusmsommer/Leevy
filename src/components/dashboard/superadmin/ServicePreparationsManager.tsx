
import React from 'react';
import ImprovedServicePreparationsManager from './ImprovedServicePreparationsManager';

interface ServicePreparationsManagerProps {
  serviceId: string;
  onUpdate?: () => void;
}

const ServicePreparationsManager = ({ serviceId, onUpdate }: ServicePreparationsManagerProps) => {
  return <ImprovedServicePreparationsManager serviceId={serviceId} onUpdate={onUpdate} />;
};

export default ServicePreparationsManager;
