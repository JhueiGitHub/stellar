// app/apps/flow/App.tsx
import React from 'react';
import { useFlowStore } from '../../store/flowStore';
import FlowDashboard from '../../components/FlowDashboard';
import FlowEditor from '../../components/FlowEditor';

const FlowApp: React.FC = () => {
  const { activeFlowId } = useFlowStore();

  return (
    <div className="w-full h-full">
      {activeFlowId ? <FlowEditor /> : <FlowDashboard />}
    </div>
  );
};

export default FlowApp;